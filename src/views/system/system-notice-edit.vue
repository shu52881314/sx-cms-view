<template>
  <div>
    <back></back>
    <div class="main-header" style="margin-bottom: 20px; border-bottom: none;">
    </div>
    <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" >
            <el-form-item label="标题" prop="title">
                <el-col :span="16">
                    <el-input type="text"  v-model="ruleForm.title" maxlength="30"></el-input>
                </el-col>
           </el-form-item>
            <el-form-item label="内容" >
              <editor-bar  :content="contents" :changeContent="changeInfo" ></editor-bar>
            </el-form-item>

      <el-form-item label="公告开始时间" prop="startTime2">
        <el-col :span="16">
          <el-date-picker
            style="width:500px"
            v-model="ruleForm.startTime2"
            :picker-options="startDatePicker"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
      </el-form-item>
            <el-form-item label="公告截止时间" prop="endTime2">
              <el-col :span="16">
                <el-date-picker
                  style="width:500px"
                  v-model="ruleForm.endTime2"
                  :picker-options="endDatePicker"
                  format="yyyy-MM-dd HH:mm"
                  default-time="23:59:59"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <div class="setSeeArea">
              设置公告可见范围 <span>若不设置，全校师生均可查看</span>
            </div>
            <el-form-item label="可见校区">
              <el-col :span="16">
                <el-select multiple @change="changeSchool" style="width:100%" v-model="campusArr" placeholder="请选择学校">
                  <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="可见院系">
              <el-col :span="16">
                <el-select multiple clearable style="width:100%" v-model="collegeArr" placeholder="请选择院系">
                  <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="可见年级">
              <el-col :span="16">
                <el-select multiple  clearable style="width:100%" v-model="gradeArr" placeholder="请选择年级">
                  <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="可见组织">
              <el-col :span="16">
                <el-select multiple  clearable style="width:100%" v-model="orgLimitArr" placeholder="请选择组织">
                  <el-option v-for="item in orgs" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-col>
            </el-form-item>
      <el-form-item label="参与性别：">

        <el-radio-group v-model="ruleForm.identityLimit">
          <el-radio label="0">不限</el-radio>
          <el-radio label="2">教师</el-radio>
          <el-radio label="1">学生</el-radio>
        </el-radio-group>

      </el-form-item>

      <el-form-item style="padding-bottom: 20px">
                <el-button  type="primary" :disabled="$store.state.sys.isClick" @click="submitForm('ruleForm')">{{btnTitle}}</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>

