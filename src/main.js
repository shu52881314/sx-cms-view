// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '../theme/index.css'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import 'babel-polyfill'
import cmsComponents from "@/components/index";
import global from "@/utils/global"//全局方法
// import VueSocketio from 'vue-socket.io'

import AMap from 'vue-amap'
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '1340aae4499cc92d45c715a57e44ea4f',
  plugin: ['AMap.Autocomplete','Geocoder', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
})

import * as filters from '@/utils/filters';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import '~/css/index.scss'//cms样式

import '@/directive/index'
Vue.use(cmsComponents);
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.use(global);
import SlideVerify from 'vue-monoplasty-slide-verify';

Vue.use(SlideVerify);
// Vue.use(VueSocketio, 'http://192.168.1.183:7001/socket')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
  data(){
    return{
      rootData:[],
      ItemData:[],
    }
  },

  methods:{
    demos(){
      this.rootData = JSON.parse(localStorage.getItem('subRouters'))
      this.counts()

    },
    getItemenu(){
      if (localStorage.getItem('item')) {
          this.ItemData = JSON.parse(localStorage.getItem('item'))
      }

    },
    counts(){
    	// var v=this.$root.rootData
      // var s = this.$store.state.sys.unreacCount
	    // for(var i =0; i<v.length;i++){
	    // 	if(v[i].children){
	    // 		for(var f =0; f<v[i].children.length;f++){
		  //   		for(var n=0;n<s.length;n++){
		  //   			if(v[i].children[f].path == s[n].path){
		  //   				this.$set(this.$root.rootData[i].children[f], 'count', s[n].count)
		  //   			}
		  //   		}
		  //   	}
	    // 	}
      //
	    // }
    }
  }
})
