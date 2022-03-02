<template>
  <section>
    <back></back>
    <div class="main-header">
      <span class="main-title">{{title}}</span>
    </div>
    <div class="main-body">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form ref="form" size="mini" :model="club" :rules="formRules" label-width="100px" label-position="left">
          <el-form-item label="logo">
            <upload type="4" :image='club.avatar' upload="/upload/image" @uploadSuccessed="uploadSuccessed2">

            </upload>
          </el-form-item>
          <el-form-item label="组织名称" prop="name">
            <el-col :span="12">
              <el-input :disabled="disabled" style="width:100%;" placeholder="请输入组织名称" v-model="club.name"
                        maxlength='30'></el-input>
            </el-col>
          </el-form-item>


          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="12">
              <el-select :disabled="disabled" clearable style="width:100%" v-model="club.campusId"

                         placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系">
            <el-col :span="12">
              <el-select :disabled="disabled" style="width: 100%" clearable v-model="club.collegeId"
                         @change="changeCollege"
                         placeholder="请选择院系">
                <el-option v-for="item in colleages" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业">
            <el-col :span="12">
              <el-select :disabled="disabled" style="width: 100%" clearable v-model="club.majorId" placeholder="请选择专业"
                        >
                <el-option v-for="item in majores" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属年级">
            <el-col :span="12">
              <el-select :disabled="disabled" style="width: 100%" clearable v-model="club.grade" placeholder="请选择年级">
                <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="所属班级">
            <el-col :span="12">
              <el-select :disabled="disabled" style="width: 100%" clearable v-model="club.class" placeholder="请选择班级"
                        >
                <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="上级机构" prop="parentId">
            <el-col :span="12">
              <el-select style="width: 100%" clearable v-model="club.parentId" placeholder="请选择上级机构"
                         @change="changeClasses">
                <el-option v-for="item in parentDepartmentIds2" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!--<el-cascader style="width: 100%" placeholder="请选择上级机构" :props="defaultProps" class="selectWidth"
                           expand-trigger="click"
                           v-model="club.parentId" clearable :options="parentDepartmentIds"
                           :change-on-select="true" :show-all-levels="true"></el-cascader>-->
            </el-col>
          </el-form-item>
          <el-form-item label="负责人" prop="orgAuditor">
            <el-col :span="12">
              <el-select clearable
                         style="width:100%"
                         v-model="club.orgAuditor"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请选择负责人"
                         :remote-method="remoteMethodbj"
                         @click="cler"
                          @change="changeChair">
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="辅导员" prop="coach">
            <el-col :span="12">
              <el-select :disabled="disabled" clearable
                         style="width:100%"
                         v-model="club.coach"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请选择辅导员"
              >
                <el-option
                  v-for="item in options5"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="组织简介" prop="introduce">
            <el-col :span="12">
              <el-input style="width:100%;" placeholder="请输入简介(200字以内)" maxlength='200' type="textarea"
                        v-model="club.introduce"></el-input>
            </el-col>
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
            <el-button v-if="this.id != 0" type="primary" @click="onSubmit(false, 'form')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </section>
</template>

