

<template>
	<section>

		<el-dialog title='选择党组织'  :visible.sync="dialogVisible" :close-on-click-modal="false" width="950px">
	    <div class="selectParty">
        <div class="selectParty-left">
					<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				  <div style="margin: 15px 0;"></div>
				  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
				   <el-checkbox class="checkboxStyle" style="float:left;width:100%" v-for="city in cities" :label="city.id" :key="city.id" :value="city.id">{{city.name}}</el-checkbox>
				  </el-checkbox-group>
				</div>
				<div class="selectParty-right">
					<el-checkbox-group v-model="AllMembers" id="memberClas">
					  <el-checkbox @change="checked=>checkRow(checked, city.id)" class="checkboxStyle" style="float:left;width:110px;margin-right:10px;" v-for="city in memberList" :label="city.id" :key="city.id" :value="city.id">
							<p style="color:#333">{{city.name}}</p>
							<p style="color:#999">{{city.identityName}}</p>
						</el-checkbox>
					</el-checkbox-group>
				</div>
	    </div>
			<div style="width:100%;overflow:hidden;padding:30px 0;text-align:Center;">
				<el-button @click="submitMember"  type="primary">确定</el-button>
			</div>
	  </el-dialog>

		<back></back>
		<div class="main-header">
			<span class="main-title">{{title}}</span>
		</div>
		<div class="main-body">
			<el-card class="box-card" shadow="never">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-form ref="form" size="mini" :model="ruleForm" :rules="formRules" label-width="220px">

					<el-form-item label="会议主题" prop="theme">
						<el-input maxlength=30 style="width:190px;" v-model="ruleForm.theme"></el-input>
					</el-form-item>
					<el-form-item label="会议地点" prop="address">
						<el-input maxlength=100 style="width:190px;" v-model="ruleForm.address"></el-input>
					</el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker style="width:300px"
             v-model="ruleForm.startTime"
             type="datetime"
             placeholder="选择日期">
            </el-date-picker>
					</el-form-item>
					<el-form-item label="参与人员" prop="joinUserIds">
						<span class="classOverflow" @click="dialogVisible = true" style="cursor:pointer;float:left;border:1px solid #dcdfe6;display:inline-block;padding:0 10px;border-radius:5px;width:220px;height:30px;">
                {{ memberName }}
						</span>
						<!-- <el-input style="width:190px;" v-model="ruleForm.joinUserIds" maxlength='30'>

						</el-input> -->
					</el-form-item>
					<el-form-item label="会议内容" prop="content">
						<el-input  style="width:350px;" type="textarea" v-model="ruleForm.content"></el-input>
					</el-form-item>
					<el-form-item v-if="isShowRectify" label="整改方案" prop="rectifyContent">
						<el-input  style="width:350px;" type="textarea" v-model="ruleForm.rectifyContent"></el-input>
					</el-form-item>
          <el-form-item label="宣传图片" prop="logo">
						<upload type="6" :image='ruleForm.logo' upload="/upload/image" @uploadSuccessed="uploadSuccessed">

						</upload>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="$store.state.sys.isClick" type="primary" @click="onSubmit(false, 'form')">{{title2}}</el-button>
						<el-button @click="$router.go(-1)">取消</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</section>
</template>

