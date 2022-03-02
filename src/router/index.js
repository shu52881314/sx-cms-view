  import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes'
import store from '../store/index'
import $http from '@/api/fetch'

import {

  ansycRoutes
} from '@/router/routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: '',
  routes
})
  const whiteList = ['/cas/index','/error/index','/error/maintenance']
router.beforeEach((to, from, next) => {

    let user = localStorage.getItem('sessionKey')
    let perms = store.state.permissions.perms
    
    if (user && to.path == '/login') {
      next("/")
    } else {
      	//点击路由获取提示信息
    //   	$http.get('/system/unreac/count').then(res => {

	   //      store.commit('setUnreacCount',res.data)
	   //      var s = store.state.permissions.menu
    //       if (s) {

    //         s.forEach( (item,index) => {
    //           res.data.forEach( item2 => {
    //             if (item.path == item2.path) {
    //               Vue.set(store.state.permissions.menu[index] ,'count',item2.count)
    //             }
    //           })
    //         })

    //       }
				// })
    if (to.path == '/login') {
      next()
    }  else if (whiteList.indexOf(to.path) !== -1) {
      //如果前往的路径是白名单内的,就可以直接前往
      next()
    }
    else {
      // this.$store.commit('setClick',false)
      if (perms) {
        next()
      } else {
        store.dispatch('setRouters').then(() => {
          router.addRoutes(store.state.permissions.addRouters)
          next({ ...to })
        })
      }

      if (localStorage.getItem('item')) {
        //菜单选中
        let currentPath = to.path
        let mainData = JSON.parse(localStorage.getItem('item'))

        mainData.forEach( item => {
          if (item.path == currentPath) {
            store.commit('setCurrentActive',currentPath)
          }else{
            if (item.children && item.children.length) {
              let flag = 0
              
              item.children.forEach( item2 => {
                if (item2.path == currentPath) {
                  store.commit('setCurrentActive',item.path)
                }else{
                  flag = 1
                }
              })

              if (flag) {
                localStorage.setItem("item",'')
              }
              
            }else{
              //  ansycRoutes.forEach( item => {
              //    if (item.children && item.children.length) {
              //      item.children.forEach( item2 => {
              //        if (item2.path == to.path) {
              //           store.commit('setCurrentActive',item.path)
              //        }
              //      })
              //    }
              //  })

              localStorage.setItem("item",'')
            }
          }
        })

      }
    }
  }
})

export default router