<template>
  <section>
    <div class="main-header">
      <span class="main-title">学情分析</span>
      <div class="main-btn-box">
        <el-button @click="importAllStudent" type="warning" size="mini" v-perms="'/student/list/export'"
                   :disabled="dcxs">导出数据
        </el-button>
        <el-checkbox v-model="params.includeClass" >包含分类明细</el-checkbox>
      </div>
    </div>

    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="校区" prop="campusId">
          <el-col :span="22">
            <el-select clearable v-model="params.campusId" @change="changeSchool" placeholder="请选择校区">
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="院系">
          <el-select clearable v-model="params.collegeId" @change="changeCollege" placeholder="请选择院系">
            <el-option v-for="item in colleages" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select clearable v-model="params.majorId" placeholder="请选择专业" @change="changeMajor">
            <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年制">
          <el-select clearable v-model="params.length" placeholder="请选择年制" @change="changeLength">
            <el-option v-for="item in lengths" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select clearable v-model="params.classId" placeholder="请选择班级" @change="changeClasses">
            <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select clearable v-model="params.grade" placeholder="请选择年级" @change="changenjes">
            <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <p>
          <el-form-item label="学年">
            <el-select clearable v-model="params.yearId" placeholder="请选择学年" @change="changeYear">
              <el-option v-for="item in years" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期">
            <el-select clearable v-model="params.teamId" placeholder="请选择学期" @change="changeTeam">
              <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'获得'+hoursUnit+'区间'">
            <el-input type="number" v-model="params.minScore" placeholder="请输入" @input="bian" style="width: 110px"></el-input>
            至
            <el-input type="number" v-model="params.maxScore" placeholder="请输入" @input="bian" style="width: 110px"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索" @input="bian"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="params.code" placeholder="请输入学号搜索" @input="bian"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" @click="search()">查询</el-button>
          </el-form-item>
        </p>
      </el-form>
    </div>

    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30"></el-table-column>
        <!-- <el-table-column type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="code" label="学号" width="100"></el-table-column>
        <el-table-column prop="code" label="性别" width="55">
          <template slot-scope="scope">
            <span>{{scope.row.gender == 1 ? "男" : (scope.row.gender == 2 ? "女" : "")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="诚信值" width="60"></el-table-column>
        <el-table-column prop="ethnic" label="民族" width="55"></el-table-column>
        <el-table-column prop="campusName" label="校区" width="150"></el-table-column>
        <el-table-column prop="collegeName" label="院系" width="150"></el-table-column>
        <el-table-column prop="majorName" label="专业" width="150"></el-table-column>
        <el-table-column prop="lengthName" label="年制" width="80"></el-table-column>
        <el-table-column label="年级" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.gradeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="班级" width="150"></el-table-column>
        <el-table-column prop="" label="政治面貌" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.politics | politicsFmt}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="hoursUnit" width="70">
          <template slot-scope="scope">
            <span style="color: red;">{{scope.row.sumScore.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color: red;">{{studentStatus(scope.row.status)}}</span>
            <span v-else :style="{color: scope.row.status == 3 ? 'red': 'green'}">{{studentStatus(scope.row.status)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="200" align="center">
          <div slot-scope="scope">
            <!-- <span v-perms="'/student/list/export/activity'">
                <el-button v-if='scope.row.status != 0' type="text" size="mini" :disable="importDisable"
                           @click="importFile(scope.row.id,scope.row.name)">导出</el-button>
            </span> -->
            <span v-perms="'/student/list/report'">
                 <el-button v-if='scope.row.status != 0' type="text" size="mini"
                            @click="goReport(scope.row.id)">成绩单</el-button>
                 <el-button v-if='scope.row.status != 0' type="text" size="mini"
                            @click="down(scope.row.id, scope.row.name, scope.row.code)">下载</el-button>
            </span>
          </div>
        </el-table-column>
      </el-table>

      <div style="padding-top: 20px;">
        <div style="float: left;">
          <el-button :disabled="dcxs" type="primary " @click="batchDownloadReports()" >批量下载选中成员成绩单</el-button>
        </div>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
      </div>

    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import bus from '@/main'
  import {politicsFmt} from "@/utils/format";

  axios.defaults.timeout = 10 * 60 *1000

  export default {
    filters: {
      politicsFmt(val) {
        return politicsFmt(val);
      },
    },
    data() {
      return {
        dcxs:false,   //记录查询条件 是否变化, 当查询条件变化时， 导出和批量下载成绩单按钮 置灰
        randomData: "",
        hoursUnit: localStorage.getItem("hoursUnit"),
        //fileInforamtion: {},
        loading: false,
        params: {
          includeClass: 0,
          current: 1,
          size: 10,
          campusId: '',
          collegeId: '',
          majorId: '',
          lengthId: '',
          classId: '',
          grade: '',
          yearId: '',
          teamId: '',
          minScore: '',
          maxScore: '',
          name: '',
          code: ''
        },
        isChange: false,
        data: [],
        userIds:[],   //多选得到的 userIds
        ethnices: [],   //民族 数组
        politics: [{id: 0, name: '群众'}, {id: 1, name: '团员'}, {id: 2, name: '党员'}, {id: 3, name: '其他党派'}, {id: 4,name: '预备党员'}],//政治面貌
        schools: [],    //校区数组
        // colleges: [],
        colleages: [],  //院系数组
        // majors: [],
        majores: [],    //专业数组
        lengths: [],    //年制数组
        // classes: [],
        classes2: [],   //班级数组
        gradees: [],    //年级数组
        years: [],      //学年数组
        teams: [],      //学期数组
        total: 0,       //总数量数组
        countryCodes: [{value: '86',label: "中国"}],
        importDisable: false,
        showfileInforDetail: false,
        clickAble: true,
      }
    },
    methods: {

      getEthnic() {
        this.$http.get("school/ethnic/list").then(res => {
          this.ethnices = res.data
        })
      },

      //导出符合查询条件的所有数据
      importAllStudent() {
        var that = this;
        that.importDisable = false;
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在导出中',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)',
        // });
        axios({
          method: 'get',
          url: 'statistics/score/export',
          responseType: 'blob',
           params: that.params
        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '学情分析数据导出' + '.xlsx')
          document.body.appendChild(link)
          link.click()
          that.importDisable = true;
        })
        // setTimeout(() => {
        //   loading.close();
        // }, 5000);
      },

      //导出 某个学生的数据
      // importFile(id, name) {
      //   axios({
      //     method: 'get',
      //     url: 'school/user/impot/activity',
      //     responseType: 'blob',
      //     params: {
      //       id: id
      //     }
      //   }).then((res) => {
      //     if (!res) {
      //       return
      //     }
      //     var filename = name;
      //     let url = window.URL.createObjectURL(res)
      //     let link = document.createElement('a')
      //     link.style.display = 'none'
      //     link.href = url
      //     link.setAttribute('download', filename + '.xlsx')
      //     document.body.appendChild(link)
      //     link.click()
      //   })
      // },

      //查看成绩单页面
      goReport(id) {
        this.$router.push({path:"/report/" + id, query: {id:id}})
      },

      //下载成绩单pdf文件
      down(id, name, code) {
        this.$confirm('是否确定下载该生成绩单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            method: 'get',
            url: 'pdf/genreportpdf',
            responseType: 'blob',
            params: {
              userId: id
            }
          }).then((res) => {
            if (!res) {
              return
            }
            var filename = code + "-" + name;
            let url = window.URL.createObjectURL(res)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', filename + '.pdf')
            document.body.appendChild(link)
            link.click()
          })
        }).catch(() => {
        })
      },

      //查询数据
      fetch() {
        const that = this;
        that.loading = true
        that.$http.get('/statistics/score', {params: that.params}).then(res => {
          that.data = res.data.list
          that.total = res.data.total
          that.loading = false
        })
      },

      //查询条件处理
      //校区处理
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.dcxs=true
        this.params.collegeId = ""
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无院系，前选择其他校区'
              });
            }

          })
        }
      },
      //院系处理
      getColleges() {
        this.$http.get('/school/college/list').then(res => {
          this.colleages = res.data
        })
      },
      changeCollege(value) {
        this.dcxs=true
        this.params.majorId = ""
        this.params.classId = ""
        if (!value) {
          this.majores = [];
          this.classes2 = [];
          // this.gradees = [];
        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      //专业处理
      getMajores() {
        this.$http.get('/school/major/list').then(res => {
          this.majores = res.data
        })
      },
      changeMajor(value) {
        this.dcxs=true
        this.params.classId = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value}}).then(res => {
            this.classes2 = res.data
          })
        }
      },
      changeClasses(value) {
        this.dcxs=true
        this.params.classId = value
      },
      changenjes(value) {
        this.dcxs=true
        this.params.grade = value
      },

      //查询条件 改变了
      bian() {
        this.dcxs=true
      },

      //查询
      search() {
        this.dcxs=false
        this.params.current = 1
        this.fetch()
      },
      //换页
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },

      //处理学生 状态 显示文字
      // studentStatus(index) {
      //   if (index == 0) {
      //     return '未激活'
      //   } else if (index == 1) {
      //     return '正常'

      //   } else if (index == 2) {
      //     return '冻结'

      //   } else if (index == 3) {
      //     return '禁用'

      //   } else if (index == 4) {
      //     return '删除'

      //   }
      // },

      //查询年级
      getGradees() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.gradees = res.data
        })
      },

      //查询 年制
      getLengths() {
        this.$http.get('/system/year-list').then(res => {
          this.lengths = res.data
        })
      },

      //查询 班级
      getClasses2( majorId,grade) {
        this.$http.get('/school/class/partake/list',{params: {majorId: majorId,gradeId: grade}}).then(res => {
          this.classes2 = res.data
        })
      },

      //查询 学年
      getYears() {
        this.$http.get('/system/years').then(res => {
          this.years = res.data
        })
      },
      changeYear(value) {
        this.dcxs=true
        this.params.teamId = ""
        if (!value) {
          this.teams = [];
        } else {
          this.$http.get('/system/getschoolyeartearms', {params: {id: value}}).then(res => {
            this.teams = res.data
          })
        }
      },
      changeTeam(value) {
        this.dcxs=true
        this.params.teamId = value
      },
      changeLength(value) {
        this.dcxs=true
        this.params.lengthId = value
      },
      handleSelectionChange(val) {
        this.userIds = val
      },

      batchDownloadReports() {
        var that = this
        let list =[]
        var s = ''

        if(this.userIds.length==0){
          this.$message({
            type: 'warning',
            message: '至少选择一名学生!'
          });
          return
        }

        if(this.userIds.length>1000){
          this.$message({
            type: 'warning',
            message: '单次批量下载数量不能超过100!'
          });
          return
        }

        for(var i = 0; i<this.userIds.length; i++){
          list.push(this.userIds[i].id)
        }

        s = '批量下载成绩单需要较长等待时间，是否继续?'
        this.$confirm(s, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
            method: 'get',
            url: 'pdf/batchGenReportZip',
            responseType: 'blob',
            params: {
              userIds: list.join(',')
            }
          //},{timeout: 1000 * 60 * 10}).then((res) => {
          }).then((res) => {
            if (!res) {
              return
            }
            var filename = "批量成绩单压缩包";
            let url = window.URL.createObjectURL(res)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', filename + '.zip')
            document.body.appendChild(link)
            link.click()
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.fetch()
      that.getCampus()
      that.getGradees()
      that.getEthnic()
      that.getLengths()
      that.getYears()
    },

 };
</script>
<style>

</style>
