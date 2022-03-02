
<template>
  <div>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>
    <el-dialog title="详情" :visible.sync="dialogxq" :close-on-click-modal="false" width="500px">
      <el-table border :data="as" stripe size="mini" style="width: 100%" ref="multipleTables">

        <el-table-column key="22" prop="name" label="姓名" show-overflow-tooltip></el-table-column>

        <el-table-column key="29" prop="answer" label="征集内容" ></el-table-column>

      </el-table>
    </el-dialog>
    <div v-if="tabs.length>0">
      <el-tabs v-model="statusAcitive" @tab-click="handleClick(statusAcitive)" type="border-card">
        <el-tab-pane
          :key="index+1"
          v-for="(item, index) in tabs"
          :label="'征集'+(index+1)"
        >
          <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
   ">
            <div class="title" style=" float: left;margin-left: 15px;    padding: 7px;
    padding-left: 0;">征集名称:</div>
            <div style="width: 65%;margin-left: 10%;">{{item.name}}<span v-if="dshuo!=1&&applyStatus==1&&statusAll>4" style="background:#e67f1c;color: #fff;padding: 10px; border-radius: 5px;width: 80px;display: inline-block;margin-left: 15px;font-size: 14px;cursor: pointer" @click="dolg(item.questions[0].answers)">查看详情</span></div>
          </div>
          <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
    ">
            <div class="title" style=" float: left;margin-left: 15px;">征集说明:</div>
            <div style="width: 65%;margin-left: 10%; line-height: 24px;">{{item.introduction}}</div>
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
        this.$router.push({path:"/proceeding/wait/activity/collect", query: {applyId:applyId,all:1}})
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
