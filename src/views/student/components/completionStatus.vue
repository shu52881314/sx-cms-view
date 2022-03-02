<template >
  <div class="completionStatus">
    <div class="" style='border-bottom: 1px solid;'>
      学分完成情况
    </div>
    <div  v-for='item in completionData'>
      <div class="hourLists">
        <div class="classifyName">
          {{item.name}}
        </div>
        <div class="obligatory" style='position:relative;padding-top: 6px;' v-for='items in item.limitList'>
          <div class='left'>{{items.name}}：</div>
          <div class="middle">
            <p>
              在校最低{{items.minHours}}积分&nbsp;&nbsp;&nbsp;在校最高{{items.maxHours}}积分
            </p>
            <p class="p2">
              已完成{{items.hasFinishedHours}}分
            </p>
          </div>
          <div class='right' v-if='items.isQualified'>
            已修满
          </div>
          <div class='right' style='color:#FF4545' v-else>
            未修满
          </div>

        </div>
        <!-- <div class="elective" style='position:relative;padding-top: 6px;'>
          <div  class='left'>选修：</div>
          <div class="middle">
            <p>
              每学期最低0.2积分  每学期最高0.2积分
            </p>
            <p class="p2">
              已完成{{item.hours1}}分
            </p>
          </div>
          <div class='right' v-if='false'>
            已修满
          </div>
          <div class='right' style='color:#FF4545' v-if='true'>
            未修满
          </div>

        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:[
    "completionData"
  ],
  data(){
    return{
      hoursList : []
    }
  },
  created(){
  }
}
</script>

<style lang="css" scoped>
.completionStatus{
  padding: 0px 10%;
}
.hourLists {
    padding:10px 20%;
    background: #fff;
    margin: 8px;

    color:#222222;
    font-size: 16px;
    line-height: 35px;
    border-bottom: 1px solid;
  }
  .classifyName{
    color:#222222;
    font-size: 18px;
    font-weight: bold;
  }
  .left{
    float: left;


  }
  .right{

    position: absolute;
    right:0;
    top:10px;
    color:#4D98FF;
    font-size: 16px;

  }
  .middle {
    margin-left: 40px;

  }
  .middle p{
    width: auto;
  }
  .middle .p2{
    color:#4D98FF;
  }
</style>
