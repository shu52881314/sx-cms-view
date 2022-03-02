
<template>
  <div>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()"></a>

    <div >
      <el-tabs v-model="statusAcitive"  >
        <el-tab-pane
          :key="index+1"
          v-for="(tabs, index) in tabnow"
          :label="'征集'+(index+1)"

        >
          <div>
            <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
   ">
              <div class="title" style=" float: left;margin-left: 15px;">征集名称:</div>
              <div style="width: 65%;margin-left: 10%;">{{tabs.name}}</div>
            </div>
            <div style="     overflow: hidden;
    background: rgb(255, 255, 255);
    padding: 10px 0;
    ">
              <div class="title" style=" float: left;margin-left: 15px;">征集说明:</div>
              <div style="width: 65%;margin-left: 10%; line-height: 24px;">{{tabs.introduction}}</div>
            </div>
            <div v-for=" (ti,index) in tabs.questions" style="  width: 75%;margin-top: 10px;">
              <div v-if="ti.type==1">
                <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span>{{ti.questionStem}}</span>
                </p>
                <p v-for=" (xuanxiang,index) in ti.options" style="padding: 10px" class="xuan">

                  <span><el-radio :value="xuanxiang.righta + ''" label="1"></el-radio></span>
                  <span>{{index+1}}.</span>
                  <span>{{xuanxiang.cont}}</span>

                </p>
              </div>


              <div v-if="ti.type==2">
                <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span>{{ti.questionStem}}</span>
                </p>
                <p v-for=" (xuanxiang,index) in ti.options" style="padding: 10px" class="xuan">
                  <span><el-checkbox :value="xuanxiang.righta + ''" true-label="1"></el-checkbox></span>
                  <span>{{index+1}}.</span>
                  <span>{{xuanxiang.cont}}</span>

                </p>
              </div>
              <div v-if="ti.type==2">
                <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span>{{ti.questionStem}}</span>
                </p>
                <p v-for=" (xuanxiang,index) in ti.options" style="padding: 10px" class="xuan">
                  <span><el-checkbox :value="xuanxiang.righta + ''" true-label="1"></el-checkbox></span>
                  <span>{{index+1}}.</span>
                  <span>{{xuanxiang.cont}}</span>

                </p>
              </div>

              <div v-if="ti.type==4">
                <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span
                  v-html=' ti.questionStem.replace(new RegExp("_","g"),"<input disabled style=\"border: none; border-bottom: 1px solid #000;\" name=\"completion"+ti.questionId+"\"  dataId="+ti.questionId+" class=\"blanks my-input\"/>")'></span>
                </p>
              </div>

              <div v-if="ti.type==5">
                <p class="xinxitou"><span style="margin-right: 5px">{{index+1}}.</span><span
                  v-html="ti.questionStem"></span></p>
                <p style="width: 100%;
    padding: 12px;
    border: 1px solid #ccc;"><span>{{ti.answers.answer}}</span></p>
              </div>
            </div>


          </div>
        </el-tab-pane>

      </el-tabs>



    </div>

  </div>
</template>

<script>
  import { GetPercent} from '@/utils/filters'
  export default {
    name: "communist-activity-questionnaireall",
    data() {
      return {
        inputName: "completion",
        checkeds:[],
        tabnow:[],
        as:[],
        dialogxq:false,
        applyId: this.$route.query.applyId,
        all: this.$route.query.all,
        peg:{
          actId:this.$route.query.actId,
          type:this.$route.query.type,
          userId:this.$route.query.uid

        },
        radiodan:'',
        tabs:{},
        statusAcitive:'0',
      }
    },
    mounted(){
      if(this.all==1){
        this.getgerenpage()
      }else {
        this.getgerenpageone()
      }



    },
    beforeRouteEnter (to, from, next) {
      next();
      localStorage.setItem("frompath",from.fullPath)
    },
    methods:{
      getgerenpage(){
        this.$http.get("/activity/paperInfoByUser",{params: {applyId:this.applyId}}).then(res => {
          this.tabnow=res.data

        })
      },
      getgerenpageone(){
        this.$http.get("/activity/paperInfosByStudent",{params: this.peg}).then(res => {
          for(var i=0; i<res.data.length; i++){
            if(res.data[i].applyId){

              this.getgerenpagetwo(res.data[i].applyId)
            }
          }

        })
      },
      getgerenpagetwo(applyId){
        this.$http.get("/activity/paperInfoByUser",{params: {applyId:applyId}}).then(res => {
          this.tabnow.push(res.data)
          // console.log(res.data)
          // this.tabs=res.data
          let that = this;
          that.$nextTick(() => {
            for (let j = 0; j < res.data.questions.length; j++) {
              let qAId = res.data.questions[j].questionId;
              console.log(document.getElementsByName(that.inputName + qAId).length)
              if (res.data.questions[j].type == 4) {//填空
                for (let i = 0; i < document.getElementsByName(that.inputName + qAId).length; i++) {
                  document.getElementsByName(that.inputName + qAId)[i].setAttribute("value", res.data.questions[j].answers.answer.split(",")[i]);
                  let len = document.getElementsByName(that.inputName + qAId)[i].getAttribute("value").length;
                  if (len > 0) {
                    document.getElementsByName(that.inputName + qAId)[i].style.width = len * 2 + "%";
                  }
                  ;

                }

              }
            }
            // let len=document.getElementsByClassName('blanks')[k].getAttribute('value')
            //
            // if (len.length>10){
            //   document.getElementsByClassName('blanks')[k].style.width=len.length*2+'%'
            // } ;


          });

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
