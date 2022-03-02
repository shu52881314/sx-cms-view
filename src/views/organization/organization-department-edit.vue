<template>
	<section>
		<back></back>
		<div class="main-header">
			<span class="main-title">行政机构</span>
		</div>
		<div class="main-body">
			<el-card class="box-card" shadow="never">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-form ref="form" size="mini" :model="club" :rules="formRules" label-width="220px">
					<el-form-item label="名称" prop="organizationName">
						<el-input style="width:190px;" v-model="club.organizationName" maxlength='30'></el-input>
					</el-form-item>
					<el-form-item label="级别" prop="level">
						<el-select @change="changeLevel" v-model="club.level" placeholder="请选择级别">
							<el-option v-for="level in levels" :key="level.value" :label="level.label" :value="level.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="club.level == 8" label="校区" prop="campusId">
						<el-select @change="changeCampus" v-model="club.campusId" placeholder="请选择校区">
							<el-option v-for="option in campuses" :key="option.id" :label="option.name" :value="option.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="club.level == 8 && club.campusId" label="院系" prop="college">
						<el-select  v-model="club.collegeId" placeholder="请选择院系">
							<el-option v-for="option in collegeList" :key="option.id" :label="option.name" :value="option.id"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item v-if="!id" label="职工" prop="chairman">

						           <el-select clearable
                         v-model="club.userId2"
                         filterable
												 multiple
                         value-key="value"
                         remote
                         placeholder="请输入关键词"
                         :remote-method="remoteMethod"
                         :loading="loading">
                         <el-option
                           v-for="item in options4"
                           :key="item.id"
                           :label="item.name +' - '+ item.id"
                           :value="item.id">
                             <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                         </el-option>
                       </el-select>
					</el-form-item>


					<el-form-item>
						<el-button v-if="this.id == 0" type="primary" @click="onSubmit(false, 'form')">立即创建</el-button>
						<el-button v-if="this.id != 0" type="primary" @click="onSubmit(false, 'form')">保存</el-button>
						<!-- <el-button @click="$router.go(-1)">取消</el-button> -->
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</section>
</template>

<script>
  import {
    levels,
    rules
  } from '@/dict'
  import {
    cascade,
    getNode2
  } from '@/utils/filters'
  import listMixins from '@/mixins/form';
  import va from '@/rules'
  export default {
    mixins: [listMixins],
    data() {
      let required = va.required('此项必填');
      return {

        title: this.$route.query.nature == 7 ? "党组织" : "团组织",
        campuses: [],
        collegeList: [],
        classifies: [],
        rules: rules,
        club: {
          level: ''
        },
        Temclassifies: [],
        options4: [],
        levels: levels,
        college: [required],
        campus: [required],
        formRules: { //校验规则
          organizationName: [required],
          level: [required],
					campusId: [required]
        },
        student: [{
          id: 1,
          name: 'a',
          code: 1001
        }, {
          id: 2,
          name: 'b',
          code: 1002
        }]
      }
    },
    created() {
      this.getCampus()
      this.getDataInfo(this.id)
    },
    mounted() {

    },
    methods: {
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/query/user", {
            params: {
              identity: '2',
              key: query
            }
          }).then(res => {
            this.loading = false;
            this.options4 = res.data
          })

        } else {
          this.options4 = [];
        }
      },
      //选择级别
      changeLevel(value) {
        if (value == 8) {
          this.formRules.campus = this.campus
        } else {
          this.formRules.campus = ''
        }
      },
      //选择校区
      changeCampus(value) {
        if (this.club.level == 8) {

          this.$http.get('/school/all/college/cascader', {
            params: {
              campusId: value
            }
          }).then(res => {

            this.collegeList = res.data
          })
        }

      },
      getDataInfo(id) {
        if (id == 0) {
          this.loading = false;
          return;
        }

        this.$http.get('/organization/institution/details', {
          params: {
            id: id,
          }
        }).then(res => {

          if (res.data.campusId) {
            this.$http.get('/school/all/college/cascader', {
              params: {
                campusId: res.data.campusId
              }
            }).then(res => {
              this.collegeList = res.data
              this.club.college = this.club.collegeId
            })
          }

          this.club = res.data





        }).catch(err => {
          this.loading = false;
        });
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.campuses = this.campuses.concat(res.data)
        })
      },
      uploadSuccessed(url) {
        this.club.avatar = url
      },
      onSubmit(state, ref) {

        if (this.id == 0) {
          if (this.club.userId2.length) {
            this.club.userId = this.club.userId2.join(",")
          }
          this.saveDataInfo(state, ref, 'organization/institution/add', this.club, '/organization/department');
        } else if (this.id != 0) {
          // var n = Number(this.club.chairmanId);
          // if (isNaN(n)){
          //     this.club.chairmanId  = this.club.secretaryId
          // }

          this.updateDataInfo(state, ref, 'organization/institution/modify', this.club, '/organization/department');

        }


      },
      getStudent(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      }
    },

  }
</script>
