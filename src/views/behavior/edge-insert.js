export default {
  data() {
    return {
      // 记录进入add-edge模式时，起始点的linkPoints
      startLinkPoint: {
        _key: '',           // 哪个方向的锚点
        source: '',         // 开始节点id
        sourceAnchor: '',   // 开始节点linkPoints的索引值
      },
      // 当前正在绘制的连接线/边
      drawEdge: null
    };
  },
  created() {
    this.$g6.registerBehavior('edge-insert', {
      getEvents() {
        return {
          mousemove: 'onMouseMove',
          mouseup: 'onMouseUp',
          'node:mouseover': 'onMouseOver',
          'node:mouseout': 'onMouseOut'
        };
      },

      // 当进入addEdge模式后，拖动鼠标事件
      onMouseMove: e => {
        let {source, sourceAnchor} = this.startLinkPoint;
        // 如果存在划线，则表示已经在开始连线了
        if (this.drawEdge) {
          const point = {x: e.x, y: e.y};
          // 增加边的过程中，移动时边跟着移动
          this.$graph.updateItem(this.drawEdge, {end: point}, false);
        } else {
          // 获取起始锚点的node
          // 获取对应的锚点坐标
          const
            startNode = this.$graph.findById(source),
            point = startNode.getLinkPointByAnchor(sourceAnchor);
          this.drawEdge = this.$graph.addItem('edge', {
            source: startNode,
            target: startNode,
            start: point,
            end: point,
            type: 'connect-line'
          }, false);
        }
      },

      // 当拖动鼠标进入锚点时，此时锚点边框为绿色，表示可以连接
      onMouseOver: e => {
        // 起始节点的锚点不可连接
        if (e.item.getModel().id === this.startLinkPoint.source) {
          return;
        }
        let targetAttr = e.target.attr();
        if (targetAttr) {
          if (targetAttr.type === 'linkPoints') {
            e.target.attr({stroke: '#67C23A', r: 6, lineWidth: 2});
          }
        }
      },

      // 当拖动的鼠标离开锚点时，恢复原本样式
      onMouseOut: e => {
        // 起始节点的锚点样式不需要修改
        if (e.item.getModel().id === this.startLinkPoint.source) {
          return;
        }

        let targetAttr = e.target.attr();
        if (targetAttr) {
          if (targetAttr.type === 'linkPoints') {
            e.target.attr({stroke: 'rgb(95, 149, 255)', r: 4, lineWidth: 1});
          }
        }
      },

      // 当鼠标左键up时
      onMouseUp: e => {
        const nodeItem = e.item;
        if (!nodeItem || nodeItem.getType() === 'edge') {
          this.quitAddEdgeMode();
          this.updateAllNodeLinkPoints(false);
        } else {
          let
            nodeModel = nodeItem.getModel(),
            {source, sourceAnchor} = this.startLinkPoint;
          // 如果是起始节点，则直接退出addEdge模式
          if (nodeModel.id === source) {
            this.quitAddEdgeMode();
            this.showHoverNodeLinkPoints(nodeModel);
          } else {
            // 如果当前是其他节点的锚点，则添加边edge
            const targetAttr = e.target.attr();
            if (targetAttr && targetAttr.type === 'linkPoints') {
              this.$graph.addItem('edge', {
                id: `edge_${Date.now()}`,
                source: source,
                target: nodeModel.id,
                label: '',
                type: 'polyline-running',
                sourceAnchor: sourceAnchor,
                targetAnchor: targetAttr.anchorIndex,
                style: {stroke: '#333333', endArrow: true, lineWidth: 2, cursor: 'pointer'},
                labelCfg: {
                  position: 'center',
                  autoRotate: false,
                  style: {stroke: '#FFFFFF', fill: '#722ed1', lineWidth: 5, fontSize: 12, cursor: 'pointer'}
                }
              }, true);
              // 退出addEdge模式
              this.quitAddEdgeMode();
              this.updateAllNodeLinkPoints(false);
            } else {
              this.quitAddEdgeMode();
              this.showHoverNodeLinkPoints(nodeModel);
            }
          }
        }
      }
    });
  },

  methods: {
    // 退出addEdge模式
    // 初始化起始点的linkPoints
    // 移除drawEdge虚线
    quitAddEdgeMode() {
      // 移除drawEdge
      this.$graph.removeItem(this.drawEdge, false);
      this.drawEdge = null;
      // 初始化起始点的linkPoints
      this.initStartLinkPoints();
      // 退出addEdge模式
      this.$graph.setMode('default');
    },

    // 注册边的动画效果
    // type:线条类型
    registerSideAnimate(type) {
      // 注册边动画
      this.$g6.registerEdge(`${type}-running`, {
        setState: (name, value, item) => {
          const shape = item.get('keyShape');
          switch (name) {
            case 'running':
              if (value) {
                let index = 0;
                shape.animate(() => {
                  index++;
                  if (index > 9) {
                    index = 0;
                  }
                  return {lineDash: this.lineDash, lineDashOffset: -index};
                }, {repeat: true, duration: 3000});
              } else {
                shape.stopAnimate();
                shape.attr('lineDash', null);
              }
              break;
            case 'hover':
            case 'activate':
              if (value) {
                shape.attr({shadowColor: '#409EFF', shadowBlur: 6});
              } else {
                shape.attr({shadowColor: '', shadowBlur: 0});
              }
              break;
          }
        }
      }, type);
    },

    // 注册勾画连线的线条
    registerConnectLine() {
      this.$g6.registerEdge('connect-line', {
        draw(cfg, group) {
          return group.addShape('path', {
            attrs: {
              id: `edge_${Date.now()}`,
              path: [['M', cfg.start.x, cfg.start.y], ['L', cfg.end.x, cfg.end.y]],
              stroke: '#1890FF',
              strokeOpacity: 0.9,
              lineDash: [5, 5]
            }
          });
        },
      });
    },

    // 退出addEdge模式后，当前鼠标悬停的节点显示linkPoints
    showHoverNodeLinkPoints(targetModel) {
      this.$graph.getNodes().forEach(node => {
        let nodeModel = node.getModel();
        // 自身节点不可连接
        if (targetModel.id === nodeModel.id) {
          if (nodeModel.type === 'star') {
            nodeModel.linkPoints = {top: true, right: true, left: true, leftBottom: true, rightBottom: true};
          } else {
            nodeModel.linkPoints = {top: true, right: true, left: true, bottom: true};
          }
          node.update(nodeModel);
          let
            group = node.getContainer(),
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
                cursor: 'crosshair', anchorIndex: index, type: 'linkPoints', _key: key, r: 4, lineWidth: 1,
                fill: 'rgb(247, 250, 255)', stroke: 'rgb(95, 149, 255)'
              });
            }
          });
        } else {
          this.updateLinkPoints(node, nodeModel, false);
        }
      });
    }
  }
};
