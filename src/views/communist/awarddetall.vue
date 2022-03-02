<template>
    <div>
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
                    <a class="el-button el-button--text el-button--mini" download=""
                        href='/static/tpls/加减分项目学生导入模板.xlsx' size='mini'>模板下载</a>
                </span>
              </div>
              <el-form-item label="" prop="name">
                <el-col :span="22" >
                  <upload-file
                    ref="childUpload"
                    :dataObj="dataObj2"
                    uploadUrl="/school/award/apply/import"
                    uploadType=".xls,.xlsx"
                    uploadSzie="100"
                    uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                    @fileInfor="openfileInfor"
                    v-on:childByValue='ishaveFile'
                    @setFileList="setFileList"
                    @setProgress="setProgress"
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

      <el-dialog title="添加学生" v-if="dialogxs" :visible.sync="dialogxs" :close-on-click-modal="false" width="40%">
        <el-form size="mini" :model="ruleFormRejecthdjc"  ref="ruleFormReject" class="demo-ruleForm xstj">
          <el-form-item label="姓名/学号" required>
            <el-col :span="18">
            <el-select
              clearable
              style="width:100%"
              v-model="ruleFormRejecthdjc.userId"
              filterable
              value-key="value"
              :multiple-limit=1
              remote
              placeholder="请输入姓名/学号"
              :remote-method="remoteMethod"
              @clear="clear"
              :loading="loading">
              <el-option
                v-for="item in options4"
                :key="item.id"
                :label="item.name "
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>
            </el-col>
          </el-form-item>
          <el-form-item  :label="detalltype==1?'增加 ' + hoursUnit:detalltype==0?'减少 ' + hoursUnit:''" required>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入" v-model="ruleFormRejecthdjc.score"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="学年" style="margin-left:32px" required>
            <el-col :span="19">
            <el-select clearable v-model="xnianid"  placeholder="请选学年" style="width: 100%" @change="hqxq">
              <el-option
                v-for="item in xuenians"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="学期" style="margin-left:32px" required>
            <el-col :span="19">
              <el-select clearable v-model="ruleFormRejecthdjc.semesterId"  placeholder="请选学期" style="width: 100%" >
                <el-option
                  v-for="item in xueqis"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-left:42px" label="备注">
            <el-col :span="20">
              <el-input type="textarea" placeholder="请输入备注" v-model="ruleFormRejecthdjc.remark"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="上传附件：">
            <uploadMore @deleteList="deleteFile" :imageList='ruleFormRejecthdjc.url'
                        @uploadSuccessed="uploadSuccessed">
            </uploadMore>
          </el-form-item>
          <el-form-item  style="text-align: center">
            <el-button type="primary" size="medium" @click="submitFormPass()" >确定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

      <div class="main-body" >
        <p class="xinxitou">基本信息<a class="cms-back" href="javascript:void(0)" @click="goBack()"></a></p>
        <div style="padding: 8px;padding-left: 18px">
          <span>项目名称：</span>
          <span style="margin-left: 10px">{{showDetail.awardName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>项目分类：</span>
          <span style="margin-left: 10px">{{showDetail.classifyName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>添加人：</span>
          <span style="margin-left: 10px">{{showDetail.creatorName}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>活动时间:</span>
          <span style="margin-left: 10px">{{showDetail.sctime}}</span>
        </div>
        <div style="padding: 8px;padding-left: 18px">
          <span>备注：</span>
          <span style="margin-left: 10px; display: -webkit-inline-box; width: 80%;">{{showDetail.remark}}</span>
        </div>
        <p class="xinxitou" style="overflow: hidden;margin-top: 20px">
          {{detalltype==1?'加分学生信息' :detalltype==0?'减分学生信息':''}}
          <span class="main-btn-box" style="margin-right: 10px;float: right">
            <el-button @click="tjxs" type="primary" size="mini" >添加学生</el-button>
            <!--@click="dialogImportCollegeVisible = true"-->
            <!--<el-button   type="primary" size="mini"  >导入学生</el-button>-->
            <el-button type="primary" size="mini" @click="dialogImportCollegeVisible=true">导入学生</el-button>
          </span>
        </p>

        <div class="search-box">
          <el-form size="mini" :inline="true" class="demo-form-inline">
            <el-form-item label="姓名/学号">
              <el-input  v-model="params.keyWord" placeholder="请输入姓名/学号搜索"  maxlength=30  @input="changeDate"></el-input>
            </el-form-item>

            <el-form-item label="添加时间：" prop="activityDate">
              <el-date-picker @change="changeDate" class="activityWidth" :editable="false" type="datetimerange" v-model="dateArray"
                              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="main-body">
          <el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="姓名"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="code" label="学号"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="score" :label="detalltype==1?'增加' + hoursUnit:detalltype==0?'减少' + hoursUnit:''"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="sctime" label="添加时间">
              <div slot-scope="scope">
                {{scope.row.sctime }}
              </div>
            </el-table-column>
            <el-table-column prop="remark" label="备注"  show-overflow-tooltip></el-table-column>

            <el-table-column  label="附件" width="200px">
              <div slot-scope="scope">
                <p v-for="(item,index) in scope.row.urls " style="width: 100%">
                  <a :href="item.url" v-if="item.url" style="color: #4D7DFF" target="_blank">
                    {{qie(item.url)}}
                  </a>
                </p>
              </div>
            </el-table-column>

            <el-table-column  label="操作">
              <div slot-scope="scope">
                <el-button type="text" class="opreat-btn" @click.native='deletes(scope.row.applyId)'>删除</el-button>
              </div>
            </el-table-column>
          </el-table>

          <div style="padding-top: 20px;">
            <div style="float: left;">
              <el-button :disabled="plsc" type="primary " @click='deletes()' >批量删除</el-button>
            </div>
            <qu-pagination :total="total" @change="changePage"></qu-pagination>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import listMixins from '@/mixins/form'
  import {
    isFloat
  } from '@/utils/validate'

  export default {
    mixins:[listMixins],
    name: "awarddetall",
    data() {

      return {
        xnianid:'',
        xuenians:[],
        xueqis:[],
        ruleFormRejecthdjc:{
          userId:'',
          score:'',
          remark:'',
          url:[],
          awardId:this.$route.query.id,
          type:this.$route.query.type,
          semesterId:''
        },
        dialogxs:false,
        plsc:false,
        detalltype:this.$route.query.type,
        randomData:'',
        fileListName:'',
        fileList:[],
        ishaveFile3:true,
        ishaveFile2:'',
        applyIds:[],
        hoursUnit:localStorage.getItem("hoursUnit"),
        dataObj2:{
          awardId:this.$route.query.id
          //type:detalltype
        },
        IsClick:false,
        dialogVisible: false,
        loading: false,
        dateArray:[],
        options4:[],
        params: {
          current: 1,
          size: 10,
          beginTime: '',
          endTime: '',
          awardId:this.$route.query.id,
          keyWord: '',
        },
        ruleForm: {
          name: '',
          parents:[],
          des: '',
          type:1,
          awardId:this.$route.query.id,
        },

        data: [],
        total: 0,
        showDetail:{},
        options: [{id: '', name: '不限'}],
        showfileInfor:false,
        fileInforamtion:{

        },
        dialogImportCollegeVisible: false,
        showProgress:false,
        fileUploadPercent:0,
        showfileInforDetail:false,
        clickAble:true,
      }
    },
    mounted() {

      this.getDetail()
      this.fetch()

    },
    methods:{
      qie(urls){

        var url = urls;
        var index = url.lastIndexOf("\/");
        var str = url.substring(index + 1,url.length);
        return str
      },
      clear() {
        this.options4 = [];

      },
      hqxq(value){
        this.ruleFormRejecthdjc.semesterId=''
        this.xueqis=[]
        if (value){
          this.getxq(value)
        }

      },
      tjxs(){
        this.getschoolyear()
        this.ruleFormRejecthdjc.userId=''
        this.ruleFormRejecthdjc.score=''
        this.ruleFormRejecthdjc.remark=''
        this.xnianid=''
        this.ruleFormRejecthdjc.semesterId=''
        this.ruleFormRejecthdjc.url=[]

        this.$store.state.sys.fileProgresss=[]

        this.dialogxs=true

        console.log(this.ruleFormRejecthdjc.url)
      },
      submitFormPass() {

        if(this.ruleFormRejecthdjc.userId==''){
          this.$message({
            type: 'error',
            message: '请输入姓名/学号'
          });
          return
        }
        if(this.ruleFormRejecthdjc.score==''){
          this.$message({
            type: 'error',
            message: '请输入'+this.hoursUnit
          });
          return
        }
        if(this.ruleFormRejecthdjc.score<=0){
          this.$message({
            type: 'error',
            message: '输入数值必须大于0'
          });
          return
        }
        if(this.ruleFormRejecthdjc.semesterId==''){
          this.$message({
            type: 'error',
            message: '请选择学期'
          });
          return
        }
        this.$http.post("/award/adduser", this.ruleFormRejecthdjc).then( (res) => {
          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.dialogxs=false
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
        this.fileUploadPercent = 0
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload.closeUpload();
        this.showfileInforDetail =false
        this.clickAble = true
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
          url: 'school/fail/hours/export',
          responseType: 'blob',
          data:{
            randomData:this.randomData
            //type:detalltype
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
          link.setAttribute('download', '加分项成员导入失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      ishaveFile(val){
        if(this.ishaveFile2 == ''){
          this.ishaveFile2 = val
        }
        if(this.ishaveFile2 != val){
          this.ishaveFile2 = val
          this.ishaveFile3 = true
        }
      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []
        this.showfileInfor = false
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false
        this.ishaveFile2 = ''
        this.ishaveFile3 = true
        this.$store.commit('setClick',false)
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail = false
        this.clickAble = true
      },
      //导入成功返回
      openfileInfor(res){

        if(res != false){

          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          if(res.failed == 0){
            this.dialogImportCollegeVisible = false;
            this.loading=true
            this.data = []
            this.fetch()
            this.$message({
              type: 'success',
              message: '导入成功'
            });
          }
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
          // this.fileList = []
        }

        // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {

        if (this.clickAble){
          this.setProgress()
          this.$store.commit('setClick',true)
          this.$refs.childUpload.submitUpload2()
          this.ishaveFile3 = false
        }else{
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      submitForm(formName){

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.ruleForm.classifyId = this.ruleForm.parents.join(',');

            this.$store.commit('setClick',true)

            this.$http.post("/reward-punish/project/member/add", this.ruleForm).then((res) => {

              if (res.code === '200') {
                this.fetch();
                this.dialogVisible = false
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
              }
            })

          }
        })


      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/NoPage",{params:{
              key:query
            }}).then(res => {
            this.loading = false;
            this.options4 =  res.data
          })


        } else {
          this.options4 = [];
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandler() {
        this.resetForm('ruleForm');
      },
      changeDate(){
         this.plsc=true

      },
      getDetail(){
        this.$http.get('/award/detail', {params: {awardId:this.$route.query.id}}).then(res => {
          this.showDetail = res.data
        })
      },
      getschoolyear(){
        this.$http.get('/system/getschoolyear').then(res => {
          this.xuenians = res.data
        })
      },
      getxq(id){
        this.$http.get('/system/getschoolyeartearms',{params: {id:id}}).then(res => {
          this.xueqis = res.data
        })
      },
      fetch() {
        this.loading = true
        this.$http.get('/award/detail/apply/list', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total = res.data.total
          this.loading = false
        })
      },
      search() {
        this.plsc=false
      if (this.dateArray==null){
        this.dateArray=[]
        this.params.beginTime  =''
        this.params.endTime =''
      } ;
        if(this.dateArray.length>0){
          this.params.beginTime  =this.dateArray[0].getTime();
          this.params.endTime =this.dateArray[1].getTime();
        }


        this.params.current = 1
        this.fetch()
      },
      changePage(current, size){
        this.params.current = current
        this.params.size = size
        this.data = []
        this.fetch()
      },
      handleSelectionChange(val) {

        this.applyIds = val
      },
      deletes(id){
        var that = this
        let list =[]
        var s = ''
        if(id){
          list.push(id)
          s = '是否确定删除?'
          this.$confirm(s, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$http.post("/award/deluser",{
              applyId:list.join(','),
            }).then( (res) => {
              if (res.code == '200') {
                that.$message({
                  type: 'success',
                  message: '删除成功'
                });
                that.loading=true
                that.data = []
                that.applyIds = []
                that.fetch()
              }else{
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            }).catch(() => {
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });

        }else{
          if(this.applyIds.length==0){
            this.$message({
              type: 'warning',
              message: '至少选择一名!'
            });
            return
          }
          for(var i = 0; i<this.applyIds.length; i++){
            list.push(this.applyIds[i].applyId)
          }
          s = '是否确定删除?'
          this.$confirm(s, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$http.post("/award/batchdeluser",{
              applyIds:list.join(','),
            }).then( (res) => {
              if (res.code == '200') {
                that.$message({
                  type: 'success',
                  message: '删除成功'
                });
                that.loading=true
                that.data = []
                that.applyIds = []
                that.fetch()
              }else{
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            }).catch(() => {
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });

        }


      },
      uploadSuccessed(url) {

        for (let i=0;i<url.length;i++){
          url[i].progress=100;
        }
        var that = this;
        this.$set(this.ruleFormRejecthdjc, "url", url);
      },
      deleteFile(value){
        this.ruleFormRejecthdjc.url =   this.ruleFormRejecthdjc.url.filter( (item,index) => {
          return item.name != value.name
        })
      },
      goBack() {
        this.$router.push({
          path:  localStorage.getItem("frompath"),

        })
      },
    },
    beforeRouteEnter (to, from, next) {
      next();
      localStorage.setItem("frompath",from.fullPath)
    },
  };
</script>
<style>
 .xstj .progressStyle{
    margin-left: 16%;
  }
</style>
<style scoped>
  .main-body div span:first-child {
    width: 12%;
    display: inline-block;
  }

  .el-form-item {
    margin-right: 5px !important;
  }

  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>
