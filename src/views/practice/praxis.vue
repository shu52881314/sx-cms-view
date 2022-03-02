<template>
  <section>

    <div style="position:relative;">
      <el-tabs v-model="params.statusAcitive">
        <el-tab-pane label="团队管理" name="1"></el-tab-pane>
      </el-tabs>
      <!--<el-button @click="goTemplate" style="position:absolute;right:0;top:2px;"  type="increase" size="mini">新增活动</el-button>-->
      <!--   <el-button @click="dialogVisible=true" style="position:absolute;right:90px;top:2px;"  type="primary" size="mini">添加历史活动</el-button>-->
    </div>

    <div class="search-box">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item label="所属学院: ">
          <el-select clearable v-model="params.collegeId" placeholder="请选择所属学院" @clear="clearzx" @change="zxdata">
            <el-option
              v-for="item in colleges"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队专项: ">
          <el-select clearable v-model="params.specialId" placeholder="请选择团队专项">
            <el-option
              v-for="item in tdzxs"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否重点团队: ">
          <el-select clearable v-model="params.pointTeam" placeholder="请选择">
            <el-option
              v-for="item in iszds"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否党员团队: ">
          <el-select clearable v-model="params.partyTeam" placeholder="请选择">
            <el-option
              v-for="item in iszdys"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="实践时间">
          <el-date-picker
            clearable
            :editable="false"
            v-model="sjsj"
            @change='change'
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </el-form-item>

        <el-form-item label="调研地点: ">
          <el-select v-model="params.provinceName" placeholder="请选择省" clearable @clear="clearsheng" @change="shidata">
            <el-option
              v-for="item in shengs"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="params.cityName" placeholder="请选择市" clearable @clear="clearshi" @change="xiandata">
            <el-option
              v-for="item in shis"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="params.areaName" placeholder="请选择县" clearable>
            <el-option
              v-for="item in xians"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地点: ">
          <el-input v-model="params.addressName" maxlength=30 placeholder="请输入详细地点"></el-input>
        </el-form-item>
        <el-form-item label="团队名称: ">
          <el-input v-model="params.teamName" maxlength=30 placeholder="请输入团队名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="importFile" type="warning" size="mini" v-perms="'/communist/activity/delete'">导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
        <el-table-column prop="teamName" label="团队名称" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="specialName" label="团队专项" show-overflow-tooltip></el-table-column>
        <el-table-column prop="collegeName" label="所属学院" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否重点团队" show-overflow-tooltip>
          <div slot-scope="scope">
            {{scope.row.pointTeam==1?'是':'否'}}
          </div>
        </el-table-column>
        <el-table-column label="指导老师">
          <div slot-scope="scope">
            <p v-for="item in scope.row.teachers">{{item.name}}-{{item.code}}</p>
          </div>
        </el-table-column>
        <el-table-column label="负责人" width="120">
          <div slot-scope="scope">
            {{scope.row.principal.name}}-{{scope.row.principal.code}}
          </div>
        </el-table-column>
        <el-table-column  label="是否党员团队" show-overflow-tooltip>
          <div slot-scope="scope">
            {{scope.row.partyTeam==1?'是':'否'}}
          </div>
        </el-table-column>
        <el-table-column prop="peopleNum" label="团队人数" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column  label="实践时间" width="105" >
          <div slot-scope="scope">
            {{scope.row.praxisBtime | formatD}}至{{scope.row.praxisEtime| formatD}}
          </div>
        </el-table-column>


        <el-table-column label="操作" width="160" align="left">
          <div slot-scope="scope">
            <!-- 可转载站点功能未完成 -->
            <!--              <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/detail','view',scope.row.id,'',params.cur,params.statusAcitive)" v-perms="'/communist/activity/detail'">详情</el-button>-->
            <el-button type="text" class="opreat-btn"
                       @click.native="deleteBatch(scope.row.teamId)">解散团队
            </el-button>
            <el-button type="text" class="opreat-btn" @click.native="showDetail(scope.row.teamId)"
                      >查看详情
            </el-button>


          </div>
        </el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </section>
