<template>
  <div class="rightBg">
    <div class="roleMain">

      <div class="roleMain-left">
        <div class="roleMain-left-top" style="position:relative;z-index:998;float:left;margin-left:10px;">
          <el-input v-model="keyWord" style="width:220px;float:left;" placeholder="请输入机构名称搜索"></el-input>
          <img @click="search()" src="../../assets/images/fagnda.png" class="searchRole">
        </div>
        <div style="clear:both"></div>
        <el-tree style="max-height: 700px;overflow-y: auto;" ref="treeBox" node-key="id" :props="defaultProps"
                 :expand-on-click-node="false" highlight-current :accordion="false" :data="data"
                 @node-click="handleNodeClick">

        <span class="custom-tree-node" slot-scope="{ node, data }">
           <span
             style="float:left;text-overflow:ellipsis;overflow:hidden;white-space:nowrap; -o-text-overflow: ellipsis;">{{ node.label}}</span>
        </span>
        </el-tree>
      </div>

      <div class="roleMain-right" v-if="list.length">

        <div class="search-box">
          <el-row class="fl" style="float:left;">
            <el-form size="mini" :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-input @keyup.enter="getMembers()" v-model="paramsMember.keyWord" maxlength=30
                          placeholder="请输入姓名搜索"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getMembers()" class='blueButton2 blueButtonSmall' size="mini"
                           type="primary">搜索
                </el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <span style="float:right;">
          <el-button @click="configurationRole = true" :disabled="multipleSelection.length <= 0" size="mini"
                     type="primary">批量编辑权限</el-button>
        </span>
        </div>
        <div class="tableWidth">
          <el-table border ref="multipleTable"
                    tooltip-effect="dark"
                    :data="showList"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="code" label="工号"></el-table-column>
            <el-table-column prop="identity" label="角色">
              <template slot-scope="scope">
                {{scope.row.role == 3 ? "普通成员" : (scope.row.role == 2 ? '管理员' : (scope.row.role == 1 ? "负责人"
                : '其他'))}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button @click="editRole(scope.row.userId)" type="text" class="opreat-btn">编辑权限
                </el-button>
              </div>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="queryList.currentPage"
            :page-size="queryList.pagesize"
            :total='list.length'>
          </el-pagination>
        </div>
      </div>
    </div>


    <!--权限配置-->
    <el-dialog title="权限配置" @close="beforeRoleClose" :visible.sync="configurationRole" width="600px">
      <cms-role :roles="roleData" :perms="treeData" ref="refTree"></cms-role>
      <span slot="footer" class="dialog-footer">
					<el-button @click="configurationRole = false">取 消</el-button>
				  <el-button type="primary" @click="submitRole">确 定</el-button>
				</span>
    </el-dialog>
  </div>
</template>

<script>

  import {ansycRoutes} from '@/router/routes'
  import {clickOutSide} from '@/utils/directives'
  import {
    cascade2,
    cascade3,
    getNode2
  } from "@/utils/filters"

  export default {
    directives: {
      clickOutSide
    },
    data() {
      return {
        configurationRole: false,
        data: [],
        list: [],
        paramsMember: {
          id: '',
          type: 1,
          keyWord: '',
        },
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        treeData: [],
        roleData: [],
        userId: '',
        keyWord: '',
        showList: [],
        multipleSelection: [],
        queryList: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        click: 0,
      }
    },
    created() {
      this.getRole();
      this.getUserRoleList();

    },
    mounted() {

    },
    methods: {
      searchMember() {

      },
      handleCurrentChange(val) {
        this.queryList.currentPage = val;
        this.showList = this.list.slice((this.queryList.currentPage - 1) * this.queryList.pageSize, this.queryList.currentPage * this.queryList.pageSize)
      },
      editRole(id) {
        this.configurationRole = true
        this.userId = id
        this.$http.get("/operator/role/detail", {
          params: {
            userId: id
          }
        }).then(res => {
          this.treeData = res.data.moduleList.map(item => {
            return item.id
          })
        })
      },
      submitRole() {
        let data = this.$refs.refTree.creatRoles()
        let id = this.userId;
        this.click = 0;
        if (this.multipleSelection.length > 0) {
          id = '';
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (i > 0) {
              id += ','
            }
            id += this.multipleSelection[i].userId;
          }
        }
        if (data) {
          this.$http.post("/operator/role/module/add",
            {
              userId: id,
              modules: data
            }).then(res => {
            if (res.code == 200) {
              this.configurationRole = false
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
            }
          })
        }
        else{
          this.$http.post("/operator/role/module/del",
            {
              userId: id              
            }).then(res => {
            if (res.code == 200) {
              this.configurationRole = false
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
            }
          })
        }
      },
      //所有角色权限
      getUserRoleList() {
        let that = this
        that.$http.get('/system/modules2').then(res => {
          that.roleData = cascade2('0', res.data)
        })
      },
      beforeRoleClose() {
        this.treeData = []
        this.$refs.refTree.setDefaultCheck()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getMembers() {
        this.$http.get("/operator/operatorList", {
          params: this.paramsMember
        }).then(res => {
          this.list = res.data
          this.showList = res.data
          this.showList = this.list.slice((this.queryList.currentPage - 1) * this.queryList.pageSize, this.queryList.currentPage * this.queryList.pageSize)
        })
      },
      search() {
        this.getRole()
      },
      getRole() {
        this.$http.get("/operator/rolesOrgList", {
          params: {
            keyWord: this.keyWord
          }
        }).then(res => {
          let tempList = [];
          let tempJiGou = new Object();
          tempJiGou.id = -1;
          tempJiGou.name = '机构';
          tempJiGou.parentId = 0;
          res.data.jigou.push(tempJiGou)
          tempList = tempList.concat(res.data.jigou);
          //tempList.concat(res.data.zuzhi);
          tempJiGou = new Object();
          tempJiGou.id = -2;
          tempJiGou.name = '学院';
          tempJiGou.parentId = 0;
          res.data.collegeList.push(tempJiGou);
          tempList = tempList.concat(res.data.collegeList);

          tempJiGou = new Object();
          tempJiGou.id = -4;
          tempJiGou.name = '独立老师';
          tempJiGou.parentId = 0;
          res.data.operatorList.push(tempJiGou);
          tempList = tempList.concat(res.data.operatorList);

          if (this.keyWord) {
            this.data = cascade3(0, tempList)
          } else {
            this.data = cascade3(0, tempList)
            /*组织机构渲染*/
            let orgClass = new Object();
            orgClass.id = -3;
            orgClass.name = '组织';
            orgClass.parentId = 0;
            orgClass.children = [];
            orgClass.children.push(res.data.zuzhi1)
            orgClass.children.push(res.data.zuzhi2)
            orgClass.children.push(res.data.zuzhi3)
            this.data.push(orgClass);
          }

        })
      },
      handleNodeClick(data) {
        this.multipleSelection = [];
        this.temporaryList = data
        this.paramsMember.id = data.id
        this.queryList.currentPage = 1;
        this.paramsMember.keyWord = '';

        if (data.parentId <= 0) {
          this.list = [];
        }

        if (data.parentId == -4) {
          this.getUserRoleList()
          this.editRole(data.id);

          return;
        }

        if (data.parentId == -2) {
          this.paramsMember.type = 2
        } else {
          this.paramsMember.type = 1
        }

        if (data.id > 0) {
          this.getMembers()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .roleMain-right {
    margin-left: 320px;
    margin-right: 15px;
    margin-top: 20px;
  }

  .orgnazitonTitle {
    width: 100%;
    overflow: hidden;
  }

  .orgnazitonTitle-logo {
    margin-top: 5px;
  }

  .orgnazitonTitle-content {

    font-size: 14px;
    line-height: 30px;

    b {
      font-size: 16px;
    }
  }

  .searchRole {
    position: absolute;
    left: 190px;
    top: 9px;
    cursor: pointer;
  }

  .roleMain {

    border: 1px solid #EBEEF5;
    width: 98%;
    float: left;
    margin-left: 1%;
    background: #fff;
    min-height: calc(100vh - 80px);

    &-left {
      float: left;
      min-height: calc(100vh - 80px);
      width: 300px;
      border-right: 1px solid #EBEEF5;

      &-top {
        width: 260px;
        margin: 20px auto;
      }
    }

    &-right {
    }
  }
</style>
