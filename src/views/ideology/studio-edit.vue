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

          <el-form-item label="主题名称" prop="theme">
						<el-input style="width:190px;" v-model="ruleForm.theme" maxlength='30'></el-input>
					</el-form-item>
          <el-form-item label="报名截止时间" prop="applyEndTime2">
            <el-date-picker
						style="width:300px"
			       v-model="ruleForm.applyEndTime2"
			       format="yyyy-MM-dd HH:mm"
						 type="datetime"
			      placeholder="选择日期时间">
			    </el-date-picker>
					</el-form-item>
          <el-form-item label="公示结束时间" prop="endTime2">
            <el-date-picker style="width:300px"
             v-model="ruleForm.endTime2"
						 format="yyyy-MM-dd HH:mm"
						 type="datetime"
             placeholder="选择日期">
            </el-date-picker>
					</el-form-item>
					<el-form-item label="征集描述" prop="desc">
						<el-input  style="width:350px;" maxLength="1000" type="textarea" v-model="ruleForm.desc"></el-input>
					</el-form-item>
          <el-form-item label="宣传图片" prop="logo">
						<upload :image='ruleForm.logo'  upload="/upload/image" @uploadSuccessed="uploadSuccessed">

						</upload>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="$store.state.sys.isClick" v-if="this.id == 0" type="primary" @click="onSubmit(false, 'form')">立即创建</el-button>
						<el-button v-if="this.id != 0" type="primary" @click="onSubmit(false, 'form')">编辑</el-button>
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
				value1: '',
				chairmanId:'',
				campuses: [],
				collegeList:[],
				classifies:[],
				rules: rules,
        ruleForm: {
          logo: '',
					applyType:1,
					applyType:1,
					isGrantHours:0,
					applyEndTime:'',
					applyEndTime2:'',
					endTime:'',
					endTime2:''
        },
				Temclassifies:[],
				options4:[],
				levels: levels,
				college: [required],
				campus: [required],
				formRules: {//校验规则
					theme:[required],
					applyEndTime2:[required],
					endTime2:[required],
					desc: [required],
					logo: [required],
				},
      }
		},
		created() {
		},
		mounted(){

		},
    methods: {

      uploadSuccessed(url) {

        this.ruleForm.logo = url
      },
      onSubmit(state, ref) {
				if (this.ruleForm.applyEndTime2) {
					this.ruleForm.applyEndTime = this.ruleForm.applyEndTime2.getTime()
				}
				if (this.ruleForm.endTime2) {
					this.ruleForm.endTime  = this.ruleForm.endTime2.getTime()
				}

        	this.saveDataInfo(state, ref, 'ideology/studio/add',this.ruleForm,'/ideology/studio');
      },
    },

  }
</script>
