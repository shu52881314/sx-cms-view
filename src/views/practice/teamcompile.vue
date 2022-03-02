<template>
  <section>

    <div style="position:relative;">
      <el-tabs v-model="statusAcitive">
        <el-tab-pane label="编辑" name="1"></el-tab-pane>
      </el-tabs>
      <!--<el-button @click="goTemplate" style="position:absolute;right:0;top:2px;"  type="increase" size="mini">新增团队</el-button>-->
      <!--   <el-button @click="dialogVisible=true" style="position:absolute;right:90px;top:2px;"  type="primary" size="mini">添加历史团队</el-button>-->
    </div>
    <el-form :model="team" :rules="rules" ref="team" label-width="155px" class="demo-team">
      <el-form-item label="团队名称：" prop="teamName">
        <el-input v-model="team.teamName" style="width:30%" placeholder="请输入团队名称" maxlength='30'></el-input>
      </el-form-item>

      <el-form-item label="团队专项：" >
        <el-select clearable v-model="team.specialId" placeholder="请选择团队专项" style="width:30%" >
          <el-option
            v-for="(item,index) in tdzxs"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
        <el-form-item label="所属学院："  >
         <span style="margin-top: 5px;
    display: inline-block;">{{team.collegeName}}</span>
        </el-form-item>
      <el-form-item label="调研主题：" prop="praxisThemeId">
        <el-select clearable v-model="team.praxisThemeId" placeholder="请选择调研主题" style="width:30%" >
          <el-option
            v-for="(item,index) in dyzts"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="是否重点团队：" prop="pointTeam">
        <el-select clearable v-model="team.pointTeam" placeholder="请选择是否重点团队" style="width:30%" >
          <el-option
            v-for="(item,index) in zdtds"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>

      <el-form-item label="实践时间：" prop="teamDate">
        <el-date-picker class="teamWidth" :editable="false" type="datetimerange" v-model="team.teamDate"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="调研地点：" prop="sites">
         <p v-for="item in team.sites">{{item.address}}<i class="el-icon-error" style="margin-left: 3px;cursor: pointer" @click="scdz(item.id)"></i></p>
        <el-button size="mini" type="primary" @click="dialogTableVisible=true">+添加调研地点</el-button>
      </el-form-item>

      <el-form-item label="实践方式：" prop="mannerIdss">
        <el-checkbox-group v-model="mannerIdss" size="mini"  style="margin-top: 5px">
          <span v-for="item in sjfss">
            <el-checkbox :label="item.id" border style="margin-right: 5px" >{{item.name}}</el-checkbox>
          </span>
        </el-checkbox-group>
      </el-form-item>

      <p class="xinxitou">调研内容</p>
      <el-form-item label="背景：" prop="praxisContentBgm">
        <el-col :span="22">
          <el-input type="textarea" v-model="team.praxisContentBgm" placeholder="请输入背景" maxlength='500'
                    style="width: 30%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="目的及意义：" prop="praxisContentAim">
        <el-col :span="22">
          <el-input type="textarea" v-model="team.praxisContentAim" placeholder="请输入目的及意义" maxlength='500'
                    style="width: 30%"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="主要内容：" prop="praxisContentMain">
        <el-col :span="22">
          <el-input type="textarea" v-model="team.praxisContentMain" placeholder="请输入主要内容" maxlength='500'
                    style="width: 30%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="预期成果：" prop="praxisContentExpect">
        <el-col :span="22">
          <el-input type="textarea" v-model="team.praxisContentExpect" placeholder="请输入预期成果" maxlength='500'
                    style="width: 30%"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('team')" style="margin: 15px;">确认修改</el-button>
        <el-button type="primary" @click="qx()" style="margin: 15px;width: 98px;height: 40px">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="地图" :visible.sync="dialogTableVisible">
      <txmap ref="ms" @on-select="addressSelectHandler"></txmap>
    </el-dialog>
  </section>
