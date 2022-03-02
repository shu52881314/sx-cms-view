<template>
<div class="templatePeople-line-li">
  <div style="float:left;">
    <div class="templatePeople-line-top"><span @click="deleteActivityAuditList(index)"></span></div>
    <div class="templatePeople-line-bottom" v-html="showAuditName(index,item.assignFirst,item.assignSecond,item.sourceName)"></div>
  </div>
  <div style="padding-top:30px;width:40px;float:left;margin-left:30px;" v-if="isShowAdd(tag,index)">
    <img src="../../../assets/images/more.png">
  </div>
</div>
</template>

<style scoped lang="scss">
.templatePeople-line {

    &-li {
        float: left;
        display: inline;
        width: 170px;
        height: 170px;
        margin-right: 30px;
        margin-bottom: 20px;
    }
    &-top {
        width: 70px;
        height: 70px;
        position: relative;
        border-radius:4px;
        background: url("../../../assets/images/touxiang(1).png") no-repeat center center ;
        margin: 0 auto;
      background-size: 100% 100%;
        span {
            display: block;
            position: absolute;
            right: -10px;
            top: -10px;
            width: 25px;
            height: 25px;
            cursor: pointer;
            background: url("../../../assets/images/close.png") no-repeat;
        }
    }
    &-bottom {
        text-align: center;
        width: 90px;
        overflow: hidden;
        font-size: 14px;
        color: #666;
        padding-top: 6px;
        line-height: 22px;
    }
}
</style>

<script>
export default {
  props: ["item", 'index', "tag",'list'],
  data() {
    return {

    }
  },
  watch: {

  },
  created() {

  },
  methods: {
    //添加隐藏
    isShowAdd(tag, index) {
      if (this.tag == 1) {
        if (index < 19) {
          return true
        } else {
          return false
        }
      } else {
        if (index < 0) {
          return true
        } else {
          return false
        }
      }
    },
    //删除
    deleteActivityAuditList(index) {
      this.$emit('deleteList', index, this.tag)
    },
    transIndex(index){
    },
    showAuditName(index, type, type2, name) {

       this.transIndex(index)

      //上级机构
      if (type == 1) {
        if (type2 == 11) {
          return "<p>上级机构<p><p>负责人</p>"
        } else if (type2 == 12) {
          return "<p>上级机构<p><p>管理员</p>"
        } else if (type2 == 13) {
          return "<p>上级机构<p><p>负责人或管理员</p>"
        }
        //指定机构
      } else if (type == 2) {
        if (type2 == 11) {
          return "<p>" + name + "</p>" + "<p>(负责人)</p>"
        } else if (type2 == 12) {
          return "<p>" + name + "</p>" + "<p>(管理员)</p>"
        } else if (type2 == 13) {
          return "<p>" + name + "</p>" + "<p>(负责人或管理员)</p>"
        }
      } else if (type == 3) {
        //指定人员
        return name
      } else if (type == 4) {
        //挂靠单位
        if (type2 == 11) {
          return "<p>挂靠单位<p><p>负责人</p>"
        } else if (type2 == 12) {
          return "<p>挂靠单位<p><p>管理员</p>"
        } else if (type2 == 13) {
          return "<p>挂靠单位<p><p>负责人或管理员</p>"
        }
      } else if (type == 5) {
        //指定人员
        return "指导老师"

      } else if (type == 6) {
        //指定组织
        if (type2 == 11) {
          return "<p>" + name + "</p>" + "(负责人)"
        } else if (type2 == 12) {
          return "<p>" + name + "</p>" + "(管理员)"
        } else if (type2 == 13) {
          return "<p>" + name + "</p>" + "(负责人或管理员)"
        }

      }
    },

  }
}
</script>
