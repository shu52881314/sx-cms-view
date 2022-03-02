<template>
    <div> </div>
</template>

<script>

  export default {

    data() {
      return {

      }


    },
    methods: {
      getinfo(school) {

        this.$http.get('/casSso/verifyToken',{params:{school:school}}).then(res => {
          if(res.code==200){
            if(res.data.verify==0){
              // console.log(11)
              window.location.href = res.data.forWardUrl
            }else{

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
              localStorage.setItem("name", res.data.name);
              localStorage.setItem("code", res.data.code);
              localStorage.setItem("identity", res.data.identity);
              localStorage.setItem("username", res.data.username);
              localStorage.setItem("schoolId", res.data.schoolId);

              localStorage.setItem('avatar', res.data.avatar)
              localStorage.setItem('operatorId', res.data.operatorId)
              localStorage.setItem('compulsoryName', res.data.compulsoryName)
              localStorage.setItem('electiveName', res.data.electiveName)
              this.$router.push('/');
            }

          }

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

            that.sysLogo = res.data[0].sysLogo
            localStorage.setItem('schoolName', res.data[0].name)
            localStorage.setItem('hoursUnit', res.data[0].hoursUnit)
            localStorage.setItem('sysschoolLogo', res.data[0].sysLogo)
            localStorage.setItem('mobschoolLogo', res.data[0].mobilLogo)
          }

          this.getinfo(res.data[0].id)

        })
      },
    },
    mounted() {

      if(this.$route.query.token){
        localStorage.setItem("sessionKey", this.$route.query.token)
      }

      let url=document.domain
      this.getSchool(url)
    }
  };
</script>

<style scoped>

</style>
