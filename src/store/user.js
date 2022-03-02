import store from '@/store/index'
import $http from '@/api/fetch'
import api from '@/api/api'
import { Encrypt } from '@/utils/aes'

const user = {
  state: {
    username: '',
    localLanguage: 'zh'
  },
  mutations: {
    LOGIN_STATE: (state, params) => {
      localStorage.setItem('sessionKey', params)
      localStorage.setItem('localLanguage', 'zh')
      state.username = localStorage.getItem('username')
    }
  },
  actions: {
    login({ commit }, params) {
      let username = params.username
      let password = params.password
      // password = Encrypt(params.password, process.env.aesKey, process.env.ivKey)
      return new Promise((resolve, reject) => {
        $http.post(api.login, {username: username, password: password}).then(res => {
          if (res.code == 200) {
            localStorage.setItem('username', username)
            commit('LOGIN_STATE', res.token)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