<script>
  import {
    levels, rules
  } from '@/dict'
	import {cascade,getNode2,getOssToken,getAliyunImageUrl} from '@/utils/filters'
	import listMixins from '@/mixins/form';
	import va from '@/rules'
  export default {
		mixins:[listMixins],
    data() {
			let required = va.required('此项必填');
      return {
				IsClick:false,
				title:this.$route.query.nature == 1 ? '录入' : '新增',
				title2:this.$route.query.nature == 1 ? '立即录入' : '立即创建',
				isShowRectify:this.$route.query.nature == 1 ? true : false,
				checkAll: false,
        checkedCities: [],
        AllMembers: [],
        memberList: [],
        cities: [],
				memberName:'',
        isIndeterminate: false,
				dialogVisible:false,
				chairmanId:'',
				campuses: [],
				collegeList:[],
				classifies:[],
				rules: rules,
        ruleForm: {
          type:1,
          theme:'',
          startTime:'',
          joinUserIds:'',
          address:'',
          content:'',
          logo:'',
          isGrantHours:0,
        },
				Temclassifies:[],
				options4:[],
				levels: levels,
				college: [required],
				campus: [required],
				formRules: {//校验规则
					theme:[required],
					startTime:[required],
					address:[required],
					joinUserIds: [required],
					content: [required],
					rectifyContent: [required],
					logo: [required],
				},
				deleteArr:[]
      }
		},
		created(){
	   	this.getClasses()
		},
		mounted(){

		},
    methods: {
			checkRow(checked,row) {
        // deleteArr
				let status = `${checked}`
				let id = `${JSON.stringify(row)}`
				if (status == 'true') {
			 	  var index = this.deleteArr.indexOf(id);
					if (index > -1) {
					    this.deleteArr.splice(index, 1);
					}
				}else{
					  this.deleteArr.push(id);
				}



		  },
			compareArray(ids,arr){

          let data = []
					ids.forEach(item => {
						arr.forEach(item2 => {
							if (item == item2.id) {
								data.push(item2.name)
							}
						})
					})

				 this.memberName = data.join(",")


			},
      submitMember(){
				this.ruleForm.joinUserIds = this.AllMembers.join(",")
				this.compareArray(this.AllMembers,this.memberList)
        this.dialogVisible = false
				// if (this.AllMembers.length) {
				// 	 this.ruleForm.joinUserIds = this.AllMembers.join(",")
				// 	 this.dialogVisible = false
				// 	 let  memberName2 = this.memberList.map(item => {
				// 		 return item.name
				// 	 })
				// 	 this.memberName = memberName2.join(",")
				// }
			},
			getClasses(){
	      this.$http.get('/organization/party/list/all',{
	        params:{
	          nature:7
	        }
	      }).then(res => {
            this.cities = res.data
	      })
	    },
			handleCheckAllChange(val) {
				if (val) {
					this.checkedCities = 	this.cities.map(item => {
		 				return item.id
		 			})
				}else{
          this.checkedCities = []
				}

        this.isIndeterminate = false;
				this.getMembers()
      },
      handleCheckedCitiesChange(value) {


        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			  this.getMembers()



      },
			getMembers(){

					let ids = this.checkedCities.length ? this.checkedCities.join(",") : ""

					this.$http.get("/ideology/meeting/members/list",{
						params:{
							type:7,
							id:ids
						}
					}).then(res => {

						  this.memberList = res.data

							this.AllMembers = 	this.memberList.map(item => {
 	 		 				  return item.id
 	 		 		 	  })

							if (this.deleteArr.length) {
									this.deleteArr.forEach( (item,index) => {
										this.AllMembers.forEach( (item2,index2) => {
											 if (item == item2) {
												 this.AllMembers.splice(index2, 1);
											 }
										})
									})
							}

						 // let arr = []
						 //
						 // arr = 	this.memberList.map(item => {
	 		 			 //  return item.id
	 		 			 // })



						 // this.memberList.forEach(item => {
							//  this.AllMembers.forEach(item2 => {
							// 	  if (item.id == item2.id) {
							// 	  	return item
							// 	  }
							//  })
						 // })



					})
			},
      uploadSuccessed(url) {
				var that = this
 			 this.$set(that.ruleForm,'logo', url)

      },
      onSubmit(state, ref) {

			    	// this.$store.commit('setClick',true)

					if (this.ruleForm.startTime) {
              this.ruleForm.startTime = this.ruleForm.startTime.getTime()
					}

        	this.saveDataInfo(state, ref, '/ideology/meeting/add',this.ruleForm,'/ideology/meeting');


      },
    },

  }
</script>

<style scoped lang="scss">
.el-checkbox+.el-checkbox {
    margin-left: 0px;

}
.el-checkbox + .el-checkbox[data-v-14c571b4] {
    margin-left: 0px;

}
.classOverflow{
	white-space:nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
}
.checkboxStyle{
	padding-top:10px;
	white-space:nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
}
.selectParty{
	width:100%;
	height:400px;
	border:1px solid #ccc;
	overflow:hidden;
	&-left{
		float:left;
		width:250px;
		height:380px;
		padding:10px;
		border:1px solid #ccc;
		margin-left:10px;
		margin-top:10px;
		overflow-y:auto;
	}
	&-right{
		margin-left:280px;
		height:380px;
		overflow-y:auto;
	}
}
</style>
