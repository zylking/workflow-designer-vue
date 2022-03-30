export default {
  created() {
    this.$g6.registerBehavior('edge-hover', {
      getEvents() {
        return {
          'edge:mouseenter': 'onMouseEnter',
          'edge:mouseleave': 'onMouseLeave'
        };
      },

      // 鼠标移入（边）连接线edge
      onMouseEnter: e => {
        // 获取鼠标进入的节点元素对象
        const edgeItem = e.item;
        // 如果当前点击的边已处于选中状态，则不再触发
        if (edgeItem.hasState('activate')) {
          return;
        }

        // 设置当前edge的 hover 状态为 true
        this.$graph.setItemState(edgeItem, 'hover', true);
      },

      // 鼠标移除（边）连接线edge
      onMouseLeave: e => {
        const edgeItem = e.item;
        // 如果当前点击的边已处于选中状态，则不再触发
        if (edgeItem.hasState('activate')) {
          return;
        }

        // 设置目标节点的 hover 状态 false/清除nodeItem的hover状态
        edgeItem.clearStates('hover');
      }
    });
  }
};
