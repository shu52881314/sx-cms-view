<template>
  <el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="学生组织" name="0">
        <el-form size="mini" ref="form" :inline="true" :model="studentSearchForm">
          <el-form-item label="级别：">
            <el-select v-model="studentSearchForm.level" placeholder="请选择级别">
              <el-option label="全部级别" value=""></el-option>
              <el-option label="校级" value="1"></el-option>
              <el-option label="院系级" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织类型：">
            <el-select v-model="studentSearchForm.nature" placeholder="请选择组织类型">
              <el-option label="全部类型" value=""></el-option>
              <el-option label="学生会" value="1"></el-option>
              <el-option label="社团协会" value="2"></el-option>
              <el-option label="其他组织" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织名称：">
            <el-input v-model="studentSearchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table border :loading="loading" :data="list" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="组织名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="组织类型" width="240" show-overflow-tooltip>
            <el-row slot-scope="scope">
              {{scope.row.nature | NatureFmt}}
            </el-row>
          </el-table-column>
          <el-table-column label="级别" show-overflow-tooltip>
            <el-row slot-scope="scope">
              {{scope.row.level | LevelFmt}}
            </el-row>
          </el-table-column>
          <el-table-column prop="fuzeName" label="负责人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="zhidaoName" label="指导老师" show-overflow-tooltip></el-table-column>
          <el-table-column prop="guakaoName" label="挂靠机构" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parentName" label="上级机构/组织" show-overflow-tooltip></el-table-column>
          <el-table-column prop="peopleNum" label="人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="energy" label="活力值" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button type="text" class="opreat-btn" @click.native="openDetail(scope.row.orgId)"
                         v-perms="'/communist/activity/detail'">详情
              </el-button>
            </el-row>
          </el-table-column>
        </el-table>
        <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
      </el-tab-pane>


      <el-tab-pane label="班团组织" name="1">
        <el-form size="mini" ref="classGroupSearchForm" :inline="true" :model="classGroupSearchForm">
          <el-form-item label="校区：">
            <el-select @change="changeSchool" clearable style="width:100%" v-model="classGroupSearchForm.campus"
                       placeholder="请选择校区">
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="院系：">
            <el-select ref="department" @change="changeDepartment" clearable v-model="classGroupSearchForm.college"
                       placeholder="请选择院系">
              <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：">
            <el-select clearable v-model="classGroupSearchForm.major" placeholder="请选择专业">
              <el-option v-for="item in majors" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级：">
            <el-select clearable v-model="classGroupSearchForm.grade" placeholder="请选择年级">
              <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班团名称：">
            <el-input v-model="classGroupSearchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <!--班团组织-->
        <el-table border :loading="loading" :data="list" stripe size="mini" style="width: 100%">
          <!--   <el-table-column type="selection" prop="scope.row.checked">

             </el-table-column>-->
          <el-table-column prop="name" label="班团名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属校区" prop="campusName" width="240" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="所属院系" prop="collegeName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="majorName" label="所属专业" show-overflow-tooltip></el-table-column>
          <el-table-column prop="gradeName" label="所属年级" show-overflow-tooltip></el-table-column>
          <el-table-column prop="parentName" label="上级机构" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fuzeName" label="班团负责人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fudaoName" label="辅导员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="peopleNum" label="人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="energy" label="活力值" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button type="text" class="opreat-btn" @click.native="openDetail(scope.row.orgId)"
                         v-perms="'/communist/activity/detail'">详情
              </el-button>
            </el-row>
          </el-table-column>
        </el-table>
        <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>

      </el-tab-pane>
      <el-tab-pane label="班级" name="2">

        <el-form size="mini" ref="classGroupSearchForm" :inline="true" :model="classGroupSearchForm">
          <el-form-item label="校区：">
            <el-select @change="changeSchool" clearable style="width:100%" v-model="classGroupSearchForm.campus"
                       placeholder="请选择校区">
              <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="院系：">
            <el-select ref="department" @change="changeDepartment" clearable v-model="classGroupSearchForm.college"
                       placeholder="请选择院系">
              <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：">
            <el-select clearable v-model="classGroupSearchForm.major" placeholder="请选择专业">
              <el-option v-for="item in majors" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级：">
            <el-select clearable v-model="classGroupSearchForm.grade" placeholder="请选择年级">
              <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称：">
            <el-input v-model="classGroupSearchForm.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <!--班级列表-->
        <el-table border :loading="loading" :data="list" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="班级名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="所在年级" prop="gradeName" width="240" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="所属校区" prop="campusName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="collegeName" label="所属院系" show-overflow-tooltip></el-table-column>
          <el-table-column prop="majorName" label="所属专业" show-overflow-tooltip></el-table-column>
          <el-table-column prop="peopleNum" label="学生数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fuzeName" label="班级负责人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fudaoName" label="辅导员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="energy" label="活力值" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <el-row slot-scope="scope">
              <el-button type="text" class="opreat-btn" @click.native="openDetail(scope.row.orgId)"
                         v-perms="'/communist/activity/detail'">详情
              </el-button>
            </el-row>
          </el-table-column>
        </el-table>
        <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>

      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
  export default {
    name: "ExamineList",
    data() {
      return {
        activeName: '0',
        list: [],
        schools: [],//校区
        departments: [],//院系
        majors: [],//专业
        grades: [],//班级
        loading: false,
        total: 0,
        postUrl: '',//请求路径
        studentSearchForm: {
          level: '',
          name: '',
          nature: '',
        },
        classGroupSearchForm: {
          level: '',
          name: '',
          campus: '',
          college: '',
          major: '',
          grade: ''
        }, params: {
          current: 1,
          size: 10,
        }
      }
    }, methods: {
      changeDepartment(value) {
        if (value) {
          this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
            this.majors = res.data
          })
        } else {
          this.majors = null
        }

      },
      changeSchool(value) {
        if (value) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
            this.departments = res.data
          })
        } else {
          this.departments = [];
        }
      },
      getGrades() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.grades = res.data
        })
      },
      getCampus() {//获取校区
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      openDetail(id) {//打开详情
        const that = this;
        that.$router.push({path: '/proceeding/wait/org/detail', query: {id: id, type: that.activeName}});
      },
      handleClick(e) {
        const that = this;
        that.loadList();
        that.$router.push({path: '/proceeding/wait/org/list', query: {type: e.name}});
      }, loadList() {
        const that = this;
        if (that.activeName == 0) {//学生组织
          that.postUrl = '/organization/studentList'
        }

        if (that.activeName == 1) {//班团组织
          that.postUrl = '/organization/classGroupList'
        }
        if (that.activeName == 2) {//班级
          that.postUrl = '/organization/classList'
        }
        that.loading = true
        that.$http.get(that.postUrl, {params: that.params}).then(res => {
          if (res.code == 200) {
            that.list = res.data.list
            that.total = res.data.total
            that.loading = false
          }
        })
      }, changePage(current, size) {
        const that = this;
        that.params.current = current
        that.params.size = size
        that.loadList()
      }, search() {
        const that = this;
        if (that.activeName == 0) {//学生组织条件
          for (let key in that.studentSearchForm) {
            that.params[key] = that.studentSearchForm[key]
          }
        }

        if (that.activeName == 1 || that.activeName == 2) {//班团/班级组织条件
          for (let key in that.classGroupSearchForm) {
            that.params[key] = that.classGroupSearchForm[key]
          }
        }
        that.params.current = 1
        that.loadList()
      },
    }, created() {
      const that = this;
      that.activeName = that.$route.query.type;

    }, mounted() {
      const that = this;
      that.loadList();
      that.getCampus();
      that.getGrades();
    }, filters: {
      NatureFmt(val) {//类型转换器
        switch (val) {
          case 1:
            return '学生会'
          case 2:
            return '社团协会'
          case 3:
            return '其他'
          default:
            return '其他'
        }
      }, LevelFmt(val) {
        switch (val) {
          case 1:
            return '校级'
          case 2:
            return '院系级'
          default:
            return '未知级'
        }
      }
    }
  }
</script>

<style scoped>

</style>
