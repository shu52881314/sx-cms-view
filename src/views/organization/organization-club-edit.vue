<template>
  <section>
    <back></back>
    <div class="main-header">
      <span class="main-title">{{ id ? "编辑学生组织" : "添加学生组织"}}</span>
    </div>
    <div class="main-body">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form ref="form" size="mini" :model="club" :rules="formRules" label-position="left" label-width="220px">
          <el-form-item label="标志" prop="imagePath">
            <upload type="4" :image='club.imagePath' upload="/upload/image" @uploadSuccessed="uploadSuccessed">

            </upload>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input style="width:190px;" placeholder="请输入组织名称" v-model="club.name" maxlength='30'></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="nature">
            <el-select v-model="club.nature" placeholder="请选择类型">
              <el-option v-for="rule in naturees" :key="rule.value" :label="rule.label" :value="rule.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-select @change="changeLevel" v-model="club.level" placeholder="请选择级别">
              <el-option v-for="level in levels" :key="level.value" :label="level.label"
                         :value="level.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属校区" prop="campus">
            <el-select @change="changeCampus" v-model="club.campus" placeholder="请选择所属校区">
              <el-option v-for="option in campuses" :key="option.id" :label="option.name"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="club.level == 2" label="所属院系" prop="college">
            <el-select v-model="club.college" placeholder="请选择所属院系">
              <el-option v-for="option in collegeList" :key="option.id" :label="option.name"
                         :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加入规则" prop="rule">
            <el-select v-model="club.rule" placeholder="请选择加入规则">
              <el-option v-for="rule in rules" :key="rule.value" :label="rule.label" :value="rule.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="chairman">
            <el-select clearable

                       v-model="club.chairman"
                       @change="changeSelect"
                       filterable
                       value-key="value"
                       :multiple-limit=1
                       remote
                       placeholder="请输入负责人名称搜索"
                       :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in options4"
                :key="item.id"
                :label="item.name +' - '+ item.code"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="指导老师">
            <el-select clearable
                       v-model="club.guider"
                       filterable
                       value-key="value"
                       placeholder="请输入指导老师姓名搜索"
                       :multiple-limit=1
                       remote
                       :remote-method="remoteMethod2"
            >
              <el-option
                v-for="item in options42"
                :key="item.userId"
                :label="item.userName +' - '+ item.userCode"
                :value="item.userId">
                <span style="float: left">{{ item.userName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userCode }}</span>
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="挂靠单位">
            <el-select clearable
                       placeholder="请输入挂靠单位名称搜索"
                       v-model="club.appender"
                       filterable
                       value-key="value"
                       :multiple-limit=1
                       remote
                       :remote-method="remoteMethod3"
                       style="width: 350px"
            >
              <el-option
                v-for="item in options43"
                :key="item.administrationId"
                :label="item.administrationName"
                :value="item.administrationId">
                <span style="float: left">{{ item.administrationName }}</span>
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="上级机构" prop="parentIds">
            <el-cascader placeholder="请选择上级机构" :props="defaultProps" class="selectWidth" expand-trigger="click"
                         v-model="club.parentIds" clearable :options="classifies" :change-on-select="true"
                         :show-all-levels="true" style="width: 350px"></el-cascader>
          </el-form-item>
          <el-form-item label="简介" prop="desc">
            <el-input style="width:350px;" type="textarea" v-model="club.desc" placeholder="请输入介绍信息(200字以内)"
                      maxlength='200'></el-input>
          </el-form-item>
          <el-form-item label="风采展示">
            <el-col :span="22">
              <el-upload
                action=""
                list-type="picture-card"
                :beforeUpload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-change="geturl"
                :limit="9"
                accept=".gif,.jpeg,.png,.jpg"
                :file-list="sujuhuixian"
                :http-request="httpRequest"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="danmiens" alt="">
              </el-dialog>
            </el-col>
          </el-form-item>
          <el-form-item>

            <el-button v-if="this.id == 0" type="primary" @click="onSubmit(false, 'form')">立即创建</el-button>
            <el-button v-if="this.id != 0" type="primary" @click="onSubmit(false, 'form')">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </section>
</template>

