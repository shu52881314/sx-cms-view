<template>
  <div class="login-container" style="background: #ECF6FF;">
    <!-- <div class="qu-header" style="height: 85px;padding:  0 75px;overflow: hidden;">
      <div class="header-left" style="height: 85px;">
        <img src="../assets/images/logo.png" class="header-logo" style="width: 435px;">
      </div>
      <div class="header-right" style="height: 85px;">
				<span>
					<span style="display: block;float: left;color: #000000;padding-left: 15px;">
						<p style="font-size: 14px;color: #8f8d8d">让科技遍布校园每一个角落 by 顼科技</p>
					</span>
				</span>
      </div>
    </div> -->
    <div class="login-inner-box">


      <div class="login-form">
        <div style="     position: absolute;
    width: 422px;
    top: -102px;
    left: -59px;">
          <img :src="sysLogo" alt="" style="display: block;width: 100%">
        </div>
        <div v-show="forgetpassword" @keydown.enter="login">

          <div class="val" style="display: none">

            <el-select @change="schoolChange(loginForm.schoolId)" v-model="loginForm.schoolId"
                       style="margin-bottom:15px;" class="login-input" filterable disabled>
              <el-option v-for="(item,index) in schools" :key="index" :label="item.name" :value="item.id">

              </el-option>
            </el-select>
          </div>
          <div class="val user-after">

            <label id="userName">账号:</label>
            <input style="border:1px solid rgb(220, 223, 230);text-indent:10px;" type="text" autocomplete="off"

                   v-model="loginForm.username"

                   @keyup.enter="login"
                   class="login-input user">

          </div>
          <div class="val pwd-after">
            <label id="pwd">密码:</label>
            <input style="border:1px solid rgb(220, 223, 230);text-indent:10px;" type="password"
                   autocomplete="new-password"
                   v-model="loginForm.password"

                   @keyup.enter="login"
                   class="login-input user">

          </div>

          <div  class="val">
            <span style="display: inline-block;
    width: 254px;
    margin-right: 40px;">  <el-button v-loading="$store.state.sys.isClick" round style="      width: 100%;
    height: 35px;
    margin-bottom: 45px;
    color: rgb(237, 108, 0);
    background-color: rgb(255, 255, 255) !important;
    font-size: 18px;
    line-height: 13px;"
                               class="login-input login-btn" @click="login" id="login">登 &nbsp;&nbsp;&nbsp; 录
          </el-button></span>
            <span style="float: right;color: #fff;font-size: 14px;cursor: pointer;margin-top: 7px;" @click="forgetpassword=false"> 忘记密码？</span>
          </div>

        </div>
        <div v-show="!forgetpassword" style="text-align: center;color: #fff">

          <div class="val ">
            请联系学校客服专员找回密码
            <br/>
            联系方式：13716481741（同微信号）
          </div>

          <el-button round style="height:40px;color: #FFFFFF;margin-top: 40px;margin-bottom: 40px;"
                     class="login-input login-btn" @click="forgetpassword=true">返回
          </el-button>
        </div>

      </div>
    </div>
    <!--<div class="fixed-bar" style="color: #a6b2c6;">-->
    <!--<p>趣拓校园</p>-->
    <!--<p>Copyright © 2018 2ketang.com  趣拓2ketang.com 版权所有</p>-->
    <!--</div>-->
    <el-dialog width="450px" title="安全验证" :visible.sync="reStatusShow">
      <slide-verify style="margin: 0 auto;" :show="reStatusShow" :l="42"
                    :r="10"
                    :w="310"
                    ref="slideLogin"
                    :h="155"
                    type="2"
                    :slider-text="sliderText"
                    @success="onSuccess"
                    @fail="onFail"
                    @refresh="onRefresh"
                    :imgs="imgs"
      ></slide-verify>

    </el-dialog>
  </div>
</template>

