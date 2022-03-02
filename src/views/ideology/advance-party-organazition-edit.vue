<template>
	<section>
		<back></back>
		<div class="main-header">
			<span class="main-title">新增</span>
		</div>
		<div class="main-body">
			<el-card class="box-card" shadow="never">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-form ref="form" size="mini" :model="ruleForm" :rules="formRules" label-width="220px">

          <el-form-item label="评选征集" prop="theme">
						<el-input style="width:500px" v-model="ruleForm.theme" maxlength='30'></el-input>
					</el-form-item>
          <el-form-item :label="titleName">
            <el-select 	style="width:500px" clearable multiple  v-model="ruleForm.joinPartyOrganizationIds2" placeholder="全校组织">
              <el-option v-for="option in organizations" :key="option.id" :label="option.name" :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报名截止时间" prop="applyEndTime2">
            <el-date-picker
						style="width:500px"
			       v-model="ruleForm.applyEndTime2"
			       format="yyyy-MM-dd HH:mm"
						 type="datetime"
			      placeholder="选择日期时间">
			    </el-date-picker>
					</el-form-item>
          <el-form-item label="投票时间" prop="voteTime">
            <el-date-picker  	style="width:500px" :editable="false" type="datetimerange" v-model="ruleForm.voteTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm">
            </el-date-picker>
					</el-form-item>
          <el-form-item label="投票参与院系">
            <el-select  style="width:500px" multiple  v-model="ruleForm.voteJoinCollegeIds2" multiple placeholder="全部院系">
               <el-option
                 v-for="item in departments"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id">
               </el-option>
             </el-select>
					</el-form-item>
					<el-form-item label="评选描述" prop="desc">
						<el-input  style="width:500px;" maxLength="1000" type="textarea" v-model="ruleForm.desc"></el-input>
					</el-form-item>
          <el-form-item label="宣传图片" prop="logo">
						<upload type="6" :image='ruleForm.logo'  upload="/upload/image" @uploadSuccessed="uploadSuccessed">

						</upload>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="$store.state.sys.isClick" v-if="this.id == 0" type="primary" @click="onSubmit(false, 'form')">立即创建</el-button>
						<el-button :disabled="$store.state.sys.isClick" v-if="this.id != 0" type="primary" @click="onSubmit(false, 'form')">编辑</el-button>
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
	import {cascade,getNode2} from '@/utils/filters'
	import listMixins from '@/mixins/form';
	import va from '@/rules'
  export default {
		mixins:[listMixins],
    data() {
			let required = va.required('此项必填');
      return {
				titleName:(this.$route.query.nature == 1 || this.$route.query.nature == 2 ) ? '参与党组织' : '参与团组织',
				value1: '',
				chairmanId:'',
				campuses: [],
				collegeList:[],
				classifies:[],
				rules: rules,
        ruleForm: {
          type:this.$route.query.nature,
          theme:'',
          joinPartyOrganizationIds2:[],
          joinPartyOrganizationIds:'0',
          voteTime:[],
          applyEndTime2:'',
          applyEndTime:'',
          voteStartTime:'',
          voteEndTime:'',
					voteJoinCollegeIds2:[],
					voteJoinCollegeIds:'0',
					desc:'',
					isGrantHours:0,
					logo:'',
        },
        organizations:[],
				departments:[],
				options4:[],
				levels: levels,
				college: [required],
				campus: [required],
				formRules: {//校验规则
					theme:[required],
					applyEndTime2:[required],
					voteTime:[required],
					desc: [required],
					logo: [required],
				},
      }
		},
		created() {
      this.getOrgnaziton()
      this.getdepartment()
		},
		mounted(){

		},
    methods: {
      getdepartment(){
          this.$http.get('/school/college/list').then(res => {
            this.departments = res.data
          })
      },
      getOrgnaziton() {
				if (this.$route.query.nature == 1 || this.$route.query.nature == 2) {
					this.$http.get('/organization/party/list', {
						params: {
							current: 1,
							size: 100,
							nature: '7',
						}
					}).then(res => {
						this.organizations = res.data.list
					})
				}else{
					this.$http.get('/organization/party/list', {
						params: {
							current: 1,
							size: 100,
							nature: '4',
						}
					}).then(res => {
						this.organizations = res.data.list
					})
				}

      },
      uploadSuccessed(url) {
				var that = this
 			 this.$set(that.ruleForm,'logo', url)

      },
      onSubmit(state, ref) {
				if (this.ruleForm.joinPartyOrganizationIds2.length) {
					this.ruleForm.joinPartyOrganizationIds = this.ruleForm.joinPartyOrganizationIds2.join(",")
				}
        if (this.ruleForm.applyEndTime2) {
					this.ruleForm.applyEndTime  = this.ruleForm.applyEndTime2.getTime()
				}
        if (this.ruleForm.voteJoinCollegeIds2.length) {
					this.ruleForm.voteJoinCollegeIds = this.ruleForm.voteJoinCollegeIds2.join(",")
				}

        if (this.ruleForm.voteTime.length) {
          this.ruleForm.voteStartTime  = this.ruleForm.voteTime[0].getTime()
          this.ruleForm.voteEndTime	  = this.ruleForm.voteTime[1].getTime()
        }

				if (this.$route.query.nature == 1) {
           this.saveDataInfo(state, ref, '/ideology/advanced/add',this.ruleForm,'/ideology/advanced/party');
        }

				if (this.$route.query.nature == 2) {
           this.saveDataInfo(state, ref, '/ideology/advanced/add',this.ruleForm,'/ideology/advanced/party/member');
        }

				if (this.$route.query.nature == 3) {
           this.saveDataInfo(state, ref, '/ideology/advanced/add',this.ruleForm,'/ideology/advanced/group');
        }

				if (this.$route.query.nature == 4) {
           this.saveDataInfo(state, ref, '/ideology/advanced/add',this.ruleForm,'/ideology/advanced/group/member');
        }


      },
    },

  }
</script>
