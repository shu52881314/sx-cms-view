<template>
  <div id="app">
    <router-view v-if="loaded"/>
  </div>
</template>

<script>
  import qs from 'querystring'
  import url from 'url'
  import CryptoJS from 'crypto-js'

  export default {
    name: 'App',
    data() {
      return {
        loaded: false
      }
    },
    created() {

      let fromUrl = window.location.href;
      let fromSchool = qs.parse(url.parse(fromUrl).query);

      if (fromSchool.from) {
        this.ishaveToken(fromSchool)
      } else {
        this.loaded = true
      }
    },
    methods: {
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
      ishaveToken(fromSchool) {

        if (fromSchool.from == 'guangdongIndustry') {

          this.$http.get("/third/token", {
            params: {
              schoolId: '11845',
              username: fromSchool.code
            }
          }).then(res2 => {

            if (res2.code == 200) {

              localStorage.setItem("sessionKey", res2.data.access_token)

              this.$http.post("/login").then(res => {
                if (res.code == 200) {

                  this.loaded = true
                  this.sys_error = ""
                  localStorage.setItem("name", res.data.name);
                  localStorage.setItem("code", res.data.code);
                  localStorage.setItem("schoolId", res.data.schoolId);
                  localStorage.setItem('schoolLogo', res.data.schoolLogo)
                  localStorage.setItem('avatar', res.data.avatar)
                  localStorage.setItem('operatorId', res.data.operatorId)
                  localStorage.setItem('compulsoryName', res.data.compulsoryName)
                  localStorage.setItem('electiveName', res.data.electiveName)
                  setTimeout(item => {
                    let template = JSON.parse(localStorage.getItem('allRouters'))

                    localStorage.setItem("subRouters", JSON.stringify(this.getSubRoutes(34, template)))
                    this.$root.demos()
                  }, 1000)


                  this.$router.push('/communist/activity/launch');

                }

              })

            }
          })


        } else if (fromSchool.from == 'fync') {

          let objString = fromSchool.params.replace(/ /g, "+")

          let decode = CryptoJS.AES.decrypt(objString,
            CryptoJS.enc.Utf8.parse('1qqqqwwweeeerrrt'),
            {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            })
          let decryptResult = decode.toString(CryptoJS.enc.Utf8);
          decryptResult.toString().toUpperCase();
          let result = qs.parse(decryptResult);


          this.$http.get("/third/token", {
            params: {
              schoolId: '10371',
              username: result.code
            }
          }).then(res2 => {
            if (res2.code == 200) {

              localStorage.setItem("sessionKey", res2.data.access_token)

              this.$http.post("/login").then(res => {

                if (res.code == 200) {

                  this.loaded = true
                  this.sys_error = ""
                  localStorage.setItem("name", res.data.name);
                  localStorage.setItem("schoolId", res.data.schoolId);
                  localStorage.setItem('schoolLogo', res.data.schoolLogo)
                  localStorage.setItem('avatar', res.data.avatar)
                  localStorage.setItem('operatorId', res.data.operatorId)
                  localStorage.setItem('compulsoryName', res.data.compulsoryName)
                  localStorage.setItem('electiveName', res.data.electiveName)
                  setTimeout(item => {
                    let template = JSON.parse(localStorage.getItem('allRouters'))

                    localStorage.setItem("subRouters", JSON.stringify(this.getSubRoutes(34, template)))
                    this.$root.demos()

                  }, 1000)
                  this.$router.push('/');
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  /*修改全局表格中下边框的值*/
  .el-table td {
    border-bottom: 1px solid #dcdfe6;
  }
</style>
