<template>



  <section>
    <el-tabs v-model="activeName" @tab-click="goTab">
      <el-tab-pane label="社团协会" name="0"></el-tab-pane>
      <el-tab-pane label="学生会" name="1"></el-tab-pane>
      <el-tab-pane label="其他组织" name="2"></el-tab-pane>
    </el-tabs>

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
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/学生组织模板.xlsx' size='mini' ><i class='el-icon-question'></i>模板下载</a>
                  </span>
                </div>
                <el-form-item label="" prop="name">
                 <el-col :span="22" >
                   <upload-file
                     ref="childUpload"
                     uploadUrl="/school/organization/students/import"
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




<!--     <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">-->
<!--      <el-tab-pane label="社团协会" name="2"></el-tab-pane>-->
<!--      <el-tab-pane label="学生会" name="3"></el-tab-pane>-->
<!--      <el-tab-pane label="志愿组织" name="5"></el-tab-pane>-->
<!--      <el-tab-pane label="其他组织" name="19"></el-tab-pane>-->
<!--    </el-tabs>-->


		<div class="search-box" style="position:relative;">
      <span style="float:left">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="级别">
					<el-select v-model="params.level" placeholder="请选择级别">
						<el-option v-for="level in levels" :key="level.value" :label="level.label" :value="level.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="params.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
    </span>
    <div style="float:right" :class="{ isTopClass: ($root.ItemData && $root.ItemData.length && $root.ItemData.length == 1) }">
        <el-button  v-perms="'/organization/club/add'" type="increase" size="mini" @click="routerLink('club/edit', 'update', 0,'','','','',activeName)">添加</el-button>
        <el-button  v-perms="'/organization/club/add'" type="primary" size="mini" @click="dialogImportCollegeVisible = true">导入</el-button>
    </div>

		</div>
		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column  width="160" show-overflow-tooltip prop="organizationName" label="名称" ></el-table-column>
          <el-table-column prop="level" label="级别">
             <div slot-scope="scope">
               {{scope.row.level == 1 ? '校级' : '院系级'}}
            </div>
					</el-table-column>
          <el-table-column  width="160" show-overflow-tooltip prop="chairmanName" label="负责人"  align="center"></el-table-column>
          <el-table-column  width="160" show-overflow-tooltip prop="guiderName" label="指导老师"  align="center"></el-table-column>
          <el-table-column  width="160" show-overflow-tooltip prop="appenderName" label="挂靠单位"  align="center"></el-table-column>
          <el-table-column  width="160" show-overflow-tooltip prop="parentName" label="上级机构"  align="center"></el-table-column>
          <!-- <el-table-column prop="rule" label="规则" align="center">
             <div slot-scope="scope">
               {{scope.row.rule == 1 ? '申请加入' :  (scope.row.rule == 2 ? '允许任何人加入' : '不允许加入') }}
            </div>
					</el-table-column> -->
          <el-table-column prop="organizationCount" label="人数"  align="center">
          	<template slot-scope="scope">
								<span>{{scope.row.organizationCount}}人</span>
							</template>
          </el-table-column>
          <el-table-column prop="actCount" label="活动数" align="center"></el-table-column>
          <el-table-column prop="energy" label="活力值"  align="center"></el-table-column>
          <!-- <el-table-column prop="activityCount" label="活动数" align="center">
          	<template slot-scope="scope">
								<span>{{scope.row.activityCount}}个</span>
							</template>
          </el-table-column> -->

          <el-table-column  label="操作" width="220" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('club/edit','update',scope.row.id,'','','','',activeName)" v-perms="'/organization/club/edit'">编辑</el-button>
              <el-button type="text" class="opreat-btn" @click.native="routerLink('club/detail', 'view', scope.row.id,'',params.current,activeName)" v-perms="'/organization/club/details'">详情</el-button>
              <el-button type="text" class="opreat-btn" @click.native="deleteClub(scope.row.id,scope.row.organizationCount)" v-perms="'/organization/club/delete'">删除</el-button>
            </div>
          </el-table-column>
        </el-table>


        <div style="width:98%;margin:0 auto;padding-top:30px;" >
          <span  style="float:left;"  v-perms="'/organization/club/add'">
            <el-dropdown size="small" split-button type="primary" @command="handleCommand">
              导出
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">导出所选</el-dropdown-item>
                <el-dropdown-item command="b">导出所有</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <div class="block text-center  fr">
              <qu-pagination :total="total" @change="changePage"></qu-pagination>
          </div>
        </div>


		</div>
  </section>