</template>
<script>
  import { cascade, formatDate, getOssToken, getAliyunImageUrl } from "@/utils/filters";
  import listMixins from "@/mixins/form";
  import txmap from '@/components/txmap'
  import { Message } from "element-ui";
  import axios from "axios";

  export default {
    mixins: [listMixins],
    components: {
      txmap
    },
    data() {

      var checkteamDate = (rule, value, callback) => {

        if(value!=undefined){
          if (this.team.teamDate.length==0) {
            return callback(new Error('请选择实践时间'));
          }else {
            callback()
          }
        }else {
          callback()
        }

      };
      var checkmannerIdss = (rule, value, callback) => {

        if(value==undefined){
          if (this.mannerIdss.length==0) {
            return callback(new Error('请选择实践方式'));
          }else {
            callback()
          }
        }else {
          callback()
        }

      };
      var checksites = (rule, value, callback) => {

        if(value!=undefined){
          if (this.team.sites.length==0) {
            return callback(new Error('请选添加调研地点'));
          }else {
            callback()
          }
        }else {
          callback()
        }

      };
      return {

        dialogTableVisible:false,
        statusAcitive:'1',
        mannerIdss:[],
        tdzxs:[],
        dyzts:[],
        sjfss:[],
        zdtds:[{ id: 0, name: "否" }, { id: 1, name: "是" }],
        teamNormal: {},
        team: {
          teamId:'',
          teamName:'',
          specialId:'',
          praxisThemeId:'',
          pointTeam:'',
          praxisBtime:'',
          praxisEtime:'',
          sites:[],
          collegeName:'',
      mannerIds:'',
      praxisContentBgm:'',
      praxisContentAim:'',
      praxisContentMain:	'',
      praxisContentExpect:'',
          teamDate: [],

        },
        rules: {
          teamName: [{
            required: true, message: "请输入团队名称", trigger: "blur"
          }],
          praxisContentBgm: [{
            required: true, message: "请输入背景", trigger: "blur"
          }],
          praxisContentAim: [{
            required: true, message: "请输入目的及意义", trigger: "blur"
          }],
          praxisContentMain: [{
            required: true, message: "请输入主要内容", trigger: "blur"
          }],
          praxisContentExpect: [{
            required: true, message: "请输入预期成果", trigger: "blur"
          }],

          praxisThemeId: [{
            required: true, message: "请选择调研主题", trigger: "blur"
          }],

          praxisThemeId: [{
            required: true, message: "请选择调研主题", trigger: "change"
          }],
          pointTeam: [{
            required: true, message: "请选择调研主题", trigger: "blur"
          }],

          pointTeam: [{
            required: true, message: "请选择调研主题", trigger: "change"
          }],
          teamDate: [{required: true, validator: checkteamDate, trigger: 'change' }],
          sites: [{required: true, validator: checksites, trigger: 'blur' }],
          mannerIdss: [{required: true, validator: checkmannerIdss, trigger: 'change' }]

        },

        options: [],

      };
    },
    created() {
      this.getxiangqing()


    },
    methods: {
      addressSelectHandler(id, address,name, lat, lng,province,city,area) {
        let addressnow=address+name
        let tmp={
          id:id,
          province:province,
          city:city,
          area:area,
          address:addressnow,
          longitude:lat,
          lng:lng,
        }
        this.team.sites.push(tmp)
this.dialogTableVisible=false
      },
      scdz(id){
        for (let i = 0; i < this.team.sites.length; i++) {
          if (this.team.sites[i].id == id) {
            this.team.sites.splice(i, 1);
          }
        }
      },
      getxiangqing() {

        this.$http.get('/praxis/getTeamDetail', {
          params: {
            teamId: this.$route.query.teamid
          }
        }).then(res => {

          if (res.code == 200) {
            this.team.teamId=res.data.teamId
            this.team.teamName=res.data.teamName
            this.team.collegeName=res.data.collegeName
           this.gettdzx(res.data.collegeId)
           this.getdyzt(res.data.collegeId)
           this.getsjfs()
            this.team.specialId=res.data.specialId
            this.team.praxisThemeId=res.data.themeId
            this.team.praxisContentAim=res.data.praxisContentAim
            this.team.praxisContentBgm=res.data.praxisContentBgm
            this.team.praxisContentMain=res.data.praxisContentMain
            this.team.praxisContentExpect=res.data.praxisContentExpect
            this.team.pointTeam=res.data.pointTeam
            this.team.sites=res.data.sites
            this.team.teamDate = [new Date(res.data.praxisBtime*1000), new Date(res.data.praxisEtime*1000)];
            for (let i = 0; i < res.data.manners.length ; i++) {
              this.mannerIdss.push(res.data.manners[i].id)
            }
          }
        })
      },
      gettdzx(collegeId) {
        this.$http.get("/praxis/getSpecialByCollege",{ params: { collegeId:
            collegeId} }).then(res => {
          this.tdzxs =  res.data;
        });
      },
      getdyzt(collegeId) {
        this.$http.get("/praxis/getThemeByCollegeId",{ params: { collegeId:
            collegeId} }).then(res => {
          this.dyzts =  res.data;
        });
      },
      getsjfs() {
        this.$http.get("/praxis/getManner",).then(res => {
         this.sjfss=res.data
        });
      },
      qx(){
        this.$router.push({ path: "/social/teamdetall", query: { teamid: this.$route.query.teamid } });
      },
      submit(formName) {

        var that = this;

        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {

            that.team.praxisBtime = that.team.teamDate[0].getTime();
            that.team.praxisEtime = that.team.teamDate[1].getTime();
            that.team.mannerIds = that.mannerIdss.toString();

            that.$http.post("/praxis/teamSave", that.team).then(res => {
              if (res.code == "200") {
                that.$refs["team"].resetFields();
                that.$message({
                  type: "success",
                  message: "团队修改成功!"
                });

                this.$router.push({ path: "/social/teamdetall", query: { teamid: this.$route.query.teamid } });
              }
            });

          } else {
            return false;
          }
        });


      }
    },

  };
</script>
<style lang="scss" scoped>
  .xinxitou {
    border-radius: 5px;
    margin-left: 10px;
    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
</style>
