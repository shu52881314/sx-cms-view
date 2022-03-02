<template>
  <section>
    <div class="main-header">
      <span class="main-title">活动违约记录列表</span>
    </div>

    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="所属学校" prop="campusId">
          <el-col :span="22">
            <el-select clearable style="width:100%" v-model="params.campusId" @change="changeSchool"
                       placeholder="请选择学校">
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
        <el-form-item label="姓名">
          <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索" @input="bian"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="params.code" placeholder="请输入学号搜索" @input="bian"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="code" label="学号" width="100"></el-table-column>
        <el-table-column prop="credit" label="诚信值" width="60"></el-table-column>
        <el-table-column prop="actName" label="活动名称" ></el-table-column>
        <el-table-column prop="remark" label="违约原因" ></el-table-column>
        <el-table-column prop="foulTime" label="记录时间" ></el-table-column>
        <el-table-column prop="operator" label="记录人" ></el-table-column>
        <el-table-column prop="campusName" label="校区" ></el-table-column>
        <el-table-column prop="collegeName" label="院系"></el-table-column>
        <el-table-column prop="majorName" label="专业" ></el-table-column>
        <el-table-column prop="gradeName" label="年级" ></el-table-column>
        <el-table-column prop="className" label="班级" ></el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <el-button type="text" class="opreat-btn" size="mini" @click.native="deleteFoulRecord(scope.row.id)"
                       v-perms="'/student/list/edit'">撤销记录
            </el-button>
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

  export default {
    // filters: {
    //   politicsFmt(val) {
    //     return politicsFmt(val);
    //   },
    // },
    data() {

      return {
        dcxs:false,
        dis: false,
        activeName: '',
        //tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
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
          campusId: '',
          collegeId: '',
          majorId: '',
          classId: '',
          grade: '',
          name: '',
          code: ''
        },
        isChange: false,
        data: [],
        ethnices: [],
        // politics: [{id: 0, name: '群众'}, {id: 1, name: '团员'}, {id: 2, name: '党员'}, {id: 3, name: '其他党派'}, {
        //   id: 4,
        //   name: '预备党员'
        // }],//政治面貌
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
        importDisable: false,
        fileUploadPercent: 0,
        showProgress: false,
        showfileInforDetail: false,
        clickAble: true,
      }
    },
    methods: {
      changeStatus(item) {
        const that = this;
        let st = item.status == 3 ? 1 : 3
        that.$confirm(item.status == 3 ? '是否启用此学员?' : item.status == 1 ? '是否禁用此学员?' : '', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post('/school/student/statusModify', {userId: item.id, status: st}).then(res => {
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '修改状态成功!'
              });
              that.fetch()
            }
          })
        })
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
      //删除违约记录
      deleteFoulRecord(id) {

        this.$confirm('是否撤销此条违约记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('foul/delrecord', {
            id: id,
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '撤销成功!'
              });
              this.fetch()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }).catch(() => {
        })
      },

      fetch() {
        const that = this;
        that.loading = true
        that.$http.get('/foul/list', {params: that.params}).then(res => {
          that.data = res.data.list
          that.total = res.data.total
        })
        that.loading = false
      },
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
                message: '该校区下无此院系，前选择其他校区'
              });
            }

          })
        }
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
                message: '该院系下无此专业，前选择其他院系'
              });
            }

            // console.log(this.majores)
          })
        }
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
      bian() {
        this.dcxs=true
      },

      search() {
        this.dcxs=false
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
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
      getClasses2( majorId,grade) {
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
      // that.getEthnic()
    },
    mounted() {

    }
  }
</script>
<style>

</style>
