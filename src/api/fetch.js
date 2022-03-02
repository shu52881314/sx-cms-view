import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import router from '../router/index'

import { Message,Loading} from 'element-ui'
import { setBaseUrl } from '@/config.js'
import { getRand } from '@/utils/random'
import { signParams } from '@/utils/sign'

import {Encrypt, Decrypt} from '@/utils/encrypt';

var loadingnow        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loadingnow = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)',
    body:true
  })

}

function endLoading() {    //使用Element loading-close 方法
  loadingnow.close()
}


function showError(value) {
  return Message({
    showClose: true,
    message: value,
    type: 'error',
    duration: 3500
  })
}

axios.defaults.baseURL = setBaseUrl()
axios.defaults.timeout = 60000

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config => {

  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // config.headers['Content-Type'] = 'multipart/form-data'

            let  AuthorObj = {}

            if (process.env.NODE_ENV === 'production') {

              if(localStorage.getItem('sessionKey')){
                 // AuthorObj.token = Decrypt(localStorage.getItem('sessionKey'))
                 AuthorObj.token = localStorage.getItem('sessionKey')
              }else{
                 AuthorObj.token = ""
              }

            }

            if (process.env.NODE_ENV === 'development') {
              AuthorObj.token = localStorage.getItem('sessionKey') || ""
            }

            AuthorObj.platform = 3
            AuthorObj.timestamp =  new Date().getTime()
            config.headers['Authorization'] = Encrypt( JSON.stringify(AuthorObj) )




  let params = {
    // appId: appId,
    // nonce_str: getRand(),
    // _site_id_param: _site_id_param
  }

  // if (sessionKey && sessionKey != '') {
  //   params.sessionKey = sessionKey
  // }
  // params = signParams(params, appKey)   // 返回签名后的对象

  // config.data = qs.stringify({params: JSON.stringify(params)})   // 序列化
  if (config.method === 'post') {
    startLoading()
    if (config.data) {

      if (process.env.NODE_ENV === 'production') {

        let data = encodeURI(Encrypt(JSON.stringify(config.data)))
        data =   data.replace("+","%2B")
        config.data = qs.stringify({params: data});

      }
      if (process.env.NODE_ENV === 'development') {

           // config.data = qs.stringify({params: encodeURI(Encrypt(JSON.stringify(config.data))) });
          config.data = qs.stringify({params: JSON.stringify(config.data)});
      }



    }
  } else if (config.method === 'get') {
    startLoading()

      if (config.params) {


        if (process.env.NODE_ENV === 'production') {

          let data = encodeURI(Encrypt(JSON.stringify(config.params)))
          data =   data.replace("+","%2B")
          config.params = {params: data};

        }
        if (process.env.NODE_ENV === 'development') {

              // let data = encodeURI(Encrypt(JSON.stringify(config.params)))
              // data =   data.replace("+","%2B")
              // config.params = {params: data};

           config.params = {params: JSON.stringify(config.params)};
        }


      }
  }

  return config
}, err => {

  Promise.reject(err)   // 错误提示
})

/**
 * 响应拦截器
 */
axios.interceptors.response.use(res => {

  store.commit('setClick',false)
  let data = ''
  if (process.env.NODE_ENV === 'production') {

           if(res.data.code != 10001){

             if(res.data.type){
                  data = res.data;
             }else{
                  data = JSON.parse(Decrypt(res.data));
             }



           }else{
             data = res.data
           }
  }
  if (process.env.NODE_ENV === 'development') {
      data = res.data
      // data = JSON.parse(Decrypt(res.data));
  }
 if(data){
   endLoading()
 };
  if (data.code) {


    switch (data.code) {

      case '200':

      break;
      case '10001':

        localStorage.setItem('sessionKey', '')
        localStorage.setItem('username', '')
        router.push('/login')
        break;
      default:
        // showError(data.code + ':' + data.msg)
        showError(data.msg)
        break;
    }
  }


  return data
}, err => {
  endLoading()
  showError('服务器响应失败')
  return Promise.reject(err)
})

export default axios
