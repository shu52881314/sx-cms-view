<template>
  <div id="aside">
    <!-- <el-menu class="el-menu-vertical-demo" background-color="#ffffff" text-color="#000000" active-text-color="#ffffff" :collapse="$store.state.sys.collapse" unique-opened router>
            <template v-for="item in $store.state.permissions.routers" v-if="!item.hidden" >
                <el-menu-item v-if="item.leaf && item.children.length>0" :index="item.path" class="first-item" :key="item.id" @click="go(item.id)">
                    <i :class="item.icon" class="iconfont iconfont1"></i>
                        <span class="collapse-font" slot="title">{{item.name}} <el-badge class="mark" :max="99" :value="item.count" v-if='item.count&&item.count!=0' style='padding-bottom: 5px;'/></span>
                </el-menu-item>
            </template>
        </el-menu> -->
    <el-menu
      :unique-opened="false"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      text-color="#fff"
      @close="handleClose"
      background-color="#606266">
      <!--v-if="isSHowDesk != 1"-->
      <el-menu-item @click="goHome" index="1" class="first-item">
        <i class="iconfont icon-shouye03"></i>
        <span class="collapse-font" slot="title">首页</span>
      </el-menu-item>

      <template v-for="(item,index) in $store.state.permissions.menu">


        <el-submenu :index="item.id + ''" :key="index" v-if="item.children && item.children.length">

          <template slot="title">
            <i :class="item.icon" class="iconfont iconfont1"></i>
            <span class="collapse-font" slot="title">
              {{item.name}}<el-badge v-if="item.count && item.count > 0" is-dot class="item" style="position:absolute;top:-5px;padding-left:5px;"></el-badge>
            </span>
          </template>

          <template v-for="(child,index2) in item.children">
            <el-menu-item @click="goItem(child)" :index="child.id + ''">{{child.name}}</el-menu-item>
          </template>
        </el-submenu>

        <!-- <el-menu-item v-else :index="item.id" class="first-item" :key="item.id">
          <i :class="item.icon" class="iconfont iconfont1"></i>
          <span class="collapse-font" slot="title">{{item.name}} 77</span>
        </el-menu-item> -->

      </template>
    </el-menu>

  </div>
</template>

<script>
  import '@/plugs/slimscroll.min.js'
  import VueI18n from 'vue-i18n'
  import cmsZhLocale from '@/i18n/lang/zh_CN'
  import cmsEnLocale from '@/i18n/lang/en'
  import store from '../store/index'

  export default {
    name: "module",
    data() {
      return {
        isSHowDesk: localStorage.getItem('identity'),
        activeIndex: "/work",
        isCollapse: false
      };
    },
    methods: {
      goHome() {
        this.$root.ItemData = []
        this.$router.push("/")
      },
      goItem(item) {
        localStorage.removeItem("daishenshenbao")
        let hash ="";
        if(undefined==item.children){
          hash = item.path

        }else {
          localStorage.setItem("item", JSON.stringify(item.children))
          this.$root.getItemenu()
          hash = item.children[0].path

        }

        this.$router.push(hash)

      },
      iscorresponding(path, path2) {
        if (path == path2) {
          return true
        } else {
          return false
        }
      },
      getSubRoutes(pid, arr) {

        var getChildren = function (pid, data) {

          var children = [];
          data.forEach(item => {
            var strs = item.parentId
            if (strs === pid) {
              if (getChildren(item.id, data).length > 0) {
                children.push({
                  name: item.name,
                  path: item.path,
                  children: getChildren(item.id, data)
                })
              } else {
                children.push({
                  name: item.name,
                  path: item.path,
                })
              }

            }
          });
          return children;
        }
        return getChildren(pid, arr)
      },
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      go(id) {

        let template = JSON.parse(localStorage.getItem('allRouters'))
        localStorage.setItem("subRouters", JSON.stringify(this.getSubRoutes(id, template)))

        this.$root.demos()
      },
    },
    watch: {
      $route: function (to, from) {
        this.activeIndex = this.$route.path;
      }
    },
    created() {
      this.$root.demos()
      this.$root.getItemenu()
    },
    mounted() {
      this.activeIndex = this.$route.matched[1].path;
      $("#aside").slimScroll({
        height: "100%",
        width: "auto",
        wrapperClass: "asidebar",
        color: "#fff",
        opacity: 0
      });
    }
  };
</script>

<style lang="scss" scoped>
  #aside .iconfont {
    color: #FFF;
  }

  #aside .el-menu-vertical-demo .el-menu-item:hover {
    background: url(../assets/images/module.png) repeat !important;
    color: #FFFFFF !important;
  }

  .el-menu-item.is-active {
    color: #fff !important;
    background: linear-gradient(#e8962e, #e45131) !important;
  }

  .full-height {
    width: 180px;
    height: 100%;
  }

  .el-menu {
    position: relative;
    z-index: 55;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
  }

  .el-menu-vertical-demo {
  }

  .cms-menu-title {
    display: inline-block;
    padding: 20px 24px 15px 24px;
    width: 100%;
    font-size: 14px;
    color: #3caeff;
    transition: 0.5s;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .collapse-font {
    margin-left: 12px;
  }

  .el-menu--collapse {
    position: fixed;
    z-index: 500;
  }

  .el-menu--collapse .iconfont {
    font-size: 24px;
    margin-left: 0;
    position: relative;
    left: -7px;
  }

  .parent-padding {
    padding-left: 56px !important;
  }


  .iconfont {
    color: #fff;
  }

  .el-badge__content {
    border: none;
  }

  .el-badge__content.is-dot {
    height: 6px;
    width: 6px;
  }
</style>