<script>
  import {getOssToken, getAliyunImageUrl, cascade3} from "@/utils/filters"
  import {
    levels, rules
  } from '@/dict'
  import {cascade, getNode2,uploadOSS} from '@/utils/filters'
  import listMixins from '@/mixins/form';
  import va from '@/rules'

  export default {
    mixins: [listMixins],
    data() {
      let required = va.required('此项必填');
      return {
        detail: {},
        disabled: false,
        schools: [],
        colleages: [],
        majores: [],
        gradees: [],
        classes2: [],
        placeholder: '',
        IsShowchairman: true,
        title: this.$route.query.nature == 7 ? "党组织" : "班团组织",
        coach: '',
        campuses: [],
        chairmanes: [],
        collegeList: [],
        classifies: [],
        parentDepartmentIds: [],
        parentDepartmentIds2: [],
        defaultProps: {
          children: 'children',
          value: 'id',
          label: 'name'
        },
        danmiens: '',
        miensshuzu: [],
        sujuhuixian: [],
        boolloading: false,
        dialogVisible: false,
        loading:true,
        rules: rules,
        club: {
          avatar: '',
          name: '',
          remark: '',
          campusId: '',
          collegeId: '',
          majorId: '',
          class: '',
          grade: '',
          introduce: '',
          classifys: [],
          parentDepartmentId: '',
          parentId: '',
          orgAuditor: '',
          miens: '',
          id:this.$route.query.id
        },
        Temclassifies: [],
        options4: [],
        options5: [],
        levels: [
          {label: '校级', value: 6},
          {label: '院系级', value: 8},
          {label: '班级', value: 10},
        ],
        collegeId: [required],
        campusId: [required],
        formRules: {//校验规则
          avatar: [required],
          parentId: [required],
          name: [required],
          campus: [required],
          college: [required],
          orgAuditor: [required],
          desc: [required],
          introduce: [required],

        },
        student: [{id: 1, name: 'a', code: 1001}, {id: 2, name: 'b', code: 1002}]
      }
    },
    created() {
      getOssToken()

      this.getDataInfo(this.$route.query.id);

    },
    mounted() {
      const that = this;
      that.disable()
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
        let url = uploadOSS(file, "2room", 'organization' + "/", 0).then(res => {
          this.uploadSuccessed(res)
        })
      },
      disable() {
        const that = this;
        if (that.$route.query.id != 0) {//修改时禁用某些不可改字段
          that.disabled = true;
        }
      },
      changeClasses(value) {

        this.club.classId = value
      },
      getGradees() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.gradees = res.data
        })
      },

      changeCollege(value) {
        this.$http.get('/school/major/list', {params: {collegeId: value}}).then(res => {
          this.majores = res.data
          if (this.$route.query.id == 0) {
            this.club.majorId = ""
            this.club.class = ""
          }
        })
      },
      changeSchool(value) {
        this.$http.get('/school/college/list', {params: {campusId: value}}).then(res => {
          this.colleages = res.data
          if (this.$route.query.id == 0) {
            this.club.collegeId = ""
            this.club.majorId = ""
            this.club.class = ""
          }
        })
      },
      changeChair(val) {

        this.club.orgAuditor = val
      },
      getParent() {
        this.$http.get("/organization/administration/list", {
          params: {
            keyWord: this.keyWord
          }
        }).then(res => {
          //this.parentDepartmentIds = cascade3(0, res.data)
          this.parentDepartmentIds2 = res.data
        })
      },
      cler(){
        this.club.orgAuditor=''
        this.options4=[]
      },
      //远程搜索
      remoteMethodbj(query) {

        if (query !== '') {


          this.$http.get("/school/students/OrgStudent", {
            params: {
              orgId:this.club.orgId,
              key: query
            }
          }).then(res => {
            this.options4 = res.data
          })

        } else {
          this.options4 = [];
        }
      },



      //选择级别
      changeLevel(value) {
        // if(value == 8){
        // 	this.formRules.campus = this.campus
        // }else{
        //   this.formRules.campus = ''
        // }
      },
      //选择校区
      changeCampus(value) {
        this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
          this.collegeList = res.data
          this.club.college = ""
        })
      },
      getDataInfo(id) {
        const that = this;
        if (id == 0) {
          that.loading = false;
          return;
        }

        that.$http.get('/organization/party/detail', {
          params: {
            id: id,
          }
        }).then(res => {
          that.loading = true;
          that.club.name = res.data.name
          that.club.introduce = res.data.introduce


          if (res.data.mienAttach==1) {
            this.sujuhuixian = res.data.miens;
            for (let i = 0; i < res.data.miens.length; i++) {
              let imghuiurl = res.data.miens[i].url
              this.miensshuzu.push(imghuiurl)
            }
          }
          /*加载下拉*/
          that.club.orgId = res.data.id;
          that.club.avatar = res.data.logo;
          let obj={
            id:res.data.coachId,
            name:res.data.coachName
          }

          this.options5.push(obj)
          this.club.coach=res.data.coachId
          let obj2={
            id:res.data.majorId,
            name:res.data.majorName
          }
          this.majores.push(obj2)
          this.club.majorId=res.data.majorId
          let obj3={
            id:res.data.campusId,
            name:res.data.campusName
          }
          this.schools.push(obj3)
          this.club.campusId =res.data.campusId
          let obj4={
            id:res.data.collegeId,
            name:res.data.collegeName
          }
          this.colleages.push(obj4)
          this.club.collegeId =res.data.collegeId
          let obj5={
            id:res.data.class,
            name:res.data.className
          }
          this.classes2.push(obj5)
          this.club.class =res.data.class
          // if(res.data.parentId){
          //   let obj6={
          //     id:res.data.parentId,
          //     name:res.data.parentName
          //   }
          //   this.parentDepartmentIds2.push(obj6)
          //
          // }

          if(res.data.auditorId){
            let obj7={
              id:res.data.auditorId,
              name:res.data.auditorName
            }
            this.options4.push(obj7)
            this.club.orgAuditor =res.data.auditorId
          }
          let obj8={
            id:res.data.gradeId,
            name:res.data.grade
          }
          this.gradees.push(obj8)
          this.club.grade =res.data.gradeId
          this.getParent()
          this.club.parentId =res.data.parentId
        }).catch(err => {
          that.loading = false;
        });
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data

        })
      },
      uploadSuccessed2(url) {
        const that = this
        that.$set(that.club, 'avatar', url)
      },
      uploadSuccessed(url) {
        this.miensshuzu.push(url)
      },
      onSubmit(state, ref) {
        this.club.miens = this.miensshuzu.toString()
        this.updateDataInfo(state, ref, 'organization/party/modify', this.club,  "/organization/group");
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
