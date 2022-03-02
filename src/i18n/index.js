import Vue from 'vue'
import VueI18n from 'vue-i18n'

import ElementLocal from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const message = {
  en: {},
  zh: {}
}

let localLanguage = localStorage.getItem('localLanguage')
const i18n = new VueI18n({
  locale: localLanguage ? localLanguage : 'zh',
  message
})

export default i18n
