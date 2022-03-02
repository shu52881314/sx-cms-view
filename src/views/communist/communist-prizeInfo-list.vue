<template>
  <section>
    <el-tabs v-model="activeName" @tab-click="goTab">
      <el-tab-pane label="项目列表1" name="0"></el-tab-pane>
      <el-tab-pane label="审核列表" name="1"></el-tab-pane>
    </el-tabs>
    <div class="main-header">
      <span class="main-title">项目列表</span>
      <div class="main-btn-box">
        <el-button type="increase" size="mini" @click="routerLink('project/edit', 'update','-1')"
                   v-perms="'/communist/project/add'">新增项目
        </el-button>
        <!--<el-button type="primary" size="mini" @click="routerLink('project/export', 'update')">导出项目</el-button>-->
      </div>
    </div>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="项目分类">
          <!--<el-select v-model="params.classifyId" clearable placeholder="请选择项目分类">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>-->


          <el-cascader @change="systemClassifysListChange" placeholder="请选择项目分类" :props="defaultProps" style="width:100%" class="selectWidth"
                       expand-trigger="click" v-model="classifyIds" clearable :options="classList"
                       :change-on-select="true" :show-all-levels="true"></el-cascader>
        </el-form-item>
        <el-form-item label="申报状态">
          <el-select v-model="params.status" clearable placeholder="请选择申报状态">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="params.name" maxlength="30" placeholder="请输入项目名称关键字搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classifyName" label="分类名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optionNumber" label="奖项数" align="center"></el-table-column>
        <el-table-column prop="applyPassNumber" label="获奖人数" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{scope.row.status == 1 ? '已启用' : '停止申请'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="left">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn"
                       @click.native="routerLink('project/edit','update',scope.row.projectId,'',params.current)"
                       v-perms="'/communist/project/edit'">编辑
            </el-button>
            <el-button v-if="scope.row.status == 1" type="text" class="opreat-btn"
                       @click.native="stopProject(scope.row.projectId,2)" v-perms="'/communist/project/stop'">停止申请
            </el-button>
            <el-button v-if="scope.row.status == 2" type="text" class="opreat-btn"
                       @click.native="stopProject(scope.row.projectId,1)" v-perms="'/communist/project/stop'">恢复申请
            </el-button>
            <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.projectId)"
                       v-perms="'/communist/project/details'">详情
            </el-button>
            <!-- <el-button v-if="scope.row.applyPassNumber == 0" type="text" class="opreat-btn"
                        @click.native="deleteProject(scope.row.projectId)" v-perms="'/communist/project/delete'">删除
             </el-button>-->
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import {cascade,cascade3} from '@/utils/filters'

  export default {
    data() {
      return {
        classList: [],
        statusList: [{name: '已启用', id: 1}, {name: '停止申请', id: 2}],
        loading: false,
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        classifyIds: [],
        params: {
          current: 1,
          size: 10,
          classifyId: '',
          status: '',
          name: ''
        },
        data: [],
        total: 0,
        options: {
          value: 'id',
          label: 'name',
          children: "children"
        },
        systemClassifysList: [],
        selectClassify: [],
        systemClassifies: [],
        activeName: '0',
        tabsList:['/communist/project','/communist/project/apply'],
      }
    },
    methods: {
      goTab() {
        const that = this;
        this.$router.push({path: that.tabsList[parseInt(that.activeName)], query: {type: that.activeName}});
      },
      initProject() {
        const that = this;
        that.$http.get('/activity/classifies/list').then(res => {
          if (res.code == 200) {
            that.classList = cascade3(0,res.data);
          }
        })
      },
      showDetail(id) {
        if (this.params.id) {
          this.params.id = id
        }
        this.params.selectClassify = this.selectClassify.join(',')
        this.$router.push({path: "/communist/project/detail", query: {id: id, ...this.params}})
      },
      systemClassifysListChange(value) {
        this.params.current = 1
       // this.$refs.mychild.handleCurrentChange(this.params.current);
        this.params.classifyId = value[value.length - 1]
      },
      systemClassifys() {
        var that = this
        this.$http.get('/activity/classifies/list').then(res => {
          this.systemClassifysList = cascade("0", res.data)
          this.systemClassifysList.unshift({label: '不限', value: ''})
          this.systemClassifies = cascade("0", res.data)
        })
      },
      stopProject(id, methods) {
        this.$confirm(methods == 1 ? '  是否确定恢复申请该项目? ' : '  是否确定停止申请该项目? ', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post("/project/classify/set", {id: id, method: methods}).then((res) => {

            if (res.code == '200') {
              this.fetch();
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      //删除
      deleteProject(id) {

        this.$confirm('是否确定删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post("/project/delete", {projectId: id}).then((res) => {
            if (res.code == '200') {
              this.fetch();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      fetch() {
        this.loading = true
        this.$http.get('/project/list', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total = res.data.total
          this.loading = false
        })
      },
      search() {
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      }
    }
    ,
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.initProject();
      that.systemClassifys()
    }
    ,
    mounted() {

      if (this.$route.query.page) {
        this.params.current = parseInt(this.$route.query.page)
      }
      if (this.$route.query.current) {
        this.params = this.$route.query;
        if (this.$route.query.selectClassify) {
          this.selectClassify = []
          var s = this.$route.query.selectClassify.split(',')
          for (var i = 0; i < s.length; i++) {
            this.selectClassify.push(parseInt(s[i]))
          }
        }
      }
      this.fetch()

    }
    ,
    filters: {
      formatLimitType(limitType) {
        if (limitType == 0) {
          limitType = '无'
        } else if (limitType == 1) {
          limitType = localStorage.getItem("compulsoryName")
        } else if (limitType == 2) {
          limitType = localStorage.getItem("electiveName");
        }
        return limitType;
      }
    }
  }
</script>
<style>

</style>
