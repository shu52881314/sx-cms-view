<template>
    <a class="cms-back" href="javascript:void(0)" @click="goBack()">
    </a>
</template>


<script>
  export default {
    name: 'back',
    props: {
      value: '',
      label: {
        type: String,
        default: 'label'
      },
      page:'',
      status:'',
      goRouter:'',
      width: {
        type: Number,
        default: 160
      }
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    methods: {
      goBack(){

        if (this.page) {
            this.$router.push({
              path:this.goRouter,
              query:{
                page:this.page,
                status:this.status,
              }
            })
        }else{
          this.$router.go(-1)
        }

      }
    }
  }
</script>

<style scoped lang="scss">

</style>
