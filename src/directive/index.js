
import Vue from 'vue'
import store from '@/store/index'
Vue.directive("perms", {
  bind(el, binding) {
    let perms = store.state.permissions.permissions;//按钮权限指令
    if(perms != '*'){
      if(perms.indexOf(binding.value)<0){
      	setTimeout(()=>{
        	el.parentNode.removeChild(el);//权限不通过删除元素
      	},500)

      }else{
        return false
      }
    }else{
      return false
    }
  }
});
