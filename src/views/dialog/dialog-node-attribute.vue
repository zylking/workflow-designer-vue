<template>
  <el-drawer title="节点数据配置" class="custom-drawer drawer-node-data" :visible.sync="visible" size="490px"
             :close-on-press-escape="false"
             :modal="false"
             :show-close="false"
             :wrapperClosable="false"
             @closed="activeName = 'basic-info'">
    <el-container class="percentage node-data-cfg">
      <el-main class="pd0">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="basic-info">
            <template slot="title">
              <i class="el-icon el-icon-s-order"></i>
              <span>基本信息</span>
            </template>
            <el-form size="mini" class="no-margin no-padding no-error" label-width="88px">
              <el-form-item label="节点ID：" required>{{nodeConfig.id}}</el-form-item>
              <el-form-item label="节点名称：" required>
                <el-input v-model="nodeConfig.label" class="w-346" placeholder="节点名称"></el-input>
              </el-form-item>
              <el-form-item label="节点类型：">
                <el-select v-model="nodeConfig.nodeType" class="w-346" placeholder="节点类型"
                           :disabled="nodeConfig.type === 'polyline-running'">
                  <el-option v-for="item in nodeTypeOpts" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-col span="12">
                  <el-form-item label="长：">
                    <el-input-number v-model="nodeConfig.sizeL" class="w-120" placeholder="长"
                                     :min="1"
                                     :max="999"
                                     :step="1"
                                     :disabled="nodeConfig.type === 'polyline-running'"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="宽：">
                    <el-input-number v-model="nodeConfig.sizeW" class="w-120" placeholder="宽"
                                     :min="1"
                                     :max="999"
                                     :step="1"
                                     :disabled="numberType.includes(nodeConfig.type) || nodeConfig.type === 'polyline-running'"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="el-icon el-icon-s-tools"></i>
              <span>节点样式</span>
            </template>
            <el-form size="mini" class="no-margin no-padding no-error" label-width="88px">
              <el-row>
                <el-col span="12">
                  <el-form-item label="描边颜色：">
                    <el-color-picker v-model="nodeConfig.nodeStroke" show-alpha :predefine="predefineColors">
                    </el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="描边粗细：">
                    <el-input-number v-model="nodeConfig.nodeLineWidth" class="w-120" placeholder="描边粗细"
                                     :min="1"
                                     :max="10"
                                     :step="1"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="填充色：">
                    <el-color-picker v-model="nodeConfig.nodeFill" show-alpha :predefine="predefineColors"
                                     :disabled="nodeConfig.type === 'polyline-running'">
                    </el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="透明度：">
                    <el-input-number v-model="nodeConfig.nodeFillOpacity" class="w-120" placeholder="透明度"
                                     :min="0"
                                     :max="1"
                                     :step="0.1"
                                     :precision="1"
                                     :disabled="nodeConfig.type === 'polyline-running'"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <!-- 只有矩形会有该属性 -->
                  <el-form-item label="圆角半径：">
                    <el-input-number v-model="nodeConfig.radius" class="w-120" placeholder="圆角半径"
                                     :min="0"
                                     :step="1"
                                     :disabled="nodeConfig.type !== 'rect'"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <i class="el-icon el-icon-s-check"></i>
              <span>文字样式</span>
            </template>
            <el-form size="mini" class="no-margin no-padding no-error" label-width="88px">
              <el-row>
                <el-col span="12">
                  <el-form-item label="文本位置：">
                    <el-select v-model="nodeConfig.position" class="w-120" placeholder="文本位置">
                      <el-option v-for="item in positionsOpts" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="文本偏移：">
                    <el-input-number v-model="nodeConfig.offset" class="w-120" placeholder="文本偏移"
                                     :min="-10"
                                     :max="10"
                                     :step="1"
                                     :disabled="nodeConfig.type === 'polyline-running'"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="文本颜色：">
                    <el-color-picker v-model="nodeConfig.textFill" show-alpha :predefine="predefineColors">
                    </el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="字体大小：">
                    <el-input-number v-model="nodeConfig.fontSize" class="w-120" placeholder="字体大小"
                                     :min="12"
                                     :max="26"
                                     :step="1"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col span="12">
                  <el-form-item label="描边粗细：">
                    <el-input-number v-model="nodeConfig.textLineWidth" class="w-120" placeholder="描边粗细"
                                     :min="1"
                                     :max="60"
                                     :step="1"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="4" v-show="nodeConfig.type !== 'polyline-running'">
            <template slot="title">
              <i class="el-icon el-icon-s-claim"></i>
              <span>执行条件</span>
            </template>
            <div>
              <div class="condition-title">
                <span>审批人员设置</span>
                <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="nodeConfig.approvers >= 3"
                           @click="$refs.approver.showDialog()">添加
                </el-button>
              </div>
              <el-table size="mini" :data="nodeConfig.approvers" border style="width: 100%">
                <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
                <el-table-column prop="approverTypeName" label="审批类型" width="70"></el-table-column>
                <el-table-column prop="conditionName" label="选择人员" show-overflow-tooltip></el-table-column>
                <el-table-column prop="approverCondition" label="条件" width="60"></el-table-column>
                <el-table-column label="操作" width="58">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" title="编辑"
                               @click="$refs.approver.showDialog(scope.row)"></el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" title="删除"
                               @click="deleteApprovers(scope)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="condition-title mt12">
                <span>节点条件设置</span>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="$refs.condition.showDialog()">添加
                </el-button>
              </div>
              <el-table size="mini" :data="nodeConfig.nodeConditions" border style="width: 100%">
                <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
                <el-table-column prop="name" label="条件名称"></el-table-column>
                <el-table-column prop="compare" label="比较逻辑" width="70"></el-table-column>
                <el-table-column prop="value" label="条件" width="70"></el-table-column>
                <el-table-column label="操作" width="58">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" title="编辑"
                               @click="$refs.condition.showDialog(scope.row)"></el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" title="删除"
                               @click="deleteCondition(scope)"></el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div class="mt6">
                <el-checkbox v-model="nodeConfig.isSignature" true-label="1" false-label="0">允许加签</el-checkbox>
              </div>
              <div>
                <el-checkbox v-model="nodeConfig.countersign.isCountersign" true-label="1" false-label="0">会签
                </el-checkbox>
              </div>
              <div>
                <el-input v-model="nodeConfig.countersign.proportion" size="mini" placeholder="会签比例"
                          :disabled="nodeConfig.countersign.isCountersign === '0'">
                  <template slot="append">%</template>
                </el-input>
              </div>
              <div class="condition-title mt12">节点功能权限</div>
              <el-checkbox-group v-model="nodeConfig.nodePoints" class="small-spacing">
                <el-checkbox v-for="item in authorityOpts" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
      <el-footer height="38px" class="tl-r pt10">
        <el-button size="mini" type="primary" icon="el-icon-check" :disabled="!nodeConfig.id"
                   @click="confirmSave">保 存
        </el-button>
      </el-footer>

      <!-- 审批人员设置 -->
      <form-approver ref="approver" @add="addApprovers" @update="updateApprovers"></form-approver>
      <!-- 节点条件设置 -->
      <form-condition ref="condition" @add="addCondition" @update="updateCondition"></form-condition>
    </el-container>
  </el-drawer>
