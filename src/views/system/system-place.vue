<template>
  <section>

    <el-dialog title="批量导入"
               :visible.sync='dialogImportCollegeVisible'
               @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>

        <div v-show="!showfileInfor">

          <div class="uploadLocal" v-show="fileList.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
              <p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName}}</p>
            </div>
            <div class="uploadLocal-btn">
              <button  class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>
              <button class="uploadLocal-btnSubmit"  @click="submitUpload">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
                  <span class="importTipsTitle-left">
                     请下载导入模板，按格式修改后导入
                  </span>
              <span class="importTipsTitle-right">
                    <a class="el-button el-button--text el-button--mini" href='https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%9B%A2%E5%91%98%E7%BC%B4%E8%B4%B9%E6%A8%A1%E6%9D%BF%20.xlsx' size='mini' >模板下载</a>
                  </span>
            </div>
            <el-form-item label="" >
              <el-col :span="22" >
                <upload-file
                  ref="childUpload"
                  :dataObj="dataObj2"
                  uploadUrl="/school/ideology/group/fee/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  @setFileList="setFileList"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>

        <div class="progress-line" v-if="showProgress ">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;" ></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>

        <div class="importFail"  v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
            <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button  class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button  class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>
          </div>
        </div>


      </div>
    </el-dialog>



    <el-dialog title="编辑类型" :visible.sync="dialogVisible" :close-on-click-modal="false" width="550px">
      <div>

        <el-form size="mini" :model="ruleFormnj" ref="ruleFormnj" class="demo-ruleForm nj" :rules="rules">

          <el-form-item align="center" label="场地名称" prop="name">
            <el-input v-model="ruleFormnj.name" style="width: 84%"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm3('ruleFormnj')" type="primary">确定提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>
    <el-dialog :title="cdtitle" :visible.sync="dialogVisible2" :close-on-click-modal="false" width="800px">
      <div class="search-box">
        <el-form size="mini" :inline="true" class="demo-form-inline">

          <el-form-item label="请选择时间">
            <el-form-item   >
              <el-col :span="22">
                <el-date-picker
                  @change="changeStartDate"
                  style="width:100%;margin-right: 0px;"
                  v-model="dateArray.statTime2"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  default-time="00:00:00"
                  placeholder="请选择开始日期">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item    >
              <el-col :span="22">
                <el-date-picker
                  :disabled="isShow"
                  style="width:100%;"
                  start-placeholder="2017 年 03 月 21 日"
                  v-model="dateArray.endTime2"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  default-time="23:59:59"
                  placeholder="请选择结束日期" :picker-options="pickerOptions1">
                </el-date-picker>
              </el-col>
            </el-form-item>

          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" @click="search">查询</el-button>
          </el-form-item>

        </el-form>
      </div>
      <div>
        <el-table :loading="loading" :data="dataxiangqing" stripe size="mini" style="width: 100%">
          <el-table-column label="占用时间">
            <div slot-scope="scope">
            {{scope.row.startTime| formatDate}}-{{scope.row.endTime| formatDate}}
            </div>
          </el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button   type="text" size="mini" @click="goxq(scope.row)">查看活动详情</el-button>
            </div>
          </el-table-column>

        </el-table>

      </div>

    </el-dialog>
    <div class="page-head" style="margin:15px auto;padding-top:20px;width:98%;">
      <span class="page-title" >场地</span>
      <span class="page-tool" style="float:right;" >
          <el-button  type="increase" size="mini" @click="alllx(1)"><i class="fa fa-plus"></i> 添加</el-button>
        <!--<el-button type="primary" size="mini"  @click="dialogImportCollegeVisible = true">导入场地</el-button>-->
        </span>
    </div>


    <div class="main-body">
      <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="场地名称"></el-table-column>
        <el-table-column prop="numAct" label="举办活动数"></el-table-column>
        <el-table-column prop="status" label="状态">
          <div slot-scope="scope">
            {{scope.row.status==1?'开启':'禁用'}}
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="scope">
            <el-button v-perms="'/system/place/adpot'"  type="text" size="mini" @click="zhuangtai(scope.row)">{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button   type="text" size="mini" @click="alllx(2,scope.row)" >编辑</el-button>
            <el-button  type="text" size="mini" v-if="scope.row.numAct===0" @click="deletecd(scope.row.id)" >删除</el-button>
            <el-button   type="text" size="mini" @click="zhanyong(scope.row)" v-perms="'/system/place/detail'">占用情况</el-button>
          </div>
        </el-table-column>

      </el-table>
      <qu-pagination :current2="params.current" :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        rules: {

          name: [{
            required: true,
            message: "请输入场地",
            trigger: "change"
          }
          ],


        },
        dateArray: {
          statTime2:'',
          endTime2:'',
        },
        isShow:true,
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.dateArray.statTime2;
            if (beginDateVal) {
              let beginYear = beginDateVal.getFullYear();
              let beginMonth = beginDateVal.getMonth() + 1;
              let beginDate = beginDateVal.getDate();

              let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
              let beginDateVal2 = beginDateVal1.replace(/-/g,'/');
              let timestamp = new Date(beginDateVal2).getTime();

              if (beginDateVal) {
                return time.getTime() < timestamp   ;
              }
            }else {
              return true
            }
          },
          // minTime:dateArray.startDate2
        },
        cdtitle:'',
        dataxiangqing:[],
        njtype:'',
        fileListName:'',
        fileList:[],
        randomData:"",
        dataObj2:{
          type:2
        },
        ruleFormnj: { name: "" },
        showfileInfor:false,
        fileInforamtion:{

        },
        modifyMon:{
          id:'',
          mouthDuesList:''
        },
        dialogImportCollegeVisible: false,
        showMoney:{},
        dialogVisible:false,
        loading: false,
        params: {
          current: 1,
          size: 10,
        },
        zy:{
          pitchId:'',
          startTime:'',
          endTime:'',
        },
        data: [],
        total: 0,
        showProgress:false,
        fileUploadPercent:0,
        showfileInforDetail:false,
        clickAble:true,
        dialogVisible2:false
      }
    },
    methods:{

      deletecd(id){
        this.$confirm('是否删除此场地吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/pitch/delete', {id: id}).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetch()
            }
          })
        }).catch( () => {

        })

      },
      open() {
        this.$message('请选择结束日期');
      },
      search() {
        if (this.dateArray.statTime2 && this.dateArray.endTime2) {
          this.zy.startTime = this.dateArray.statTime2.getTime();
          this.zy.endTime = this.dateArray.endTime2.getTime();
        }
        if (this.dateArray.statTime2 && !this.dateArray.endTime2) {
          this.open()
          return
        }
        if (!this.dateArray.statTime2 && !this.dateArray.endTime2) {
          this.dateArray = []
          this.zy.statTime = ""
          this.zy.endTime = ""
        }
        this.statusList()
      },
      changeStartDate(value){
        if (value) {
          this.isShow = false
        }else{
          this.isShow = true
          this.dateArray.endTime2 = ""
        }
      },
      goxq(row){
          this.$router.push({path:"/proceeding/wait/activity/first/activity/detail", query: {id:row.actId,oto:row.oto}})
      },
      zhanyong(row){
        this.zy.pitchId=row.id
        this.cdtitle=row.name
        this.dialogVisible2 = true;
        this.statusList()
      },
      statusList(){
        this.$http.get("/pitch/field/statusList",
          { params: this.zy }).then(res => {
          if (res.code == "200") {
           this.dataxiangqing=res.data
          }
        });

      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            if (this.njtype == 1) {
              let name = this.ruleFormnj.name;
              this.$http.post("/pitch/field/add", { name: name }).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.dialogVisible = false;

                  this.fetch()
                }
              });
            }

            if (this.njtype == 2) {
              let obj = {
                name: this.ruleFormnj.name,
                id: this.ruleFormnj.id
              };
              this.$http.post("/pitch/edit", obj).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });

                  this.dialogVisible = false;
                  this.fetch()
                }
              });
            }
            ;

          }
        });

      },
      alllx(type, row) {
        this.ruleFormnj.name=''
        this.ruleFormnj.id=''
        this.njtype = type;
        if(row){
          this.ruleFormnj.id =row.id;
          this.ruleFormnj.name =row.name;
        }

        this.dialogVisible = true;
      },
      zhuangtai(row){

        if (row.status==1){
          var obj={
            id:row.id,
            status:0
          }
        } ;
        if (row.status==0){
          var obj={
            id:row.id,
            status:1
          }
        } ;
        this.$http.post("/pitch/field/available", obj).then((res) => {

          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.fetch()
          }
        })

      },
      setProgress(progressInfo){

        this.showfileInfor =true
        this.showProgress =true
        this.showfileInforDetail =false
        this.fileUploadPercent = 0
        var s = 1
        this.Interval = setInterval(()=>{
          s++
          this.fileUploadPercent = s
          if(s==90){
            clearInterval(this.Interval);
          }
        },100)
      },
      resetUpload(){
        this.fileList = []
        this.clickAble = true
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload.closeUpload();
        this.showfileInforDetail =false
      },
      //显示本地上传发文件
      setFileList(fileList){
        this.fileList = fileList
        this.fileListName = fileList[0].name
      },
      //下载失败模板
      downFailed(){

        axios({
          method: 'post',
          url: '/school/fail/party/groups/fee/export',
          responseType: 'blob',
          data:{
            randomData:   this.randomData,
            type:2
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
          link.setAttribute('download', '团费失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail =false
        this.clickAble = true
      },
      //导入成功返回
      openfileInfor(res){
        if (res != false ){
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fileUploadPercent=100
          clearInterval(this.Interval);
          setTimeout(()=>{
            this.showfileInfor =true
            this.showfileInforDetail =true
            this.showProgress=false;
          },2000)
        }else{
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail = false
          this.showProgress = false
          this.showfileInfor = false
          this.clickAble = false
        }

        // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {

        if (this.clickAble){
          this.setProgress()
          this.$refs.childUpload.submitUpload2()
        }else{
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      showpartymoney(item){
        this.showMoney = item
        this.dialogVisible = true
      },

      fetch() {
        this.loading = true
        this.$http.get('/pitch/field/list', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total =parseInt(res.data.total)
          this.loading = false
        })
      },

      changePage(current, size){
        this.params.current = current
        this.params.size = size
        this.fetch()
      },

    },
    created(){
      this.fetch()
    },
    mounted(){

    }
  }
</script>
<style>
  .nj .el-form-item__error {
    left: 80px !important;
  }
</style>
<style scoped lang="scss">
  .tableColor{
    border-collapse:collapse;
    line-height:30px;
    td{
      padding:10px 0;
      border:1px solid #dedede;
    }
  }
  .partyMoney{
    width:100%;
    overflow:hidden;
    &-top{
      padding-bottom:15px;
      width:100%;
      &-img{
        float:left;
        width:60px;
        margin-top:7px;
      }
      &-right{
        margin-left:60px;
        font-size:14px;
        line-height:30px;
        color:#333;
        b{
          font-size:18px;
        }
      }
    }
  }
</style>