</template>
<script>
  import { Message } from "element-ui";
  import { cascade, cascade3 } from "@/utils/filters";
  import axios from "axios";

  export default {
    data() {
      return {
        sjsj:[],
        isShow:false,
        activeName: "first",
        shengs: [],
        shis: [],
        xians: [],
        tdzxs: [],
        colleges: [],
        iszds: [{ code: 0, name: "否" }, { code: 1, name: "是" }],
        iszdys: [{ code: 0, name: "否" }, { code: 1, name: "是" }],
        tdzts: [{ code: 0, name: "尚未组队完成" }, { code: 1, name: "组队完成尚未创建项目" }, { code: 2, name: "已创建项目" }],
        loading: false,
        params: {
          cur: 1,
          size: 10,
          collegeId: "",
          specialId:"",
          pointTeam: "",
          partyTeam: "",
          provinceName: "",
          cityName: "",
          areaName: "",
          addressName: "",
          teamName: "",
          teamStatus: "2",
          praxisBtime:'',
          praxisEtime:'',
        },
        classifies: [{ id: "", name: "全部" }],
        data: [],
        total: 0,
        options: [{ id: "", name: "不限" }],
        systemClassifysList: [],
        dialogVisible: false,
        activity: {
          calssIds2: "",
          activityLimitType: "",
          name: "",
          organizationId: "",
          managerId: "",
          hours: "",
          activityDate: "",
          introduce: ""
        },
        optionsClassify: [],
        options4: [],
        limitTypeOptions: [],
        selectPlaceholder: "",
        showLimit: false,
        dateArray: {
          statTime2:'',
          endTime2:'',
        },
        selectClassify: []
      };
    },
    methods: {
      showDetail(id) {
        this.$router.push({ path: "/social/praxisdetall", query: { teamid: id } });
      },
      change(value){
        if (this.sjsj && this.sjsj.length) {
          this.params.praxisBtime = this.sjsj[0].getTime();
          this.params.praxisEtime = this.sjsj[1].getTime();
        }else{
          this.sjsj = []
          this.params.praxisBtime = ""
          this.params.praxisEtime = ""
        }

      },
         clearzx(){
        this.params.specialId=""
           this.tdzxs=[]
         },
      zxdata(){
        if(this.params.collegeId!=''){
          this.params.specialId=""
          this.tdzxs=[]
         this.gettdzx()
        }
      },
      //清除下拉框
      clearsheng() {
        this.params.provinceName = "";
        this.params.cityName = "";
        this.params.areaName = "";
        this.shis = [];
        this.xians = [];
      },
      clearshi() {
        this.params.cityName = "";
        this.params.areaName = "";
        this.xians = [];
      },
      shidata() {
        if (this.params.provinceName != "") {
          this.params.cityName = "";
          this.params.areaName = "";
          this.shi();
        }
        ;
      },
      xiandata() {
        if (this.params.cityName != "") {
          this.params.areaName = "";
          this.xian();
        }
        ;
      },

      gettdzx() {
        this.$http.get("/praxis/getSpecialByCollege",{ params: { collegeId:
            this.params.collegeId } }).then(res => {
          this.tdzxs =  res.data;
        });
      },
      college() {
        this.$http.get("/school/college/list").then(res => {
          this.colleges =  res.data

          // this.optionsClassify = cascade(0, res.data)
        });
      },
      sheng() {

        this.$http.get("/school/getprovince").then(res => {
          this.shengs = res.data;
        });
      },
      shi() {

        this.$http.get("/school/getcity", { params: { pcode: this.params.provinceName } }).then(res => {
          this.shis = res.data;
        });
      },
      xian() {

        this.$http.get("/school/getarea", { params: { pcode: this.params.cityName } }).then(res => {
          this.xians = res.data;
        });
      },
      goTemplate() {

        this.$router.push({ path: "/communist/activityTemplateUP", query: { oto: this.$route.query.oto } });

      },

      importFile() {
        // axios({
        //   method: "get",
        //   url: "activity/list/export",
        //   responseType: "blob",
        //   params: {
        //     type: 1,
        //     oto: 1
        //   }
        // }).then((res) => {
        //   if (!res) {
        //     return;
        //   }
        //   var filename = name;
        //   let url = window.URL.createObjectURL(res);
        //   let link = document.createElement("a");
        //   link.style.display = "none";
        //   link.href = url;
        //   link.setAttribute("download", "团队列表" + ".xlsx");
        //   document.body.appendChild(link);
        //   link.click();
        // });

      },

      fetch() {
        this.loading = true;
        this.$http.get("/praxis/getTeamList", { params: this.params }).then(res => {

          if (res.code == 200) {
            this.data = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        });
      },
      search() {
        this.params.cur = 1;
        if (this.params.provinceName){
          for (let i=0;i<this.shengs.length;i++){
            if (parseInt(this.params.provinceName)==parseInt(this.shengs[i].code)){
              this.params.provinceName=this.shengs[i].name
            } ;
          } ;
        }
        if (this.params.cityName){
          for (let i=0;i<this.shis.length;i++){
            if (parseInt(this.params.cityName)==parseInt(this.shis[i].code)){
              this.params.cityName=this.shis[i].name
            } ;
          } ;
        }
        if (this.params.areaName){
          for (let i=0;i<this.xians.length;i++){
            if (parseInt(this.params.areaName)==parseInt(this.xians[i].code)){
              this.params.areaName=this.xians[i].name
            } ;
          } ;
        }

        this.fetch();
      },
      changePage(cur, size) {
        this.params.cur = cur;
        this.params.size = size;
        this.fetch();
      },
      deleteBatch(id) {
        let  that=this
        this.$confirm("是否继续解散团队?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post("/praxis/destroyTeam", {
            teamId: id,
          }).then(res => {
            if (res.code == "200") {
              that.$message({
                type: "success",
                message: "解散成功!"
              });
              that.fetch();
            }

          }).catch(error => {
          });
        });
      }

    },

    created() {
      this.college()
      this.sheng();
      // this.gettdzx();
    },
    mounted() {
      if (this.$route.query.page) {
        this.params.cur = parseInt(this.$route.query.page);
        this.params.statusAcitive = this.$route.query.status;
      }
      if (this.$route.query.cur) {
        this.params = this.$route.query;
        if (this.$route.query.selectClassify) {
          this.selectClassify = [];
          var s = this.$route.query.selectClassify.split(",");
          for (var i = 0; i < s.length; i++) {
            this.selectClassify.push(parseInt(s[i]));
          }
        }
      }

      this.fetch();

    }

  };
</script>
<style lang="scss" scoped>
  .el-form-item {
    margin-right: 5px !important;
  }
</style>
