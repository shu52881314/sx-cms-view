//验证手机号
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}
//验证四位年级
export function isvalidGrade(str) {
  const reg2 = /^\d{4}$/
  return reg2.test(str)
}
//正整数
export function isvalidCode(str) {
  const reg3 = /^[0-9]+$/
  return reg3.test(str)
}
//正整数和字母
export function isvalidMajor(str) {
  const reg4 = /^[0-9a-zA-Z]+$/
  return reg4.test(str)
}

//浮点数
export function isFloat(str) {
  const reg5 = /^\d+(\.\d+)?$/
  return reg5.test(str)
}
