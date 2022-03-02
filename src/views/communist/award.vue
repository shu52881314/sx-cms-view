<template>
  <section>
    <!-- 定义新增项目弹出对话框  -->
    <el-dialog title="新增项目" v-if="dialogjc" :visible.sync="dialogjc" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormRejecthdjc" ref="ruleFormReject" class="demo-ruleForm xzxm">
        <el-form-item label="项目名称" required>
          <el-col :span="18">
            <el-input placeholder="项目名称" v-model="ruleFormRejecthdjc.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目分类" required>
          <el-col :span="18">
            <el-cascader :props="defaultProps" @change="systemClassifysListChanges" placeholder="请选择项目分类"
              style="width:100%" class="selectWidth" expand-trigger="click" clearable :options="options"
              :change-on-select="true" :show-all-levels="true"></el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-col :span="20">
            <el-input type="textarea" placeholder="请输入备注" v-model="ruleFormRejecthdjc.explain"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="submitFormPass()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 定义加减分项目标题栏 -->
    <div style="position:relative;">
      <el-tabs v-model="tabtype" @tab-click="handleClick(tabtype)">
        <el-tab-pane label="加分项" name="1"></el-tab-pane>
        <el-tab-pane label="减分项" name="0"></el-tab-pane>
      </el-tabs>
      <el-button @click="gbhd" style="position:absolute;right:0;top:2px;" type="increase" size="mini">新增项目</el-button>
    </div>

    <!-- 定义按条件搜索 -->
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="项目分类：">
          <el-cascader :props="defaultProps" @change="systemClassifysListChange" placeholder="请选择项目分类"
            style="width:100%" class="selectWidth" expand-trigger="click" clearable :options="options"
            :change-on-select="true" :show-all-levels="true"></el-cascader>
        </el-form-item>

        <el-form-item label="添加日期：">
          <el-form-item>
            <el-col :span="22">
              <el-date-picker @change="changeStartDate" style="width:100%;margin-right: 0px;"
                v-model="dateArray.beginTime2" type="datetime" format="yyyy-MM-dd HH:mm" default-time="00:00:00"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item>
            <el-col :span="22">
              <el-date-picker :disabled="isShow" style="width:100%;" start-placeholder="2017 年 03 月 21 日"
                v-model="dateArray.endTime2" type="datetime" format="yyyy-MM-dd HH:mm" default-time="23:59:59"
                placeholder="请选择结束日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form-item>

        <el-form-item label="项目名称：">
          <el-input v-model="params.name" maxlength=30 placeholder="请输入项目名称搜索"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>

      </el-form>
    </div>

    <!-- 定义列表展示区域 -->
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="awardId" label="ID" show-overclassifyIdow-tooltip></el-table-column>
        <el-table-column prop="awardName" label="项目名称" width="240" show-overclassifyIdow-tooltip></el-table-column>
        <el-table-column prop="classifyName" label="项目分类" show-overclassifyIdow-tooltip></el-table-column>
        <el-table-column prop="awardNumber" :label="params.type==1?'加分人数':params.type==0?'减分人数':''"
          show-overclassifyIdow-tooltip></el-table-column>
        <el-table-column prop="creatorName" label="添加人" show-overclassifyIdow-tooltip></el-table-column>
        <el-table-column label="添加时间" align="left">
          <div slot-scope="scope">
            <p>{{scope.row.ctime | formatDate}}</p>
          </div>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="left"></el-table-column>
        <el-table-column label="操作" width="160" align="left">
          <div slot-scope="scope">
            <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.awardId)">详情</el-button>
            <el-button v-if="scope.row.awardNumber == 0" type="text" class="opreat-btn"
              @click.native="deleteAward(scope.row.awardId)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>

      <!-- 定义分页栏 -->
      <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
    </div>
  </section>
</template>

