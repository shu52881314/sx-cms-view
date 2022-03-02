<template>
    <div class="cylst" v-if="loading">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="基本信息" name="0">
          <el-button size="mini" type="primary" @click="bianji">编辑</el-button>
          <div style="border: 1px solid #ccc;width:80%;margin-top: 15px;font-size: 14px ">
              <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
                <span style="padding: 0 20px;min-width: 140px">团队名称</span>
                <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{detalldata.teamName}}</span>
              </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">团队专项</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                {{detalldata.specialName!=''?detalldata.specialName:'无'}}
              </span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">所属学院</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">  {{detalldata.collegeName!=''?detalldata.collegeName:'无'}}</span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">调研主题</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">  {{detalldata.themeName!=''?detalldata.themeName:'无'}}</span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">是否重点团队</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{detalldata.pointTeam==1?'是':'否'}}</span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">实践时间</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{detalldata.praxisBtime | formatD}}至{{detalldata.praxisEtime | formatD}}</span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">调研地点</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;"> <i style="font-style: normal;display: block" v-for="item in detalldata.sites">{{item.address}}</i></span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">实践方式</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;"><i style="font-style: normal;" v-for="item in detalldata.manners">{{item.mannerName}},</i></span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">调研内容</span>
              <span style="    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                <i style="display: block;padding: 10px 10px;font-style: normal;    border-bottom: 1px solid #ccc;">背景:{{detalldata.praxisContentBgm}} </i>
                <i style="display: block;padding: 10px 10px;font-style: normal;    border-bottom: 1px solid #ccc;">目的及意义:{{detalldata.praxisContentAim}}</i>
                <i style="display: block;padding: 10px 10px;font-style: normal;    border-bottom: 1px solid #ccc;">主要内容:{{detalldata.praxisContentMain}} </i>
                <i style="display: block;padding: 10px 10px;font-style: normal;    border-bottom: 1px solid #ccc;">预期成果:{{detalldata.praxisContentExpect}} </i>
              </span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">指导老师</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                <i style="font-style: normal;" v-for="item in detalldata.teachers">{{item.name}}-{{item.code}},</i>
              </span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">负责人</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
             {{detalldata.principal.name}}-{{detalldata.principal.code}}
              </span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">是否是党员团队</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                {{detalldata.partyTeam==1?'是':'否'}}
              </span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">团队人数</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">{{detalldata.peopleNum}}</span>
            </p>
            <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #bafbfb;
