function setAdminApi(path) {
  let global = '/api/admin/'
  return global + path
}

const api = {
  login: '/user/login',
  logout: '/user/logout',
  getPermissions:'/user/getPermissions',// 获取用户权限

  flowPvList: 'flow/pv/list',//获取pv、ip、访客数信息
  flowSourceList: 'flow/source/list',//获取来源、来访域名、搜索词信息

  siteList: '/system/sites',
  backendService: '/system/backend/services',
  backendServiceDetail: '/system/backend/service/detail',
  backendServiceAdd: '/system/backend/service/add',
  backendServiceModify: '/system/backend/service/modify',
  machineList: '/system/backend/machines',

  departmentList: '/system/departments',
  addDepartment: '/system/department/add',

  employeeList: '/system/employees',

  roleList: '/system/roles',
  roleDetail: '/system/role/detail'

}

export default api
