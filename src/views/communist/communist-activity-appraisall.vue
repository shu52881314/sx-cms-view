
<template>
  <div>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
    <el-dialog title="详情" :visible.sync="dialogxq" :close-on-click-modal="false" width="500px">
      <el-table border :data="as" stripe size="mini" style="width: 100%" ref="multipleTables">

        <el-table-column key="22" prop="name" label="姓名" show-overflow-tooltip></el-table-column>

        <el-table-column key="29" prop="answer" label="答案" ></el-table-column>
        <el-table-column key="30" label="查看答卷" >
          <div slot-scope="scope">
            <el-button
              type="text" class="opreat-btn" @click="chakanwj(scope.row.applyId)">查看答卷</el-button>
          </div>

        </el-table-column>
      </el-table>
    </el-dialog>
    <div v-if="tabs.length>0">
      <el-tabs v-model="statusAcitive" @tab-click="handleClick(statusAcitive)" type="border-card">
        <el-tab-pane
          :key="index+1"
          v-for="(item, index) in tabs"
          :label="'测评'+(index+1)"

        >
          <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
   ">
            <div class="title" style=" float: left;margin-left: 15px;">测评名称:</div>
            <div style="width: 65%;margin-left: 10%;">{{item.name}}</div>
          </div>
          <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
    ">
            <div class="title" style=" float: left;margin-left: 15px;">测评说明:</div>
            <div style="width: 65%;margin-left: 10%; line-height: 24px;">{{item.introduction}}</div>
          </div>
          <div v-for=" (ti,index) in item.questions" style="  width: 75%;margin-top: 10px;" v-if="ti.type==1">
            <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span>{{ti.questionStem}}</span><span>({{ti.score}}分)</span></p>
            <p v-for=" (xuanxiang,index) in ti.options" style="padding: 10px" class="xuan">
              <span ><el-radio v-model="radiodan" ></el-radio></span>
              <span >{{index+1}}.</span>
              <span>{{xuanxiang.cont}}</span>
              <span v-if="dshuo!=1&&applyStatus==1&&statusAll>4">{{xuanxiang.poll}}票 ({{ xuanxiang.poll,ti.people|GetPercent}})</span>
            </p>
          </div>
          <div v-for=" (ti,index) in item.questions" style="  width: 75%;margin-top: 10px;" v-if="ti.type==2">
            <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span>{{ti.questionStem}}</span><span>({{ti.score}}分)</span></p>
            <p v-for=" (xuanxiang,index) in ti.options" style="padding: 10px" class="xuan">
              <span ><el-checkbox v-model="checkeds"></el-checkbox></span>
              <span >{{index+1}}.</span>
              <span>{{xuanxiang.cont}}</span>
              <span v-if="dshuo!=1&&applyStatus==1&&statusAll>4">{{xuanxiang.poll}}票 ({{ xuanxiang.poll,ti.people|GetPercent}})</span>
            </p>
          </div>
          <div v-for=" (ti,index) in item.questions" style="  width: 75%;margin-top: 10px;" v-if="ti.type==4">
            <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span v-html="ti.questionStem"></span><span>({{ti.score}}分)</span> <span v-if="dshuo!=1&&applyStatus==1&&statusAll>4" style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="dolg(ti.answers)">查看详情</span></p>
          </div>
          <div v-for=" (ti,index) in item.questions" style="  width: 75%;margin-top: 10px;" v-if="ti.type==5">
            <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span v-html="ti.questionStem"></span> <span>({{ti.score}}分)</span><span v-if="dshuo!=1&&applyStatus==1&&statusAll>4" style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="dolg(ti.answers)">查看详情</span></p>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>
    <div v-if="tabs.length<=0" style="height:300px;text-align:center;padding-top:150px;">
      暂无数据
    </div>
  </div>
</template>

<script>
  import { GetPercent} from '@/utils/filters'
  export default {
    name: "communist-activity-questionnaireall",
    data() {
      return {
        checkeds:[],
        as:[],
        dialogxq:false,
        dshuo: this.$route.query.dshuo,
        applyStatus: this.$route.query.applyStatus,
        statusAll: this.$route.query.statusAll,
        radiodan:'',
        tabs:[],
        statusAcitive:'0',
        params:{
          actId:this.$route.query.actId,
          type:this.$route.query.type,
        }
      }
    },
    mounted(){
      this.getpage()


    },
    beforeRouteEnter (to, from, next) {
      next();
      localStorage.setItem("frompath",from.fullPath)
    },
    methods:{
      chakanwj(applyId){
        this.$router.push({path:"/proceeding/wait/activity/appraisal", query: {applyId:applyId,all:1}})
      },
      dolg(asw){
        if(asw.length<=0){
          this.$message({
            type: 'error',
            message: '暂无答题信息'
          });
        }else {
          this.as=asw
          this.dialogxq=true
        }

      },
      getpage(){
        this.$http.get("/activity/paperInfos",{params: this.params}).then(res => {
          this.tabs=res.data
        })
      },
      handleClick(activeName){
        this.statusAcitive=activeName
      },
      goBack() {
        this.$router.push({
          path:  localStorage.getItem("frompath"),
          query:{actitype:this.$route.query.actitype}
        })
      }
    }
  };
</script>

<style scoped>
  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
  .xuan{
    overflow: hidden;
  }
  .xuan span:nth-child(1){
    line-height: 15px;
    width: 14px;
  }
  .xuan span:nth-child(3){
    width: 80%;

  }
  .xuan span{
    float: left;
    line-height: 20px;
    margin-left: 10px;
  }
</style>
