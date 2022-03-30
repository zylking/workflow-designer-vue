<template>
  <el-card class="node-button" shadow="never">
    <el-button type="text" icon="el-icon-delete" :disabled="!currentModel.id"
               @click="$listeners.deleteNode"></el-button>
  </el-card>
</template>

<script>
  export default {
    name: "Node-button",
    model: {
      prop: 'currentModel'
    },
    props: {
      currentModel: Object
    }
  };
</script>

<style lang="scss" scoped>
  .node-button {
    position: absolute;
    top: 5px;
    left: 222px;
    height: 38px;
    border: 1px solid #e2e2e2;
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    ::v-deep {
      .el-card__body {
        padding: 6px 6px 6px 0;
        .el-button {
          padding: 0;
          width: 35px;
          font-size: 21px;
          color: #545454;
          &:hover {
            color: #000000;
          }
          &.is-disabled {
            color: #999999;
          }
        }
      }
    }
  }
</style>
