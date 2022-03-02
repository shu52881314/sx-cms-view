import store from '@/store/index'
import {
  Encrypt
} from '@/utils/aes'
import $http from '@/api/fetch'
import {cascade4} from '@/utils/filters'
import api from '@/api/api'
import {
  routes,
  ansycRoutes
} from '@/router/routes'

function getAnsycRoutes(permission, asyncRouter) {


  // let lastRouters = []
  //
  // asyncRouter.forEach( item => {
  //   permission.forEach( item2 => {
  //
  //     if(item.path == item2.path){
  //        item.name = item2.name
  //        if(item.children && item.children.length){
  //
  //           let arrChildred = []
  //            item.children.forEach( item3 => {
  //               permission.forEach( item4 => {
  //                 if ( item3.name == item4.name) {
  //                    item3.name = item4.name
  //                    arrChildred.push(item3)
  //                 }
  //                 if (item3.hidden) {
  //                    arrChildred.push(item3)
  //                 }
  //               })
  //            })
  //            item.children = arrChildred
  //        }
  //
  //        lastRouters.push(item)
  //
  //     }
  //
  //   })
  // })
  //
  // return lastRouters


  let routers = []
  // 创建路由
  function createRouter(permission) {

  	if(permission){
  		permission.forEach((item) => {
	      if (item.children && item.children.length) {
	        // 递归
	        createRouter(item.children)
	      }
	      let path = item.path
	      // 循环异步路由，将符合权限列表的路由加入到routers中
	      asyncRouter.find(function(s) {

	        if (s.path == path) {

	          s.name = item.name
	          s.id = item.id
	          s.orderId = item.orderId
	          s.parentId = item.parentId
	          s.meta.id = item.id,
						s.meta.parentId = item.parentId
	          routers.push(s)
	          return
	        }
	      })
	    })
  	}

  }

  createRouter(permission)

  return routers
}

function getSubRoutes(pid, arr) {

      var getChildren = function(pid, data) {

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
  }

// function getSubRoutes(parentId, routers) {
// 	let routes = []
// 	function createRouter(parentId, routers) {
// 		routers.forEach((item) => {
// 			if (item.parentId === parentId) {
// 				createRouter(item.id, item.children)
// 			}
// 			let path = item.path
// 			routers.find(function (s) {
// 				if (s.path === path) {
// 					s.name = item.name
// 					s.id = item.id
// 					s.parentId = item.parentId;
// 					routes.push(s)
// 					return;
// 				}
// 			})
// 		})
// 	}
// 	createRouter(parentId, routers)
// 	return routes
// }

const permission = {
  state: {
    routers: routes,
    addRouters: [],
    menu:[],
    subRouters: [],
    allRouters: [],
    perms: false, // 判断是否刷新过页面
    permissions: null
  },
  mutations: {
  	setRouters:(state, value) => {
        state.routers = value
    },
    SET_ROUTERS: (state, obj) => {
      state.routers = routes.concat(obj.asRouters) // 设置路由表
      state.addRouters = obj.asRouters // 动态路由表
      state.menu = obj.asRouters2 // 菜单
      state.perms = true // 登录状态
      state.permissions = obj.permissions // 权限字符串
    },
    setSubRouters:(state,id) => {

     let result =  getSubRoutes(id,state.allRouters)

     state.subRouters = result




    },
    setAllRouters:(state,routes) => {

      state.allRouters = routes

    },
		SET_SUB_ROUTERS: (state, obj) => {
			state.subRouters = obj.subRouters
		},
    CLEAR_ROUTERS: (state) => {
      state.routers = routes
      state.addRouters = []
      subRouters: [],
        state.perms = false
         state.permissions = null;
      localStorage.setItem('sessionKey', '')
      localStorage.setItem('username', '')
      window.location.reload() // 此处退出vuex状态不刷新，目前发现重载页面可以处理
    }
  },
  actions: {
    setRouters({
      commit
    }) {
      return new Promise((resolve, reject) => {
        let asRouters
        let asRouters2
        // asRouters = ansycRoutes
          let permissionss = []
        $http.get('/system/modules').then(res => {

          localStorage.setItem("allRouters",JSON.stringify(res.data))
          asRouters = getAnsycRoutes(res.data, ansycRoutes) // 递归过滤
          asRouters2 = cascade4(0, res.data) // 递归过滤
          console.log(asRouters2)
          //   function compare(property){
          //     return function(a,b){
          //         var value1 = a[property];
          //         var value2 = b[property];
          //         return value1 - value2;
          //     }
          // }

        function bubbleSort(arr) {

         var len = arr.length;
         for (var i = 0; i < len; i++) {
             for (var j = 0; j < len - 1 - i; j++) {
                 if (arr[j].orderId > arr[j+1].orderId) {        // 相邻元素两两对比
                     var temp = arr[j+1];        // 元素交换
                     arr[j+1] = arr[j];
                     arr[j] = temp;
                 }
             }
         }
         return arr;
      }

      bubbleSort(asRouters2)

      
					for(var i=0;i<res.data.length;i++){
						if(res.data[i].isBtn == 1){

	      			permissionss.push(res.data[i].path)
						}
	      	}
          commit('SET_ROUTERS', {
            asRouters: asRouters,
            asRouters2: asRouters2,
            permissions: permissionss
          })

          resolve(asRouters)

        })
      })
    },
    logout({
      commit
    }) {
      return new Promise((resolve, reject) => {
        $http.position(api.logout).then(res => {
          if (res.code == 200) {
            commit('CLEAR_ROUTERS')
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default permission
