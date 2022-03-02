<template>
  <header class="qu-header">
    <div class="header-left" style="width: 500px;">
      <a href="javascript:void(0)" class="cms-slide-menu" @click="collapseMenu" style="margin: 0;"></a>
      <span>&nbsp;&nbsp;{{schoolName}}</span>
    </div>
    <div class="header-right">
      <div class="header-user-group">
        <!--管理员头像-->
        <!--<img v-if="avatar" :src="avatar" alt="" class="user-logo" />
                  <img v-else src="./../assets/images/userlogo.png" alt="" class="user-logo" />-->
        <span class="username">{{username}}</span>
      </div>
      <span title="修改密码" v-if="isSHowDesk != 1" style="color: white" class="iconfont icon-bianji-copy"
            @click="showPwd"></span>
      <!-- <span title="查看首页"  class="iconfont icon-wangzhan-copy" @click="getIndex"></span> -->
      <span title="退出" style="color: white" class="iconfont icon-out-copy" @click="logout"></span>
    </div>
  </header>
</template>

<script>
  import i18n from "@/i18n";

  export default {
    name: "qu-header",
    data() {
      return {
        isSHowDesk: localStorage.getItem('identity'),
        username: localStorage.getItem('name'),
        schoolName: localStorage.getItem('schoolName'),
        schoolLogo: localStorage.getItem('schoolLogo'),
        avatar: localStorage.getItem('avatar'),

      };
    },
    computed: {},
    methods: {
      //数据大屏
      clickDataV() {
        window.open('/dataV', '_blank');
      },
      collapseMenu() {//侧边栏收缩
        this.$store.dispatch("setCollapse");
      },
      showPwd() {
        if (this.$store.state.sys.pwdCollapse) {
          this.$store.dispatch('setPwd', false);
        } else {
          this.$store.dispatch('setPwd', true);
        }

      },
      toggleLocal() {

      },
      logout() {//退出登录
        this.$confirm('确定退出吗？', '提示', {type: "warning"})
          .then(mes => {
            // localStorage.removeItem("sessionKey");
            // localStorage.removeItem("name");
            // localStorage.removeItem("roleName");
            // localStorage.removeItem("lastLoginTime");
            // localStorage.removeItem("userName");
            // localStorage.removeItem("compulsoryName");
            // localStorage.removeItem("electiveName");
            localStorage.clear()
            window.location.href = "/login"
          })
          .catch(error => {
          });
      },
      getIndex() {//查看首页
        window.open(this.$store.state.sys.baseUrl);
      }
    },

  };
</script>

<style lang="scss" scoped>
  .top-share {
    padding: 0;
    margin-top: 5px;
    background: url("./../assets/images/fenxi.png") no-repeat;
    width: 146px;
    float: right;
    margin-right: 88px;
    cursor: pointer;
    font-size: 15px;
    color: #fff;
    line-height: 52px;
    text-indent: 40px;
    border: none;
  }

  .iconfont {
    color: white !important;
  }

  .iconfont:hover {
    color: #DCDFE6 !important;
  }

  $header-height: 60px;
  .qu-header {
    width: 100%;
    height: $header-height;
    background: linear-gradient(#e8962e, #e45131);
    border-bottom: 1px solid #e45131;
    box-shadow: 10px 1px 15px rgba(76, 123, 255, 0.17);
    padding: 0 24px;
    position: fixed;
    top: 0;
    z-index: 99999;
    -webkit-transform: translateZ(0);

  }

  .header-left {
    float: left;
    display: flex;
    align-items: center;
    height: $header-height;
    color: white;
    width: 220-24px;
  }

  .header-right {
    float: right;
    display: flex;
    align-items: center;
    height: $header-height;

    .iconfont {
      cursor: pointer;
      font-size: 20px;
      color: white;
      margin-left: 25px;

      &:hover {
        color: #188ae2;
      }
    }
  }

  @media screen and(max-width: 700px) {
    .header-right {
      display: none;
    }
    .header-left {
      width: 100%;
      color: white;

      .header-logo {
        text-align: center;
        margin: 0 auto;
      }
    }
  }

  .header-user-group {
    display: flex;
    color: white;
    height: $header-height;
    line-height: $header-height;
    align-items: center;
  }

  .user-logo {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .header-logo {
    margin-left: 26px;
  }

  .cms-slide-menu {
    height: 18px;
    width: 18px;
    background: url("./../assets/images/collapse.png") no-repeat;
    margin-left: 73-26px;
  }

  .cur {
    cursor: pointer;
  }

</style>
