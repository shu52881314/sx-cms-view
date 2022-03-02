<template>
  <div>
    <div>
      <!-- 头部 -->
      <qu-header></qu-header>
      <el-aside :width="$store.state.sys.asideWidth" style="background:#606266;" class="qu-left-aside">
        <!-- 左侧部 -->
        <module></module>
      </el-aside>
      <div class="qu-content" style="background:#fff;height: 100%; min-height:100vh;" :class="$store.state.sys.asideWidth=='50px'?'right-margin-50':'right-margin-190'">
        <!-- 内容 -->
        <ul class="breadcrumb">
          <li>&nbsp;
            <!--            <span class="iconfont icon-home"></span>-->
          </li>
          <li v-for="(item,index) in $route.matched" :key="item.path" v-if="item.name!=undefined">
            <a v-if="index!=$route.matched.length-1&&!item.meta.isLink">{{item.name}}</a>
            <a href="javascript:void(0)" v-else>{{item.name}}</a>
          </li>
          <!--<li v-for="(item,index) in $route.matched" :key="item.path" v-if="item.name!=undefined">
            <router-link :to="item.path" v-if="index!=$route.matched.length-1&&!item.meta.isLink">{{item.name}}</router-link>
            <a href="javascript:void(0)" v-else>{{item.name}}</a>
          </li>-->
        </ul>

        <!--<el-tabs  v-if="$root.ItemData && $root.ItemData.length && $root.ItemData.length != 1" @tab-click="handleClick" v-model="$store.state.sys.currentActive">-->
        <!--<el-tab-pane v-for="(item,index) in $root.ItemData" :key="item.path"  :label="item.name" :name="item.path" v-if="item.id!=26">-->

        <!--</el-tab-pane>-->
        <!--</el-tabs>-->


        <!--<app-main class="app-main"></app-main>-->
        <router-view class="app-main" style="min-height:100vh"></router-view>
      </div>



      <div class="right-sider" :class="[$store.state.sys.pwdCollapse?'active':'']">
        <!--        <p style="font-size:14px;color: #666; text-align: center; margin-bottom: 20px;">规格型号：QT2018016</p>-->
        <el-form :model="userInfo" :rules="rules" ref="userInfo">
          <el-form-item label="" class="form-group label-no-margin" prop="old">
            <el-col>
              <el-input placeholder="原密码" v-model="userInfo.old" type="password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="" class="form-group label-no-margin" prop="newPass">
            <el-col>
              <el-input placeholder="新密码" v-model="userInfo.newPass" type="password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="" class="form-group label-no-margin" prop="confirm" style="border:none">
            <el-col>
              <el-input placeholder="重复新密码" v-model="userInfo.confirm" type="password"></el-input>
            </el-col>
          </el-form-item>
          <div class="clearfix">
            <el-button type="primary" @click="changePwd" style="float:left;width:47%">修改密码</el-button>
            <el-button type="info" style="float:right;width:47%;background:#999;border-color:#999" @click="closePwd()">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import quHeader from "@/components/header.vue";
  import Module from "@/components/module.vue";
  import cmsTop from "@/components/top.vue";
  import axios from "axios"
  export default {
    components: {
      quHeader,
      Module,
      cmsTop
    },
    data() {
      var old = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入原密码"));
        } else {
          callback();
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.userInfo.newPass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {

        userInfo: {
          old: "",
          newPass: "",
          confirm: ""
        },
        rules: {
          old: [{
            validator: old,
            trigger: "blur"
          }],
          newPass: [{
            validator: validatePass,
            trigger: "blur"
          }],
          confirm: [{
            validator: validatePass2,
            trigger: "blur"
          }]
        },
        ItemActive: this.$router.history.current.fullPath

      }
    },
    computed: {
      //  ItemActive: {
      //   get: function () {
      //     return this.$router.history.current.fullPath
      //   },
      //   set: function () {
      //   }
      // }

    },
    watch: {
      $route(to, from) {
        this.ItemActive = to.path
        //console.log(document.getElementsByClassName('is-active')[document.getElementsByClassName('is-active').length - 1])
      }
      // ItemActive: {
      // handler(newName, oldName) {
      //   this.ItemActive = newName
      // },
      //     // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      // immediate: true
      // }

    },
    methods: {
      handleClick(path) {
        this.$router.push(path.paneName)
      },
      queryChange() {
        let clientWidth = document.body.clientWidth;
        let clientHeight = document.body.clientHeight;
        $('.firstContainer').css('minHeight', (clientHeight - 110) + 'px');
        $('.secondContainer').css('minHeight', (clientHeight - 110) + 'px');
        // $('.app-main').css('minHeight', (clientHeight) + 'px');
        if (clientWidth < 1200) {
          this.$store.dispatch('setCollapse', true);
        } else {
          this.$store.dispatch('setCollapse', false);
        }
      },
      changePwd() {
        this.$refs["userInfo"].validate(valid => {
          if (valid) {

            this.$http.post('/modify/password', this.userInfo)
              .then(res => {

                if (res.code == 200) {
                  this.$message.success("修改成功");
                  this.$store.dispatch('setPwd', false);

                } else {
                  this.$message.error("修改失败");
                }
              })
              .catch(res => {
                this.$message.error("修改失败");
              });
          } else {
            return false;
          }
        });
      },
      closePwd() {
        this.userInfo = {
          old: "",
          newPass: "",
          confirm: ""
        }
        this.$store.dispatch('setPwd', false)
      }

    },
    //     beforeRouteLeave(to, from, next) {
    //       this.$store.dispatch('setPwd', false);
    //       next();
    //     },
    mounted() {

      const self = this;
      $("#main").slimScroll({
        height: "100%",
        width: "auto",
        wrapperClass: "asidebar",
        color: "gray",
        opacity: 1
      });

      self.queryChange();
      window.onresize = () => {
        return (() => {
          self.queryChange();
        })();
      };
    }
  };
</script>
<style lang="scss" scoped>
  .el-header {
    padding: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    -webkit-transform: translateZ(0);
  }

  .qu-left-aside {
    width: 220px;
    z-index: 10;
    background-color: rgb(24, 138, 226);
    bottom: 0;
    margin-top: 0;
    padding-bottom: 0;
    position: fixed;
    top: 60px;
  }

  .icon-home {
    color: #2691e3;
  }

  .breadcrumb {
    height: 50px;
    line-height: 50px;
    overflow: hidden;

    li {
      float: left;
      font-size: 14px;

      a {
        color: #999;
      }
    }
  }

  .right-sider.active {
    right: 0px;
  }

  .right-sider {
    width: 240px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    right: -240px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    transition: opacity 0.3s, transform 0.3s, right 0.3s, top 0.4s;
    overflow: hidden;
    z-index: 999;
    top: 60px;
    height: 100%;
  }
</style>
