<template>
  <section v-loading="loading" >
    <section class="qu-left-main" style="overflow-y:auto;min-height:500px;">
      <el-menu class="" router>
				<el-menu-item-group v-for="item in $root.rootData" :key="item.name"  :title="item.name">
					<el-menu-item v-for="sub in item.children" :key="sub.name" :index="sub.path" v-if="sub.path != '/dataV'" style="padding-left: 30px;" @click='goTwo'>

					 {{sub.name}} <el-badge class="mark" :max="99" :value="sub.count" v-if='sub.count&&sub.count!=0' style='padding-bottom: 5px;'/>
					</el-menu-item>
				</el-menu-item-group>
      </el-menu>
    </section>
	  <!-- <section class="qu-right-main"> -->
	  <section class="qu-right-main firstContainer">
			<router-view></router-view>
	  </section>
  </section>
</template>

<script>
  export default {
		props: {
			loading: {
				type: Boolean,
				default: false
			},
		},
    data() {
      return {}
    },
    methods: {
    	goTwo(){
    		this.$root.counts()
    	},
       init(){
            //  this.menuData = JSON.parse(localStorage.getItem('subRouters'))

             this.loading = false;
       }
    },
    created() {
      this.init()
    },
    mounted() {

    }
  };
</script>
<style scoped lang="scss">

</style>
