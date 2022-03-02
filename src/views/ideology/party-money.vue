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
                    <a class="el-button el-button--text el-button--mini" href='https://2room.oss-cn-beijing.aliyuncs.com/template/%E5%85%9A%E5%91%98%E7%BC%B4%E8%B4%B9%E6%A8%A1%E6%9D%BF.xlsx' size='mini' >模板下载</a>
                  </span>
                </div>
                <el-form-item label="" prop="name">
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

    <!-- <el-dialog title="导入"
     :visible.sync='dialogImportCollegeVisible'
     @close="beforeCloseImportCollegeHandler"
     :close-on-click-modal="false"
     width='650px'>
       <div>
           <el-form size='mini' label-width='12px'>
               <el-row>
                   <el-col :span='17' style="margin-left: 12px">
                       <p><el-tag type="warning"><i class='el-icon-warning'></i>为了提高数据导入成功率，请使用模板,并严格按照图例格式填写！</el-tag></p>
                   </el-col>
                   <el-col :span='3'>
                       <a class="el-button el-button--text el-button--mini" href='https://res.qutuo.net/download/template/%E5%85%9A%E8%B4%B9%E5%AF%BC%E5%85%A5.xlsx' size='mini' ><i class='el-icon-question'></i>模板下载</a>
                   </el-col>
               </el-row>

               <el-form-item label="" prop="name">
                 <el-col :span="22" >
                   <upload-file
                     ref="childUpload"
                     :dataObj="dataObj2"
                     uploadUrl="/school/ideology/group/fee/import"
                     uploadType=".xls,.xlsx"
                     uploadSzie="100"
                     uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                     @fileInfor="openfileInfor"
                      >
                     </upload-file>
                 </el-col>
               </el-form-item>
               <el-form-item class="upload-info" v-if="showfileInfor">
                 <p>
                   共导入：
                   <b class="fileInforColor1">
                     {{fileInforamtion.total}}
                   </b> 个数据
                   <span class="fileInforColor2">
                     （成功导入<b >{{fileInforamtion.success}}</b>个
                   </span> ;
                   <span class="fileInforColor3">
                       失败<b>{{fileInforamtion.failed}}</b>个）
                   </span>
                </p>
               </el-form-item>
               <el-form-item style="text-align:center;">
                 <el-button   type="primary" @click="submitUpload">确定导入</el-button>
               </el-form-item>
           </el-form>
       </div>
     </el-dialog> -->

    <el-dialog :title="showMoney.userName + '的党费信息'" :visible.sync="dialogVisible" :close-on-click-modal="false" width="1000px">
			<div class="partyMoney">

        <div class="partyMoney-top">
           <!-- <img style="width:45px;height:45px;" class="partyMoney-top-img"> -->
           <div class="partyMoney-top-right" style='margin-left:0'>
             <p><b>{{showMoney.userName}}</b> &#12288; 学号：{{showMoney.userCode}}</p>
             <p>归属党组织：{{showMoney.organizationName}}</p>
           </div>
        </div>

          <table class="tableColor" width="100%" cellpadding="0" cellspacing="0">
          <tr>
           <td align="center" valign="middle">一月</td>
           <td align="center" valign="middle">二月</td>
           <td align="center" valign="middle">三月</td>
           <td align="center" valign="middle">四月</td>
           <td align="center" valign="middle">五月</td>
           <td align="center" valign="middle">六月</td>
           <td align="center" valign="middle">七月</td>
           <td align="center" valign="middle">八月</td>
           <td align="center" valign="middle">九月</td>
           <td align="center" valign="middle">十月</td>
           <td align="center" valign="middle">十一月</td>
           <td align="center" valign="middle">十二月</td>
          </tr>
          <tr>
           <td align="center" valign="middle" v-for="item in showMoney.monthDuesList">

             <input style="border:1px solid #ccc;height:30px;line-height:30px;width:40px;text-align:center;" v-model="item.due">
             </input>
           </td>
          </tr>
        </table>

        <div style="text-align:center;padding-top:40px;">
  					<el-button type="primary" @click="modifyMoney(showMoney.monthDuesList)">修改</el-button>
  			</div>



			</div>
		</el-dialog>

		<div class="main-header">
			<span class="main-title">党费管理</span>
      <div class="main-btn-box">
        <el-button  v-perms="'/ideology/party/fee/administration/import'" type="primary" size="mini"  @click="dialogImportCollegeVisible = true">导入缴费记录</el-button>
      </div>
		</div>

		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item>
					<el-input v-model="params.keyword" maxlength=30 placeholder="请输入名称搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="userName" label="姓名"></el-table-column>
          <el-table-column prop="userCode" label="学号"></el-table-column>
          <el-table-column prop="organizationName" label="所属党组织"></el-table-column>
          <el-table-column prop="payTime" label="缴费时间">
               <div slot-scope="scope">
                 {{scope.row.payTime | formatDate}}
               </div>
          </el-table-column>
          <el-table-column prop="totalDues" label="缴费金额"></el-table-column>
          <el-table-column  label="操作" width="160" align="left">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button v-perms="'/ideology/party/fee/administration/details'" type="text" class="opreat-btn" @click="showpartymoney(scope.row)">详情</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      fileListName:'',
      fileList:[],
      randomData:"",
      dataObj2:{
        type:1
      },
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
      fileUploadPercent:0,
      showProgress:false,
      showfileInforDetail:false,
      clickAble:true,
      loading: false,
			params: {
        type:1,
				current: 1,
				size: 10,
				keyword: ''
			},
			data: [
        {
           id:1,
           userName:'张三',
           userCode:"234324",
           userAvatar:"Zajp",
           organizationName:"组织名称",
           totalDues:'324',
           monthDuesList:[
                 {
                  dues:'1'
                 },
                 {
                   dues:'2'
                 },
                 {
                   dues:'3'
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:''
                 },
                 {
                   dues:'22'
                 }
           ],
          payTime:'1533365866000'
        }
      ],
			total: 0,
    }
  },
	methods:{
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
      this.showfileInfor = false
      this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
      }
      this.$refs.childUpload.closeUpload();
      this.showfileInforDetail =false
      this.fileUploadPercent = 0
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
       url: '/school/fail/party/groups/fee/export',
       responseType: 'blob',
       data:{
        randomData:   this.randomData,
        type:1
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
       link.setAttribute('download', '党费失败信息' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
    beforeCloseImportCollegeHandler() {
          this.dialogImportCollegeVisible = false;
          this.$refs.childUpload.closeUpload();
          this.showfileInfor = false
          this.fileInforamtion = {
              total: 0,
              success: 0,
              failed: 0,
              exists: 0
          }
          this.showfileInforDetail = false
          this.clickAble = true
          this.showProgress = false
    },
    //导入成功返回
      openfileInfor(res){
        if (res != false){
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
   modifyMoney(list){
     let data = {
       mouthDuesList:list,
       type:1
     }
     this.$http.post("ideology/group/fee/modify",data).then(res => {
       if (res.code == '200') {
         this.$message({
           type: 'success',
           message: '操作成功!'
         });
         this.dialogVisible = false
         this.fetch()
       }
     })



   },
		fetch() {
			this.loading = true

			this.$http.get('ideology/group/fee/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		search() {
			this.params.current = 1
			this.fetch()
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
