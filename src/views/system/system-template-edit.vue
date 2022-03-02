<template>
  <el-row class="template-detail">
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
    <el-row class="template-title">
      模板类型：{{params.name}}
    </el-row>
    <!--活动审核-->
    <el-row class="activity-container">
      <el-row class="title">
        活动审核：
      </el-row>
      <el-row class="activity-detail">
        <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 1"
                v-for="item in params.content">
          {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
        </el-tag>
        <el-button type="primary" @click="activityFunction(1)" class="button-new-tag" size="mini">添加审核人</el-button>
      </el-row>
    </el-row>

    <el-row class="activity-container">
      <el-row class="title">
        物资经费审核：
        <el-row>
          <el-radio-group v-model="params.materials_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-row>
      </el-row>
      <el-row v-if="params.materials_status" class="activity-detail">
        <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 2"
                v-for="item in params.content">
          {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
        </el-tag>
        <el-button type="primary" @click="activityFunction(2)" class="button-new-tag" size="mini">添加审核人</el-button>
      </el-row>
    </el-row>

    <el-row class="activity-container">
      <el-row class="title">
        场地审核：
        <el-row>
          <el-radio-group v-model="params.pitch_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-row>
      </el-row>
      <el-row v-if="params.pitch_status" class="activity-detail">
        <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 3"
                v-for="item in params.content">
          {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
        </el-tag>
        <el-button type="primary" @click="activityFunction(3)" class="button-new-tag" size="mini">添加审核人</el-button>
      </el-row>
    </el-row>

    <el-row class="activity-container">
      <el-row class="title">
        报名通过人数超过
        <el-input type="number" v-model="params.people_num" style="width: 10%"></el-input>
        人时进行抄送：
      </el-row>
      <el-row class="activity-detail">
        <el-row class="activity-detail">
          <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 8"
                  v-for="item in params.content">
            {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
          </el-tag>
          <el-button type="primary" @click="activityFunction(8,-1)" class="button-new-tag" size="mini">添加抄送人</el-button>
        </el-row>
      </el-row>
    </el-row>
    <el-row class="activity-container">
      <el-row class="title">
        完结报告审核：
      </el-row>
      <el-row class="activity-detail">
        <el-row class="activity-detail">
          <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 5"
                  v-for="item in params.content">
            {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
          </el-tag>
          <el-button type="primary" @click="activityFunction(5)" class="button-new-tag" size="mini">添加审核人</el-button>
        </el-row>
      </el-row>

      <el-row style="display: flex">
        完结报告审核完成是否抄送：
        <el-row>
          <el-radio-group v-model="params.finish_cc_status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-row>
      </el-row>
      <el-row v-if="params.finish_cc_status" class="activity-detail">
        <el-tag @close="removeElement(item)" type="primary" closable :key="item.index" v-if="item.type == 6"
                v-for="item in params.content">
          {{item.auditor_role | TemplateRoleFmt(item.auditor_type,item.assignName,item.auditorName)}}
        </el-tag>
        <el-button type="primary" @click="activityFunction(6,-2)" class="button-new-tag" size="mini">添加抄送人</el-button>
      </el-row>

      <el-button @click="saveTemplate" type="primary" style="margin:1rem;width: 20%">提交</el-button>
    </el-row>

    <!--普通框1-->
    <el-dialog
      title="添加审核人"
      :visible="type == 1"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="当前机构" value="11"></el-option>
            <el-option label="上级机构" value="6"></el-option>
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>

      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">
        <el-row v-if="tempRadio == 11" class="parent-org">
          <el-row class="title">当前机构</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 6" class="parent-org">
          <el-row class="title">上级机构</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
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

    <!--普通框2-->
    <el-dialog
      title="添加审核人"
      :visible="type == 2"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="上级机构" value="6"></el-option>
            <el-option label="挂靠机构" value="7"></el-option>
            <el-option label="指定组织" value="2"></el-option>
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="当前组织" value="9"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>

      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">
        <el-row v-if="tempRadio == 9" class="parent-org">
          <el-row class="title">当前组织</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="5">指导老师</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 6" class="parent-org">
          <el-row class="title">上级机构</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 7" class="parent-org">
          <el-row class="title">挂靠机构</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="tempRadio == 2" class="parent-org">
          <el-row class="title">指定组织
            <el-form-item prop="assign_id" class="content">
              <el-select v-model="org.assign_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in orgList"
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
            <el-option label="当前班级" value="4"></el-option>
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

        <el-row v-if="tempRadio == 4" class="parent-org">
          <el-row class="title">当前班级</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="4">辅导员</el-radio>
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

    <!--普通框4-->
    <el-dialog
      title="添加审核人"
      :visible="type == 4"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="上级机构" value="6"></el-option>
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="当前班团" value="8"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>

      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">
        <el-row v-if="tempRadio == 8" class="parent-org">
          <el-row class="title">当前班团</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="4">辅导员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row v-if="tempRadio == 6" class="parent-org">
          <el-row class="title">上级机构</el-row>
          <el-form-item prop="auditor_role">
            <el-radio-group v-model="org.auditor_role">
              <el-radio label="1">负责人</el-radio>
              <el-radio label="2">管理员</el-radio>
              <el-radio label="12">负责人或管理员</el-radio>
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

    <!--活动报名人数限制模态框-->
    <el-dialog
      title="添加抄送人"
      :visible="type == -1"
      width="30%" style="line-height: 2rem;"
      :before-close="closeDialog">

      <el-row class="title">选择类型
        <el-row class="content">
          <el-select @change="changeData" v-model="tempRadio">
            <el-option label="指定组织" value="2"></el-option>
            <el-option label="指定机构" value="1"></el-option>
            <el-option label="指定人员" value="5"></el-option>
          </el-select>
        </el-row>
      </el-row>

      <el-form :model="org" :rules="rulesOrg" ref="rulesOrg">
        <el-row v-if="tempRadio == 2" class="parent-org">
          <el-row class="title">指定组织
            <el-form-item prop="assign_id" class="content">
              <el-select v-model="org.assign_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in orgList"
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
  import {TemplateRoleFmt, cascade} from '@/utils/filters'

  export default {
    mixins: [listMixins],
    data() {
      return {
        type: 0,          //用于 控制弹出 哪一种 添加审核人的 对话框
        tempOrgType: '',
        meList: [],//机构列表
        orgList: [],//组织列表
        //mechanism: {},
        tempOrg: {
          role: '',
        },
        params: {
          id: '',
          name: '',
          people_num: 0,
          materials_status: '',
          finish_cc_status: '',
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
        //添加审核人对话框的 规则
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
        tempRadio: '',    //添加审核人 对话框的选择项
        userList: [],
        tempId: 0,
      }
    },
    created() {
      const that = this;
      that.initTemplateDetail();
      that.initMeList();
      that.initUser();
      that.initOrgList();
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
	  saveTemplate() {
        const that = this;

        let have = false;
        for (let i = 0; i < that.params.content.length; i++) {
          if (that.params.content[i].type == 5) {
            have = true;
            break;
          }
        }

        if (have) {
          that.$http.post("/flow/template/edit", that.params).then(res => {
            if (res.code == 200) {
              that.$message.success('审核模板保存成功');
              setTimeout(function () {
                history.go(-1)
              }, 1000)
            }
          })
        } else {
          that.$message.error('未设置完结报告审核人');
        }
      },
      //初始化 组织列表
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
      //初始化 用户列表
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
      //查询审核流模板内容
      initTemplateDetail() {
        const that = this;
        if (that.id) {
          that.$http.get("/flow/template/details", {
            params: {
              id: that.$route.query.id
            }
          }).then(res => {
            that.params = res.data;
            /*分组*/
          })
        }
      },
	  //初始化 机构列表数据，查询所有的机构
	  initMeList() {
        const that = this;
        that.$http.get("/organization/administration/list", {params: {keyWord: ''}}).then(res => {
          that.meList = res.data;
        })
      },
	  save1() {
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

            if (that.org.auditor_type == 5) {//人员搜索
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
            that.type = 0;            //隐藏 弹框
            that.changeData();
          }
        })

      },
	  changeData() {
        const that = this;
        that.$refs['rulesOrg'].resetFields();

        for (let key in that.org) {
          if (key == 'type' || key == 'sort' || key == 'auditor_role') {
            that.org.auditor_role = '1';
          } else {
            that.org[key] = '';//重置表单
          }
        }

        if (that.tempRadio == 11) {//当前机构
          that.org.auditor_role = '1';
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