</template>
<script>
	import { levels } from '@/dict'
  import axios from 'axios'
export default {
  data() {
    return {
      fileListName:'',
      fileList:[],
      randomData:"",
      activeName:'',
      tabsList:['/organization/club','/organization/union','/organization/another'],
      loading: false,
			params: {
				current: 1,
				size: 10,
				level: '',
				nature:'1',
				name: ''
			},
			levels: levels,
			data: [],
			multipleSelection: [],
			total: 0,
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
	methods:{
    goTab(){
      const that = this;
      this.$router.push({ path: that.tabsList[parseInt(that.activeName)], query: { type:that.activeName }});
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
       url: 'school/fail/organization/export',
       responseType: 'blob',
       data:{
        randomData:   this.randomData
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
       link.setAttribute('download', '学生组织失败信息' + '.xlsx')
       document.body.appendChild(link)
       link.click()
     })

    },
    deleteClub(id,count){
      if (count > 1) {

        this.$alert('<p><b>当前组织不可删除</b><p>请删除此组织下的成员后，再删除此组织', '删除组织', {
          dangerouslyUseHTMLString: true
        })

      }else{

        this.$confirm('是否删除此组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post('organization/administration/delect', {
            organizationId: id
          }).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.fetch()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })


        })

      }
    },
    handleCommand(command) {
      if (command == "a") {

        var arrAl = []
        if (this.multipleSelection && this.multipleSelection.length) {
          this.multipleSelection.forEach(item => {
            arrAl.push(item.id)
          })
        }

        if (arrAl.length) {

          axios({
           method: 'get',
           url: 'organization/clubs/export',
           responseType: 'blob',
           params: {
                 clubIds:arrAl.join(","),
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
           link.setAttribute('download', '学生组织' + '.xlsx')
           document.body.appendChild(link)
           link.click()
         })

        }



      }else{

        axios({
         method: 'get',
         url: 'organization/clubs/export',
         responseType: 'blob',
         params: {
               clubIds:'',
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
         link.setAttribute('download', '学生组织' + '.xlsx')
         document.body.appendChild(link)
         link.click()
       })

      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(activeName){

      this.params.nature = activeName

      if (activeName == "2") {

      }else if (activeName == "3") {

      }else if (activeName == "5") {

      }else if (activeName == "19") {
      }

        this.fetch()

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
          this.showfileInforDetail =false
          this.clickAble = true
          this.showProgress = false
    },
    //导入成功返回
      openfileInfor(res){

        if (res != false){
          this.randomData = res.randomData
            this.showfileInfor = true
            this.fileInforamtion = res
            this.fetch()
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
		fetch() {
			this.loading = true
      this.params.nature=1
			this.$http.get('/organization/clubs', {params: this.params}).then(res => {
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
		}
	},
	created(){
    const that = this;
    that.activeName = that.$route.query.type;
	},
	mounted(){

    // if (this.$route.query.page) {
    //   this.params.current = parseInt(this.$route.query.page)
    // }
    // if (this.$route.query.status) {
    //   this.activeName = this.$route.query.status
    // }
    this.fetch()

	}
}
</script>
<style scoped>
 .isTopClass{
   position:absolute;right:20px;top:-65px;

 }
</style>
