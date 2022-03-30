<template>
  <el-dialog title="审批人员设置" :visible.sync="visible" width="500px" append-to-body :close-on-press-escape="false"
             :close-on-click-modal="false"
             @closed="dialogClosed">
    <el-form size="mini" class="no-margin no-padding no-error" label-width="84px" v-loading="loading">
      <div>
        <el-form-item label="审批类型：" required>
          <el-select v-model="approvers.approverType" placeholder="审批类型" style="width:100%"
                     @change="changeApproverType">
            <el-option v-for="item in approverTypeOpts" :label="item.label" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
          <div class="ft13">
            <span style="color:#F56C6C;">注：</span>
            <span style="color:#909399;">审批人员设置同一审批类型只可存在一种，不可重复添加！</span>
          </div>
        </el-form-item>
      </div>
      <div class="mt2">
        <el-form-item label="选择人员：" required v-show="approvers.approverType === 'a'">
          <el-select v-model="conditionSet" multiple filterable placeholder="选择人员" style="width:100%"
                     @change="selectPersonnel">
            <el-option v-for="item in personnelOpts" :key="item.id" :label="item.name" :value="item.id">
              <span style="float:left">{{item.name}}</span>
              <span style="float:right;color:#8492a6;padding-right:20px;">{{item.id}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择组织：" required v-show="approvers.approverType === 'b'">
          <el-select v-model="conditionSet" multiple filterable placeholder="选择组织" style="width:100%"
                     @change="selectOrganize">
            <el-option v-for="item in organizeOpts" :key="item.zuzhibm" :label="item.zuzhimc" :value="item.zuzhibm">
              <span style="float:left">{{item.zuzhimc}}</span>
              <span style="float:right;color:#8492a6;padding-right:20px;">{{item.zuzhibm}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择岗位：" required v-show="approvers.approverType === 'c'">
          <el-select v-model="conditionSet" multiple filterable placeholder="选择岗位" style="width:100%"
                     @change="selectStation">
            <el-option v-for="item in stationOpts" :key="item.id" :label="item.zhiwumc" :value="item.id">
              <span style="float:left">{{item.zhiwumc}}</span>
              <span style="float:right;color:#8492a6;padding-right:20px;">{{item.id}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-row class="mt8">
        <el-col span="12">
          <el-form-item label="条件：" required>
            <el-select v-model="approvers.approverCondition" placeholder="条件">
              <el-option v-for="item in conditionOpts" :label="`${item.label}（${item.value}）`" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="人员关系：" required>
            <el-select v-model="approvers.optionCondition" placeholder="人员关系">
              <el-option v-for="item in conditionOpts" :label="`${item.label}（${item.value}）`" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
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
  import {getPersonnel, getOrganize, getStation} from "@/api/designer";

  export default {
    name: "dialog-form-approver",
    data() {
      return {
        visible: false,
        loading: false,
        selectLoading: false,

        // 审批类型选项 a.指定人员,b.组织,c.岗位
        approverTypeOpts: [{label: '指定人员', value: 'a'}, {label: '组织', value: 'b'}, {label: '岗位', value: 'c'}],
        // 条件选项
        conditionOpts: [{label: '并且', value: '&&'}, {label: '或者', value: '||'}],

        // 人员选项
        personnelOpts: [],
        // 组织选项
        organizeOpts: [],
        // 岗位选项
        stationOpts: [],

        // 选择的人员、组织、岗位
        conditionSet: [],

        // 审批人员设置
        approvers: {
          id: '',                         // 唯一字段，前端自己定义，方便进行编辑操作  value为当前时间戳
          approverType: 'a',              // 审批类型
          approverTypeName: '指定人员',     // 审批类型名称
          approverCondition: '',          // 条件
          conditionSet: '',               // 选择人员、组织、岗位
          conditionName: '',              // 选择人员、组织、岗位对应的名称
          optionCondition: ''             // 人员关系
        }
      };
    },

    created() {
      // 人员，默认400个。
      getPersonnel({pageSize: 400}).then(res => {
        this.personnelOpts = res.data || [];
      }).catch(() => {
      });

      // 组织
      getOrganize({pageSize: 400}).then(res => {
        this.organizeOpts = res.data || [];
      }).catch(() => {
      });

      // 岗位
      getStation({}).then(res => {
        this.stationOpts = res.data || [];
      }).catch(() => {
      });
    },

    methods: {
      showDialog(data) {
        if (data) {
          Object.assign(this.approvers, data);
          this.conditionSet = this.approvers.conditionSet.split(',');
        }
        this.visible = true;
      },

      // 确认保存审批人员设置
      confirmSave() {
        let {approverCondition, conditionSet, optionCondition} = this.approvers;
        if (!approverCondition) {
          return this.$promptMessage({type: 'warning', message: '请选择条件！', duration: 5000});
        }
        if (!conditionSet) {
          return this.$promptMessage({type: 'warning', message: '请选择人员/组织/岗位！', duration: 5000});
        }
        if (!optionCondition) {
          return this.$promptMessage({type: 'warning', message: '请选择人员关系！', duration: 5000});
        }

        this.loading = true;
        if (this.approvers.id) {
          // 编辑
          this.updateApprovers();
        } else {
          // 保存
          this.addNewApprovers();
        }
      },

      // 新增审批人员设置
      addNewApprovers() {
        this.approvers.id = Date.now();
        this.$listeners.add(this.approvers, flag => {
          if (flag) {
            this.loading = false;
            this.visible = false;
          } else {
            this.loading = false;
          }
        });
      },

      // 编辑审批人员设置
      updateApprovers() {
        this.$listeners.update(this.approvers, flag => {
          if (flag) {
            this.loading = false;
            this.visible = false;
          } else {
            this.loading = false;
          }
        });
      },

      // 切换审批类型
      changeApproverType(val) {
        let item = this.approverTypeOpts.find(ap => ap.value === val);
        // 清空选择的人员、组织、岗位
        this.conditionSet = [];
        // 清空对应的审批人员设置
        Object.assign(this.approvers, {approverTypeName: item ? item.label : '', conditionSet: '', conditionName: ''});
      },

      // 选择人员
      selectPersonnel(val) {
        let name = [];
        val.forEach(v => {
          let personnel = this.personnelOpts.find(p => p.id === v);
          if (personnel) {
            name.push(personnel.name);
          }
        });
        // 保存对应的设置
        Object.assign(this.approvers, {conditionSet: val.join(','), conditionName: name.join(',')});
      },

      // 选择组织
      selectOrganize(val) {
        let name = [];
        val.forEach(v => {
          let organize = this.organizeOpts.find(o => o.zuzhibm === v);
          if (organize) {
            name.push(organize.zuzhimc);
          }
        });
        // 保存对应的设置
        Object.assign(this.approvers, {conditionSet: val.join(','), conditionName: name.join(',')});
      },

      // 选择岗位
      selectStation(val) {
        let name = [];
        val.forEach(v => {
          let station = this.stationOpts.find(s => s.id === v);
          if (station) {
            name.push(station.zhiwumc);
          }
        });
        // 保存对应的设置
        Object.assign(this.approvers, {conditionSet: val.join(','), conditionName: name.join(',')});
      },

      dialogClosed() {
        this.conditionSet = [];
        Object.assign(this.approvers, {
          id: '',                       // 唯一字段，前端自己定义，方便进行编辑操作  value为当前时间戳
          approverType: 'a',            // 审批类型
          approverTypeName: '指定人员',  // 审批类型名称
          approverCondition: '',        // 条件
          conditionSet: '',             // 选择人员、组织、岗位
          conditionName: '',            // 选择人员、组织、岗位对应的名称
          optionCondition: ''           // 人员关系
        });
      }
    }
  };
</script>
