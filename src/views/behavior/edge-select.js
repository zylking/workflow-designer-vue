export default {
  created() {
    this.$g6.registerBehavior('edge-select', {
      getEvents() {
        return {
          'edge:click': 'onEdgeClick'      // 线条选择
        };
      },

      // 边（连接线）click选中
      onEdgeClick: e => {
        const
          edgeItem = e.item,
          edgeModel = edgeItem.getModel();

        // 如果当前点击的node已处于选中状态，则不再触发
        if (edgeItem.hasState('activate')) {
          return;
        }

        const
          activateNodes = this.$graph.findAllByState('node', 'activate'),
          activateEdges = this.$graph.findAllByState('edge', 'activate');
        activateNodes.forEach(an => an.clearStates('activate'));
        activateEdges.forEach(ae => ae.clearStates('activate'));

        // 移除hover状态
        edgeItem.clearStates('hover');
        // 设置目标边的 click 状态 为 true
        this.$graph.setItemState(edgeItem, 'activate', true);
        // 保存当前节点信息model
        this.currentModel = edgeModel;
        // 初始化属性面板数据
        this.initAttributePanelData(this.currentModel);
        // 显示属性侧拉
        this.$refs.attribute.showDialog();
      },
    });
  }
};