<script>
  // import CanvasAnimate from "@/plugins/canvas";
  import qs from 'querystring'

  export default {
    data() {
      return {
        imgs: ['/static/images/yzimg/img.jpg','/static/images/yzimg/img1.jpg','/static/images/yzimg/img2.jpg','/static/images/yzimg/img3.jpg','/static/images/yzimg/img4.jpg','/static/images/yzimg/img5.jpg'],
        sysLogo:'',
        reMsg: '',
        reStatus: false,
        forgetPassShow: false,
        reStatusShow: false,
        sliderText: '向右滑动来验证',
        change: {
          code: '',
          mobile: '',
          captcha: '',
          uid: '',
          type: '2'
        },
        forgetpassword: true,
        codeImg: '',
        schools: [],
        loading: false,
        params: {
          username: "",
          password: ""
        },
        loginForm: {
          uid: '',
          schoolId: '',
          username: '',
          password: '',
          captcha: '',
        },
        loginFont: "确认登录"

      }
    },
    created() {
       let domain = document.domain
      // let domain = "aepu.schtestv2.dongst.cn"
      this.getSchool(domain)
      this.getCaptcha()
    },
    methods: {
      onSuccess(){
        this.reStatus = true;
        const that = this;
        this.sliderText = '验证成功';
        setTimeout(function () {
          that.login();
        },1000)
      },
      onFail(){
        this.sliderText = '验证失败请重试';
        this.reStatus = false;
      },
      onRefresh(){
        this.sliderText = '向右滑动来验证';
        this.reStatus = false;
      },
      schoolChange(val) {
        this.schools.forEach(o => {
          if (o.id == val) {
            localStorage.removeItem("schoolId")
            this.schoolName = o.name;
            this.schoolLogo = o.logo;
            localStorage.setItem("hoursUnit", o.hoursUnit);
            localStorage.setItem("schoolName", this.schoolName);
            localStorage.setItem("schoolLogo", this.schoolLogo);
          }
        })
      },
      getCaptcha() {
        this.$http.get('/common/image/captcha',
          {
            params:
              {uid: this.loginForm.uid},
          }).then(res => {

          this.loginForm.uid = res.data.uid;
          this.change.uid = res.data.uid;
          this.codeImg = 'data:image/png;base64,' + res.data.image;
        })

      },

      getSchool(domain) {
        let that = this
        this.$http.get("/common/getschool", {
          params: {
            domain: domain,
          }
        }).then(res => {
          if (res.code == '200') {
            that.schools = res.data
            that.loginForm.schoolId = res.data[0].id
            that.sysLogo = res.data[0].sysLogo
            localStorage.setItem('schoolName', res.data[0].name)
            localStorage.setItem('hoursUnit', res.data[0].hoursUnit)
            localStorage.setItem('sysschoolLogo', res.data[0].sysLogo)
            localStorage.setItem('mobschoolLogo', res.data[0].mobilLogo)
          }


        })
      },
      requirecode() {
        if (!this.change.code) {
          $("#code")
            .addClass("error")
            .text("请填写用户名");
          return false
        } else {
          $("#code")
            .removeClass("error")
            .text("");
          return true
        }
      },
      requireUserName() {
        if (!this.loginForm.username) {
          this.$message({
            type: "error",
            message: "请填写账号!"
          });
          return
        }

      },
      requiremobile() {
        if (!this.change.mobile) {
          $("#changemobile")
            .addClass("error")
            .text("请填写手机号");
          return false
        } else {
          $("#changemobile")
            .removeClass("error")
            .text("");
          return true
        }
      },
      requirePwd() {
        if (!this.loginForm.password) {
          this.$message({
            type: "error",
            message: "请填写密码!"
          });
          return
        }

      },
      requireChangeCaptcha() {
        if (!this.change.captcha) {
          $("#changecaptcha")
            .removeClass("error")
            .text("请填写验证码");
          return false
        } else {
          $("#changecaptcha")
            .removeClass("error")
            .text("");
          return true
        }
      },
      requireCaptcha() {
        if (!this.loginForm.captcha) {
          $("#captcha")
            .removeClass("error")
            .text("请填写验证码");
          return false
        } else {
          $("#captcha")
            .removeClass("error")
            .text("");
          return true
        }
      },
      changePwd() {
        $("#pwd")
          .removeClass("error")
          .text("");
      },
      changepasswork() {
        var that = this
        if (this.requiremobile() && this.requirecode() && this.requireChangeCaptcha()) {
          this.$confirm('此操作将重新发送随机密码到用户手机是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.$http.post('/common/forget', that.change).then(res => {

              if (res.code == 200) {
                that.forgetpassword = true
                that.$message({
                  type: 'success',
                  message: '短信发送成功!'
                });
                that.getCaptcha()
              }
            })
          }).catch(error => {
          });
        }

      },
      login() {

        // if (this.params.username == "" || this.params.password == "") {
        //   this.requireUserName();
        //   this.requirePwd();
        // } else {}



        this.loading = true;

        if (!this.loginForm.username||!this.loginForm.password) {
          this.$message({
            type: "error",
            message: "请填写账号或者密码!"
          });
          return
        }else {
          this.$store.commit('setClick', true)
          this.getCaptcha()
          if(!this.reStatus){
            this.reStatusShow = true;
            this.loading = false;
            return;
          }
          this.$http.get('/token', {params: this.loginForm}).then(res => {

            if (res.code === '200') {

              localStorage.setItem("sessionKey", res.data.access_token)

              this.$http.post("/login").then(res => {

                if (res.code == 200) {
                  if (localStorage.getItem("IsfirstLogin")) {
                    localStorage.setItem("IsfirstLogin", 0)
                  } else {
                    localStorage.setItem("IsfirstLogin", 1)

                  }

                  if (res.data.isAdmin) {
                    localStorage.setItem("isAdmin", 1)
                  } else {
                    localStorage.setItem("isAdmin", 0)
                  }


                  this.sys_error = ""
                  localStorage.setItem("name", res.data.name);
                  localStorage.setItem("code", res.data.code);
                  localStorage.setItem("identity", res.data.identity);
                  localStorage.setItem("username", this.loginForm.username);
                  localStorage.setItem("schoolId", res.data.schoolId);

                  localStorage.setItem('avatar', res.data.avatar)
                  localStorage.setItem('operatorId', res.data.operatorId)
                  localStorage.setItem('compulsoryName', res.data.compulsoryName)
                  localStorage.setItem('electiveName', res.data.electiveName)
                  this.$router.push('/');
                } else {
                  this.sys_error = res.msg
                  this.loading = false;
                  this.loginFont = "登录";

                }
                this.loading = false;
                this.loginFont = "登录";
              })
            }else{
              this.$refs.slideLogin.reset();
              this.reStatus = false;
              this.reStatusShow = false;
              this.sliderText = '请重新输入账号密码,向右滑动来重试';
            }
          })
        }
      },
      restInfo() {
        this.loading = false;
        this.loginFont = "登录";
        this.params.password = "";
      },
    },
    mounted() {
      if (localStorage.getItem("username")) {
        this.change.code = localStorage.getItem("username")
      }
      if (localStorage.getItem("mobile")) {
        this.change.mobile = localStorage.getItem("mobile")
      }
    }
  }
