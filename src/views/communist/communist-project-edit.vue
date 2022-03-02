<template>
  <section>
    <back></back>
    <back v-if="this.$route.query.id!=-1" :page="$route.query.nature" goRouter="/communist/project"></back>
    <el-dialog title="选择审核人" :visible.sync="dialogVisibleActivity" :close-on-click-modal="false" width="700px">
      <div style="text-align:right;padding-top:20px;">
        <el-button type="primary" @click="onSubmit()" :disabled="$store.state.sys.isClick">确定</el-button>
        <el-button @click="dialogVisibleActivity = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="main-header">
      <span class="main-title">{{title}}</span>
    </div>
    <div class="main-body">
      <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <!-- <el-form-item label="选择标签" prop="tagId">
          <el-col :span="22" >
            <el-select :disabled="Isput" style="width:100%"  v-model="ruleForm.tagId" placeholder="请选择">
                <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-col>
        </el-form-item> -->
        <el-form-item label="项目名称" prop="name" style="margin-bottom:1.5rem">
          <el-col :span="12">
            <el-input v-model="ruleForm.name" maxlength='30'></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="项目分类" prop="activityClassifyId" style="margin-bottom:1.5rem">
          <el-col :span="12">
            <el-select v-model="ruleForm.activityClassifyId" clearable placeholder="请选择项目分类">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <!--<el-col :span="10" v-if="showLimit">
            <el-form-item label="限定类型">
              <el-select :disabled='selectAble' v-model="ruleForm.projectLimitType" placeholder="请选择">
                <el-option
                  v-for="item in limitTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-form-item>

        <div class="show-important" @click="changeSenior">&nbsp;<i class="el-icon-d-arrow-right"></i> &nbsp;高级选项<span>（点击高级选项可以对项目设置一些更加复杂的计算方式）</span>
        </div>
        <div class="important-detail" v-if="showImportant">
          <el-form-item :label="hoursUnit+'累加'" style="margin-bottom:1.5rem" label-width="130px">
            <el-col :span="22">
              <el-select v-model="ruleForm.scoreSummation" placeholder="请选择">
                <el-option
                  v-for="item in scoreSum"
                  :key="item.value"
                  :label="item.value"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="'最高'+hoursUnit+'获得上限'" prop="scoreMax" style="margin-bottom:1.5rem" label-width="130px">
            <el-col :span="11">
              <el-input @input="ruleForm.scoreMax = ruleForm.scoreMax.replace(/[^\d^\.]+/g,'')" v-model="ruleForm.scoreMax" type="text" maxlength="2"
                        placeholder="请输入最多2位正整数"></el-input>
              <span style="color: #ccc">不填则默认{{hoursUnit}}按其他规则运算，填写则学生该奖项的获得{{hoursUnit}}以该{{hoursUnit}}为上限</span>
            </el-col>
          </el-form-item>
          <el-form-item label="奖项有效期" style="margin-bottom:1.5rem" label-width="130px">
            <el-col :span="22">
              <el-select v-model="ruleForm.awardsValid">
                <el-option
                  v-for="item in terms"
                  :key="item.value"
                  :label="item.value"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item style="color:#999;margin-bottom:1.5rem" label="请添加奖项" label-width="100">

        </el-form-item>
        <el-form-item style="margin-bottom:0;background:#F2F2F2;padding-top:20px; padding-bottom: 20px;"
                      v-for="(item, index) in ruleForm.options"
                      :label="'奖项' + (index+1)"
                      :key="item.key"
                      required>
          <el-col :span="12">
            <el-form-item :prop="'options.' + index + '.name'"
                          :rules="{ required: true, message: '奖项不能为空', trigger: 'blur' }">
              <el-input placeholder="请填写奖项(100字以内)" maxlength='100' v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center;">-</el-col>
          <el-col :span="10">
            <el-form-item :prop="'options.' + index + '.hours'" :rules="{ validator: validCode,trigger: 'blur' }">
              <el-input :placeholder="'请填写' + hoursUnit" style="width:100px;" required v-model="item.hours"
                        maxlength='6'></el-input>
              <el-button style="margin-left:10px;" @click.prevent="removeDomain(index)">
                删除
              </el-button>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item style="margin-top:20px; margin-bottom: 10px;">
          <el-button size="medium" style="width:404px" class="blue-btn" @click="addDomain">新增奖项</el-button>
        </el-form-item>
        <el-form-item label="填写说明" prop="explain">
          <el-col :span="12">
            <el-input style="width:100%" :rows="3" maxlength="200" type="textarea" placeholder="移动端填写奖项的要求(200字以内)"
                      v-model="ruleForm.explain"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="审核人" style="padding-top:25px;">
           <el-col :span="22">
             <div class="templatePeople-line" style="width:90%;  overflow:hidden;">
               <auditor-list :tag="1" @deleteList="deleteAuditList" v-for="(item,index) in ruleForm.auditList"
                             :key="index" :list="ruleForm.auditList" :item="item" :index="index"></auditor-list>
               <div style="cursor:pointer;float:left;" v-if="showAddAuditor">
                 <img src="../../assets/images/add.png" @click="addAuditor()">
               </div>
             </div>
           </el-col>
         </el-form-item>-->
        <el-form-item style="padding-top: 1rem">
          <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
          <el-button v-if="!ruleForm.id" type="primary" @click="submitForm('ruleForm',2)">提交</el-button>
        </el-form-item>
      </el-form>

    </div>
  </section>
