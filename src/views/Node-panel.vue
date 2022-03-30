<template>
  <el-card class="node-panel">
    <template v-for="node in nodeTypes">
      <div class="node-panel__div" :key="node.type" :title="`拖动添加${node.title}`" draggable="true"
           @dragstart="e => startDragNode(e, node)"
           @dragend="e => endDragNode(e, node)">
        <svg-icon class="node-btn" :icon-class="`panel-${node.type}`"></svg-icon>
      </div>
    </template>
  </el-card>
</template>

<script>
  /**
   * 节点控制板
   */
  export default {
    name: "Node-panel",

    data() {
      return {
        // 节点类型
        // 'rect', 'circle', 'ellipse', 'diamond', 'triangle', 'star'
        // 自定义字段：为业务需求字段，可自行根据业务进行对应的修改
        nodeTypes: [
          {type: 'rect', title: '矩形'},
          {type: 'circle', title: '圆'},
          {type: 'ellipse', title: '椭圆'},
          {type: 'diamond', title: '菱形'},
          {type: 'triangle', title: '三角形'},
          {type: 'star', title: '星形'}
        ],

        // 基础配置
        basicCfg: {
          id: '',                 // 节点的id
          x: 0,                   // 节点的坐标 x轴
          y: 0,                   // 节点的坐标 y轴
          label: '',              // 节点文字描述
          nodeType: '',           // 自定义字段，当前节点的类型（1、发起/开始节点  2、结束节点）
          isSignature: '0',       // 自定义字段，是否加签（0、否   1、是）
          // 节点样式
          style: {
            radius: 0,            // 圆角半径
            fill: '#FFFFFF',      // 默认填充#FFFFFF
            stroke: '#000000',    // 边框颜色默认#000000
            lineWidth: 2,         // 边框宽度默认2
            fillOpacity: 1,       // 透明度
            cursor: 'pointer'     // 鼠标默认样式pointer
          },
          // 节点文字样式
          labelCfg: {             // 标签配置属性
            position: 'center',   // 标签的属性，标签在元素中的位置
            offset: 0,            // 文字偏移
            style: {              // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
              fontSize: 12,       // 标签的样式属性，文字字体大小
              fill: '#000000',    // 文字颜色
              lineWidth: 1,       // 文字描边粗细
              cursor: 'pointer'   // 文字鼠标样式
            }
          },
          stateStyles: {
            // 节点选中时，增加阴影颜色
            activate: {shadowColor: '#409EFF', shadowBlur: 6},
            // 节点鼠标悬停时，增加阴影颜色
            hover: {shadowColor: '#409EFF', shadowBlur: 6}
          },
          // 锚点数量和位置
          anchorPoints: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]],
          // 自定义字段：审批人员设置
          approvers: [],
          // 自定义字段：节点条件设置
          nodeConditions: [],
          // 自定义字段：会签
          countersign: {
            isCountersign: '0',     // 是否会签（0否 1是）
            proportion: ''          // 会签比例
          },
          // 自定义字段：节点功能权限
          nodePoints: []
        },

        // 对应节点的默认配置
        nodeCfg: {
          // 矩形默认配置，100x50，默认为直角矩形
          rect: {type: 'rect', size: [100, 50]},
          // 圆默认配置，直径80
          circle: {type: 'circle', size: 80},
          // 椭圆默认配置，长直径x短直径100x50
          ellipse: {type: 'ellipse', size: [100, 50]},
          // 菱形默认配置 100x50
          diamond: {type: 'diamond', size: [100, 50]},
          // 三角形默认配置
          triangle: {type: 'triangle', size: 50, anchorPoints: [[0.5, 0], [1, 1], [0, 1]]},
          // 五角星
          star: {type: 'star', size: 50, anchorPoints: [[0.5, 0], [1, 0.5], [1, 1], [0, 1], [0, 0.5]]}
        }
      };
    },

    methods: {
      // 开始拖拽节点
      startDragNode(e, node) {
        // 拖拽节点 true
        this.$listeners.dragStart();
        // 设置拖拽的dragNode数据
        // 每个节点都有默认数据
        e.dataTransfer.setData('dragNode', JSON.stringify(Object.assign({}, this.basicCfg, this.nodeCfg[node.type])));
      },

      // 结束拖拽节点
      endDragNode(e, node) {
        // 结束拖拽节点
        this.$listeners.dragEnd();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .node-panel {
    position: absolute;
    top: 50px;
    left: 5px;
    background-color: rgba(256, 256, 256, .2);
    ::v-deep {
      .el-card__body {
        padding: 10px;
        .node-panel__div:hover {
          color: #409EFF;
        }
        .node-panel__div + .node-panel__div {
          margin-top: 6px;
        }
        svg.node-btn {
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
      }
    }
  }
</style>