</script>

<style scoped lang="scss">
  .val {
    width: 100%;
    margin: 15px auto;
    position: relative;
    z-index: 99;
  }

  .login-form {
  }

  .user-after::after {
    position: absolute;
    top: 8px;
    right: 15px;
    color: #FFF;
    font-family: "iconfont";
    font-size: 24px;
    content: "\e65e";
  }

  .pwd-after::after {
    position: absolute;
    top: 10px;
    right: 16px;
    color: #FFF;
    font-family: "iconfont";
    font-size: 24px;
    content: "\e65f";
  }

  .val label {
    position: absolute;
    top: 5px;
    left: -50px;
    z-index: 999;
    color: #fff;
    -webkit-transition: 0.25s right linear;
    transition: 0.25s right linear;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
    font-size: 18px;
  }

  .val label.error {
    right: 48px;
    transition: 0.5s right;
  }

  $header-height: 60px;
  .qu-header {
    width: 100%;
    height: $header-height;
    background: #fff;
    border-bottom: 1px solid #e0e4e9;
    box-shadow: 10px 1px 15px rgba(76, 123, 255, 0.17);
    padding: 0 24px;
  }

  .header-left {
    float: left;
    display: flex;
    align-items: center;
    height: $header-height;

  }

  .header-right {
    float: right;
    display: flex;
    align-items: center;
    height: $header-height;

    .iconfont {
      cursor: pointer;
      font-size: 20px;
      color: #777777;
      margin-left: 25px;

      &:hover {
        color: #ffffff;
      }
    }
  }


</style>