<style>
  #selectColor::-webkit-input-placeholder {
    color: #606266;
  }

  #selectColor:-moz-placeholder {
    color: #606266;
  }

  #selectColor::-moz-placeholder {
    color: #606266;
  }

  #selectColor:-ms-input-placeholder {
    color: #606266;
  }
</style>

<script>
  import {getOssToken, getAliyunImageUrl, cascade3, getNode2, uploadOSS} from "@/utils/filters"
  import {
    levels, rules
  } from '@/dict'
  import listMixins from '@/mixins/form';
  import va from '@/rules'

  export default {
    mixins: [listMixins],
    data() {
      let required = va.required('此项必填');
      return {
        title: this.$route.query.nature == 2 ? "社团协会" : (this.$route.query.nature == 3 ? "学生会" : (this.$route.query.nature == 5 ? '志愿组织' : '其他')),
        chairmanId: '',
        dialogVisible: false,
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        naturees: [
          {
            label: '社团协会',
            value: 2
          },
          {
            label: '学生会',
            value: 1
          },

          {
            label: '其他',
            value: 3
          }
        ],
        campuses: [
          {
            id: 0,
            name: localStorage.getItem('schoolName')
          }
        ],
        classifies2: [],
        collegeList: [],
        rules: rules,
        club: {
          name: '',
          chairman: '',
          imagePath: '',
          level: 1,
          campus: '',
          nature: '',
          college: '',
          rule: 1,
          desc: '',
          appender: '',
          guider: '',
          parentIds: [],
          parentId: '',
          miens: '',
        },
        miensshuzu: [],
        sujuhuixian: [],
        danmiens: '',
        boolloading: false,
        placeholder: '请输入负责人姓名搜索',
        classifies: [],
        options4: [],
        options42: [],
        options43: [],
        levels: [
          {label: '校级', value: 1},
          {label: '院系级', value: 2},
        ],
        college: [required],
        campus: [required],
        formRules: {//校验规则

          name: [required],
          level: [required],
          nature: [required],
          rule: [required],
          campus: [required],
          college: [required],
          chairman: [required],
          appender: [required],
          guider: [required],
        },
        student: [{id: 1, name: 'a', code: 1001}, {id: 2, name: 'b', code: 1002}]
      }
    },
    created() {
      this.getParent()
      getOssToken()
      this.getCampus()
      this.getDataInfo(this.id)
    },
    methods: {
      // 上传前对文件的大小的判断
      beforeAvatarUpload(file) {
        this.boolloading = true;

        let extension = file.type === 'image/png';
        let extension2 = file.type === 'image/jpeg';

        let isLt2M = file.size > 10242880;
        if (!extension && !extension2) {
          this.$alert('上传图片只能是 jpg、png 格式!', '提示', {
            type: 'error'
          });
          this.boolloading = false;
          return false
        }
        if (isLt2M) {
          this.$alert('上传图片大小不能超过 10M!', '提示', {
            type: 'error'
          })
          this.boolloading = false;
          return false
        } else {
          console.log('可以上传')
        }


      },

      handleRemove(file, fileList) {
        for (let i = 0; i < this
          .miensshuzu.length; i++) {
          if (this.miensshuzu[i] == file.url) {
            this.miensshuzu.splice(i, 1);
          }
        }


      },
      geturl(file, fileList) {
        this.danmiens = file.url;
        this.dialogVisible = false;
      },
      httpRequest(file) {
        let url = uploadOSS(file, "2class", 'organization' + "/", 0).then(res => {
          this.uploadSuccesseds(res)
        })
      },
      uploadSuccesseds(url) {
        this.miensshuzu.push(url)
      },
      getParent() {
        this.$http.get("/organization/administration/list", {
          params: {
            keyWord: this.keyWord
          }
        }).then(res => {

          this.classifies = cascade3(0, res.data)
          this.classifies2 = res.data

        })

      },
      //远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/NoPage", {
            params: {
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
      remoteMethod2(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/organization/search/teachers/guider", {
            params: {
              keyWord: query
            }
          }).then(res => {
            console.log(res);
            this.loading = false;
            this.options42 = res.data
          })

        } else {
          this.options42 = [];
        }
      },
      remoteMethod3(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/organization/search/administration", {
            params: {
              keyWord: query
            }
          }).then(res => {
            console.log(res);
            this.loading = false;
            this.options43 = res.data
          })

        } else {
          this.options43 = [];
        }
      },
      //选择级别
      changeLevel(value) {
        this.club.college = ''
        this.club.campus = ''
        this.collegeList = []
        // if(value == 8){
        // 	this.formRules.campus = this.campus
        // }else{
        //   this.formRules.campus = ''
        // }
      },
      //选择校区
      changeCampus(value) {

        if (this.club.level == 2) {

          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {

            this.collegeList = res.data
          })
        }

      },
      getDataInfo(id) {
        if (id == 0) {
          this.loading = false;
          return;
        }
        this.$http.get('/organization/club/detail', {params: {clubId: id}}).then(res => {
          // this.club = res.data
          console.log(res, '编辑详情')
          this.club.id = res.data.id
          this.club.name = res.data.name
          if (res.data.logo) {
            this.club.imagePath = res.data.logo

          }

          this.club.level = res.data.level
          this.club.rule = res.data.rule
          this.club.desc = res.data.introduce

          this.club.nature = res.data.nature

          if (res.data.auditorId) {
            this.remoteMethod(res.data.auditorName)
            setTimeout(() => {
              this.club.chairman = res.data.auditorId
            }, 500)
          }

          if (res.data.campusId) {
            this.club.campus = res.data.campusId
          } else if (res.data.campusId == null || res.data.campusId == "") {
            this.club.campus = 0
          }

          if (res.data.guiderId) {
            this.remoteMethod2(res.data.guiderName)
            setTimeout(() => {
              this.club.guider = res.data.guiderId
            }, 500)
          }

          if (res.data.appenderId) {
            this.remoteMethod3(res.data.appenderName)
            setTimeout(() => {
              this.club.appender = res.data.appenderId
            }, 500)
          }

          if (res.data.parentId) {
            setTimeout(() => {
              this.club.parentIds = getNode2(this.classifies2, res.data.parentId);
            }, 500)

          }

          if (res.data.campusId) {
            this.$http.get('/school/all/college/cascader', {params: {campusId: res.data.campusId}}).then(res2 => {
              this.collegeList = res2.data
              this.club.college = res.data.collegeId
              // alert(this.club.college)
            })
          }

          if (res.data.mienAttach == 1) {
            this.sujuhuixian = res.data.miens;
            for (let i = 0; i < res.data.miens.length; i++) {
              let imghuiurl = res.data.miens[i].url
              this.miensshuzu.push(imghuiurl)
            }
          }

        }).catch(err => {
          this.loading = false;
        });
      },
      changeSelect(value) {
        if (value) {
          this.placeholder = ""
        }
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          // this.campuses = this.campuses.concat(res.data)
          this.campuses = res.data
        })
      },
      uploadSuccessed(url) {
        var that = this
        this.$set(this.club, 'imagePath', url)

      },
      onSubmit(state, ref) {

        this.club.miens = this.miensshuzu.toString()
        if (this.club.parentIds.length) {
          let value = this.club.parentIds
          this.club.parentId = value[value.length - 1]
        } else {

          if (!this.club.parentId) {
            this.club.parentId = 0
          }

        }

        console.log(this.club, '参数');
        var toUrl = "/organization/club"
        // if (this.$route.query.activeName=='0') {
        //   toUrl = "/organization/club"
        // }else if (this.$route.query.activeName=='1') {
        //   toUrl = '/organization/union?type=1'
        // }else if (this.$route.query.activeName=='2') {
        //   toUrl = "/organization/another?type=2"
        // }
        if (this.id == 0) {

          this.saveDataInfo(state, ref, 'organization/club/add', this.club, toUrl);
        } else if (this.id != 0) {


          // var n = Number(this.club.chairman);
          // if (isNaN(n)){
          //     this.club.chairman  = this.chairmanId
          // }

          // if (!this.club.chairman) {
          //    this.club.chairman = this.chairmanId
          // }


          console.log(this.club)
          this.updateDataInfo(state, ref, 'organization/club/modify', this.club, toUrl);

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
