<template>
<div class="rightBg">

  <el-dialog title="添加分类" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="beforeCloseHandler" width="55%">
    <!--<el-col :span="22" style="color:red;padding-bottom:20px;">-->
    <!--分类添加后将无法删除,请谨慎操作-->
    <!--</el-col>-->
    <div>
      <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

        <el-form-item label="上级分类" v-if=" tableData.length">
          <el-col :span="22">
            <el-cascader   :props="props"  style="width:100%" class="selectWidth" expand-trigger="click" v-model="classifys" clearable :options="classifies" :change-on-select="true" @change="beforeCloseHandlers"></el-cascader>
          </el-col>
        </el-form-item>
        <el-form-item label="分类名称" prop="classifyName" placeholder="请输入">
          <el-col :span="22">
            <el-input maxLength="30" v-model.trim="ruleForm.classifyName"></el-input>
          </el-col>
        </el-form-item>
        <div class="limitContent" v-if="classifys.length<=0" >

          <el-form-item label="限制院系" >
            <el-col :span="22">
              <el-select v-model="collegeIds" placeholder="请选择" multiple clearable style="width: 100%">
                <el-option
                  v-for="item in colleges"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="限制年级" >
            <el-col :span="22">
              <el-select v-model="gradeIds" placeholder="请选择" multiple clearable style="width: 100%">
                <el-option
                  v-for="item in grades"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="限制年制"  >
            <el-col :span="22">
              <el-select v-model="yearIds" placeholder="请选择" style="width: 100%" multiple clearable >
                <el-option
                  v-for="item in years"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item :label=" '在校最低' + hoursUnit">
            <el-col :span="22">
              <el-input type="number" min='0' v-model="ruleForm.schoolLow" placeholder="请输入"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item  :label=" '在校最高' + hoursUnit" >
            <el-col :span="22">
              <el-input type="number"  min='0'  v-model="ruleForm.schoolHigh" placeholder="请输入"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label="'每学期最低' + hoursUnit" >
            <el-col :span="22">
              <el-input type="number" min='0' v-model="ruleForm.semesterLow" placeholder="请输入"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label="'每学期最高' + hoursUnit" >
            <el-col :span="22">
              <el-input type="number" min='0' v-model="ruleForm.semesterHigh" placeholder="请输入"></el-input>
            </el-col>
          </el-form-item>

        </div>


        <el-form-item>
          <el-button type="increase" @click="submitForm('ruleForm',1)">添加</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>

    </div>
  </el-dialog>
  <el-dialog title="编辑分类" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="beforeCloseHandler" width="55%">
    <div>
      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">

          <el-form-item label="分类名称" prop="classifyName" placeholder="请输入">
            <el-col :span="22">
              <el-input maxLength="30" v-model.trim="ruleForm.classifyName"></el-input>
            </el-col>
          </el-form-item>
          <div class="limitContent" v-if="isInput==true" >

            <el-form-item label="限制院系" >
              <el-col :span="22">
                <el-select v-model="collegeIds" placeholder="请选择" multiple clearable style="width: 100%">
                  <el-option
                    v-for="item in colleges"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="限制年级" >
              <el-col :span="22">
                <el-select v-model="gradeIds" placeholder="请选择" multiple clearable style="width: 100%">
                  <el-option
                    v-for="item in grades"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="限制年制"  >
              <el-col :span="22">
                <el-select v-model="yearIds" placeholder="请选择" style="width: 100%" multiple clearable >
                  <el-option
                    v-for="item in years"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>

            <el-form-item :label=" '在校最低' + hoursUnit">
              <el-col :span="22">
                <el-input type="number" min='0' v-model="ruleForm.schoolLow" placeholder="请输入"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item  :label=" '在校最高' + hoursUnit" >
              <el-col :span="22">
                <el-input type="number"  min='0'  v-model="ruleForm.schoolHigh" placeholder="请输入"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label="'每学期最低' + hoursUnit" >
              <el-col :span="22">
                <el-input type="number" min='0' v-model="ruleForm.semesterLow" placeholder="请输入"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item :label="'每学期最高' + hoursUnit" >
              <el-col :span="22">
                <el-input type="number" min='0' v-model="ruleForm.semesterHigh" placeholder="请输入"></el-input>
              </el-col>
            </el-form-item>

          </div>


          <el-form-item>
            <el-button type="increase" @click="submitForm('ruleForm',2)">编辑</el-button>

          </el-form-item>
        </el-form>

      </div>
    </div>
  </el-dialog>


  <div class="page-head" style="margin:15px auto;padding-top:20px;width:98%;">
    <span class="page-title" >分类(最多支持4级分类)</span>
    <span class="page-tool" style="float:right;" @click="dialogVisible=true">
          <el-button  type="increase" size="mini" ><i class="fa fa-plus"></i> 添加分类</el-button>
        </span>
  </div>
    <div  class="orgTable1" v-for="(item,index) in tableData" style="overflow:hidden;margin-top:20px;">
        <ul class="firstUl">
            <li class="oWidth1" @click="toggleTree(index)">
              <i v-if="item.children && item.children.length" :class="[curIndex==index?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
              <div class="namePadding">{{item.name}}</div>
            </li>
          <li class="width70">
            <ul style="margin-bottom: 10px; clear: both; overflow: hidden">
              <li class="oWisthRight" @click="toggleTree(index)">
              <ul >

                  <li class="oWidth2" @click="toggleTree(index)">
                     <div class="oWidth-padding"><b>{{item.typeList.minHours | formatHours}}</b></div>
                     <div>在校最低{{hoursUnit}}</div>
                  </li>
                <li class="oWidth2" @click="toggleTree(index)">
                  <div class="oWidth-padding"><b>{{item.typeList.maxHours | formatHours}}</b></div>
                  <div>在校最高{{hoursUnit}}</div>
                </li>
                  <li class="oWidth3" @click="toggleTree(index)">
                      <div class="oWidth-padding"><b>{{item.typeList.termMinHours | formatHours}}</b></div>
                      <div>每学期最低{{hoursUnit}}</div>
                  </li>
                  <li class="oWidth4" @click="toggleTree(index)">
                    <div class="oWidth-padding"><b>{{item.typeList.termMaxHours | formatHours}}</b></div>
                    <div>每学期最高{{hoursUnit}}</div>
                  </li>
              </ul>
              </li>
              <li class="oWidth5" >
                <div class="btnPadding" >
                  <el-button  size="mini" @click="modify(item,1)" type="text" v-perms="'/system/classify/edit'">编辑</el-button>
                   <el-button  style="margin-left: 0"  v-if="!item.children " size="mini" type="text"  @click="delfl(item.id)" >删除</el-button>
                  <p >
                    <i :class="[showr===index?'el-icon-caret-bottom':'el-icon-caret-right']" @click="showTag(index)" style="cursor: pointer" v-if="item.limit"></i>
                  </p>

                </div>
              </li>
            </ul>

          </li>
        </ul>
      <div v-if="item.limit&&showr=== index" style="margin-left: 10px">
        <p style="margin-top: 10px">适用年级: <span v-if="item.limit.gradeName">{{item.limit.gradeName}}</span></p>
        <p style="margin-top: 10px">适用院系: <span v-if="item.limit.collegeName">{{item.limit.collegeName}}</span></p>
        <p style="margin-top: 10px">适用年制: <span v-if="item.limit.yearName">{{item.limit.yearName}}</span></p>
      </div>
        <div class="orgTable2" :class="[curIndex==index?'cur':'']" v-for="(item2,index2) in item.children">
            <ul>
                <li class="oWidth1 oWidth1-2"  @click="toggleTree2(index2)">
                    <i :class="[curIndex2==index2?'el-icon-caret-bottom':'el-icon-caret-right']" v-if="item2.children && item2.children.length"></i>
                    <div class="namePadding">{{item2.name}}</div>
                </li>
              <li class="width70">
                <ul style="margin-bottom: 10px; clear: both; overflow: hidden">
                  <li class="oWidth6" @click="toggleTree2(index2)" style="width:95%">
                    <div class="namePadding" style="font-weight: normal;">{{item2.limitType | formatLimitType}}</div>
                  </li>
                  <li class="oWidth5">
                    <div class="btnPadding">
                      <el-button size="mini" @click="modify(item2,2)" type="text" v-perms="'/system/classify/edit'">编辑</el-button>
                      <el-button  style="margin-left: 0"  v-if="!item2.children " size="mini" type="text"  @click="delfl(item2.id)">删除</el-button>
                    </div>
                  </li>
                </ul>

              </li>
            </ul>
            <div class="orgTable3" v-for="(item3,index3) in item2.children" :class="[curIndex2==index2?'cur2':'']">
                <ul>
                    <li @click="toggleTree3(index3)" class="oWidth1 oWidth1-3"  >
                       <i :class="[curIndex3==index3?'el-icon-caret-bottom':'el-icon-caret-right']" v-if="item3.children && item3.children.length"></i>
                       <div class="namePadding">{{item3.name}}</div>
                    </li>
                  <li class="width70">
                    <ul style="margin-bottom: 10px; clear: both; overflow: hidden">
                      <li class="oWidth6" @click="toggleTree3(index3)" style="width:95%">
                        <div class="namePadding" style="font-weight: normal;">{{item3.limitType | formatLimitType}}</div>
                      </li>
                        <li class="oWidth5">
                          <div class="btnPadding">
                            <el-button size="mini" @click="modify(item3,3)" type="text" v-perms="'/system/classify/edit'">编辑</el-button>
                            <el-button  style="margin-left: 0"  v-if="!item3.children " size="mini" type="text" @click="delfl(item3.id)" >删除</el-button>
                          </div>
                        </li>
                    </ul>

                  </li>
                </ul>
                <div class="orgTable4" v-for="item4 in item3.children" :class="[curIndex3==index3?'cur3':'']">
                    <ul>
                        <li class="oWidth1 oWidth1-4"  >
                           <div class="namePadding">{{item4.name}}</div>
                        </li>
                      <li class="width70">
                        <ul style="margin-bottom: 10px; clear: both; overflow: hidden">
                          <li class="oWidth6" style="width:95%">
                            <div class="namePadding" style="font-weight: normal;">{{item4.limitType | formatLimitType}}</div>
                          </li>
                            <li class="oWidth5">
                              <div class="btnPadding">
                                <el-button size="mini" @click="modify(item4,4)" type="text" v-perms="'/system/classify/edit'">编辑</el-button>
                                <el-button  style="margin-left: 0"  v-if="!item4.children " size="mini" type="text" @click="delfl(item4.id)" >删除</el-button>
                              </div>
                            </li>
                        </ul>

                      </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  </div>