">
              <span style="padding: 0 20px;min-width: 140px">团队状态</span>
              <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                {{detalldata.teamStatus==0?'尚未完成组队':detalldata.teamStatus==1&&detalldata.praxisStatus==null?'组队完成尚未创建项目':detalldata.teamStatus==1&&detalldata.praxisStatus!=null?'已创建项目':''}}

              </span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员列表" name="1">
          <el-button size="mini" type="primary" @click="tjiazd=true">添加指导老师</el-button>
          <el-button size="mini" type="primary" @click="tjiaxs=true">添加成员</el-button>
          <el-button size="mini" type="primary" @click="goxgcy">修改成员信息</el-button>
          <div class="main-body" style="margin-top: 15px">
            <el-table border :loading="loading" :data="teacherdata" stripe size="mini" style="width: 100%" :header-cell-style="tableHeaderColor">
              <el-table-column prop="name" label="指导老师姓名" ></el-table-column>
              <el-table-column prop="code" label="工号" ></el-table-column>
              <el-table-column prop="collegeName" label="学院" ></el-table-column>
              <el-table-column prop="duty" label="职务" ></el-table-column>
              <el-table-column prop="contact" label="联系方式" ></el-table-column>

              <el-table-column label="操作" width="160" align="left">
                <div slot-scope="scope">
                  <!-- 可转载站点功能未完成 -->
                  <!--              <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/detail','view',scope.row.id,'',params.cur,params.statusAcitive)" v-perms="'/communist/activity/detail'">详情</el-button>-->

                  <el-button type="text" class="opreat-btn" @click.native="showDetaills(scope.row.id,scope.row.duty,scope.row.contact)">编辑
                  </el-button>
                  <el-button type="text" class="opreat-btn"
                             @click.native="deletels(scope.row.id,0,2)">删除
                  </el-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
          <div class="main-body" style="margin-top: 50px">
            <el-table border :loading="loading" :data="membersdata" stripe size="mini" style="width: 100%" :header-cell-style="tableHeaderColor">
              <el-table-column  label="排序" >
                <div slot-scope="scope">
                  {{scope.row.sort!=undefined?scope.row.sort:'无'}}
                  </div>
              </el-table-column>
              <el-table-column prop="name" label="成员姓名" ></el-table-column>
              <el-table-column prop="code" label="学号" ></el-table-column>
              <el-table-column prop="className" label="班级" ></el-table-column>
              <el-table-column prop="collegeName" label="学院" ></el-table-column>
              <el-table-column prop="majorName" label="专业" ></el-table-column>
              <el-table-column prop="politics" label="政治面貌" >
                <div slot-scope="scope">
                {{scope.row.politics==0?'群众':scope.row.politics==1?'团员':scope.row.politics==2?'党员':scope.row.politics==3?'其他党派':scope.row.politics==4?'预备党员':''}}
                </div>

              </el-table-column>
              <el-table-column prop="contact" label="联系方式" ></el-table-column>
              <el-table-column  label="角色" >
              <div slot-scope="scope">

                {{scope.row.role==1?'负责人':scope.row.role==12?'负责人,安全员':scope.row.role==123?'负责人,安全员,宣传员':scope.row.role==13?'负责人,宣传员':scope.row.role==135?'负责人,宣传员,普通成员':scope.row.role==15?'负责人,普通成员':scope.row.role==1235?'负责人,安全员,宣传员,普通成员':scope.row.role==2?'安全员':scope.row.role==23?'安全员,宣传员':scope.row.role==235?'安全员,宣传员,普通成员':scope.row.role==25?'安全员,普通成员':scope.row.role==3?'宣传员':scope.row.role==35?'宣传员,普通成员':scope.row.role==5?'普通成员':''}}
              </div>

              </el-table-column>

              <el-table-column label="操作" width="160" align="left">
                <div slot-scope="scope">
                  <!-- 可转载站点功能未完成 -->
                  <!--              <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/detail','view',scope.row.id,'',params.cur,params.statusAcitive)" v-perms="'/communist/activity/detail'">详情</el-button>-->

                  <el-button type="text" class="opreat-btn" @click.native="showDetaillxs(scope.row.id,scope.row.politics,scope.row.contact)">编辑
                  </el-button>
                  <el-button type="text" class="opreat-btn"
                             @click.native="deletels(scope.row.id,scope.row.role,1)">删除
                  </el-button>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

      </el-tabs>
      <el-dialog title="编辑指导老师信息" :visible.sync="dialogzd" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler('ruleFormzd')">
        <div>

          <el-form size="mini" :model="ruleFormzd" ref="ruleFormzd" class="demo-ruleForm nj qt" :rules="rules">

            <el-form-item align="right" label="职务" >
              <el-input v-model="ruleFormzd.duty" style="width: 84%; "></el-input>
            </el-form-item>
            <el-form-item align="right" label="联系方式" prop="contact">
              <el-input v-model="ruleFormzd.contact" style="width: 84%"></el-input>
            </el-form-item>
            <el-form-item align="right">
              <el-button @click=" submitForm3('ruleFormzd')" type="primary">确定提交</el-button>
              <el-button @click=" dialogzd=false" type="primary">取消</el-button>
            </el-form-item>
          </el-form>

        </div>

      </el-dialog>
      <el-dialog title="编辑成员信息" :visible.sync="dialogxs" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler('ruleFormxs')">
        <div>

          <el-form size="mini" :model="ruleFormxs" ref="ruleFormxs" class="demo-ruleForm nj qt" :rules="rulexs">


            <el-form-item align="right" label="政治面貌" prop="politics">
              <el-select clearable v-model="ruleFormxs.politics" placeholder="请选择政治面貌" style="width: 84%">
                <el-option
                  v-for="item in zzmm"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item align="right"  prop="contact" label="联系方式">
              <el-input v-model="ruleFormxs.contact" style="width: 84%"></el-input>
            </el-form-item>
            <el-form-item align="right">
              <el-button @click=" submitForm4('ruleFormxs')" type="primary">确定提交</el-button>
              <el-button @click=" dialogxs=false" type="primary">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog title="添加指导老师" :visible.sync="tjiazd" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler('ruleFormtj')">
        <div>

          <el-form size="mini" :model="ruleFormtj" ref="ruleFormtj" class="demo-ruleForm nj" :rules="rulezd" label-position="right" label-width="80px">
            <el-form-item align="right" label="姓名" prop="name">
              <el-input v-model="ruleFormtj.name" ></el-input>
            </el-form-item>
            <el-form-item align="right" label="工号" prop="code">
              <el-input v-model="ruleFormtj.code"></el-input>
            </el-form-item>
            <el-form-item align="right" label=" 职务" >
              <el-input v-model="ruleFormtj.duty" ></el-input>
            </el-form-item>
            <el-form-item align="right" label="联系方式" prop="contact">
              <el-input v-model="ruleFormtj.contact" ></el-input>
            </el-form-item>
            <el-form-item align="right">
              <el-button @click=" submitForm1('ruleFormtj')" type="primary">确定提交</el-button>
              <el-button @click=" tjiazd=false" type="primary">取消</el-button>
            </el-form-item>
          </el-form>

        </div>

      </el-dialog>
      <el-dialog title="添加学生" :visible.sync="tjiaxs" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler('ruleFormtjxs')">
        <div>

          <el-form size="mini" :model="ruleFormtjxs" ref="ruleFormtjxs" class="demo-ruleForm nj" :rules="ruletjxs" label-position="right" label-width="80px">
            <el-form-item align="right" label="姓名" prop="name">
              <el-input v-model="ruleFormtjxs.name" ></el-input>
            </el-form-item>
            <el-form-item align="right" label="学号" prop="code">
              <el-input v-model="ruleFormtjxs.code"></el-input>
            </el-form-item>
            <el-form-item align="right" label="政治面貌" prop="politics">
              <el-select clearable v-model="ruleFormtjxs.politics" placeholder="请选择政治面貌"  style="width: 100%">
                <el-option
                  v-for="item in zzmm"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item align="right" label="联系方式" prop="contact">
              <el-input v-model="ruleFormtjxs.contact" ></el-input>
            </el-form-item>
            <el-form-item align="right">
              <el-button @click=" submitForm2('ruleFormtjxs')" type="primary">确定提交</el-button>
              <el-button @click=" tjiaxs=false" type="primary">取消</el-button>
            </el-form-item>
          </el-form>

        </div>

      </el-dialog>
    </div>
