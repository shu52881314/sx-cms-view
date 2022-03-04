<template>
  <section>
    <!--<el-tabs v-model="activeName" @tab-click="goTab">-->
      <!--<el-tab-pane label="校区" name="0"></el-tab-pane>-->
      <!--<el-tab-pane label="院系" name="1"></el-tab-pane>-->
      <!--<el-tab-pane label="专业" name="2"></el-tab-pane>-->
      <!--<el-tab-pane label="班级" name="3"></el-tab-pane>-->
      <!--<el-tab-pane label="学生" name="4"></el-tab-pane>-->
    <!--</el-tabs>-->
    <el-dialog title="批量导入"
               :visible.sync='dialogImportCollegeVisible'
               @close="beforeCloseImportCollegeHandler"
               :close-on-click-modal="false"
               width='650px' id="dialogOrange">
      <div>

        <div v-show="!showfileInfor">

          <div class="uploadLocal" v-show="fileList.length">
            <div class="uploadLocal-circel">
              <p style="padding-top:57px;"><img src="../../assets/images/upload_two@2x.png" style="width:70px;"></p>
              <p style="padding-top:10px;font-size:14px;color:#333;">{{fileListName}}</p>
            </div>
            <div class="uploadLocal-btn">
              <button class="uploadLocal-btnReset" @click="resetUpload">重新上传</button>
              <button class="uploadLocal-btnSubmit" @click="submitUpload">确认导入</button>
            </div>
          </div>

          <el-form v-show="!fileList.length" size='mini' label-width='12px'>
            <div class="importTipsTitle">
                  <span class="importTipsTitle-left">
                     请下载导入模板，按格式修改后导入
                  </span>
              <span class="importTipsTitle-right">
                    <a class="el-button el-button--text el-button--mini" download="" href='/static/tpls/班级模板.xlsx'
                       size='mini'><i class='el-icon-question'></i>模板下载</a>
                  </span>
            </div>
            <el-form-item label="" prop="name">
              <el-col :span="22">
                <upload-file
                  ref="childUpload"
                  uploadUrl="/school/class/import"
                  uploadType=".xls,.xlsx"
                  uploadSzie="100"
                  uploadSzieTips="只能上传xlx/xlsx文件，且不超过100MB!"
                  @fileInfor="openfileInfor"
                  @setFileList="setFileList"
                >
                </upload-file>
              </el-col>
            </el-form-item>
          </el-form>

        </div>
        <div class="progress-line" v-if="showProgress ">
          <el-progress :stroke-width="18" :percentage="fileUploadPercent" style="margin-top:30px;"></el-progress>
          <p style="text-align: center;padding: 20px 0px 10px;">正在上传，请您耐心等待...</p>
          <span style="display: block; text-align: center; font-size: 13px; color: #999">请勿关闭浏览窗口</span>
        </div>
        <div class="importFail" v-show="showfileInforDetail  && fileInforamtion.total != fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_fail@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功，<span style="color:#FFC600;">{{fileInforamtion.failed}}</span>条导入失败
            <span @click="downFailed()" style="cursor:pointer;color:#4D98FF" v-if="fileInforamtion.failed">下载失败列表</span>
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload">重新导入</button>
          </div>
        </div>

        <div class="importSuccess" v-show="showfileInforDetail && fileInforamtion.total == fileInforamtion.success">
          <div class="importFail-img"><img style="width:90px;" src='../../assets/images/upload_success@2x.png'></div>
          <div class="importFail-tips">
            <span style="color:#4D98FF;">{{fileInforamtion.success}}</span>条导入成功
          </div>
          <div class="uploadLocal-btn">
            <button class="uploadLocal-btnReset" @click="resetUpload">继续导入</button>
          </div>
        </div>


      </div>
    </el-dialog>


    <el-dialog
      title="添加班级" @close="beforeCloseHandlerMajor"
      :visible.sync="dialogVisibleMajor"
      :close-on-click-modal="false"
      width="50%">

      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="logo">
            <span style="font-max-size: 12px">(建议尺寸XXX*XXX)</span>
            <el-col :span="22">
              <upload id="uploadSquar" :image='ruleForm.logo' upload="/upload/image"
                      @uploadSuccessed="uploadSuccessed2">

              </upload>

            </el-col>
          </el-form-item>
          <el-form-item label="班级名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength="30" placeholder="请输入班级名称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="22">
              <el-select @change="changeSchool" style="width:100%" v-model="ruleForm.campusId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="collegeId">
            <el-col :span="22">
              <el-select @change="changeCollege" style="width:100%" v-model="ruleForm.collegeId" placeholder="请选择院系">
                <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业" prop="majorId">
            <el-col :span="22">
              <el-select @change="changeMajor" style="width:100%" v-model="ruleForm.majorId" placeholder="请选择专业">
                <el-option v-for="item in majors" :key="item.id" :label="item.name + '-' + item.lengthName"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.grade" placeholder="请选择年级">
                <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>


          <!--<el-form-item label="班团负责人">-->
            <!--<el-col :span="22">-->
              <!--<el-select clearable-->
                         <!--style="width: 100%"-->
                         <!--v-model="ruleForm.orgAuditor"-->
                         <!--@change="changeSelect"-->
                         <!--filterable-->
                         <!--value-key="value"-->
                         <!--:multiple-limit=1-->
                         <!--remote-->
                         <!--placeholder="请输入班团负责人"-->
                         <!--:remote-method="remoteMethodbt"-->
              <!--&gt;-->
                <!--<el-option-->
                  <!--v-for="item in optionsbt"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name +' - '+ item.code"-->
                  <!--:value="item.id">-->
                  <!--<span style="float: left">{{ item.name }}</span>-->
                  <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
          <!--</el-form-item>-->

          <el-form-item label="辅导员" >
            <el-col :span="22">
              <el-select clearable
                         style="width: 100%"
                         v-model="ruleForm.coachId"
                         @change="changeSelect"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入辅导员"
                         :remote-method="remoteMethodfdy"
              >
                <el-option
                  v-for="item in optionsfdy"
                  :key="item.id"
                  :label="item.name +' - '+ item.code"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="组织简介">
            <el-col :span="22">
              <el-input type="textarea" v-model="ruleForm.introduce" placeholder="请输入组织简介" maxlength='300'></el-input>
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
            <el-button size="mini" @click="dialogVisibleMajor = false">取 消</el-button>
            <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加班级</el-button>


          </el-form-item>
        </el-form>
      </div>

    </el-dialog>


    <el-dialog
      title="编辑班级" @close="beforeCloseHandlerMajor"
      :visible.sync="editor"
      :close-on-click-modal="false"
      width="50%">
      <div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="logo">
            <span style="font-max-size: 12px">(建议尺寸XXX*XXX)</span>
            <el-col :span="22">
              <upload id="uploadSquar2" :image='ruleForm.logo' upload="/upload/image"
                      @uploadSuccessed="uploadSuccessed2">

              </upload>

            </el-col>
          </el-form-item>
          <el-form-item label="班级名称" prop="name">
            <el-col :span="22">
              <el-input v-model="ruleForm.name" maxlength="30" placeholder="请输入班级名称"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="所属校区" prop="campusId">
            <el-col :span="22">
              <el-select @change="changeSchool" style="width:100%" v-model="ruleForm.campusId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属院系" prop="collegeId">
            <el-col :span="22">
              <el-select @change="changeCollege" style="width:100%" v-model="ruleForm.collegeId" placeholder="请选择院系">
                <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="所属专业" prop="majorId">
            <el-col :span="22">
              <el-select @change="changeMajor" style="width:100%" v-model="ruleForm.majorId" placeholder="请选择专业">
                <el-option v-for="item in majors" :key="item.id" :label="item.name + '-' + item.lengthName"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-col :span="22">
              <el-select style="width:100%" v-model="ruleForm.grade" placeholder="请选择年级">
                <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="班级负责人">
            <el-col :span="22">
              <el-select clearable
                         style="width: 100%"
                         v-model="ruleForm.auditor"
                         @change="changeSelect"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入班级负责人"
                         :remote-method="remoteMethodbj"
              >
                <el-option
                  v-for="item in optionsbj"
                  :key="item.id"
                  :label="item.name "
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="辅导员">
            <el-col :span="22">
              <el-select clearable
                         style="width: 100%"
                         v-model="ruleForm.coachId"
                         @change="changeSelect"
                         filterable
                         value-key="value"
                         :multiple-limit=1
                         remote
                         placeholder="请输入辅导员"
                         :remote-method="remoteMethodfdy"
              >
                <el-option
                  v-for="item in optionsfdy"
                  :key="item.id"
                  :label="item.name "
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="组织简介">
            <el-col :span="22">
              <el-input type="textarea" v-model="ruleForm.introduce" placeholder="请输入组织简介" maxlength='300'></el-input>
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
            <el-button size="mini" @click="editor = false">取 消</el-button>
            <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改班级</el-button>
          </el-form-item>
        </el-form>
      </div>


    </el-dialog>


    <div class="main-header" v-if="$root.ItemData && $root.ItemData.length && $root.ItemData.length == 1">
      <span class="main-title">班级管理</span>

    </div>
    <div class="search-box">
      <span style="float:left;">
			<el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="校区" prop="campusId">
          <el-col :span="22">
              <el-select @change="changeSchool2" clearable style="width:100%" v-model="params.campusId"
                         placeholder="请选择校区">
                  <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="院系">
         <el-select @change="changeCollege2" clearable v-model="params.collegeId" placeholder="请选择院系">
           <el-option v-for="item in colleages" :key="item.id" :label="item.name" :value="item.id"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="专业">
        <el-select clearable v-model="params.majorId" placeholder="请选择专业">
          <el-option v-for="item in majores" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级">
       <el-select clearable v-model="params.grade" placeholder="请选择年级">
         <el-option v-for="item in gradees" :key="item.id" :label="item.name" :value="item.id"></el-option>
       </el-select>
     </el-form-item>
          <el-form-item label="辅导员及负责人设置">
       <el-select clearable v-model="params.fuzerenfudaoyuan" placeholder="请选择辅导员及负责人">
         <el-option v-for="item in fuzerenfufsoyusns" :key="item.id" :label="item.name" :value="item.id"></el-option>
       </el-select>
     </el-form-item>

				<el-form-item label="名称">
					<el-input v-model="params.name" placeholder="请输入班级名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="search()">查询</el-button>
				</el-form-item>
			</el-form>
    </span>
      <span style="float:right">
          <el-button v-perms="'/student/class/add'" @click="dialogVisibleMajor = true" type="increase"
                     size="mini">添加班级</el-button>
          <el-button v-perms="'/student/class/add'" type="primary" size="mini"
                     @click="dialogImportCollegeVisible = true">导入</el-button>

      </span>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="班级名称"></el-table-column>
        <el-table-column label="所在年级">
          <template slot-scope="scope">
            <span>{{scope.row.grade}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="campusName" label="所属校区"></el-table-column>
        <el-table-column prop="collegeName" label="所属院校"></el-table-column>
        <el-table-column prop="majorName" label="所属专业"></el-table-column>

        <!-- <el-table-column label="党员总数"  align="center">
           <template slot-scope="scope">
             <span >{{scope.row.partyCount}}人</span>
           </template>
         </el-table-column>
        <el-table-column label="团员总数"  align="center">
          <template slot-scope="scope">
             <span >{{scope.row.groupCount}}人</span>
           </template>
        </el-table-column> -->
        <el-table-column label="学生数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.studentCount}}人</span>
          </template>
        </el-table-column>
        <el-table-column label="班级负责人" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.auditorName">{{scope.row.auditorName}}</span>
            <span v-else style="color: red">暂未设置</span>
          </template>
        </el-table-column>
        <el-table-column label="辅导员" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.coachName">{{scope.row.coachName}}</span>
            <span v-else style="color: red">暂未设置</span>

          </template>
        </el-table-column>
        <el-table-column prop="actCount" label="活动数" align="center"></el-table-column>
        <el-table-column label="活力值" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.energy}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status == 0 ? "删除" : scope.row.status == 1 ? "待审核" :scope.row.status == 2 ? "审核通过":scope.row.status == 3? "审核驳回":''}}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="220" align="center">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <el-button type="text" class="opreat-btn"
                       @click.native="routerLink('/student/details?classId=' + scope.row.id, 'view', scope.row.orgId,{classId:scope.row.id},4)"
                       v-perms="'/student/class/details'">详情
            </el-button>
            <el-button type="text" class="opreat-btn" @click="modify(scope.row)" v-perms="'/student/class/edit'">编辑
            </el-button>
            <el-button @click='deleteCampus(scope.row)' v-perms="'/student/class/delete'" size="mini" type="text">删除
            </el-button>

            <!--<el-button type="text" class="opreat-btn" @click.native="compile(scope.row)" v-perms="'/student/class/export'">导出学生</el-button>-->
          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import axios from 'axios'
  import {uploadOSS} from '@/utils/filters';

  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请正确输入年级'))
    } else {
      callback()
    }
  }

  export default {
    data() {
      return {
        fuzerenfufsoyusns:[
          {id:'',name:'全部'},
          {id:1,name:'已完成'},
          {id:2,name:'未完成'},
        ],
        activeName: '',
        tabsList: ['/student/campus', '/student/college', '/student/major', '/student/class', '/student/list'],
        danmiens: '',
        miensshuzu: [],
        sujuhuixian: [],
        boolloading: false,
        dialogVisible: false,
        optionsbj: [],
        optionsbt: [],
        optionsfdy: [],
        randomData: '',
        fileListName: '',
        fileList: [],
        showfileInfor: false,
        fileInforamtion: {},
        dialogImportCollegeVisible: false,
        dialogVisibleMajor: false,
        showProgress: false,
        fileUploadPercent: 0,
        showfileInforDetail: false,
        clickAble: true,
        editor: false,
        loading: false,
        props: {
          label: "name",
          value: "id"
        },
        params: {
          fuzerenfudaoyuan:'',
          current: 0,
          size: 10,
          option: '',
          name: '',
          grade: '',
          campusId: '',
          collegeId: '',
          majorId: '',
        },
        ruleForm: {
          id: '',
          campusId: '',
          collegeId: '',
          majorId: '',
          grade: '',
          name: '',
          auditor: '',
          orgAuditor: '',
          coachId: '',
          introduce: '',
          miens: '',
          logo: '',

        },
        rules: {
          auditor: [{
            required: true,
            message: '请填写班级负责人',
            trigger: 'blur'
          }],
          orgAuditor: [{
            required: true,
            message: '请填写班团负责人',
            trigger: 'blur'
          }],
          coachId: [{
            required: true,
            message: '请填写辅导员',
            trigger: 'blur'
          }],
          campusId: [{
            required: true,
            message: '请选择所属校区',
            trigger: 'change'
          }
          ],
          collegeId: [{
            required: true,
            message: '请选择所属院系',
            trigger: 'change'
          }
          ],
          majorId: [{
            required: true,
            message: '请选择所属专业',
            trigger: 'change'
          }
          ],
          grade: [{
            required: true,
            trigger: 'blur',
            validator: validPhone
          }
          ],
          name: [{
            required: true,
            message: '请填写班级名称',
            trigger: 'change'
          }
          ]
        },
        data: [],
        gradees: [],
        schools: [{id: 0, name: localStorage.getItem("schoolName")}],
        colleages: [],
        colleges: [],
        majors: [],
        majores: [],
        total: 0,
        options: [{id: 0, name: localStorage.getItem("schoolName")}],
        bianjifzr:false,
        bianjifdy:false
      }
    },
    methods: {
      goTab() {
        const that = this;
        this.$router.push({ path: that.tabsList[parseInt(that.activeName)], query: { type:that.activeName }});
      },
      httpRequest(file) {
        let url = uploadOSS(file, "2class", 'organization' + "/", 0).then(res => {
          this.uploadSuccessed(res)
        })
      },
      geturl(file, fileList) {
        this.danmiens = file.url;
        this.dialogVisible = true;
      },
      uploadSuccessed(url) {
        this.miensshuzu.push(url)
      },
      handleRemove(file, fileList) {
        for (let i = 0; i < this
          .miensshuzu.length; i++) {
          if (this.miensshuzu[i] == file.url) {
            this.miensshuzu.splice(i, 1);
          }
        }


      },

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


      changeSelect(value) {
        if (value) {
          this.placeholder = ""
        }
      },
      //班级负责人远程搜索
      remoteMethodbj(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/OrgStudent", {
            params: {
              orgId:this.ruleForm.orgId,
              key: query
            }
          }).then(res => {
            this.loading = false;
            this.optionsbj = res.data
          })

        } else {
          this.optionsbj = [];
        }
      },


      //辅导员远程搜索
      remoteMethodfdy(query) {
        if (query !== '') {
          this.loading = true;

          this.$http.get("/school/students/NoPage", {
            params: {
              key: query,
              identity:2,
            }
          }).then(res => {
            this.loading = false;
            this.optionsfdy = res.data
          })

        } else {
          this.optionsbj = [];
        }
      },
      setProgress(progressInfo) {

        this.showfileInfor = true
        this.showProgress = true
        this.showfileInforDetail = false
        this.fileUploadPercent = 0
        var s = 1
        this.Interval = setInterval(() => {
          s++
          this.fileUploadPercent = s
          if (s == 90) {
            clearInterval(this.Interval);
          }
        }, 100)
      },
      resetUpload() {
        this.fileList = []
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.$refs.childUpload.closeUpload();
        this.showfileInforDetail = false
        this.fileUploadPercent = 0
        this.clickAble = true
      },
      //显示本地上传发文件
      setFileList(fileList) {
        this.fileList = fileList
        this.fileListName = fileList[0].name
      },
      //下载失败模板
      downFailed() {

        axios({
          method: 'post',
          url: 'school/fail/class/export',
          responseType: 'blob',
          data: {
            randomData: this.randomData
          }

        }).then((res) => {
          if (!res) {
            return
          }
          var filename = name;
          let url = window.URL.createObjectURL(res)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '班级失败信息' + '.xlsx')
          document.body.appendChild(link)
          link.click()
        })

      },
      uploadSuccessed2(url) {
        var that = this
        this.$set(that.ruleForm, 'logo', url)
      },
      changeMajor(a) {
      },
      changeSchool2(value) {
        if (value) {
          this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
            this.colleages = res.data
          })
        } else {
          this.colleages = []
        }

      },
      changeCollege2(value) {
        if (value) {
          this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
            this.majores = res.data
          })
        } else {
          this.majores = []
        }

      },
      deleteCampus(item) {

        this.$confirm('是否确定删除该班级?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http.post('/school/class/delete', {
            id: item.id
          }).then((res) => {

            if (res.code == '200') {
              this.fetch();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }

          })

        }).catch(() => {

        });


      },
      beforeCloseImportCollegeHandler() {
        this.fileList = []
        this.showfileInfor = false
        this.dialogImportCollegeVisible = false;
        this.$refs.childUpload.closeUpload();
        this.showfileInfor = false
        this.fileInforamtion = {
          total: 0,
          success: 0,
          failed: 0,
          exists: 0
        }
        this.showfileInforDetail = false
        this.clickAble = true
        this.showProgress = false
      },
      //导入成功返回
      openfileInfor(res) {
        if (res != false) {
          this.randomData = res.randomData
          this.showfileInfor = true
          this.fileInforamtion = res
          this.fetch()
          this.fileUploadPercent = 100
          clearInterval(this.Interval);
          setTimeout(() => {
            this.showfileInfor = true
            this.showfileInforDetail = true
            this.showProgress = false;
          }, 2000)
        } else {
          clearInterval(this.Interval);
          this.fileUploadPercent = 0
          this.showfileInforDetail = false
          this.showProgress = false
          this.showfileInfor = false
          this.clickAble = false
        }

        // this.dialogImportCollegeVisible = false;
      },
      submitUpload() {
        if (this.clickAble) {
          this.$refs.childUpload.submitUpload2()
          this.setProgress()
        } else {
          this.$message({
            type: 'error',
            message: '请重新上传文件'
          });
          return;
        }

      },
      modify(row) {
        this.miensshuzu = []
        if (row) {
          console.log(row)
          this.editor = true
          this.ruleForm.id = row.id;
          this.ruleForm.campusId = row.campusId;
          this.ruleForm.name = row.name;
          this.ruleForm.grade = row.gradeId;
          this.ruleForm.logo = row.logo;
          this.ruleForm.introduce = row.introduce;


          this.$set(this.ruleForm, 'orgId', row.orgId)
          if (row.mienAttach) {
            this.sujuhuixian = row.miens;
            for (let i = 0; i < row.miens.length; i++) {
              let imghuiurl = row.miens[i].url
              this.miensshuzu.push(imghuiurl)
            }
          }
          // this.optionsfdy=''
          // this.optionsbj =
          if (row.auditorId) {
            this.optionsbj=[]
           let obj={
             id:row.auditorId,
             name:row.auditorName
           }

            this.optionsbj.push(obj)
            this.ruleForm.auditor=row.auditorId
           this.bianjifzr=true
          }
          if (row.coachId) {
            this.optionsfdy=[]
            let obj={
              id:row.coachId,
              name:row.coachName
            }
            this.optionsfdy.push(obj)
            this.ruleForm.coachId=row.coachId
            this.bianjifdy=true
          }
          this.$http.get('/school/all/college/cascader', {params: {campusId: row.campusId}}).then(res => {
            this.colleges = res.data;
            this.ruleForm.collegeId = row.collegeId;
          })
          this.$http.get('/school/all/major/cascader', {params: {collegeId: row.collegeId}}).then(res => {
            this.majors = res.data
            this.ruleForm.majorId = row.majorId;
          })
          /*this.$http.get("/school/students/NoPage", {params: {coachId: row.coachId}}).then(res => {
            this.loading = false;
            this.optionsfdy = res.data
            this.ruleForm.coachId = row.coachId;
          })*/
        } else {
          this.dialogVisibleMajor = true;
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandlerMajor() {
        this.resetForm('ruleForm');
        this.ruleForm = {
          id: '',
          campusId: '',
          collegeId: '',
          majorId: '',
          grade: '',
          name: '',
          auditor: '',
          orgAuditor: '',
          coachId: '',
          introduce: '',
          miens: '',
          logo: '',
        }
        this.sujuhuixian = []

      },
      getCampus() {
        this.$http.get('/school/all/campus').then(res => {
          // this.schools = this.schools.concat(res.data)
          this.schools = res.data
        })
      },
      changeSchool(value) {
        this.$http.get('/school/all/college/cascader', {params: {campusId: value}}).then(res => {
          this.colleges = res.data
          this.ruleForm.collegeId = ""
          this.ruleForm.majorId = ""
          this.majors =[]
        })
      },
      changeCollege(value) {
        this.$http.get('/school/all/major/cascader', {params: {collegeId: value}}).then(res => {
          this.majors = res.data
          this.ruleForm.majorId = ""
        })
      },
      // getOptions() {
      // 	this.$http.get('/school/all/major/cascader').then(res => {
      // 		this.options = this.options.concat(res.data)
      // 	})
      // },
      changeOption(value) {
        this.params.option = value.join(',')
      },
      fetch() {
        this.loading = true
        this.$http.get('/school/classes', {params: this.params}).then(res => {
          this.data = res.data.list
          this.total = res.data.total
          this.loading = false
        })
      },
      search() {
        this.params.current = 1
        this.fetch()
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()
      },
      submitForm(formName, type) {
        this.ruleForm.miens = this.miensshuzu.toString()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (type == 1) {
              if (this.bianjifzr==true&& this.ruleForm.auditor==''){
                this.$message({
                  type: 'warning',
                  message: '请输入班级负责人!'
                });
                return
              } ;
              // if (this.bianjifdy==true&& this.ruleForm.coachId==''){
              //   this.$message({
              //     type: 'warning',
              //     message: '请输入辅导员!'
              //   });
              //   return
              // } ;
              this.$http.post('/school/class/modify', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.editor = false;
                  this.fetch();
                } else {
                  this.$message({
                    type: 'error',
                    message: res.msg
                  });
                }
              })
            } else if (type == 2) {
              this.$http.post('/school/class/add', this.ruleForm).then((res) => {
                if (res.code == '200') {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogVisibleMajor = false;
                  this.fetch();
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
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      // this.getOptions()
      this.fetch()
      this.getCampus()
      this.$http.get('/school/grade/partake/list').then(res => {
        this.gradees = res.data
      })
      // this.$http.get('/school/college/list').then(res => {
      //   this.colleages   = res.data
      // })
      // this.$http.get('/school/major/list').then(res => {
      //
      //   this.majores   = res.data
      // })
    },
    mounted() {

    }
  }
</script>
<style>

</style>
