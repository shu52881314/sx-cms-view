import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import permissions from './permissions'
import sys from './system'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules : {
    user,
    permissions,
    sys
  }
})

export default store
