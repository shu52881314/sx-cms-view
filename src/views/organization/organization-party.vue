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
                    <a class="el-button el-button--text el-button--mini" href='https://2class.oss-cn-shenzhen.aliyuncs.com/template/%E5%85%9A%E7%BB%84%E7%BB%87%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx' size='mini' >模板下载</a>
                  </span>
                </div>
                <el-form-item label="" prop="name">
                 <el-col :span="22" >
                   <upload-file
                     ref="childUpload"
                     uploadUrl="/school/party/import"
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
                    <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败 <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
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




		<div class="main-header">
			<span class="main-title">党组织列表</span>
			<div class="main-btn-box">
						<el-button type="increase" size="mini" @click="routerLink('party/edit', 'update', 0,'',7)" v-perms="'/organization/party/add'">添加</el-button>
						<el-button type="primary" size="mini" @click="dialogImportCollegeVisible = true"  v-perms="'/organization/party/add'">导入</el-button>
			</div>
		</div>
		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">

				<el-form-item label="名称">
					<el-input style="width:180px;" v-model="params.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="党组织名称" ></el-table-column>
          <el-table-column prop="parentName" label="上级党组织"  align="center"></el-table-column>
          <el-table-column prop="parentDepartmentName" label="上级机构"  align="center"></el-table-column>
          <el-table-column prop="partyCount" label="党员" align="center">
          	<template slot-scope="scope">
							<span>{{scope.row.partyCount}}人</span>
						</template>
          </el-table-column>
					<el-table-column prop="secretaryName" label="书记"  align="center"></el-table-column>
					<el-table-column prop="remarks" label="备注"  align="center"></el-table-column>
          <el-table-column  label="操作" width="220" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('party/edit','update',scope.row.id,'',7)" v-perms="'/organization/party/edit'">编辑</el-button>
              <el-button type="text" class="opreat-btn" @click.native="routerLink('party/details', 'view', scope.row.id,'',7)" v-perms="'/organization/party/details'">详情</el-button>
              <el-button type="text" class="opreat-btn"  v-if="scope.row.isdelorganization=='0'" @click="deleteParty(scope.row.id,scope.row.identity)" >删除</el-button>
              <el-button type="text" class="opreat-btn colorGray" v-if="scope.row.isdelorganization=='1'||scope.row.isdelorganization=='2'||scope.row.isdelorganization=='3'" :title="scope.row.msg_3">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
import axios from 'axios'
	import { levels } from '@/dict'
export default {
  data() {
    return {
      fileListName:'',
      fileList:[],
      randomData:"",
      showfileInfor:false,
      loading: false,
			params: {
				current: 1,
				size: 10,
				nature:'7',
				name: ''
			},
      fileInforamtion:{

      },
      dialogImportCollegeVisible: false,
			levels: levels,
			data: [],
			total: 0,
      showProgress:false,
      fileUploadPercent:0,
      showfileInforDetail:false,
      clickAble:true,
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
    deleteParty(id,identityId){
      this.$confirm('是否删除该党组织?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/organization/party/delete',  {
            organizationId: id,
            identityId:identityId
        }).then(res => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetch();
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      }).catch( () => {
      })
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
       url: 'school/fail/party/club/export',
       responseType: 'blob',
       data:{
        randomData:   this.randomData,
        nature:7
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
       link.setAttribute('download', '党组织失败信息' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
    beforeCloseImportCollegeHandler() {
      this.fileList = []
      this.showfileInfor = false
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
		fetch() {
			this.loading = true
			this.$http.get('/organization/party/list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
    submitUpload() {
      if (this.clickAble){
        this.$refs.childUpload.submitUpload2()
        this.setProgress()
      }else{
        this.$message({
          type: 'error',
          message: '请重新上传文件'
        });
        return;
      }
   },
    importFile(){
    },
		search() {
			this.params.current = 1
			this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		}
	},
	created(){
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style scoped>
  .colorGray{
    color: gray;
  }
</style>