</template>
<script>
import {
    activyCascade,
  cascade5,
    getNode2,
    cascade
} from '@/utils/filters'
export default {
    data() {
        return {
          collegeIds:[],
          gradeIds:[],
          yearIds:[],
          colleges:[],
          grades:[],
          years:[],
          showr:false,
          hoursUnit:localStorage.getItem("hoursUnit"),
          loading:true,
          tagIds:'1',
          isPaddingTop:false,//有选修与必修时，编辑按钮样式改变
          schoolName:localStorage.getItem("schoolName"),
          compulsoryName:localStorage.getItem("compulsoryName"), //必修显示名称
          electiveName:localStorage.getItem("electiveName"),  //选修显示名称
          editDialogVisible:false,//是否显示编辑弹窗
          isInput:true,  //是否显示分数字段
          IsSelect:false, //上级分类是否可选择
          showNewType:false, //是否显示新增按钮
          showLimitEle:false, //是否显示选修字段
          showLimitComp:false,
          curIndexTag:0,
          props:{
             value: 'id',
             label: 'name',
             children: 'children'
          },
          classifies:[],
          classifies2:[],
          tags: [],
          dialogVisible: false, //是否显示添加分类弹窗
          dialogVisibleType:false,  //是否显示必修选修编辑弹窗
          options: [],
          limitName:'',
          classTypeForm:{
            limitType:'',
            limitName:''
          },
          limitTypes:[],
          limitTypes1:[],
          classifys:[],
          ruleForm: {
            classifyId: '',
            classifyName: '',
            parentId: '',
            semesterLow:'',
            semesterHigh:'',
            schoolLow:'',
            schoolHigh:'',
            collegeId:'',
            gradeId:'',
            yearId:'',
            },
          editForm:{
            classifyId: null,
            classifyName: '',
            parentId:'',
            limitType:'',
            typeList:[{
              limitType:'',
              minHours:'',
              maxHours:'',
              termMinHours:'',
              termMaxHours:''
            }]
          },
          parentName:'',
          editLimitType:'',
          editLimitType1:'',
          editLimitType2:'',
          limitLength:0,
            rules: {
              classifyName: [{required: true,message: '请输入分类名称',trigger: 'blur' }],
            },
            tableData: [],
            curIndex: -1,
            curIndex2: -1,
            curIndex3: -1,
          classifyLength:0,
          isOpenAbility:"", //是否开启核心素养
        }
    },
    created() {
      // this.limitTypes=[
      //   {
      //     value: 0,
      //     label: '无'
      //   }, {
      //     value: 1,
      //     label: this.compulsoryName
      //   }, {
      //     value: 2,
      //     label: this.electiveName
      //   }
      // ],
      //   this.limitTypes1=[{
      //     value: 1,
      //     label: this.compulsoryName
      //   }, {
      //     value: 2,
      //     label: this.electiveName
      //   }]
        this.getData();
      this.getClass()
      this.getyx()
      this.getyear()
        // this.getClasses();
        // this.getIsOpenAbility()
    },
    methods: {
      // //获取核心素养是否开启
      // getIsOpenAbility(){
      //   this.$http.get("/isOpenAbility").then(res => {
      //     this.isOpenAbility=res.data.isOpenAbility;
      //   })
      // },

      delfl(id) {

        this.$confirm("是否确定删除该级分类?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

          this.$http.post("/qu-activity-classify/del", {
            classifyId: id
          }).then((res) => {

            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.beforeCloseHandler()
              this.getData();

            }

          });

        }).catch(() => {

        });

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
      getClass() {
        this.$http.get("/school/grade/partake/list").then(res => {
          this.grades = res.data
        })
      },
      getyear() {
        this.$http.get("/school/year/partake/list").then(res => {
          this.years = res.data
        })
      },
      showTag(i){
      let self=this
        if (self.showr === i) {
          self.showr = -1;
        } else {
          self.showr = i;
        }


      },

       //获取列表

        changCur(index){
            this.tagIds = index+1;
            this.curIndexTag = index;
            this.getData()
        },
        beforeCloseHandler() {
            this.dialogVisible = false;
            this.editDialogVisible = false;
         this. ruleForm= {
            classifyId: '',
              classifyName: '',
              parentId: '',
              semesterLow:'',
              semesterHigh:'',
              schoolLow:'',
              schoolHigh:'',
              collegeId:'',
              gradeId:'',
              yearId:'',
          },
          this.classifys=[],
          this.collegeIds=[],
          this.gradeIds=[],
          this.yearIds=[],
          this.classifyLength=0

        },
        beforeCloseHandlers() {

         this. ruleForm= {
            classifyId: '',
              classifyName: '',
              parentId: '',
              semesterLow:'',
              semesterHigh:'',
              schoolLow:'',
              schoolHigh:'',
              collegeId:'',
              gradeId:'',
              yearId:'',
          },
          this.collegeIds=[],
          this.gradeIds=[],
          this.yearIds=[],
          this.classifyLength=0

        },
        getData() {
            this.loading = true;
            this.$http.get('/system/classifys').then(res => {
                this.tableData = cascade5('0', res.data);
                console.log(this.tableData)
              this.classifies =  cascade5('0', res.data);

                this.loading = false;
            })
        },
        toggleTree(index) {
            if (this.curIndex == index) {
                this.curIndex = -1;
            } else {
                this.curIndex = index;
            }
        },
        toggleTree2(index) {
            if (this.curIndex2 == index) {
                this.curIndex2 = -1;
            } else {
                this.curIndex2 = index;
            }
        },
        toggleTree3(index) {
        console.log(this.curIndex3)
        // console.log(index)
            if (this.curIndex3 == index) {
                this.curIndex3 = -1;
            } else {
                this.curIndex3 = index;
            }
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        //添加分类
        getCascaderObj(val,opt) {
          return val.map(function (value) {
            for (var itm of opt) {
              if (itm.id == value) {
                opt = itm.children; return itm; }
            }
            return null;
          });
        },

        removeLimit() {
          this.showNewType=false;
          this.showDeleteType=false;
          this.ruleForm.typeList.splice(1, 1)
        },
        addLimit(){
          this.ruleForm.typeList.push({
            limitType:'',
            minHours:'',
            maxHours:'',
            termMinHours:'',
            termMaxHours:''
          });
          this.showNewType=true;
        },
        getLimitTypes(value){
          if(this.classifyLength!=0||value==0){
              this.showNewType=true;
            this.ruleForm.typeList.splice(1, 1)
          }else{
             this.showNewType=false;
         }
        },
        getLimitTypesChange(value){
          var firstType=this.ruleForm.typeList[0].limitType;
          if(value==firstType){
            this.$message({
              type:"error",
              message:'不能同时存在两个相同的限定类型'
            })
          }
        },
        add() {
          this.IsSelect = false;
          this.dialogVisible = true;
        },
        submitForm(formName,type) {
        if (type==1){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.classifys.length>=4){
                this.$message({
                  type: 'error',
                  message: '上级分类最多选3级!'
                });
                return
              }
              if (this.classifys.length <= 0) {
                this.ruleForm.parentId = 0
              }else {
                this.ruleForm.parentId= this.classifys.pop()
              }
              this.ruleForm.collegeId=this.collegeIds.toString()
              this.ruleForm.gradeId=this.gradeIds.toString()
              this.ruleForm.yearId=this.yearIds.toString()
              this.$http.post('/qu-activity-classify/add', this.ruleForm).then(res => {
                if (res.code == '200') {
                  this.$refs['ruleForm'].resetFields();
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.beforeCloseHandler()
                  this.getData();
                }
              })

            }
          });
        } ;
        if (type==2){
          this.$refs[formName].validate((valid) => {
            if (valid) {

              this.$confirm('请注意：若修改了分类的在校最高分或学期最高分，则会触发全体学生的学分重新计算，这个过程大概需要1-2小时，在此期间涉及到学分查询与导出的所有功能均不可用，确定要修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.ruleForm.collegeId=this.collegeIds.toString()
                this.ruleForm.gradeId=this.gradeIds.toString()
                this.ruleForm.yearId=this.yearIds.toString()
                this.$http.post('/qu-activity-classify/edit', this.ruleForm).then(res => {
                  if (res.code == '200') {
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.beforeCloseHandler()
                    this.getData();
                  }
                })
              }).catch( () => {

              })

            }
          });
        } ;

        },
        //编辑分类
        beforeCloseEdit(){
          this.editDialogVisible = false;

          this.editForm = {
            classifyId: null,
            classifyName: '',
            parentId: '',
            limitType:'',
            typeList:[{
              limitType:'',
              minHours:'',
              maxHours:'',
              termMinHours:'',
              termMaxHours:''
            }]
          }
          setTimeout(()=>{this.Isput = false},1000)
        },
        removeEditLimit() {
          this.showNewType=false;
          this.editForm.typeList.splice(1, 1)
        },
        editLimit(){
          this.editForm.typeList.push({
            limitType:'',
            minHours:'',
            maxHours:'',
            termMinHours:'',
            termMaxHours:''
          });
          this.showNewType=true;
        },
        modify(row,type) {
          this.editDialogVisible = true;
          //判断是否为一级
          if(type==1){
            this.isInput=true
            if (row) {
              this.ruleForm.classifyName=row.name
              this.ruleForm.classifyId=row.id
              this.ruleForm.semesterLow=row.typeList.termMinHours
              this.ruleForm.semesterHigh=row.typeList.termMaxHours
              this.ruleForm.schoolLow=row.typeList.minHours
              this.ruleForm.schoolHigh=row.typeList.maxHours
              if(row.limit){
              if(row.limit.collegeId){
                var arr=row.limit.collegeId.split(",")
                for (let i = 0; i < arr.length; i++) {
                  this.collegeIds.push(parseInt(arr[i]))
                }
              }
                if(row.limit.gradeId){
                  var arr=row.limit.gradeId.split(",")
                  for (let i = 0; i < arr.length; i++) {
                    this.gradeIds.push(parseInt(arr[i]))
                  }


                }
                if(row.limit.yearId){
                  var arr=row.limit.yearId.split(",")
                  for (let i = 0; i < arr.length; i++) {
                    this.yearIds.push(parseInt(arr[i]))
                  }
                }
              }
              // collegeIds:[],
              //   gradeIds:[],
              //   yearIds:[],

            }
          }else{
            this.isInput=false;
            if (row) {
              this.ruleForm.classifyName=row.name
              this.ruleForm.classifyId=row.id
            }
          }

        },

    },
    filters:{
      formatHours(val){
        if(val==null || val==''){
          val=0
        }
        return val;
      },
      formatLimitType(limitType) {
        if(limitType==0){
          limitType='无'
        }else if(limitType==1){
          limitType=localStorage.getItem("compulsoryName")
        }else if(limitType==2){
          limitType=localStorage.getItem("electiveName");
        }
        return limitType;
      }
  }
}
</script>
<style scoped="scoped">
  .paddingTop30{
    padding-top: 53px !important;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .type-set {
    display: flex;
  }
  .type-set .right{
    flex: 1;
  }
  .type-set button{
    margin-left: 15px;
  }
  .required-class {
    margin-left: 30px;
    margin-bottom: 5px;
  }
.orgTable1 .fa{color:#999}
.orgTable1 {
    width: 98%;
    overflow: hidden;
    margin: 0 auto;
    border: 1px solid #EBEEF5;
}
.firstUl{
  clear: both;
  border-bottom: 1px solid #e4e6e8;
  overflow: hidden;
  padding-bottom: 10px;
}
.orgTable1 li {

     line-height:22px;
    float: left;
    display: inline;
}

.orgTable1:hover {
    background: #ECF5FF
}

.orgTable2 {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;

    display: none;
    border-bottom: 1px solid #EBEEF5;
  clear: both;
}
  .orgTable2 ul,.orgTable3 ul,.orgTable4 ul{
    clear: both;
    overflow: hidden;
    margin-bottom: 10px;
  }

.orgTable2 li {
    float: left;
    display: inline;
}

.orgTable3 {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    background: #F5F7FA;
    display: none;
}

.orgTable3 li {
    float: left;
    display: inline;
}

.orgTable4 {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    background: #F5F7FA;
    display:none;
}

.orgTable4 li {
    float: left;
    display: inline;
}

.orgTable-title {
    width: 98%;
    overflow: hidden;
    margin: 0 auto;
    background: #F5F7FA;
    font-weight: bold;
    padding: 10px 0;
}

.orgTable-title li {
    float: left;
    display: inline;
    color: #666
}

.oWidth1 {
    width: 30%;
    padding-left:10px;
    position: relative;
}

  .oWisthRight{
   width: 95%;
  }
  .oWisthRight ul{
    clear: both;
    overflow: hidden;
  }

.oWidth2 {
    width: 20%;
    text-align:center;
    color:#666;
}

.oWidth3 {
    width: 25%;
    text-align:center;
    color:#666;
}

.oWidth4 {
    width: 25%;
    text-align:center;
    color:#666;
}

.oWidth5 {
    width: 5%;
    text-align:center;
}
.oWidth6{
  width: 10%;
}

.oWidth1-2 {
    padding-left:40px;
}

.oWidth1-3 {
    padding-left: 60px;
}

.oWidth1-4 {
  padding-left: 100px;
}

.oWidth1 .fa {
    float: left;
    position: absolute;
    left: -15px;
    top: 25px;
    font-size: 18px;
}

.orgTable1 .cur {
    display: block;
}

.orgTable2 .cur2 {
    display: block;
}

.orgTable3 .cur3 {
    display: block;
}
.orgTable1 b{font-size:18px;color:#666}
.oWidth-padding{padding-top:10px;}
.namePadding{padding-top:23px;display:inline-block;font-size:14px;font-weight:bold;color:#666;}
.btnPadding{padding-top:23px;}
.btnPadding .btnPadding-delete{color:red}
.index-chart-change{width:98%;border-bottom:1px solid #F6F6FC;overflow:hidden;margin:0px auto;padding-top:20px;font-size:15px;}
.index-chart-change li{float:left;margin-right:20px;height:30px;
color:#666;cursor:pointer;padding-left:20px;padding-right:20px;}
.index-chart-change .cur{border-bottom:2px solid #008AFF;color:#008AFF}
.index-chart-change .cur span{color:#008AFF}
.index-chart-change li span{color:#666;font-size:13px;}
  .width70{width: 70%;}
  .coreContent{
    clear: both;
    overflow: hidden;
  }
  .coreTitle{
    float: left;
    width: 20%;

    font-size: 14px;
    color: #666;
  }
  .coreBtn{
    float: left;
    width: 17%;
  }
  .coreTable{
    float: left;
    border-collapse:collapse;
    border-spacing:0;
  }
  .coreTable td{
    border: 1px solid #dad7d7;
    text-align: center;
    padding: 5px 0px;
  }
</style>
