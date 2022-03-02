<template>
  <div class="cylst">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="修改成员信息" name="0">
        <div style="border: 1px solid #ccc;width:80%;margin-top: 15px;font-size: 14px ">
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #fb9a5d;
">
            <span style="padding: 0 20px;min-width: 140px;color: #fff">指导老师</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
              <i style="font-style: normal;"  v-for="item in teacherdata">{{item.name}},</i>
            </span>
          </p>
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #fb9a5d;
">
            <span style="padding: 0 20px;min-width: 140px;color: #fff">负责人</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
              <i style="font-style: normal;"  v-for="item in membersdata">{{item.role.toString().indexOf('1')>-1?item.name:''}}</i>
            </span>
          </p>
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #fb9a5d;
">
            <span style="padding: 0 20px;min-width: 140px;color: #fff">安全员</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                  <el-select clearable v-model="anqy.userId" placeholder="请选择安全员"  style="width: 100%">
          <el-option
            v-for="item in membersdata"
            :key="item.id"
            :label="item.name+'-'+item.code"
            :value="item.id">
          </el-option>
        </el-select>
            </span>
          </p>
          <p style="border-bottom: 1px solid #ccc;display:flex;
    display: -webkit-flex;
    align-items:center;
    background: #fb9a5d;
">
            <span style="padding: 0 20px;min-width: 140px;color: #fff">宣传员</span>
            <span style="padding: 10px 10px;    border-left: 1px solid #ccc;    width: -webkit-fill-available;
    background: #fff;">
                  <el-select clearable v-model="xcy.userId" placeholder="请选择宣传员"  style="width: 100%">
          <el-option
            v-for="item in membersdata"
            :key="item.id"
            :label="item.name+'-'+item.code"
            :value="item.id">
          </el-option>
        </el-select>
            </span>
          </p>

        </div>

        <el-form  ref="team"  class="demo-team" style="width: 81%">
          <div class="main-body">
            <el-table border :loading="loading" :data="memberszongls" stripe size="mini" style="width: 100%" :header-cell-style="tableHeaderColor" >
              <el-table-column  label="排序" type='index' width="200px" align="center">
                <!--<div slot-scope="scope">-->
               <!--{{index}}-->
                <!--</div>-->
              </el-table-column>
              <el-table-column  label="成员" align="center" >
                <div slot-scope="scope" >
                  <!--<div v-if="scope.row.sancu">-->
                  <!--{{scope.row.name}}-{{scope.row.code}}<i class="el-icon-error" style="margin-left: 5px;cursor: pointer" @click="huixsc(scope.row.id)"></i>-->
                  <!--</div>-->
                    <el-select  v-model="xy[scope.row.sort]" placeholder="请选择学员"  style="width: 100%"  @change="changeSelect($event,scope,xy[scope.row.sort])"  @focus="xialagx(xy[scope.row.sort])"  >

                      <el-option
                        v-for="(item,index) in membersls"
                        :key="index"
                        :disabled="item.sancu!=null"
                        :label="item.name+'-'+item.code"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  <span style="    position: absolute;
    top: 11px;
    right: 55px;" v-if="xy[scope.row.sort]">
                    <i class="el-icon-error" @click="sanchu(xy[scope.row.sort])"></i>
                  </span>
                </div>

              </el-table-column>


            </el-table>

          </div>
          <el-form-item align="center">
            <el-button type="primary" @click="qrxg()" style="margin: 15px;">确认修改</el-button>
            <el-button type="primary" @click="qx()" style="margin: 15px;width: 98px;height: 40px">取消</el-button>
          </el-form-item>

        </el-form>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>

  export default {
    name: "teamdetall",
    data() {

      return {
        jy:false,
        team:'',
        anqy:{
          userId:'',
          role:'2'
        },
        xcy:{
          userId:'',
          role:'3'
        },
        xy:{},
        orders:[],
        loading:false,
        activeName:'0',
        teacherdata:'',
        membersdata:[],
        membersls:[],
        memberszongls:[],
        lssj:[],
        huixian:false,
        num:0,
        zc:''
      }
    },
    methods: {
      qx(){
        if (this.$route.query.xiangmu){
          this.$router.push({ path: "/social/praxisdetall", query: { teamid: this.$route.query.teamid } });
        }else {
          this.$router.push({ path: "/social/teamdetall", query: { teamid: this.$route.query.teamid } });
        };

      },
      xialagx(o){
         this.zc=o
      },
      sanchu(val){
 if(val!=undefined){
   for (var key in this.xy){

     if(val==this.xy[key]){
       this.xy[key]=''
     }
   }

   for (let i = 0; i < this.membersls.length ; i++) {
     if (val==this.membersls[i].id){
       this.memberszongls[i].sancu=null
     }

   }
 }



      },

      changeSelect(val){




        for (let i = 0; i < this.membersls.length ; i++) {
          if (val==this.membersls[i].id){
           this.memberszongls[i].sancu=val
          }
          if (this.zc==this.membersls[i].id){
            this.memberszongls[i].sancu=null
          }
        }
        //




      },

      tableHeaderColor({row, column, rowIndex, columnIndex}){
        if (rowIndex==0){
          return 'background:#2233CC;color: #fff'
        } ;
      },
      qrxg() {

        var orders=[]
        console.log(this.xy)
        for (var key in this.xy){
          let tmp={
            userId:this.xy[key],
            ordrNum:parseInt(key),
            sancu:this.xy[key]
          }
          if (this.xy[key]!=''){
            orders.push(tmp)
          } ;
        } ;
        console.log(orders)
        if (this.anqy.userId==''){
              this.$message({
                type: "warning ",
                message: "选择安全员"
              });
              return
        } ;
        if (this.xcy.userId==''){
              this.$message({
                type: "warning ",
                message: "选择宣传员"
              });
              return
        } ;

        if (orders.length!=this.membersdata.length){
              this.$message({
                type: "warning ",
                message: "您还未有学生进行排序！请进行排序。"
              });
              return
        } ;
        let roles=[]
        roles.push(this.anqy)
        roles.push(this.xcy)


        this.$http.post("/praxis/setTeamRoleAndOrder", {teamId: this.$route.query.teamid,roles:roles,orders:orders}).then(res => {
          if (res.code == "200") {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            if (this.$route.query.xiangmu){
              this.$router.push({ path: "/social/praxisdetall", query: { teamid: this.$route.query.teamid } });
            }else {
              this.$router.push({ path: "/social/teamdetall", query: { teamid: this.$route.query.teamid } });
            }
          }
        });

      },
      getcy(){
        this.$http.get("/praxis/getTeamMembers",{ params: { teamId: this.$route.query.teamid}}).then(res => {
          this.teacherdata= res.data.teachers;

          for (let i = 0; i < res.data.members.length ; i++) {
            this.membersdata.push(res.data.members[i])
          }
          for (let i = 0; i < res.data.members.length ; i++) {
            this.memberszongls.push(res.data.members[i])
          }
          for (let i = 0; i < res.data.members.length ; i++) {
            this.membersls.push(res.data.members[i])
          }


          var obj = {}; //或者 var obj=new Object();
          for (let i = 0; i < this.membersls.length ; i++) {
           if (this.membersls[i].role.toString().indexOf('2')>-1){
             this.anqy.userId=this.membersls[i].id;
           } ;
            if (this.membersls[i].role.toString().indexOf('3')>-1){
              this.xcy.userId= this.membersls[i].id;
            } ;
            if (this.membersls[i].sancu!=null){


              //对象动态添加
              obj[this.membersls[i].sort] = this.membersls[i].id;

            }


          }
         this.xy=obj
          console.log(this.xy)
          this.loading=true
        });
      },
    },
    mounted(){
      this.getcy()
    }


  };
</script>

<style >

</style>
