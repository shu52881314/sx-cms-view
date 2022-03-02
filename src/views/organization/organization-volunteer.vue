<template>
  <section>

    <el-dialog title="导入"
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
                       <a class="el-button el-button--text el-button--mini" href='https://res.qutuo.net/download/template/%E5%BF%97%E6%84%BF%E7%BB%84%E7%BB%87%E6%A8%A1%E6%9D%BF.xlsx' size='mini' ><i class='el-icon-question'></i>模板下载</a>
                   </el-col>
               </el-row>

               <el-form-item label="" prop="name">
                 <el-col :span="22" >
                   <upload-file
                     ref="childUpload"
                     uploadUrl="/school/organization/volunteer/import"
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
                 <!-- <el-button type="info" native-type="reset" @click="beforeCloseImportCollegeHandler()">关闭</el-button> -->
               </el-form-item>
           </el-form>
       </div>
     </el-dialog>

     <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
      <el-tab-pane label="社团协会" name="first"></el-tab-pane>
      <el-tab-pane label="学生会" name="second"></el-tab-pane>
      <el-tab-pane label="志愿组织" name="third"></el-tab-pane>
      <el-tab-pane label="其他组织" name="fourth"></el-tab-pane>
    </el-tabs>


		<div class="search-box">
      <span style="float:left;">
			<el-form size="mini" :inline="true" class="demo-form-inline">
				<el-form-item label="级别">
					<el-select v-model="params.level" placeholder="请输入级别">
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
      <span style="float:right">
            <el-button type="primary" size="mini" @click="routerLink('club/edit', 'update', 0,'',5)" v-perms="'/organization/volunteer/add'">添加</el-button>
            <el-button type="primary" size="mini" @click="dialogImportCollegeVisible = true" v-perms="'/organization/volunteer/import'">导入</el-button>

      </span>
		</div>
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="organizationName" label="名称" ></el-table-column>
          <el-table-column prop="level" label="级别">
             <div slot-scope="scope">
               {{scope.row.level == 1 ? '校级' : '院系级'}}
            </div>
					</el-table-column>
          <el-table-column prop="rule" label="规则" align="center">
             <div slot-scope="scope">
               {{scope.row.rule == 1 ? '申请加入' :  (scope.row.rule == 2 ? '允许任何人加入' : '不允许加入') }}
            </div>
					</el-table-column>
          <el-table-column prop="organizationCount" label="人数"  align="center">
							<template slot-scope="scope">
								<span>{{scope.row.organizationCount}}人</span>
							</template>
          </el-table-column>
          <el-table-column prop="activityCount" label="活动数" align="center">
          	<template slot-scope="scope">
								<span>{{scope.row.activityCount}}个</span>
							</template>
          </el-table-column>
					<el-table-column prop="chairmanName" label="负责人"  align="center"></el-table-column>
          <el-table-column  label="操作" width="220" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('club/edit','update',scope.row.id, '',5)" v-perms="'/organization/volunteer/edit'">编辑</el-button>
              <el-button type="text" class="opreat-btn" @click.native="routerLink('club/detail', 'view', scope.row.id,'',5)" v-perms="'/organization/volunteer/details'">详情</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
	import { levels } from '@/dict'
export default {
  data() {
    return {
      activeName:'third',
      loading: false,
			params: {
				current: 0,
				size: 10,
				level: '',
				nature:'5',
				name: ''
			},
			levels: levels,
			data: [],
			total: 0,
      showfileInfor:false,
      fileInforamtion:{

      },
      dialogImportCollegeVisible: false,
    }
  },
	methods:{
    handleClick(activeName){

      if (activeName == "first") {
         this.$router.push("/organization/club")
      }else if (activeName == "second") {
         this.$router.push("/organization/student-union")
      }else if (activeName == "third") {
         this.$router.push("/organization/volunteer")
      }else if (activeName == "fourth") {
         this.$router.push("/organization/other")
      }

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
    },
    //导入成功返回
      openfileInfor(res){
          this.showfileInfor = true
          this.fileInforamtion = res
          // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {
          this.$refs.childUpload.submitUpload2()
     },
		fetch() {
			this.loading = true
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
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>

</style>
