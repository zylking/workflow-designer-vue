<template>
  <el-container class="percentage el-container__designer" v-loading="loading">
    <el-header height="38px" class="designer-top__fun">
      <div>预留位置：显示模板信息等等...</div>
      <el-button size="mini" type="success" icon="el-icon-finished" @click="saveModel">保 存</el-button>
    </el-header>
    <el-main ref="main" class="designer-bottom__workbench pd0">
      <!-- 设计器工作台 -->
      <div id="workbench"></div>
      <!-- 自定义功能按钮 -->
      <node-button v-model="currentModel" @deleteNode="deleteNode"></node-button>
      <!-- 节点控制板 -->
      <node-panel @dragStart="isDragNode = true" @dragEnd="isDragNode = false"></node-panel>
    </el-main>

    <!-- 节点属性侧拉弹窗：属性、事件等 -->
    <node-attribute ref="attribute" v-model="attrPanelData" :numberType="numberType"
                    @updateNodeItem="updateNodeAttribute"
                    @updateEdgeItem="updateEdgeAttribute"></node-attribute>
  </el-container>
</template>

<script>
  import {NodeInsert, NodeSelect, NodeHover, EdgeInsert, EdgeHover, EdgeSelect} from "./behavior";
  import NodePanel from "./Node-panel";
  import NodeButton from "./Node-button";
  import {NodeAttribute} from "./dialog";
  import {saveModelTemplate} from "@/api/designer";

  export default {
    name: "Designer",
    mixins: [NodeInsert, NodeSelect, NodeHover, EdgeInsert, EdgeHover, EdgeSelect],
    components: {NodePanel, NodeButton, NodeAttribute},
    data() {
      return {
        loading: false,

        // 是否拖动添加节点
        isDragNode: false,

        // G6图的实例
        $graph: null,
        // 工具栏
        $toolbar: null,
        // 对齐线
        $snapLine: null,
        // 网格线
        $grid: null,

        // 边的动画虚线数组
        lineDash: [4, 2, 1, 2],

        // 节点类型为circle，triangle，star时，size为数值
        numberType: ['circle', 'triangle', 'star'],

        // 属性面板数据
        attrPanelData: {
          id: '',                 // 节点的id
          label: '',              // 节点名称、文字描述
          type: '',               // 节点类型
          nodeType: '',           // 节点类型 1、发起/开始节点  2、结束节点
          sizeL: 0,               // 长
          sizeW: 0,               // 宽
          radius: 0,              // 圆角矩形radius

          nodeStroke: '#000000',  // 边框颜色默认#000000
          nodeFill: '#FFFFFF',    // 默认填充#FFFFFF
          nodeLineWidth: 2,       // 边框宽度默认2
          nodeFillOpacity: 1,     // 透明度

          position: 'center',     // 标签的属性，标签在元素中的位置
          offset: 0,              // 文字偏移
          fontSize: 12,           // 标签的样式属性，文字字体大小
          textFill: '#000000',    // 文字颜色
          textLineWidth: 1,       // 文字描边粗细

          isSignature: '0',       // 自定义字段，是否加签（0、否   1、是）
          approvers: [],          // 审批人员设置
          nodeConditions: [],     // 节点条件设置
          countersign: {
            isCountersign: '0',   // 是否会签（0否 1是）
            proportion: ''        // 会签比例
          },
          nodePoints: []          // 节点功能权限
        },

        // 当前选中的节点model
        currentModel: {},

        // 当前画布流程数据
        nodesData: {
          // 点集
          nodes: [],
          // 边集
          edges: []
        }
      };
    },

    created() {
      // 初始化插件
      // 工具栏
      this.$toolbar = new this.$g6.ToolBar({position: {x: 5, y: 5}});
      // 对齐线
      this.$snapLine = new this.$g6.SnapLine({line: {stroke: '#409EFF', lineWidth: 1}, itemAlignType: true});
      // 网格线
      this.$grid = new this.$g6.Grid();

      // 注册折线的动画效果，注册的线需要继承原有线的类型，例如折线
      // 新注册的线类型为：polyline-running
      this.registerSideAnimate('polyline');
      // 注册勾画连线的线条
      this.registerConnectLine();
    },

    mounted() {
      // 创建 G6 图实例
      this.$graph = new this.$g6.Graph({
        container: 'workbench',
        plugins: [this.$grid, this.$toolbar, this.$snapLine],   // 插件
        enabledStack: true,                                     // 设置为true，启用 redo & undo 栈功能
        fitView: true,
        modes: {
          // 默认模式
          default: ['node-insert', 'node-select', 'node-hover', 'edge-hover', 'edge-select', 'drag-canvas', 'drag-node', 'zoom-canvas'],
          // 添加边/连线模式
          addEdge: ['edge-insert'],
        }
      });
      // 读取数据
      this.$graph.data(this.nodesData);
      // 渲染图
      this.$graph.render();
      // 当窗口改变时
      this.windowResize();
    },

    methods: {
      // 保存
      saveModel() {
        this.loading = true;
        console.log(this.$graph.save());
        // saveModelTemplate({resultJSon: this.$graph.save()}).then(res => {
        //
        // }).catch(() => this.loading = false);
      },

      // 删除节点/边
      deleteNode() {
        let {id, type} = this.currentModel;
        if (id) {
          this.$confirmMessage('确认删除当前节点/边吗？', '提示', 'warning', () => {
            // 如果删除的是节点，则获取节点上所有关联的边，然后移除这些边：移除的边不会进入undo redo栈
            if (type !== 'polyline-running') {
              const
                nodeItem = this.$graph.findById(id),
                edges = nodeItem.getEdges();

              edges.forEach(edge => this.$graph.removeItem(edge, false));
            }
            // 删除当前的节点
            this.$graph.removeItem(id, true);
            // 删除后，当前model数据清空
            this.currentModel = {};
            // 初始化属性面板数据
            this.initAttributePanelData(this.currentModel);
            // 关闭右侧属性侧拉
            this.$refs.attribute.hideDialog();
          });
        }
      },

      // 更新节点属性
      updateNodeAttribute() {
        // 将属性面板数据赋值到节点数据上，然后更新
        let {
          id, label, type, nodeType, sizeL, sizeW, radius, nodeStroke, nodeFill, nodeLineWidth, nodeFillOpacity,
          position, offset, fontSize, textFill, textLineWidth, approvers, nodeConditions, countersign, nodePoints
        } = this.attrPanelData;

        // 节点不一致，则不会进行更新
        if (id === this.currentModel.id) {
          // 节点基本属性 label、size
          Object.assign(this.currentModel, {
            label, nodeType, size: this.numberType.includes(type) ? sizeL : [sizeL, sizeW],
            approvers: JSON.parse(JSON.stringify(approvers)),             // 审批人员设置
            nodeConditions: JSON.parse(JSON.stringify(nodeConditions)),   // 节点条件
            countersign: JSON.parse(JSON.stringify(countersign)),         // 会签
            nodePoints: JSON.parse(JSON.stringify(nodePoints))            // 节点功能点
          });
          // 节点样式
          Object.assign(this.currentModel.style, {
            radius,
            fill: nodeFill,
            stroke: nodeStroke,
            lineWidth: nodeLineWidth,
            fillOpacity: nodeFillOpacity
          });
          // 文本配置
          Object.assign(this.currentModel.labelCfg, {position, offset});
          // 文本样式
          Object.assign(this.currentModel.labelCfg.style, {
            fontSize,
            fill: textFill,
            lineWidth: textLineWidth
          });
          // 更新节点
          // 元素、节点ID，数据，操作是否入undo & redo 栈
          this.$graph.updateItem(id, this.currentModel, true);
          this.$promptMessage({type: 'success', message: '保存成功！', duration: 3000});
        }
      },

      // 更新边/edge属性
      updateEdgeAttribute() {
        // 将属性面板数据赋值到节点数据上，然后更新
        let {
          id, label, type, nodeStroke, nodeLineWidth, position, fontSize, textFill, textLineWidth
        } = this.attrPanelData;

        // edge不一致，则不会进行更新
        if (id === this.currentModel.id) {
          // edge基本属性 id, label, type
          Object.assign(this.currentModel, {id, label, type});
          // edge样式
          // defaultStroke  存储修改后的描边颜色
          Object.assign(this.currentModel.style, {stroke: nodeStroke, lineWidth: nodeLineWidth});
          // 文本配置
          Object.assign(this.currentModel.labelCfg, {position});
          // 文本样式
          Object.assign(this.currentModel.labelCfg.style, {
            fontSize,
            fill: textFill,
            lineWidth: textLineWidth
          });
          // 更新节点
          // 元素、节点ID，数据，操作是否入undo & redo 栈
          let edgeItem = this.$graph.findById(id);
          edgeItem.update(this.currentModel);
          this.$promptMessage({type: 'success', message: '保存成功！', duration: 3000});
        }
      },

      // 进入addEdge模式后，所有的节点的linkPoints全部显示
      // 退出addEdge模式后，所有的节点的linkPoints全部隐藏
      updateAllNodeLinkPoints(flag) {
        this.$graph.getNodes().forEach(node => {
          let
            {_key, source} = this.startLinkPoint,
            nodeModel = node.getModel();
          // 自身节点不可连接
          if (source === nodeModel.id) {
            const group = node.getContainer();
            if (nodeModel.type === 'star') {
              nodeModel.linkPoints = {top: false, right: false, left: false, leftBottom: false, rightBottom: false};
            } else {
              nodeModel.linkPoints = {top: false, right: false, left: false, bottom: false};
            }
            // 隐藏自身节点其他锚点
            nodeModel.linkPoints[_key] = true;
            node.update(nodeModel);
            // 更新锚点时，会更新掉状态，需要重新更新状态
            group.shapeMap[`link-point-${_key}`].attr({fill: '#29EBF5', stroke: '#333333', r: 6, lineWidth: 2});
          } else {
            this.updateLinkPoints(node, nodeModel, flag);
          }
        });
      },

      // 显示/隐藏节点的linkPoints
      updateLinkPoints(nodeItem, nodeModel, flag) {
        if (nodeModel.type === 'star') {
          nodeModel.linkPoints = {top: flag, right: flag, left: flag, leftBottom: flag, rightBottom: flag};
        } else {
          nodeModel.linkPoints = {top: flag, right: flag, left: flag, bottom: flag};
        }
        // 更新节点
        nodeItem.update(nodeModel);
        // 节点更新之后，当再次移入鼠标时，需要重新更新linkPoints的鼠标悬停样式
        if (flag) {
          // 更新linkPoints的鼠标样式状态
          let
            group = nodeItem.getContainer(),
            position = [];
          switch (nodeModel.type) {
            case 'star':
              position = ['top', 'right', 'right-bottom', 'left-bottom', 'left'];
              break;
            case 'triangle':
              position = ['top', 'right', 'left'];
              break;
            default:
              position = ['top', 'right', 'bottom', 'left'];
              break;
          }
          position.forEach((key, index) => {
            if (group.shapeMap[`link-point-${key}`]) {
              group.shapeMap[`link-point-${key}`].attr({
                cursor: 'crosshair', anchorIndex: index, type: 'linkPoints', _key: key
              });
            }
          });
        }
      },

      // 初始化
      initStartLinkPoints() {
        Object.assign(this.startLinkPoint, {_key: '', source: '', sourceAnchor: ''});
      },

      // 初始化node面板属性数据
      initAttributePanelData(model) {
        let
          {
            id, label, type, nodeType, size, style, labelCfg, isSignature, approvers, nodeConditions, countersign,
            nodePoints
          } = model,
          _approvers = approvers ? JSON.parse(JSON.stringify(approvers)) : [],
          _nodeConditions = nodeConditions ? JSON.parse(JSON.stringify(nodeConditions)) : [],
          _countersign = countersign ? JSON.parse(JSON.stringify(countersign)) : {isCountersign: '0', proportion: ''},
          _nodePoints = nodePoints ? JSON.parse(JSON.stringify(nodePoints)) : [];
        Object.assign(this.attrPanelData, {
          id,                 // 节点的id
          label,              // 节点名称、文字描述
          type,               // 节点类型
          nodeType,           // 节点类型（自定义字段 ）
          sizeL: Array.isArray(size) ? size[0] : size,               // 长
          sizeW: Array.isArray(size) ? size[1] : 0,                  // 宽
          isSignature,
          approvers: _approvers,                  // 审批人员设置
          nodeConditions: _nodeConditions,        // 节点条件设置
          countersign: _countersign,              // 会签
          nodePoints: _nodePoints                 // 节点功能权限
        });

        let
          {radius, fill: nodeFill, stroke: nodeStroke, lineWidth: nodeLineWidth, fillOpacity: nodeFillOpacity} = style || {},
          {position, offset, style: cfgStyle} = labelCfg || {};
        Object.assign(this.attrPanelData, {
          radius,             // 圆角矩形radius
          nodeStroke,         // 边框颜色默认#000000
          nodeFill,           // 默认填充#FFFFFF
          nodeLineWidth,      // 边框宽度默认2
          nodeFillOpacity,    // 透明度
          position,           // 标签的属性，标签在元素中的位置
          offset,             // 文字偏移
          fontSize: cfgStyle ? cfgStyle.fontSize : 12,           // 标签的样式属性，文字字体大小
          textFill: cfgStyle ? cfgStyle.fill : '#000000',        // 文字颜色
          textLineWidth: cfgStyle ? cfgStyle.lineWidth : 1       // 文字描边粗细
        });
      },

      // 当窗口resize时
      windowResize() {
        const container = document.getElementById('workbench');

        if (typeof window !== 'undefined') {
          window.onresize = () => {
            if (!this.$graph || this.$graph.get('destroyed')) {
              return;
            }
            if (!container || !container.scrollWidth || !container.scrollHeight) {
              return;
            }

            this.$graph.changeSize(container.scrollWidth, container.scrollHeight);
          };
        }
      }
    },

    beforeDestroy() {
      this.$graph.destroy();
    }
  };
</script>
<style lang="scss" scoped>
  .el-container__designer {
    .designer-top__fun {
      display: flex;
      padding: 0 5px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #DCDFE6;
    }

    #workbench {
      width: 100%;
      height: 100%;
    }

    ::v-deep {
      .el-card__right {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        border-radius: 0;
        border-top: 0;
        border-bottom: 0;
        border-right: 0;
        &:hover {
          background-color: #e8f4ff;
        }
        .el-card__body {
          padding: 4px;
          .el-button--text {
            padding: 5px 0;
            .el-icon-caret-left {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
</style>
