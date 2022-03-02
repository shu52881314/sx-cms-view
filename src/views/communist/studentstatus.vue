<template>
  <section>

    <div class="main-header">
      <span class="main-title">学籍变动列表</span>
    </div>
    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="所属学校" prop="campus">
          <el-col :span="22">
            <el-select clearable style="width:100%" v-model="params.campus" @change="changeSchool"
                       placeholder="请选择学校">
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="院系">
          <el-select clearable v-model="params.college" @change="changeCollege" placeholder="请选择院系">
            <el-option v-for="item in colleages" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select clearable v-model="params.major" placeholder="请选择专业" @change="changeMajor">
            <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select clearable v-model="params.class" placeholder="请选择班级" @change="changeClasses">
            <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select clearable v-model="params.grade" placeholder="请选择年级">
            <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="params.code" placeholder="请输入学号搜索"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="code" label="学号" width="100"></el-table-column>
        <el-table-column prop="code" label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.gender == 1 ? "男" : (scope.row.gender == 2 ? "女" : "")}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ethnicName" label="民族"></el-table-column>
        <el-table-column prop="" label="政治面貌" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.politics | politicsFmt}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="campusName" label="所属校区"></el-table-column>
        <el-table-column prop="collegeName" label="所属院系"></el-table-column>
        <el-table-column prop="majorName" label="所属专业"></el-table-column>
        <el-table-column label="所属年级" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.gradeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="所属班级"></el-table-column>
        <!-- <el-table-column prop="" label="政治面貌" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.politics==0?'群众':scope.row.politics==1?'团员':scope.row.politics==2?'党员':scope.row.politics==2?'其他党派':'未填写'}}</span>
          </template>
        </el-table-column> -->


        <el-table-column label="操作"  align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <span >
                 <el-button  type="text" size="mini"
                            @click="goReports(scope.row.applyId,scope.row.taskId)">查看详情</el-button>
              </span>
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import bus from '@/main'

  import {politicsFmt} from "@/utils/format";
  // import {
  //     isvalidCode
  // } from '@/utils/validate'
  // // import {vs} from '@/rules'
  // var validCode = (rule, value, callback) => {
  //     if (!value) {
  //         callback(new Error('请输入学号'))
  //     } else if (!isvalidCode(value)) {
  //         callback(new Error('请输入正确的学号'))
  //     } else {
  //         callback()
  //     }
  // }

  export default {
    filters: {
      politicsFmt(val) {
        return politicsFmt(val);
      },
    },
    data() {
      // var that = this
      // var mobile = (rule, value, callback) => {
      // 	if(that.ruleForm.mobile!=''){
      //         let reg = /^1\d{10}$/;
      //     if (!reg.test(that.ruleForm.mobile)) {
      //         callback(new Error('请输入正确的手机号'));
      //     }
      //     }else {
      //         callback();
      //     }
      // };
      return {
        dis: false,
        activeName: '',
        tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
        interval: '',
        isUploadaLoading: false,
        fileListName: '',
        fileList: [],
        randomData: "",
        hoursUnit: localStorage.getItem("hoursUnit"),
        title: '添加学生',
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        dialogImportCollegeVisiblecj: false,
        loading: false,
        params: {
          current: 1,
          size: 10,
          campus: '',
          college: '',
          major: '',
          class: '',
          grade: '',
          name: '',
          code: ''
        },
        isChange: false,
        data: [],
        ethnices: [],
        politics: [{id: 0, name: '群众'}, {id: 1, name: '团员'}, {id: 2, name: '党员'}, {id: 3, name: '其他党派'}, {
          id: 4,
          name: '预备党员'
        }],//政治面貌
        schools: [],
        classes2: [],
        colleges: [],
        colleages: [],
        majors: [],
        majores: [],
        classes: [],
        gradees: [],
        total: 0,
        countryCodes: [{
          value: '86',
          label: "中国"
        }],
        options4: [],
        dialogVisible: false,
        ruleForm: {
          grade: '',
          major: '',
          college: '',
          politics: '',
          campus: '',
          id: '',
          class: '',
          class2: '',
          code: '',
          name: '',
          ethnicId: 1,
          gender: '1',
          countryCode: '86',
          mobile: ''
        },
        rules: {
          campus: [{
            required: true,
            message: '请选择所属学校',
            trigger: 'change'
          }
          ],
          college: [{
            required: true,
            message: '请选择所属院系',
            trigger: 'change'
          }
          ],
          major: [{
            required: true,
            message: '请选择所属专业',
            trigger: 'change'
          }
          ],
          class: [{
            required: true,
            message: '请选择班级',
            trigger: 'change'
          }
          ],
          code: [{
            required: true,
            message: '请填写学号',
            trigger: 'blur',
            // validator: validCode
          }
          ],
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],
          grade: [{
            required: true,
            message: '请选择年级',
            trigger: 'change'
          }]

        },
        importDisable: false,
        fileUploadPercent: 0,
        showProgress: false,
        showfileInforDetail: false,
        clickAble: true,
      }
    },
    methods: {
      changepolitics(value){
        this.ruleForm.politics =''
        this.ruleForm.politics =value

      },
      goTab() {
        const that = this;
        this.$router.push({path: that.tabsList[parseInt(that.activeName)], query: {type: that.activeName}});
      },
      gocj() {
        this.$router.push({path:'/student/history'});
      },
      setProgress(progressInfo) {
        this.showfileInfor = true
        this.showProgress = true
        this.showfileInforDetail = false
        this.fileUploadPercent = 0
        var s = 1
        this.Interval = setInterval(() => {
          s++
          this.fileUploadPercent = s
          if (s == 90) {
            clearInterval(this.Interval);
          }
        }, 100)
      },
      changeClass() {
        this.isChange = true
      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.$http.get("/school/all/class/cascader", {
            params: {
              keyWord: query
            }
          }).then(res => {
            this.loading = false;
            this.options4 = res.data
          })


        } else {
          this.options4 = [];
        }
      },

      getEthnic() {
        this.$http.get("school/ethnic/list").then(res => {
          this.ethnices = res.data
        })
      },
      resetUpload() {
        this.fileList = []
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail = false
        this.$refs.childUpload.closeUpload();
        this.fileUploadPercent = 0
        this.clickAble = true
      },
      //显示本地上传发文件
      setFileList(fileList) {

        this.fileList = fileList
        this.fileListName = fileList[0].name
      },
      //下载失败模板
      downFailed() {

        axios({
          method: 'post',
          url: 'school/fail/student/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData
          }

        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '学生失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      downFailedcj() {

        axios({
          method: 'post',
          url: 'school/fail/historycredit/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData
          }

        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '成绩失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },

      goReports(applyId,taskId) {
        this.$router.push({path:"/proceeding/wait/studentstatusinfo", query: {applyId:applyId,taskId:taskId}})

      },


      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      fetch() {
        const that = this;
        that.loading = true
        that.$http.get('/unit/change/list', {params: that.params}).then(res => {
          that.data = res.data.list
          that.total = res.data.total
          that.loading = false
        })
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.params.college = ""
        this.params.major = ""
        this.params.class = ""
        if (!value) {
          this.colleages = [];
          this.majores = [];
          this.classes2 = [];
          this.gradees = [];
        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollege(value) {
        this.params.major = ""
        this.params.class = ""
        if (!value) {
          this.majores = [];
          this.classes2 = [];
          this.gradees = [];
        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      changeMajor(value) {
        this.params.class = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClasses(value) {
        this.params.class = value
      },
      changeSchoolbj(value) {
        this.ruleForm.college = ""
        this.ruleForm.major = ""

        this.ruleForm.class = ""
        this.colleages = [];
        this.majores = [];
        this.classes2 = [];
        if (!value) {


        } else {
          this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
            if (res.data.length>0){
              this.colleages = res.data
            } else {
              this.ruleForm.college =''
              this.$message({
                type: 'error',
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
      },

      changeCollegebj(value) {
        this.ruleForm.major = ""

        this.ruleForm.class = ""
        this.majores = [];
        this.classes2 = [];
        if (!value) {


        } else {
          this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
            if (res.data.length>0){
              this.majores = res.data
            } else {
              this.ruleForm.major=''
              this.$message({
                type: 'error',
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
      },
      changeMajorbj(value) {

        this.ruleForm.class = ""
        this.classes2 = [];
        if (!value) {

        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: value,gradeId: this.ruleForm.grade}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changegradebj(value) {

        this.ruleForm.class = ""
        if (!value) {
          this.classes2 = [];
        } else {
          this.$http.get('/school/class/partake/list', {params: {majorId: this.ruleForm.major,gradeId: value}}).then(res => {
            this.classes2 = res.data

          })
        }
      },
      changeClassesbj(value) {
        this.ruleForm.class = value
      },
      search() {
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      studentStatus(index) {
        if (index == 0) {
          return '未激活'
        } else if (index == 1) {
          return '正常'

        } else if (index == 2) {
          return '冻结'

        } else if (index == 3) {
          return '禁用'

        } else if (index == 4) {
          return '删除'

        }
      },
      getColleges() {
        this.$http.get('/school/college/list').then(res => {
          this.colleages = res.data
        })
      },
      getMajores() {
        this.$http.get('/school/major/list').then(res => {
          this.majores = res.data
        })
      },
      getGradees() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.gradees = res.data
        })
      },
      getClasses2(campusId,collegeId, majorId,grade) {
        this.$http.get('/school/class/partake/list',{params: {majorId: majorId,gradeId: grade}}).then(res => {
          this.classes2 = res.data
        })
      },
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.fetch()
      that.getCampus()
      that.getGradees()
      that.getEthnic()
    },
    mounted() {

    }
  }
</script>
<style>

</style>
