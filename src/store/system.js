import { setBaseUrl } from '@/config.js'
import Vue from 'vue'
const systemConfig = {
    state: {
        fileProgresss:[],
    	  unreacCount:'',
        currentActive:'',
        isClick:false,
        collapse: false,
        pwdCollapse:false,
        asideWidth:'180px',
        baseUrl: setBaseUrl(),
        resourceUpLoad: setBaseUrl() + '/api/admin/resource/upload',
        templateUpLoad: setBaseUrl() + '/api/admin/template/upload',
        importTpl: setBaseUrl() + '/api/admin/template/importTpl',
    },
    mutations: {
        setProgresss:(state, value) => {
          if (state.fileProgresss &&  state.fileProgresss.length) {
            let flag = false
            state.fileProgresss.map( (item,index) => {
              if (item.name == value.name) {
                item.progress = value.progress
                flag = true
              }
            })
            if (!flag) {
              state.fileProgresss.push(value)
            }
          }else{
              state.fileProgresss.push(value)
          }
            // state.fileProgresss = value
        },
        setProgresssBack:(state, value) => {
      
          state.fileProgresss = value
        },
        clearProgresss:(state, value) => {

          state.fileProgresss = []

        },
        deleteProgresss:(state, value) => {


         state.fileProgresss =   state.fileProgresss.filter( (item,index) => {
             return item.name != value.name
          })

        },
      	setUnreacCount:(state, value) => {
            state.unreacCount = value
        },
        setClick:(state, value) => {
            state.isClick = value
        },
        setCurrentActive:(state, value) => {
            state.currentActive = value
        },
        CHANGE_SET: (state, value) => {
            if(value==undefined){
                state.collapse = !state.collapse;
            }else{
                state.collapse = value ? true : false;
            }
            state.asideWidth = state.collapse?'50px' :'180px';
        },
        PWD_SET:(state,value)=>{
            state.pwdCollapse=value;
        }
    },
    actions: {
        setCollapse({ commit },value) {
            commit('CHANGE_SET',value);
        },
        setPwd({commit},value){
            commit('PWD_SET',value);
        }
    }
}

export default systemConfig
