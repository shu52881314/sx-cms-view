<template>
  <el-row class="template-detail">

    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
    <!--活动审核-->
    <el-row class="activity-container">
      <el-row class="title">
        选择院系：
        <el-row class="content">
          <el-select v-if="!params.id" value-key="id" @change="clicks" :disabled="params.id != ''"
                     v-model="params.collegeId" filterable
                     placeholder="请选择">
            <el-option
              v-for="item in collegeList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-row v-else>
            {{params.name}}
          </el-row>
        </el-row>
      </el-row>

      <el-row class="activity-detail">
        <el-row style="display: flex;align-items: center">
          <el-row style="margin-right: 1rem">
            审核流
          </el-row>

          <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 10"
                  v-for="item in params.content">
            {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
          </el-tag>
          <el-button type="primary" @click="activityFunction(10)" class="button-new-tag" size="mini">添加审核人</el-button>
        </el-row>
      </el-row>


      <el-row class="activity-container">
        <el-row class="title">
          审核完成抄送：
          <el-row>
            <el-radio-group v-model="params.finish_cc_status">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-row>
        </el-row>
        <el-row v-if="params.finish_cc_status" class="activity-detail">
          <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 13"
                  v-for="item in params.content">
            {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
          </el-tag>
          <el-button type="primary" @click="activityFunction(13,-2)" class="button-new-tag" size="mini">添加抄送人
          </el-button>
        </el-row>
      </el-row>
    </el-row>


    <el-button @click="saveTemplate" type="primary" style="margin:1rem;width: 20%">提交</el-button>


    <!--普通框3-->
    <el-dialog
      title="添加审核人"
      :visible="type == 3"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="当前院系" value="3"></el-option>
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="当前团队" value="10"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>

      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">

        <el-row v-if="tempRadio == 3" class="parent-org">
          <el-row class="title">当前院系</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 10" class="parent-org">
          <el-row class="title">当前团队</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="5">指导老师</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 1">
          <el-row class="title">指定机构
            <el-form-item prop="assign_id" class="content">
              <el-select v-model="org.assign_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in meList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
            </el-radio-group>
          </el-row>
        </el-row>


        <el-row v-if="tempRadio == 5" class="title">指定人员
          <el-form-item prop="auditor_id" class="content">
            <el-select v-model="org.auditor_id" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="save1">确 定</el-button>
      </span>
    </el-dialog>


    <!--活动审核完成/完结报告审核完成添加抄送人-->
    <el-dialog
      title="添加抄送人"
      :visible="type == -2"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>
      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">
        <el-row v-if="tempRadio == 1">
          <el-row class="title">指定机构
            <el-form-item prop="assign_id" class="content">
              <el-select v-model="org.assign_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in meList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
            </el-radio-group>
          </el-row>
        </el-row>


        <el-row v-if="tempRadio == 5" class="title">指定人员
          <el-form-item prop="auditor_id" class="content">
            <el-select v-model="org.auditor_id" filterable placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="type = 0">取 消</el-button>
        <el-button type="primary" @click="save1">确 定</el-button>
      </span>
    </el-dialog>

  </el-row>
</template>


<script>
  import listMixins from '@/mixins/form';
  import {TemplateRoleFmt, cascade5} from '@/utils/filters'

  export default {
    mixins: [listMixins],
    data() {
      return {
        type: 0,
        tempType: 0,
        edit: false,
        tempOrgType: '',
        meList: [],//机构列表
        orgList: [],//组织列表
        mechanism: {},
        tempOrg: {
          role: '',
        },
        params: {
          id: '',
          name: '',
          type: '',
          people_num: 0,
          college_id: '',
          materials_status: '',
          finish_cc_status: '',
          class_id: '',
          classId: [],
          content: []
        },
        org: {//上级机构列表
          auditor_type: '',
          tpl_id: '',
          type: '',
          auditor_role: '1',
          assign_id: '',
          auditor_id: '',
          sort: 0,
          auditorName: '',
          assignName: '',
          tempId: 0,
        },
        rulesOrg: {
          auditor_role: [
            {required: true, message: '请选择角色', trigger: 'blur'},
          ], assign_id: [
            {required: true, message: '请选择选项', trigger: 'blur'},
          ], auditor_id: [
            {required: true, message: '请选择成员', trigger: 'blur'},
          ],
        },
        orgParams: '',
        tempRadio: '',
        userList: [],
        tempId: 0,
        collegeList: [],
        classList: []
      }
    },
    created() {
      const that = this;
      that.tempType = that.$route.query.type;
      that.edit = that.$route.query.ed;
      that.initTemplateDetail();
      that.initMeList();
      that.initUser();
      that.initOrgList();
      that.initCollegeList();
      that.initClassList();
    },
    filters: {
      TemplateRoleFmt(role, type, assignName, auditorName) {
        return TemplateRoleFmt(type, role, assignName, auditorName);
      }
    },
    methods: {
      goBack() {
        window.history.go(-1)
      },
      clicks(value) {
        const that = this;
        that.params.college_id = value.id;
        that.params.name = value.name;
      },
      initClassList() {
        const that = this;
        that.$http.get('/system/classifys').then(res => {
          that.classList = cascade5('0', res.data);
        })
      },
      initCollegeList() {
        const that = this;
        that.$http.get("/school/college/list", {}).then(res => {
          that.collegeList = res.data;
        })
      },
      saveTemplate() {
        const that = this;
        let have = false;
        that.params.class_id = that.params.classId[that.params.classId.length - 1];
        that.params.type = that.tempOrgType;

        for (let i = 0; i < that.params.content.length; i++) {
          if (that.params.content[i].type == 10) {
            have = true;
          }
        }

        let fix = 'add';
        if (have) {
          if (that.params.id) {
            fix = 'edit';
          }

          if (that.tempType == 2 && !that.params.id) {
            that.params.name = that.$refs['cascaderClass'].currentLabels[that.$refs['cascaderClass'].currentLabels.length - 1]
          }

          console.log(that.params)
          /*that.$http.post("/flow/template/" + fix, that.params).then(res => {
            if (res.code == 200) {
              that.$message.success('审核模板保存成功');

              setTimeout(function () {
                history.go(-1)
              }, 1000)
            }
          })*/
        } else {
          that.$message.error('请至少选择一位审核人员');
        }
      },
      initOrgList() {
        const that = this;
        that.$http.get("/school/org/partake/list", {params: {}}).then(res => {
          that.orgList = res.data;
        })
      },
      removeElement(item) {
        const that = this;
        let tempContent = [];
        for (let i = 0; i < that.params.content.length; i++) {
          if (item.id) {
            if (item.id != that.params.content[i].id) {
              tempContent.push(that.params.content[i])
            }
          }

          if (item.tempId != undefined) {
            if (item.tempId != that.params.content[i].tempId) {
              tempContent.push(that.params.content[i])
            }
          }
        }
        that.params.content = tempContent;
      },
      initUser() {
        const that = this;
        that.$http.get("/school/students/NoPage", {params: {identity: 2}}).then(res => {
          that.userList = res.data;
          for(let i = 0; i < that.userList.length;i++){
            that.userList[i].name = that.userList[i].name + ' - ' + that.userList[i].code;
          }
        })
      },
      closeDialog() {
        const that = this;
        that.type = 0;
        that.$refs['rulesOrg'].resetFields();
      },
      activityFunction(type, tt) {
        const that = this;
        that.type = that.$route.query.type;
        if (tt != undefined) {
          that.type = tt;
        }

        that.tempOrgType = type;
      },
      initTemplateDetail() {
        const that = this;
        if (that.id) {
          that.$http.get("/flow/template/details", {
            params: {
              id: that.$route.query.id
            }
          }).then(res => {
            that.params = res.data;
            let tempList = [];
            tempList.push(res.data.class_id)
            that.params.classId = tempList;
            /*分组*/
          })
        }
      }, initMeList() {
        const that = this;
        that.$http.get("/organization/administration/list", {params: {keyWord: ''}}).then(res => {
          that.meList = res.data;
        })
      }, save1() {
        const that = this;
        if (!that.tempRadio) {
          return;
        }
        that.$refs['rulesOrg'].validate((valid) => {
          if (valid) {
            let temp = new Object();
            that.org.type = that.tempOrgType;
            that.org.auditor_type = that.tempRadio;
            if (that.org.auditor_type == 1) {//机构搜素
              for (let i = 0; i < that.meList.length; i++) {
                if (that.org.assign_id == that.meList[i].id) {
                  that.org.assignName = that.meList[i].name;
                }
              }
            }

            if (that.org.auditor_type == 2) {//组织搜索
              for (let i = 0; i < that.meList.length; i++) {
                if (that.org.assign_id == that.orgList[i].id) {
                  that.org.assignName = that.orgList[i].name;
                }
              }
            }

            if (that.org.auditor_type == 5) {
              for (let i = 0; i < that.userList.length; i++) {
                if (that.org.auditor_id == that.userList[i].id) {
                  that.org.auditorName = that.userList[i].name;
                }
              }
            }
            that.org.tpl_id = that.params.id;
            that.tempId = (that.tempId + 1);
            that.org.tempId = that.tempId;

            for (let key in that.org) {
              temp[key] = that.org[key];
            }

            that.params.content.push(temp);
            that.type = 0;
            that.changeData();
          }
        })

      }, changeData() {
        const that = this;
        that.$refs['rulesOrg'].resetFields();


        for (let key in that.org) {
          if (key == 'type' || key == 'sort' || key == 'auditor_role') {
            that.org.auditor_role = '1';
          } else {
            that.org[key] = '';//重置表单
          }
        }

        if (that.tempRadio == 9) {//当前组织
          that.org.auditor_role = '5';
        }

        if (that.tempRadio == 4 || that.tempRadio == 8) {//当前班级或当前班团默认选中
          that.org.auditor_role = '4';
        }
      }
    }
  }
</script>


<style scoped lang="scss">
  .template-detail {
    .template-title {
      font-size: 1rem;
      padding: 1rem;
    }

    .title {
      border-radius: 5px;
      padding: 8px 8px 8px 18px;
      background: #bee0f7;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .content {
      margin-left: 1rem;
    }

    .activity-container {
      .activity-detail {
        padding: 1rem 0;

        .el-tag + .el-tag {
          margin-left: 10px;
        }

        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }

        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
    }
  }
</style>