</template>

<script>
  import {getNodeAuthority} from "@/api/designer";
  import FormApprover from "./dialog-form-approver";
  import FormCondition from "./dialog-form-condition";

  export default {
    name: "dialog-node-attribute",
    components: {FormApprover, FormCondition},
    model: {
      prop: 'nodeConfig'
    },
    props: {
      nodeConfig: Object,
      numberType: Array
    },
    data() {
      return {
        loading: false,
        visible: false,

        // 默认展开的收缩面板为基本信息
        activeName: 'basic-info',

        // 节点类型：1、发起/开始节点  2、结束节点
        nodeTypeOpts: [{label: '发起/开始节点', value: '1'}, {label: '结束节点', value: '2'}],

        // 文本位置选项
        positionsOpts: [
          {label: '居上', value: 'top'}, {label: '居中', value: 'center'}, {label: '居下', value: 'bottom'},
          {label: '居左', value: 'left'}, {label: '居右', value: 'right'}
        ],
        // 预设颜色
        predefineColors: [
          '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)',
          '#ff8c00', '#ff7800', '#fad400', '#00babd', 'rgba(31, 147, 255, 0.73)', 'rgba(199, 21, 133, 0.46)'
        ],
        // 功能权限选项
        authorityOpts: []
      };
    },

    created() {
      getNodeAuthority({isNeedPage: false}).then(res => {
        this.authorityOpts = res.data || [];
      }).catch(() => {
      });
    },

    methods: {
      showDialog() {
        this.visible = true;
      },

      hideDialog() {
        this.visible = false;
      },

      // 确认保存
      confirmSave() {
        if (this.nodeConfig.type === 'polyline-running') {
          this.$listeners.updateEdgeItem();
        } else {
          // 勾选会签后，需要填写会签比例
          let {isCountersign, proportion} = this.nodeConfig.countersign;
          if (isCountersign === '1' && !proportion) {
            return this.$promptMessage({type: 'warning', message: '请输入会签比例！', duration: 5000});
          }
          this.$listeners.updateNodeItem();
        }
      },

      // 新增审批人员设置
      addApprovers(data, callback) {
        // 相同的审批类型只可存在一个
        let row = this.nodeConfig.approvers.find(r => r.approverType === data.approverType);
        if (row) {
          this.$promptMessage({type: 'warning', message: '同一审批类型只能存在一个！', duration: 5000});
          callback && callback(false);
        } else {
          this.nodeConfig.approvers.push(JSON.parse(JSON.stringify(data)));
          callback && callback(true);
        }
      },

      // 修改审批人员设置
      updateApprovers(data, callback) {
        // 相同的审批类型只可存在一个，但不包括自身
        let row = this.nodeConfig.approvers.find(r => r.approverType === data.approverType && r.id !== data.id);
        if (row) {
          this.$promptMessage({type: 'warning', message: '同一审批类型只能存在一个！', duration: 5000});
          callback && callback(false);
        } else {
          let index = this.nodeConfig.approvers.findIndex(r => r.id === data.id);
          Object.assign(this.nodeConfig.approvers[index], data);
          callback && callback(true);
        }
      },

      // 删除审批人员设置
      deleteApprovers({$index}) {
        this.$confirmMessage('确认删除吗？', '提示', 'warning', () => {
          this.nodeConfig.approvers.splice($index, 1);
        });
      },

      // 保存节点条件设置
      addCondition(data, callback) {
        let row = this.nodeConfig.nodeConditions.find(r => r.id === data.id);
        if (row) {
          this.$promptMessage({type: 'warning', message: '同一节点条件只能存在一个！', duration: 5000});
          callback && callback(false);
        } else {
          this.nodeConfig.nodeConditions.push(JSON.parse(JSON.stringify(data)));
          callback && callback(true);
        }
      },

      // 修改节点条件设置
      updateCondition(data, callback) {
        // 相同的节点条件只可存在一个，但不包括自身
        let row = this.nodeConfig.nodeConditions.find(r => r.id === data.id && r.cId !== data.cId);
        if (row) {
          this.$promptMessage({type: 'warning', message: '同一节点条件只能存在一个！', duration: 5000});
          callback && callback(false);
        } else {
          let index = this.nodeConfig.nodeConditions.findIndex(r => r.cId === data.cId);
          Object.assign(this.nodeConfig.nodeConditions[index], data);
          callback && callback(true);
        }
      },

      // 删除审批人员设置
      deleteCondition({$index}) {
        this.$confirmMessage('确认删除吗？', '提示', 'warning', () => {
          this.nodeConfig.nodeConditions.splice($index, 1);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .drawer-node-data {
    width: 518px;
    left: initial;
  }

  .node-data-cfg {
    ::v-deep {
      .el-collapse-item__header {
        height: 40px;
        color: #409EFF;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        .el-icon {
          font-size: 16px;
        }
      }
      .el-color-picker {
        display: flex;
        top: 1px;
        .el-color-picker__mask {
          width: 100%;
        }
      }
      .el-color-picker__trigger {
        width: 120px !important;
        border-color: #DCDFE6;
      }
    }
    .condition-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      padding-left: 6px;
      height: 28px;
      &:before {
        position: absolute;
        top: 10px;
        left: 0;
        content: '';
        width: 4px;
        height: 13px;
        background-color: #409EFF;
      }
    }
    .w-346 {
      width: 346px;
    }
  }
</style>
