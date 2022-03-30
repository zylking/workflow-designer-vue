export default {
  created() {
    this.$g6.registerBehavior('node-select', {
      getEvents() {
        return {
          'node:click': 'onNodeClick',
          'canvas:click': 'onCanvasClick'     // 点击canvas
        };
      },

      // 节点click选中
      // click：当前节点mousedown和mouseup结合为一个click
      onNodeClick: (e) => {
        // 如果当前点击的node已处于选中状态，则不再触发
        if (e.item.hasState('activate')) {
          return;
        }

        // 所有activate状态的节点/边移除
        const
          activateNodes = this.$graph.findAllByState('node', 'activate'),
          activateEdges = this.$graph.findAllByState('edge', 'activate');
        activateNodes.forEach(an => an.clearStates('activate'));
        activateEdges.forEach(ae => ae.clearStates('activate'));

        // 设置目标节点的 click 状态 为 true
        this.$graph.setItemState(e.item, 'activate', true);
        // 保存当前节点信息model
        this.currentModel = e.item.getModel();
        // 初始化属性面板数据
        this.initAttributePanelData(this.currentModel);
        // 显示属性侧拉
        this.$refs.attribute.showDialog();
      },

      // 画布的点击，取消selected
      onCanvasClick: () => {
        // 所有activate状态的节点/边移除
        const
          activateNodes = this.$graph.findAllByState('node', 'activate'),
          activateEdges = this.$graph.findAllByState('edge', 'activate');
        activateNodes.forEach(an => an.clearStates('activate'));
        activateEdges.forEach(ae => ae.clearStates('activate'));

        // 清除节点选中状态后，初始化当前节点数据
        this.currentModel = {};
        // 初始化属性面板数据
        this.initAttributePanelData(this.currentModel);
        // 关闭右侧属性侧拉
        this.$refs.attribute.hideDialog();
      }
    });
  }
};
