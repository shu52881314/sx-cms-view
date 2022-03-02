<template>

  <el-tabs v-model="tabType" @tab-click="changeTab">
    <el-tab-pane label="活动模板" name="1">

      <!-- <el-row v-if="tplSplitByClassfy == 1" style="margin-right: 1rem">
        请选择类别：
        <el-cascader
          :change-on-select="true"
          ref="cascaderClass"
          style="width: 100%;"
          :props="{value:'id',label:'name'}"
          :options="classList">
        </el-cascader>
      </el-row> -->

      <el-row>
        <el-table border :loading="loading" :data="tplList" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="模板名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="className" label="归属分类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="actNum" label="待审任务数" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="auditorNum" label="审核人数量" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100" prop="status">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '启用' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button @click="onOROff(scope.row.id,scope.row.status ? 0 : 1)" type="text"> {{scope.row.status ?
                '禁用' : '启用'}}</el-button>
              <el-button @click="goEdit(scope.row)" type="text">编辑</el-button>
            </el-row>
          </el-table-column>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane v-perms="'/system/template/pro'" label="申报模板" name="2">
      <el-tabs v-model="proType" @tab-click="fetch()" type="card">
        <el-tab-pane name="1" :label="proApplyType == 1 ? '按院系（当前）' : '按院系'">
          <el-row style="display:flex;align-items: center;padding:1rem">
            <el-row style="margin-right: 1rem">
              当前审核规则为： {{proApplyType == 1 ? '按院系' : '按类别'}} 审核
            </el-row>

            <el-row style="width: 70%">
              <el-button @click="changeRoles(proApplyType == 2 ? 1 : 2)" size="mini" type="primary">更改当前规则</el-button>
              <router-link :to="'/system/template/edit-sub?type=1'">
                <el-button style="margin-left: 70%" size="mini" type="success">添加模板</el-button>
              </router-link>
            </el-row>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="2" :label="proApplyType == 2 ? '按类别（当前）' : '按类别'">
          <el-row style="display:flex;align-items: center;padding:1rem">
            <el-row style="margin-right: 1rem">
              当前审核规则为： {{proApplyType == 1 ? '按院系' : '按类别'}} 审核
            </el-row>
            <el-row style="width: 70%">
              <el-button @click="changeRoles(proApplyType == 1 ? 2 : 1)" size="mini" type="primary">更改当前规则</el-button>
              <router-link :to="'/system/template/edit-sub?type=2'">
                <el-button style="margin-left: 70%" size="mini" type="success">添加模板</el-button>
              </router-link>
            </el-row>
          </el-row>
        </el-tab-pane>

        <el-row>
          <el-table border :loading="loading" :data="tplList" stripe size="mini" style="width: 100%">
            <el-table-column prop="name" :label="proApplyType == 1 ? '院系' : '类别名称'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="proNum" label="待审任务数" width="240" show-overflow-tooltip></el-table-column>
            <el-table-column prop="auditorNum" label="审核人数量" width="240" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="100" prop="status">
              <template slot-scope="scope">
                {{scope.row.status == 1 ? '启用' : '禁用'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="left">
              <el-row slot-scope="scope">
                <el-button @click="onOROff(scope.row.id,scope.row.status ? 0 : 1)" type="text"> {{scope.row.status ?
                  '禁用' : '启用'}}</el-button>
                <el-button @click="goEdit(scope.row)" type="text">编辑</el-button>
              </el-row>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tabs>
    </el-tab-pane>

    <el-tab-pane v-if="tabRole" label="社会实践模板" name="3">
      <el-row style="display:flex;align-items: center;padding:1rem;justify-content: flex-end">
        <router-link style="display: block;margin-right: 5rem;" :to="'/system/template/edit-practice?type=3'">
          <el-button style="margin-left: 70%" size="mini" type="success">添加模板</el-button>
        </router-link>
      </el-row>

      <el-row>
        <el-table border :loading="loading" :data="tplList" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" :label="proApplyType == 1 ? '院系' : '类别名称'" show-overflow-tooltip></el-table-column>
          <el-table-column prop="auditorNum" label="审核人数量" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100" prop="sta width="100"tus">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '启用' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button @click="onOROff(scope.row.id,scope.row.status ? 0 : 1)" type="text"> {{scope.row.status ?
                '禁用' : '启用'}}</el-button>
              <el-button @click="goEdit(scope.row)" type="text">编辑</el-button>
            </el-row>
          </el-table-column>
        </el-table>
      </el-row>
    </el-tab-pane>

    <!--v-perms="'/system/template/unit'"-->
    <el-tab-pane label="学籍模板" name="5" @click="fetch()">
      <el-row style="width: 100%">
        <router-link :to="'/system/template/edit-sub?type=5'" style="float: right;margin-right: 30px">
          <el-button size="mini" type="success">添加模板</el-button>
        </router-link>
      </el-row>

      <el-row>
        <!--班团组织-->
        <el-table border :loading="loading" :data="tplList" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="院系" show-overflow-tooltip></el-table-column>
          <el-table-column prop="unitNum" label="待审任务数" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="auditorNum" label="审核人数量" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100" prop="status">
            <template slot-scope="scope">
                {{scope.row.status == 1 ? '启用' : '禁用'}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button @click="onOROff(scope.row.id,scope.row.status ? 0 : 1)" type="text"> {{scope.row.status ?'禁用' : '启用'}}
                </el-button>
              <el-button @click="goEdit(scope.row)" type="text">编辑</el-button>
            </el-row>
          </el-table-column>
        </el-table>
      </el-row>

    </el-tab-pane>
  </el-tabs>

</template>

<style scoped lang="scss">

</style>

<script>
  import store from '@/store/index'
  import {TemplateRoleFmt, cascade5} from '@/utils/filters'

  export default {
    data() {
      return {
        tabRole: false,
        //标志变量 表示 tab页类型， 活动模板，申报模板，学籍模板
        tabType: '1',
        loading: false,
        proType: '',
        tplList: [], //活动模板列表
        proApplyType: '',
        //学校参数 是否按照 分类 隔离模板
        tplSplitByClassfy:0,
        //分类列表
        classList: [],
        classId: ''

      }
    },
    mounted() {
      const that = this;
      that.initTabRole();
    },
    created() {
      const that = this;
      that.getsettings();
      that.initClassList();
      that.fetch();
    },
    methods: {
      getsettings() {
        this.$http.get("/system/school/getsettings").then(res => {
           this.tplSplitByClassfy=res.data.tplSplitByClassfy;
        });
      },
      //初始化 分类 列表
      initClassList() {
        const that = this;
        that.$http.get('/system/classifys').then(res => {
          that.classList = cascade5('0', res.data);
        })
      },
      initTabRole() {
        let perms = store.state.permissions.permissions; //按钮权限指令
        if (perms != '*') {
          if (perms.indexOf('/system/template/team') < 0) {
            this.tabRole = false;
          } else {
            this.tabRole = true;
          }
        } else {
          this.tabRole = false;
        }
      },
      changeRoles(status) {
        const that = this;
        that.$confirm(status == 2 ? '当前审核规则为按院校审核，是否更改为按类别审核？' : '当前审核规则为按类别审核，是否更改为按院系审核？', '更改当前规则', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post("/flow/template/edit-role", {
            role: status
          }).then(res => {
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '修改规则成功'
              });
              that.getRoleByTab();
            }
          })
        })
      },
      getRoleByTab() {
        const that = this;
        let schoolId = window.localStorage.getItem('schoolId');
        that.$http.get("/flow/template/getSchoolProApplyStatus", {
          params: {}
        }).then(res => {
          that.proApplyType = res.data.proApplyType;
        })
      },
      onOROff(id, status) {
        const that = this;
        that.$confirm('是否' + (status ? '启用' : '禁用') + '模板？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post("/flow/template/edit-status", {
            id: id,
            status: status
          }).then(res => {
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: status ? '启用成功' : '禁用成功'
              });
              that.fetch();
            }
          })
        }).catch(() => {

        })
      },
      changeTab(val) {
        const that = this;
        if (that.tabType == 2) {
          that.proType = '1';
          that.getRoleByTab();
        } else {
          that.proType = '';
        }

        that.fetch();
      },
      fetch() {
        const that = this;
        that.$http.get("/flow/template/list", {
          params: {
            type: that.tabType,
            proType: that.proType
          }
        }).then(res => {
          that.loading = false;
          that.tplList = []
          that.tplList = res.data;
        })
      },
      goEdit(item) {
        const that = this;
        if (that.tabType == 2) {
          that.$router.push({
            path: "/system/template/edit-sub",
            query: {
              id: item.id,
              type: that.proType,
              xj: 1,
              ed: true
            }
          })
        } else if (that.tabType == 1) {
          that.$router.push({
            path: "/system/template/edit",
            query: {
              id: item.id,
              type: item.class
            }
          })
        } else if (that.tabType == 3) {
          that.proType = 3;
          that.$router.push({
            path: "/system/template/edit-practice",
            query: {
              id: item.id,
              type: that.proType,
              ed: true
            }
          })
        } else if (that.tabType == 5) {
          that.proType = 5;
          that.$router.push({
            path: "/system/template/edit-sub",
            query: {
              id: item.id,
              type: that.proType,
              xj: 1,
              ed: true
            }
          })
        }
      }
    }
  }
</script>
