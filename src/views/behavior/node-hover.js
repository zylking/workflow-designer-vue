export default {
  data() {
    return {
      // 延时300毫秒进入add-edge模式
      addEdgeTimer: ''
    };
  },

  created() {
    this.$g6.registerBehavior('node-hover', {
      getEvents() {
        return {
          'node:mouseenter': 'onMouseEnter',
          'node:mouseover': 'onMouseOver',
          'node:mouseleave': 'onMouseLeave',
          'node:mouseout': 'onMouseOut',
          'node:mousedown': 'onMouseDown',
          'node:mouseup': 'onMouseUp'
        };
      },

      // 鼠标进入节点
      onMouseEnter: e => {
        // 获取鼠标进入的节点元素对象
        const
          nodeItem = e.item,
          nodeModel = nodeItem.getModel();
        // 设置当前节点的 hover 状态为 true
        this.$graph.setItemState(nodeItem, 'hover', true);
        // 显示linkPoints
        this.updateLinkPoints(nodeItem, nodeModel, true);

        // 与目标节点相同的线不改变样式
        const edges = nodeItem.getEdges();
        edges.forEach((edge) => {
          if (nodeItem._cfg.id !== edge._cfg.target._cfg.id) {
            this.$graph.setItemState(edge, 'running', true);
          }
        });
      },

      // 鼠标悬停linkPoints节点
      onMouseOver: e => {
        let targetAttr = e.target.attr();
        if (targetAttr) {
          if (targetAttr.type === 'linkPoints') {
            e.target.attr({fill: '#29EBF5', stroke: '#333333', r: 6, lineWidth: 2});
          }
        }
      },

      // 鼠标离开节点
      onMouseLeave: e => {
        const
          nodeItem = e.item,
          nodeModel = nodeItem.getModel();
        // 设置目标节点的 hover 状态 false
        nodeItem.clearStates('hover');
        // 隐藏linkPoints
        this.updateLinkPoints(nodeItem, nodeModel, false);

        // 取消线条的样式
        const edges = nodeItem.getEdges();
        edges.forEach((edge) => this.$graph.setItemState(edge, 'running', false));
      },

      // 鼠标离开linkPoints节点
      onMouseOut: e => {
        let targetAttr = e.target.attr();
        if (targetAttr) {
          if (targetAttr.type === 'linkPoints') {
            e.target.attr({fill: 'rgb(247, 250, 255)', stroke: 'rgb(95, 149, 255)', r: 4, lineWidth: 1});
            // 快速划出linkPoints，如果还处于default模式，则清除定时任务
            if (this.$graph.getCurrentMode() === 'default' && this.addEdgeTimer) {
              clearTimeout(this.addEdgeTimer);
            }
          }
        }
      },

      // linkPoints上鼠标点击左键，进入add-edge模式
      onMouseDown: e => {
        let targetAttr = e.target.attr();
        if (targetAttr) {
          let {type, anchorIndex, _key} = targetAttr;
          // 在节点的linkPoint上按下鼠标左键，300毫秒后，进入添加edge(连接线/边)模式
          if (type === 'linkPoints') {
            // e.originalEvent.button 0左键  1中键  2右键
            if (e.originalEvent.button === 0) {
              this.addEdgeTimer = setTimeout(() => {
                const
                  nodeItem = e.item,
                  nodeModel = nodeItem.getModel();
                // 进入添加add-edge模式
                this.$graph.setMode('addEdge');
                // 记录连接线开始的信息
                this.startLinkPoint = {source: nodeModel.id, sourceAnchor: anchorIndex, _key};
                this.updateAllNodeLinkPoints(true);
                // 取消线条的样式
                const edges = nodeItem.getEdges();
                edges.forEach((edge) => this.$graph.setItemState(edge, 'running', false));
                // 如果起始节点并非当前激活的节点，则在进入addEdge模式后，移除hover样式
                if (this.startLinkPoint.source !== this.currentModel.id) {
                  this.$graph.setItemState(nodeItem, 'hover', false);
                }
              }, 300);
            }
          }
        }
      },

      // 鼠标左键抬起后，如果还存在延时进入add-edge模式的定时，则清除
      onMouseUp: e => {
        // 鼠标左键抬起时，清除定时任务
        if (e.originalEvent.button === 0) {
          if (this.addEdgeTimer) {
            clearTimeout(this.addEdgeTimer);
          }

          // 此情况很难出现，避免bug出现
          // 避免出现问题，当触发up事件后，已经进入addEdge模式后，则退出这个模式
          if (this.$graph.getCurrentMode() === 'addEdge') {
            this.$graph.setMode('default');
          }
        }
      }
    });
  }
};
