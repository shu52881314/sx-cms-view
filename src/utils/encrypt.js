const CryptoJS = require('crypto-js');

let KEY = CryptoJS.enc.Utf8.parse('schoolmanage2019');
// let IV = CryptoJS.enc.Utf8.parse('16-Bytes--String');

export function Encrypt (content) {
  var srcs = CryptoJS.enc.Utf8.parse(content);
  var encrypted = CryptoJS.AES.encrypt(srcs, KEY, { mode: CryptoJS.mode.ECB});
  return encrypted.toString();
}

export function Decrypt (content) {
  var decrypt = CryptoJS.AES.decrypt(content, KEY, {mode: CryptoJS.mode.ECB});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