</template>
<script>

  import auditorList from "./commpents/auditor"
  import organizationTemplate from "./commpents/organazition"
  import {isFloat} from '@/utils/validate'
  import listMixins from '@/mixins/form'
  import {cascade} from '@/utils/filters'

  export default {
    mixins: [listMixins],
    components: {
      organizationTemplate,
      auditorList
    },
    data() {
      let that = this
      var validCode2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入' + that.hoursUnit))
        } else if (!isFloat(value)) {
          callback(new Error('请输入正确的' + that.hoursUnit))
        } else if (value < 0.01 || value > 999.99) {
          callback(new Error(that.hoursUnit + '必须大于0.01小于999.99'))
        } else {
          callback()
        }
      };
      let validUpperLimit = (rule, value, callback) => {
        if (!value) {
          callback()
        } else {
          callback()
        }
      }
      return {
        title: this.$route.query.id != -1 ? '编辑项目奖项' : '新增项目奖项',
        length: 0,
        showAddAuditor: true,
        selectAble: true,
        id: '',
        hoursUnit: localStorage.getItem("hoursUnit"),
        validCode: validCode2,
        Isput: false,
        tags: [],
        options: [],
        options2: [],
        ruleForm: {
          id: '',
          classId: '',
          name: '',
          parents: [],
          projectLimitType: '',
          activityClassifyId: '',
          // tagId: '',
          explain: '',
          options: [{
            name: '',
            hours: '',
            id: ''
          }],
          visualRange: 1,
          auditList: [],
          scoreSummation: 1,
          awardsValid: 3,
          scoreMax: ''
        },
        loading: false,
        dataInfo: {
          options: []
        },
        limitTypes: [],
        rules: {
          name: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
          parents: [{required: true, message: '请选择活动标分类', trigger: 'blur'}],
          explain: [{required: true, message: '请输入填写说明', trigger: 'blur'}],
          scoreMax: [{validator: validUpperLimit, trigger: 'blur'}],
          activityClassifyId: [{required: true, message: '请选择项目分类', trigger: 'blur'}]
        },
        dialogVisibleActivity: false,
        showLimit: true,
        scoreSum: [
          {value: '累加', label: 1}, {value: '不累加', label: 0}
        ],
        terms: [
          {value: '在校期', label: 3}, {value: '每学年', label: 2}, {value: '每学期', label: 1}
        ],
        showImportant: false
      }
    },

    created() {
      /*this.getTags();*/
      this.getClassify();
    },
    mounted() {
      this.id = this.$route.query.id;
      if (this.id && this.id != -1) {
        this.getDataInfo(this.id)
      }
    },
    methods: {
      checkUpper(str) {
        if (str + ''.match(/^[0-9]{1,2}$/)) {
          return true;
        } else {
          return false;
        }
      },
      //点击进行高级设置
      changeSenior() {
        this.showImportant = !this.showImportant;
      },
      //根据选择分类，显示限定类型
      changeCascader(value) {
        var categoryId = value[value.length - 1];
        if (categoryId != null) {
          this.getLimitType(categoryId);
        }
      },
      getLimitType(id) {
        this.$http.get('/qu-activity-classify/info', {params: {classifyId: id}}).then(res => {
          if (res.data.length == 0) {
            this.showLimit = false
            this.ruleForm.projectLimitType = '0'
          }
          if (res.data.length == 1) {
            this.showLimit = true
            this.selectAble = true
            this.ruleForm.projectLimitType = res.data[0].value
          }
          if (res.data.length == 2) {
            this.showLimit = true
            this.selectAble = false
            this.ruleForm.projectLimitType = res.data[0].value
          }
          this.limitTypes = res.data
        })
      },
      //添加活动审核人
      addAuditor() {
        this.dialogVisibleActivity = true
      },
      //删除
      deleteAuditList(index) {
        this.ruleForm.auditList.splice(index, 1);
      },
      //选择审核人提交
      onSubmit() {
        let list = this.$refs.orgRef.list
        switch (list.assignFirst) {
          case 1:
            if (!list.sourceId) {
              this.$message({
                message: '请选择组织机构名称',
                type: 'error'
              });
              return false
            } else {
              this.dialogVisibleActivity = false
            }
            break
          case 2:
            if (!list.sourceId) {
              this.$message({
                message: '请选择指定人员',
                type: 'error'
              });
              return false
            } else {
              this.dialogVisibleActivity = false
            }
            break
          default:
            this.dialogVisibleActivity = false
        }
        var selectList = new Object()
        if (list.assignFirst == 2) {
          selectList.sourceType = 1
        } else {
          if (list.assignSecond == 2) {
            selectList.sourceType = 2
          }
          if (list.assignSecond == 3) {
            selectList.sourceType = 3
          }
          if (list.assignSecond == 4) {
            selectList.sourceType = 4
          }
        }
        selectList.sourceId = list.sourceId;
        selectList.sourceName = list.sourceName;
        let obj = JSON.parse(JSON.stringify(selectList));
        this.$store.commit('setClick', true)
        this.ruleForm.auditList.push(obj)
        if (this.ruleForm.auditList && this.ruleForm.auditList.length > 10) {
          this.showAddAuditor = false
        }
        setTimeout(() => {
          this.$store.commit('setClick', false)
        }, 200)
      },
      getTags() {
        this.$http.get('/school/activity/tag/list').then(res => {
          this.tags = res.data
        })
      },
      getClassify() {
        this.$http.get('/activity/classifies/list').then(res => {
          if (res.code == 200) {
            this.options = res.data;
          }

        })
      },
      removeDomain(index) {
        if (this.ruleForm.options.length <= 1) {
          this.$message({
            type: 'error',
            message: '最少保留一项奖项'
          });
          return;
        }
        for (let i = 0; i < this.ruleForm.options.length; i++) {
          if (index == i) {
            this.$http.get('/project/delCheckOption', {
              params: {
                optionId: this.ruleForm.options[i].id,
                projectId: this.id
              }
            }).then((res) => {
              if (res.data > 0) {
                this.$message({
                  type: 'error',
                  message: '项目 “' + this.ruleForm.options[i].name + " ”因有数据关联，不可删除"
                });
              } else {
                this.ruleForm.options.splice(index, 1)
              }
            })
          }
        }
      },
      addDomain() {
        this.ruleForm.options.push({
          // value: '',
          // key: Date.now()
          name: '',
          hours: '',
          id: '0'
        });
      },
      addOption() {
        this.dataInfo.options.push({
          name: ''
        })
      },
      submitForm(formName, type) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            for (let i = 0; i < this.ruleForm.options.length; i++) {
              this.ruleForm.options[i].sort = i;
            }
            this.isButton = true;
            if (type == 1) {
              this.$http.post('/project/modify', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.$router.push("/communist/project")
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }

              })

            } else if (type == 2) {
              for (let i = 0; i < this.ruleForm.options.length; i++) {
                this.ruleForm.options[i].sort = i;
              }
              this.$http.post('/project/add', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.$router.push("/communist/project")
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
      removeOption(item) {
        let index = this.dataInfo.options.indexOf(item)
        if (index != -1) {
          this.dataInfo.options.splice(index, 1)
        }
      },
      getDataInfo(id) {
        var that = this
        that.$http.get("/project/details", {params: {projectId: id}}).then(res => {
          that.ruleForm = res.data
          that.length = that.ruleForm.options.length - 1
          /*if (that.ruleForm.auditList == undefined) {
            that.ruleForm.auditList = []
          }
          if (that.ruleForm.auditList && that.ruleForm.auditList > 10) {
            that.showAddAuditor = false
          }*/
          /*   if (res.data.projectLimitType == 0) {
               that.limitTypes = [{value: 0, label: '无'}]
             } else if (res.data.projectLimitType == 1) {
               that.limitTypes = [{value: 1, label: localStorage.getItem("compulsoryName")}]
             } else if (res.data.projectLimitType == 2) {
               that.limitTypes = [{value: 2, label: localStorage.getItem("electiveName")}]
             }*/
          /*   that.isDisableLimit = true;
             var templateData = res.data.classifyId.split(',');
             var dataIntArr = [];
             templateData.forEach(function (data) {
               dataIntArr.push(+data);
             });
             that.ruleForm.parents = dataIntArr;*/
        })
      }
    }
  }
</script>
<style scoped>
  .el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }

  .show-important {
    color: #606266;
    font-size: 14px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .show-important span {
    font-size: 12px;
    color: #ccc
  }

  .blue-btn {
    border-color: #02bca6;
    color: #4d98ff
  }

  .important-detail {
    background: #F2F2F2;
    padding: 20px;
    margin: 5px 0px 10px;
  }
</style>