<script>
  import {
    Message
  } from 'element-ui';
  import {
    cascade,
    cascade3
  } from '@/utils/filters'
  import axios from 'axios'

  export default {
    data() {
      return {
        // 加减分 栏目 类型
        tabtype: '1',
        // 新增项目中用到的属性
        ruleFormRejecthdjc: {
          name: '',
          classifyId: '',
          explain: '',
          type: 1
        },
        // 新增项目弹框的显示状态
        dialogjc: false,
        // 搜索项的第二个日历控件是否可用， 取反用法
        isShow: true,
        // 控制搜索项的第二个日历控件内容？ todo
        pickerOptions1: {
          // disabledDate: (time) => {
          //   let beginDateVal = this.dateArray.beginTime2;
          //   if (beginDateVal) {
          //     let beginYear = beginDateVal.getFullYear();
          //     let beginMonth = beginDateVal.getMonth() + 1;
          //     let beginDate = beginDateVal.getDate();

          //     let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
          //     let beginDateVal2 = beginDateVal1.replace(/-/g, '/');
          //     let timestamp = new Date(beginDateVal2).getTime();

          //     if (beginDateVal) {
          //       return time.getTime() < timestamp;
          //     }
          //   } else {
          //     return true
          //   }
          // },
          // minTime:dateArray.startDate2
        },
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        // 搜索项 开始时间 结束时间
        dateArray: {
          beginTime2: '',
          endTime2: ''
        },
        // 是否在载入中,用于控制 加载遮罩
        loading: false,
        // 搜索项 参数
        params: {
          current: 1,
          size: 10,
          classifyId: '',
          name: '',
          beginTime: '',
          endTime: '',
          type: 1,
          status: ""
        },
        // 用于接收 接口返回数据的数组
        data: [],
        // 数据总条数
        total: 0,
        // 用于接收 分类列表返回数据的数组
        options: [],
        // options: [{
        //   id: '',
        //   name: '不限'
        // }],
      }
    },
    methods: {
      // 新增项目弹窗 提交
      submitFormPass() {
        if (this.ruleFormRejecthdjc.name == '') {
          this.$message({
            type: 'error',
            message: '请输入项目名称'
          });
          return
        }
        if (this.ruleFormRejecthdjc.classifyId == '') {
          this.$message({
            type: 'error',
            message: '请选择项目分类'
          });
          return
        }
        this.$http.post("/award/add", this.ruleFormRejecthdjc).then((res) => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            // 重新获取数据
            this.fetch()
            // 重置新增项目弹窗 标志
            this.dialogjc = false
          }
        })
      },
      // 跳转到 详情 页
      showDetail(id) {
        this.$router.push({
          path: "/communist/awarddetall",
          query: {
            id: id,
            type: this.params.type
          }
        })
      },
      // 搜索 项目分类 下拉列表 变化 触发
      systemClassifysListChange(value) {
        this.params.classifyId = value[value.length - 1]
      },
      // 新增项目弹窗 项目分类 变化 触发函数
      systemClassifysListChanges(value) {
        this.ruleFormRejecthdjc.classifyId = value[value.length - 1]
        console.log(this.ruleFormRejecthdjc.classifyId)
      },
      // 获取可用分类
      getClassifytwo() {
        this.$http.get("/activity/classifies/list").then(res => {
          this.options = cascade3(0, res.data);
        });
      },
      // 搜索栏 仅选择了开始日期 未选择结束日期 时 弹出提示
      open() {
        this.$message('请选择结束日期');
      },
      // 搜索栏 根据第一个日历控件 是否有值,控制 第二个日历控件 是否可用， 注意第二个日历控件用的是 disable属性，所以isShow 需要取反
      changeStartDate(value) {
        if (value) {
          this.isShow = false
        } else {
          this.isShow = true
          this.dateArray.endTime2 = ""
        }
      },
      // 弹出 新增项目 对话框
      gbhd() {
        this.ruleFormRejecthdjc.name = ''
        this.ruleFormRejecthdjc.classifyId = ''
        this.ruleFormRejecthdjc.explain = ''
        this.dialogjc = true
      },
      // 切换 加减分项目 tab栏， 重置分页参数， 重新获取数据
      handleClick(tabtype) {
        this.ruleFormRejecthdjc.type = parseInt(tabtype);
        this.params.type = parseInt(tabtype);
        this.params.current = 1;
        this.params.size = 10;
        if (this.$route.query.page) {
          this.params.current = 1;
          this.params.size = 10;
          this.$refs.mychild.getCurrent(this.params.current);
        }
        this.fetch();
      },
      // 刷新数据
      fetch() {
        this.loading = true
        this.$http.get('/award/list', {
          params: this.params
        }).then(res => {
          if (res.code == 200) {
            this.data = res.data.list
            this.total = res.data.total
            this.loading = false
          }
        })
      },
      // 搜索
      search() {
        if (this.dateArray.beginTime2 && this.dateArray.endTime2) {
          this.params.beginTime = this.dateArray.beginTime2.getTime();
          this.params.endTime = this.dateArray.endTime2.getTime();
        }
        if (this.dateArray.beginTime2 && !this.dateArray.endTime2) {
          this.open()
          return
        }
        if (!this.dateArray.beginTime2 && !this.dateArray.endTime2) {
          this.dateArray = []
          this.params.beginTime = ""
          this.params.endTime = ""
        }
        this.params.current = 1
        this.fetch()
      },
      // 更改 分页栏 触发函数
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      //删除奖惩项目
      deleteAward(id) {
        this.$confirm('是否确定删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post("/award/delete", {
            awardId: id
          }).then((res) => {
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
    },
    // 初始化 执行的函数
    created() {
      this.getClassifytwo()
    },
    // 初始化 之后执行的 函数
    mounted() {
      this.fetch()
    },
  }
</script>

<style>
  .xzxm .el-form-item__error {
    left: 20% !important;
  }
</style>
<style lang="scss" scoped>
  .el-form-item {
    margin-right: 5px !important;
  }
</style>