</template>

<script>

  export default {
    name: "teamdetall",
    data() {
      var checkPhone = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/

          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        rules: {

          contact: [{required: true, validator: checkPhone, trigger: 'blur' }]

        },
        rulexs: {
          politics: [{
            required: true,
            message: '请选择政治面貌',
            trigger: 'change'
          }],
          contact: [{required: true, validator: checkPhone, trigger: 'blur' }]



        },
        rulezd: {

          code: [{
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          contact: [{required: true, validator: checkPhone, trigger: 'blur' }]
        },
        ruletjxs: {
          politics: [{
            required: true,
            message: '请选择政治面貌',
            trigger: 'change'
          }],
          code: [{
            required: true,
            message: '请输入学号',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          contact: [{required: true, validator: checkPhone, trigger: 'blur' }]
        },
        ruleFormzd:{
          duty:'',
          contact:'',
          teamId:this.$route.query.teamid,
          userId:'',
        },

        ruleFormxs:{
          politics:'',
          contact:'',
          teamId:this.$route.query.teamid,
          userId:'',
        },
        ruleFormtj:{
          duty:'',
          contact:'',
          teamId:this.$route.query.teamid,
          name:'',
          code:''
        },
        ruleFormtjxs:{
          politics:'',
          contact:'',
          teamId:this.$route.query.teamid,
          name:'',
          code:''
        },
        zzmm:[{ code: 0, name: "群众" }, { code: 1, name: "团员" }, { code: 3, name: "其他党派" }, { code: 4, name: "预备党员" }],
        dialogxs:false,
        dialogzd:false,
        tjiazd:false,
        tjiaxs:false,
        loading:false,
        teacherdata:'',
        membersdata:'',
        activeName:'0',
        detalldata:''
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      beforeCloseHandler(r) {
        this.resetForm(r);
      },
      showDetaills(id,duty,contact){
        this.ruleFormzd.userId=id
        this.ruleFormzd.duty=duty
        this.ruleFormzd.contact=contact
        this.dialogzd=true
      },
      showDetaillxs(id,politics,contact){
        this.ruleFormxs.userId=id
        this.ruleFormxs.politics=politics

        this.ruleFormxs.contact=contact
        this.dialogxs=true
      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            this.$http.post("/praxis/editTeacher", this.ruleFormzd).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });

                this.dialogzd = false;
                this.getcy()
              }
            });

          }
        });

      },
      submitForm4(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            this.$http.post("/praxis/editMember", this.ruleFormxs).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });

                this.dialogxs = false;
                this.getcy()
              }
            });

          }
        });

      },
      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            this.$http.post("/praxis/addTeacher", this.ruleFormtj).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });

                this.tjiazd = false;
                this.getcy()
              }
            });

          }
        });

      },
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            this.$http.post("/praxis/addMember", this.ruleFormtjxs).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });

                this.tjiaxs = false;
                this.getcy()
              }
            });

          }
        });

      },
      deletels(id, role,identity) {
        if (role.toString().indexOf('1')>-1) {
          this.$message({
            type: "warning",
            message: "该成员是负责人不可删除"
          });
          return
        }
        this.$confirm("是否删除该成员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post("/praxis/deleteTeamMember", {
            userId: id,
            teamId: this.$route.query.teamid,
            identity:identity
          }).then((res) => {
            if (res.code == 200) {
              this.getcy();
              this.$message({
                type: "success",
                message: "删除成功!"
              })
            }
            ;
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      tableHeaderColor({row, column, rowIndex, columnIndex}){
       if (rowIndex==0){
         return 'background:#bafbfb'
       } ;
      },
      getcy(){
        this.$http.get("/praxis/getTeamMembers",{ params: { teamId: this.$route.query.teamid}}).then(res => {
          this.teacherdata= res.data.teachers;
          this.membersdata= res.data.members;
          this.loading=true
        });
      },
      bianji(){
        this.$router.push({ path: "/social/teamcompile", query: { teamid: this.$route.query.teamid } });
      },
      goxgcy(){
        this.$router.push({ path: "/social/teamcompilecy", query: { teamid: this.$route.query.teamid } });
      },
      getteamdetall(){
        this.$http.get("/praxis/getTeamDetail",{ params: { teamId: this.$route.query.teamid}}).then(res => {
      this.detalldata= res.data;
          this.getcy()
        });
      }
    },
    mounted(){
     this.getteamdetall()

    }


  };
</script>

<style >
 .qt  .el-form-item__error{
    left: 80px !important;
  }
</style>
