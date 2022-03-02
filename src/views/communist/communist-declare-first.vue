<template>
  <section>
    <el-dialog title="通过" :visible.sync="dialogVisible" :close-on-click-modal="false" width="500px">
      <el-form size="mini" label-width="60px" class="demo-ruleForm">
        <div id="" style="text-align: center;">
          <p>确定通过该奖项审核？</p>
          <p style="padding: 10px; margin-bottom: 20px;">通过后该获奖人将获得
            <el-input v-model="ruleFormReject.hours" style='width: 80px;' maxlength='6'></el-input>
            {{hoursUnit}}
          </p>
          <el-button type="primary" @click="adopt()">确定</el-button>
        </div>

      </el-form>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogVisibleImg" width="80%">
      <el-carousel ref="carousel" class="showBiImgs" :autoplay="false" height="1000px" indicator-position="outside">
        <el-carousel-item v-for="(item,index) in attachments" :key="item.id" name="index">
          <h3><img :src="item.url"></h3>
        </el-carousel-item>
      </el-carousel>

    </el-dialog>


    <el-dialog title="驳回" :visible.sync="dialogVisibleAdopt" :close-on-click-modal="false" width="30%">
      <el-form size="mini" :model="ruleFormReject" ref="ruleFormReject" class="demo-ruleForm">
        <el-form-item prop="name" style="padding-top:20px;">
          <el-col :span="22">
            <el-input type="textarea" placeholder="请输入原因" v-model="ruleFormReject.comment" maxlength='50'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormReject()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="main-header">
      <span class="main-title">待审申报</span>
      <!-- <div class="main-btn-box">
          <el-button type="primary" size="mini" @click="routerLink('club/edit', 'update')">添加</el-button>
      </div> -->
    </div>
    <div class="search-box">
      <!--<keep-alive>-->
        <el-form size="mini" :inline="true" class="demo-form-inline">
          <!-- <el-form-item label="状态">
            <el-select v-model="params.status" placeholder="请输入级别">
              <el-option v-for="option in options" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="院系" prop="college">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="params.college" @change="changeCollege"
                         placeholder="请选择院系">
                <el-option v-for="item in colleages" :key="item.id" :label="item.type_name"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="params.major" placeholder="请选择专业"
                         @change="changeMajor">
                <el-option v-for="item in majores" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="年级" prop="grade">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="params.grade" placeholder="请选择年级">
                <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="班级" prop="class">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="params.class" placeholder="请选择班级"
                         @change="changeClasses">
                <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="params.name" maxlength=30 placeholder="请输入姓名搜索"></el-input>
          </el-form-item>

          <el-form-item label="学号">
            <el-input v-model="params.code" maxlength=30 placeholder="请输入学号搜索"></el-input>
          </el-form-item>

          <el-form-item label="项目名称">
            <el-input v-model="params.proName" maxlength=30 placeholder="请输入项目名称"></el-input>
          </el-form-item>

          <el-form-item label="申请时间">
            <el-date-picker format="yyyy-MM-dd HH:mm"
                            v-model="time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      <!--</keep-alive>-->

    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="code" label="学号"></el-table-column>
        <el-table-column prop="projectName" label="项目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optionName" label="奖项" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="applyCount" label="申请次数" >
          <div slot-scope="scope">
             {{scope.row.applyCount}}次
          </div>
        </el-table-column>-->
        <el-table-column prop="hours" :label="hoursUnit"></el-table-column>
        <el-table-column prop="status" label="状态">
          <div slot-scope="scope">
            待审核
            <!-- {{scope.row.status == 1 ? '待审核' : (scope.row.status == 2 ? '通过' : '驳回' )}} -->
          </div>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间">
          <div slot-scope="scope">
            {{scope.row.applyTime | formatDate}}
          </div>
        </el-table-column>
        <!-- <el-table-column prop="option" label="材料"></el-table-column> -->
        <el-table-column label="操作">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn"
                       @click.native=" routerLink('/proceeding/wait/declare/show?userId=' + scope.row.userId,scope.row.auditType,scope.row.applId)">
              详情
            </el-button>
            <!--<el-button type="text" class="opreat-btn" @click="showActivy(scope.row.id)" v-perms="'/communist/project/apply/see'">查看</el-button>-->
            <el-button type="text" class="opreat-btn"
                       @click="dialog(scope.row.taskId,1,scope.row.hours,scope.row.applId)">通过
            </el-button>
            <el-button type="text" class="opreat-btn" @click="rejectProject(scope.row.applId,scope.row.taskId,scope.row.hours)">驳回
            </el-button>
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :current2="params.current" :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        id: '',
        hours: '',
        exampleId: '',
        hoursUnit: localStorage.getItem("hoursUnit"),
        dialogVisible: false,
        dialogVisibleImg: false,
        dialogVisibleAdopt: false,
        loading: false,
        showActivyData: {},
        time: [],
        params: {
          current: 1,
          size: 10,
          college: '',
          name: '',
          major: '',
          code: '',
          grade: '',
          class: '',
          proName: '',
          beginTime: '',
          endTime: '',
        },
        ruleFormReject: {
          id: '',
          appId: '',
          taskId: '',
          comment: '',
          result: 0,
          hours: '',
        },
        data: [],
        attachments: [],
        total: 0,
        options: [
          {id: '', name: '不限'},
          {id: '1', name: '待审核'},
          {id: '2', name: '审核通过'},
          {id: '3', name: '审核驳回'},
        ], colleages: [], majores: [], gradees: [], classes2: []
      }
    },
    methods: {
      setsx(){
        localStorage.setItem('daishenshenbao', JSON.stringify(this.params))
      },
      changeClasses(value) {
        this.params.classId = value
      },
      changeMajor(value) {
        this.$http.get('/school/class/partake/list', {params: {majorId: value}}).then(res => {
          this.classes2 = res.data
          this.params.classId = ""
        })
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
      getClasses2() {
        this.$http.get('/school/class/partake/list').then(res => {
          this.classes2 = res.data
        })
      },
      changeCollege(value) {
        this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
          this.majores = res.data
          this.params.major = ""
          this.params.class = ""
        })
        this.getClasses2();
      },
      showActivy(id) {
        this.dialogVisible = true
        this.$http.get("/project/detail", {params: {id: id}}).then((res) => {
          this.showActivyData = res.data;
          this.attachments = res.data.attachment
        })

      },
      //显示大图
      showBIgImg(index) {
        this.dialogVisibleImg = true;
        setTimeout(() => {
          this.$refs.carousel.setActiveItem(index);
        })
      },
      //通过
      dialog(id, status, hours, applyId) {
        this.id = id
        this.dialogVisible = true
        this.ruleFormReject.hours = hours
        this.ruleFormReject.result = status
        this.ruleFormReject.appId = applyId
        this.ruleFormReject.taskId = id
      },
      adopt() {
        const that = this;
        that.$http.post('/project/auditPass', this.ruleFormReject).then((res) => {
          if (res.code == 200) {
            this.dialogVisible = false;
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.ruleFormReject.hours = '';
            this.search();
          }
        })
      },
      //驳回
      rejectProject(applId, taskId,hours) {
        this.dialogVisibleAdopt = true;
        this.ruleFormReject.result = 0;
        this.ruleFormReject.appId = applId
        this.ruleFormReject.taskId = taskId
        this.ruleFormReject.hours = hours
      },
      //驳回提交
      submitFormReject() {
        if (this.ruleFormReject.comment) {
          this.$http.post('/project/auditPass', this.ruleFormReject).then((res) => {
            if (res.code == '200') {
              this.dialogVisibleAdopt = false;
              this.$message({
                type: 'success',
                message: '驳回成功!'
              });
              this.ruleFormReject.comment = '';
              this.search();
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请填写原因'
          });
        }
      },
      fetch() {
        this.loading = true
        this.$http.get('/project/wait/apply/list', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total = res.data.total
          this.params.beginTime = '';
          this.params.endTime = '';
          this.loading = false
        })
      },
      search() {
        this.params.current = 1

        if (this.time!=null){
          if (this.time.length) {
            this.params.beginTime = this.time[0].getTime();
            this.params.endTime = this.time[1].getTime();
          } else {
            this.params.beginTime = '';
            this.params.endTime = '';
          }
        } ;
       this.setsx()
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      }
    },
    created() {
      if(localStorage.getItem("daishenshenbao")){
        this.params=JSON.parse(localStorage.getItem("daishenshenbao"))
        this.time.push(new Date(this.params.beginTime))
        this.time.push(new Date(this.params.endTime))
      }
      this.getColleges()
      this.getMajores()
      this.getGradees()
      this.getClasses2()
    },
    mounted() {

      if (this.$route.query.page) {
        this.params.current = parseInt(this.$route.query.page)
      }
      this.fetch()

    }
  }
</script>
<style scoped>
  .showActivy {
    line-height: 30px;
    position: relative;
  }

  .showActivy td {
    padding-bottom: 20px;
  }

  .statusClass {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -70px;
  }

  .projectImg li {
    float: left;
    display: inline;
    width: 100px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .projectImg li img {
    width: 100px;
    height: 100px;
  }

  .showBiImgs img {
    width: 100%;
    height: 100%;
  }

  .el-carousel__item {
    overflow-y: auto;
  }

</style>