<script>
 import umditer from '../../components/UMeditor.vue';
 import EditorBar from '@/components/wangEditor'
 export default{
   components: {
       umditer,
       EditorBar
    },
    data(){
      return{
        model:{
          content:'',
        },
        rules: {
            title: [{
                required: true,
                message: '请输入标题',
                trigger: 'blur'
            }],

          startTime2:[{required: true,message: '请选择公告开始时间',trigger: 'change'}],
          endTime2:[{required: true,message: '请选择公告截止时间',trigger: 'change'}],

        },

        schools:[],
        colleges:[],
        campusArr:[],
        collegeArr:[],
        orgs:[],
        orgLimitArr:[],
        gradeArr:[],
        grades: [],
        ruleForm: {
          endTime2:'',
          startTime2:'',
          title: '',
            type:'',
            content:'',
            endTime:'',
            startTime:'',
            campusLimit: '',
            collegeLimit: '',
            gradeLimit: '',
          orgLimit:'',
          identityLimit:'0',
        },
        contents: "",
        activeName: 'second',
        showTime:true,//是否可以更改时间
        showSelectTime:false,
        btnTitle:'立即发布',
        startDatePicker:this.beginDate(),
        endDatePicker:this.beginDate(),
        neirong:false
      }
    },
    created(){
      this.getCampus();
      this.getClass()
      this.getyx()
      this.getzz()
      if(this.$route.query.id&&this.$route.query.id!=0){
        this.getDataInfo(this.$route.query.id)
      }
    },
    methods:{
      beginDate(){//提出开始时间必须大于等于今天
        let self = this
        return {
          disabledDate(time){
            return time.getTime() < new Date(new Date().getTime() - 86400000)
          }
        }
      },
     //获取详情
      getDataInfo(id){
        this.$http.get('/system/announcement/detail', {params: {
            id:id,
          }}).then(res => {
               if(res.code==200){
                 this.ruleForm.id =res.data.id;
                 this.ruleForm.title =res.data.title;
                 this.contents=res.data.content;
                 this.ruleForm.content=res.data.content;

                 if(res.data.identityLimit==null){
                   this.ruleForm.identityLimit ='0'
                 }else {
                   this.ruleForm.identityLimit =res.data.identityLimit+"";
                 }

                 this.ruleForm.startTime2=new Date(res.data.startTime)
                 this.ruleForm.endTime2=new Date(res.data.endTime)
                 if(res.data.campusLimit){
                   let  arr=res.data.campusLimit.split(",")
                   let arr2=[]
                   for (let i=0;i<arr.length;i++){
                     arr2.push(parseInt(arr[i]))
                   }
                   this.campusArr=arr2
                 }

                 if(res.data.collegeLimit){
                   let  arr=res.data.collegeLimit.split(",")
                   let arr2=[]
                   for (let i=0;i<arr.length;i++){
                     arr2.push(parseInt(arr[i]))
                   }
                   this.collegeArr=arr2
                 }
                 if(res.data.gradeLimit){
                   let  arr=res.data.gradeLimit.split(",")
                   let arr2=[]
                   for (let i=0;i<arr.length;i++){
                     arr2.push(parseInt(arr[i]))
                   }
                   this.gradeArr=arr2
                 }

                 if(res.data.orgLimit){
                   let  arr=res.data.orgLimit.split(",")
                   let arr2=[]
                   for (let i=0;i<arr.length;i++){
                     arr2.push(parseInt(arr[i]))
                   }
                   this.orgLimitArr=arr2
                 }

               }


        }).catch(err => {
        });
      },
      handleClick(tab) {
        if(tab=='second'){
          this.showSelectTime=true
          this.btnTitle='定时发布'
        }else{
          this.showSelectTime=false
          this.btnTitle='立即发布'
        }
          if(tab=='second'&&this.ruleForm.startTime2==''){
            this.$message({
              type: 'error',
              message: '请选择公告发布时间!'
            });
          }
      },
      changeInfo(data){
        this.contents=data;
        this.ruleForm.content = this.contents


      },
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {

            if (valid) {
                this.ruleForm.campusLimit = this.campusArr.join(",")
                this.ruleForm.collegeLimit = this.collegeArr.join(",")
                this.ruleForm.gradeLimit = this.gradeArr.join(",")
                this.ruleForm.orgLimit = this.orgLimitArr.join(",")
              if( this.ruleForm.title.length<2){
                this.$message({
                  type: 'error',
                  message: '标题最少两个字!'
                });
                return;
              }
              if( this.contents.length<9){
                this.$message({
                  type: 'error',
                  message: '公告内容最少两个字!'
                });
                return;
              }
              this.ruleForm.type=2
              if(this.ruleForm.startTime2==''){
                this.$message({
                  type: 'error',
                  message: '请选择公告发布时间!'
                });
                return;
              }
              if(this.ruleForm.endTime2==''){
                this.$message({
                  type: 'error',
                  message: '请选择公告截止时间!'
                });
                return;
              }
              if (this.ruleForm.startTime2) {
                if(this.ruleForm.startTime2.getTime()<=new Date().getTime()){
                  this.$message({
                    type: 'error',
                    message: '公告发布时间必须大于当前时间!'
                  });
                  return;
                }
                this.ruleForm.startTime  = this.ruleForm.startTime2.getTime()
              }
                if (this.ruleForm.endTime2) {
                  this.ruleForm.endTime  = this.ruleForm.endTime2.getTime()
                }
                if(this.ruleForm.startTime>=this.ruleForm.endTime){
                  this.$message({
                    type: 'error',
                    message: '公告发布时间必须小于公告截止时间!'
                  });
                  return;
                }

              // if (this.contents) {
              //   // console.log(this.contents)
              //   this.ruleForm.content  =''
              //     this.ruleForm.content  = this.contents
              // }
              // console.log( this.ruleForm.content )

              if(this.$route.query.id&&this.$route.query.id!=0) {
                this.ruleForm.id=this.$route.query.id
                this.$store.commit('setClick', true)
                this.$http.post('/system/announcement/edit', this.ruleForm).then(res => {
                  if (res.code == '200') {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.$router.push("/system/notice")
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    });
                  }
                })
              }else{
                this.$store.commit('setClick', true)
                this.$http.post('/system/announcement/add', this.ruleForm).then(res => {
                  if (res.code == '200') {
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    this.$router.push("/system/notice")
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    });
                  }
                })
              }
              } else {
                  return false;
              }
          });
      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          this.schools = res.data
        })
      },
      getyx() {
        this.$http.get('/school/college/list',{
          params: {
            campusId: ''
          }
        }).then(res => {
          this.colleges = res.data
        })
      },
      getzz() {
        this.$http.get('/school/org/partake/list',{

        }).then(res => {
          this.orgs = res.data
        })
      },
      changeSchool(value) {
          let value2=value.join(',');
          this.collegeArr=[]
        this.colleges =[]
          this.$http.get('/school/college/list', {
              params: {
                  campusId: value2
              }
          }).then(res => {
              this.colleges = res.data
          })
      },
      getClass() {
        this.$http.get("/school/grade/partake/list").then(res => {
          this.grades = res.data
        })
      },
      // setResume:function(input){
      //       var that = this;
      //       that.contents = input.content;
      //   }
    }
 }
</script>
<style>
  .el-form-item__content{
    z-index: 0;
  }
</style>
<style scoped>
  .setSeeArea{
    border-top:1px solid #e4e7ed;
    padding: 20px 0px 20px 20px;
    font-size:14px ;
  }
  .setSeeArea span{
    color: #888;
  }

</style>
