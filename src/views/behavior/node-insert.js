export default {
  created() {
    this.$g6.registerBehavior('node-insert', {
      getEvents() {
        return {
          'drop': 'onCanvasDrop'
        };
      },

      // 拖动左侧节点插入到画布中
      onCanvasDrop: e => {
        // 如果拖拽的不是节点，则不触发drop默认行为
        // 如果拖拽到节点上释放，则不添加节点
        if (!this.isDragNode || e.item) {
          return e.preventDefault();
        }

        // 获取拖拽的节点数据
        if (e.originalEvent.dataTransfer) {
          let
            {x, y} = e,
            nodeData = JSON.parse(e.originalEvent.dataTransfer.getData('dragNode'));
          // 节点id以及坐标
          Object.assign(nodeData, {id: `node_${Date.now()}`, x, y});
          // 画布添加节点
          this.$graph.addItem('node', nodeData, true);
          // 判断当前画布中是否存在选中的节点/边，如果有，则取消选中
          let
            [activateNode] = this.$graph.findAllByState('node', 'activate'),
            [activateEdge] = this.$graph.findAllByState('edge', 'activate');
          if (activateNode || activateEdge) {
            this.$graph.setItemState(activateNode || activateEdge, 'activate', false);
          }
          // 添加完之后，该节点处于选中状态
          this.$graph.setItemState(nodeData.id, 'activate', true);
          // 显示节点的锚点
          const nodeItem = this.$graph.findById(nodeData.id);
          this.updateLinkPoints(nodeItem, nodeItem.getModel(), true);
          // 设置当前节点的数据
          this.currentModel = nodeData;
          // 初始化属性面板数据
          this.initAttributePanelData(nodeData);
          // 显示属性弹框
          this.$refs.attribute.showDialog();
        }
      }
    });
  }
};
