<template>
  <el-dialog title="节点条件设置" :visible.sync="visible" width="500px" append-to-body :close-on-press-escape="false"
             :close-on-click-modal="false"
             @closed="dialogClosed">
    <el-form size="mini" class="no-margin no-padding no-error" label-width="84px" v-loading="loading">
      <div>
        <el-form-item label="条件名称：" required>
          <el-select v-model="condition.id" placeholder="条件名称" style="width:100%"
                     @change="changeCondition">
            <el-option v-for="item in conditionOpts" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <div class="ft13">
            <span style="color:#F56C6C;">注：</span>
            <span style="color:#909399;">选择条件后，自动显示对应的比较逻辑和条件！</span>
          </div>
        </el-form-item>
      </div>
      <el-row class="mt4">
        <el-col span="12">
          <el-form-item label="比较逻辑：">
            <el-input v-model="condition.compare" placeholder="比较逻辑" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="条件：">
            <el-input v-model="condition.value" placeholder="条件" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="visible = false">取 消</el-button>
      <el-button size="mini" type="primary" :disabled="loading" @click="confirmSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getNodeCondition} from "@/api/designer";

  export default {
    name: "dialog-form-condition",
    data() {
      return {
        visible: false,
        loading: false,

        // 条件选项
        conditionOpts: [],

        // 节点条件设置
        condition: {
          cId: '',
          id: '',           // 条件ID
          name: '',         // 条件名称
          compare: '',      // 比较逻辑
          value: ''         // 条件
        }
      };
    },

    created() {
      getNodeCondition({isNeedPage: false}).then(res => {
        this.conditionOpts = res.data || [];
      }).catch(() => {
      });
    },

    methods: {
      showDialog(data) {
        if (data) {
          Object.assign(this.condition, data);
        }
        this.visible = true;
      },

      // 确认保存
      confirmSave() {
        if (!this.condition.id) {
          return this.$promptMessage({type: 'warning', message: '请选择条件！', duration: 5000});
        }

        this.loading = true;
        if (this.condition.cId) {
          this.updateCondition();
        } else {
          this.addNewCondition();
        }
      },

      // 新增节点条件
      addNewCondition() {
        this.condition.cId = Date.now();
        this.$listeners.add(this.condition, flag => {
          if (flag) {
            this.loading = false;
            this.visible = false;
          } else {
            this.loading = false;
          }
        });
      },

      // 更新节点条件
      updateCondition() {
        this.$listeners.update(this.condition, flag => {
          if (flag) {
            this.loading = false;
            this.visible = false;
          } else {
            this.loading = false;
          }
        });
      },

      // 选择条件
      changeCondition(id) {
        let item = this.conditionOpts.find(co => co.id === id);
        if (item) {
          let {name, compare, value} = item;
          Object.assign(this.condition, {name, compare, value});
        }
      },

      dialogClosed() {
        Object.assign(this.condition, {
          cId: '',
          id: '',           // 条件ID
          name: '',         // 条件名称
          compare: '',      // 比较逻辑
          value: ''         // 条件
        });
      }
    }
  };
</script>
