import {
  parseTime
} from './format';

import store from '@/store/index'

import http from '@/api/fetch'

export function formatDate(time) {
  return parseTime(time, '{y}-{m}-{d} {h}:{i}');
};

export function formatD(time) {
  return parseTime(time, '{y}-{m}-{d}');
};

export function formatM(time) {
  return parseTime(time, '{y}-{m}');
};

export function GetPercent(num, total) {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
};


export function fujiancur(url,lName) {
  let name = lName ? lName :(url&&url.indexOf('$')!= -1)?url.substring(url.indexOf('$') + 1, url.lastIndexOf('$')):(url&&url.indexOf('$')== -1)?'附件':'';
  return name
};

export function cascade3(pid, arr) {

  var getChildren = function (pid, data) {
    var children = [];
    data.forEach(item => {
      var strs = item.parentId
      // strs = strs.split(",");
      // var strs2 = strs[strs.length-1]
      if (strs === pid) {
        if (getChildren(item.id, data).length > 0) {
          children.push({
            id: item.id,
            name: item.name,
            parentId: item.parentId,
            parentIds: item.parentIds,
            isAssociation: item.isAssociation,
            isExistence: item.isExistence,
            children: getChildren(item.id, data)
          })
        } else {
          children.push({
            id: item.id,
            name: item.name,
            parentId: item.parentId,
            parentIds: item.parentIds,
            isExistence: item.isExistence,
            isAssociation: item.isAssociation
          })
        }

      }
    });
    return children;
  }
  return getChildren(pid, arr)
}


//父级ID为多个用逗号隔开
export function cascade(pid, arr) {

  var getChildren = function (pid, data) {
    var children = [];
    data.forEach(item => {
      item.parentId = item.parentId ? item.parentId : 0
      var strs = item.parentId
      // strs = strs.split(",");
      // var strs2 = strs[strs.length-1]
      if (strs === pid) {
        if (getChildren(item.id, data).length > 0) {
          children.push({
            value: item.id,
            label: item.name,
            // limitType : item.limitType,
            // limitTypes : item.limitTypes,
            children: getChildren(item.id, data)
          })
        } else {
          children.push({
            value: item.id,
            label: item.name,
            // limitType : item.limitType,
          })
        }

      }
    });
    return children;
  }
  return getChildren(pid, arr)
}


export function cascade2(pid, arr) {

  var getChildren = function (pid, data) {
    var children = [];
    data.forEach(item => {
      var strs = item.parentId + ''
      // strs = strs.split(",");
      // var strs2 = strs[strs.length-1]
      if (strs === pid) {
        if (getChildren(item.id + '', data).length > 0) {
          children.push({
            id: item.id,
            name: item.name,
            children: getChildren(item.id + '', data)
          })
        } else {
          children.push({
            id: item.id,
            name: item.name,
          })
        }

      }
    });
    return children;
  }
  return getChildren(pid, arr)
}


export function cascade4(pid, arr) {

  var getChildren = function (pid, data) {
    var children = [];
    data.forEach(item => {
      var strs = item.parentId
      // strs = strs.split(",");
      // var strs2 = strs[strs.length-1]

      if (strs === pid) {
        if (getChildren(item.id, data).length > 0) {

          children.push({
            id: item.id,
            path: item.path,
            name: item.name,
            orderId: item.orderId,
            icon: item.icon,
            children: getChildren(item.id, data)
          })
          // console.log(children)
        } else {

          children.push({
            id: item.id,
            path: item.path,
            icon: item.icon,
            orderId: item.orderId,
            name: item.name,
          })
          // console.log(children)
        }

      }
    });
    console.log(children)
    return children;
  }
  return getChildren(pid, arr)
}
export function cascade5(pid, arr) {

  var getChildren = function (pid, data) {
    var children = [];
    var limit={}
    data.forEach(item => {
      var typeList = {
        minHours: item.schoolLow,
        maxHours: item.schoolHigh,
        termMinHours: item.semesterLow,
        termMaxHours: item.semesterHigh
      };

      var strs = item.parentId + ''
      // strs = strs.split(",");
      // var strs2 = strs[strs.length-1]
      if (strs === pid) {

        if (getChildren(item.id + '', data).length > 0) {

          children.push({
            typeList:typeList,
            id: item.id,
            name: item.name,
            children: getChildren(item.id + '', data),
            limit:item.limit
          })
        } else {

          children.push({
            id: item.id,
            name: item.name,
            typeList:typeList,
            limit:item.limit
          })
        }

      }
    });
    return children;
  }
  return getChildren(pid, arr)
}
// export function formatDate(value) {
// 	let date = new Date(value)
// 	let y = date.getFullYear();
// 	let MM = date.getMonth() + 1;
// 	MM = MM < 10 ? ('0' + MM) : MM;
// 	let d = date.getDate();
// 	d = d < 10 ? ('0' + d) : d;
// 	let h = date.getHours();
// 	h = h < 10 ? ('0' + h) : h;
// 	let m = date.getMinutes();
// 	m = m < 10 ? ('0' + m) : m;
// 	let s = date.getSeconds();
// 	s = s < 10 ? ('0' + s) : s;
// 	return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
// }

export function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes());
  let s = date.getSeconds();
  return h + m;
}

export function getFullDate(time) {

  let startTimes2 = time.split(":");

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var result = year + '-' + month + '-' + day + ' ' + startTimes2[0] + ':' + startTimes2[1]
  return new Date(result)
}

//去除数组相同元素
export function uniqueSame2(arr) {
  var result = [], hash = {};
  for (var i = 0, elem; (elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem);
      hash[elem] = true;
    }
  }
  return result;
}

//去除数组相同元素
function unique(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) == -1) {
      result.push(arr[i])
    }
  }
  return result;
}

//添加父级id
export function getNode2(json, nodeId) {

  var parentNode2 = [];
  var getNode3 = function getNode3(json, data) {

    json.forEach((item) => {
      if (item.id == data) {
        parentNode2.unshift(item.id);
        getNode3(json, [item.parentId])
      }
    })

    return parentNode2;
  }

  return unique(getNode3(json, nodeId));
}

function transUTC2date(str) {
  const year = str.substring(0, 4);
  const month = str.substring(5, 7);
  const day = str.substring(8, 10);
  const hour = str.substring(11, 13);
  const min = str.substring(14, 16);
  const sec = str.substring(17, 19);
  return new Date(Date.UTC(year, month - 1, day, hour, min, sec)).getTime()
}

// 随机生成文件名
function random_string(len) {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


export function backAliyunImageUrl(obj) {

  var index = obj.lastIndexOf("?x-oss-process");
  obj = obj.substring(0, index);
  return obj;


}

export function getAliyunImageUrl(originalUrl, imageShowWidth, imageShowHeight) {

  // let scale = 2;
  // return originalUrl+'?x-oss-process=image/resize,m_mfit,h_'+scale*imageShowHeight+',w_'+scale*imageShowWidth
  // if (process.env.NODE_ENV === 'production') {
  // return originalUrl
  // }else{

  if (originalUrl.indexOf(".aliyuncs.com") > -1) {
    let scale = 2;
    return originalUrl + '?x-oss-process=image/resize,m_mfit,h_' + scale * imageShowHeight + ',w_' + scale * imageShowWidth+',limit_0/auto-orient,1/quality,q_90'
    // return originalUrl
  } else {
    return originalUrl
  }
  // }

}


export function getOssToken() {
  return new Promise((resolve, reject) => {
    const stsStr = sessionStorage.getItem('sts')
    if (stsStr === null || stsStr === '' || stsStr === undefined || stsStr === 'null') {
      http.get('/aliyun/sts/assume-role').then(res => {
        sessionStorage.setItem('sts', JSON.stringify(res.data))
        resolve(sessionStorage.getItem('sts'))
      })
    } else if (transUTC2date(JSON.parse(stsStr).expiration) < (new Date().getTime())) {
      http.get('/aliyun/sts/assume-role').then(res => {
        sessionStorage.setItem('sts', JSON.stringify(res.data))
        resolve(sessionStorage.getItem('sts'))
      })
    } else {
      resolve(sessionStorage.getItem('sts'))
    }
  })

}


export function uploadOSS(file, bucketName, fileName, isMore) {

  return new Promise((resolve, reject) => {
    getOssToken().then(response => {
      var url = {
        avatar: "",
        imageUrl: ""
      }

      let bucketNames = "2class"

      let random_name = random_string(6) + '_' + new Date().getTime() + '.' + file.file.name.split('.').pop()
      var  schoolId=JSON.parse(localStorage.getItem('schoolId'))
      // var storeAs = schoolId+'/'+fileName + random_name;
      var storeAs = 'temp/' + random_name;
      var sts = JSON.parse(sessionStorage.getItem('sts'));
      var client = new window.OSS.Wrapper({
        region: 'oss-accelerate',
        secure: true,
        accessKeyId: sts.accessKeyId,
        accessKeySecret: sts.accessKeySecret,
        stsToken: sts.accessSecurityToken,
        bucket: bucketNames
      });
      client.multipartUpload(storeAs, file.file, {
        // client.multipartUpload("12122.xlsx", file.file, {
        progress: function* (percentage) {
          let fileloadingNum = Math.ceil(percentage * 100)

          if (isMore) {
            store.commit('setProgresss', {
              name: file.file.name,
              progress: fileloadingNum
            })
          }
        }
      }).then(function (result) {
        if (result.res.status == 200) {
          let value = client.signatureUrl(storeAs)
          let tempName = fileName;
          // let value2 = value.substring(0, value.indexOf(tempName));
          let value3 = sts.cdnHost+'/' + storeAs
    console.log(storeAs)
          resolve(value3)

        }
      }).catch(function (err) {
        console.error(err)
      });
    })
  })
}

/*只用于模板权限判断，请勿用于其他用途*/
export function TemplateRoleFmt(type, role, assignName, auditorName) {
  let roleName = '';
  if (role == 1) {
    roleName = '负责人'
  }


  if (role == 2) {
    roleName = '管理员'
  }


  if (role == 12) {
    roleName = '负责人或管理员'
  }


  if (role == 4) {
    roleName = '辅导员'
  }


  if (role == 5) {
    roleName = '指导老师'
  }

  if (type == 1 || type == 2) {//组织机构
    return assignName + roleName;
  }

  if (type == 3) {
    return '当前院系' + roleName
  }
  if (type == 4) {
    return '当前班级' + roleName
  }

  if (type == 5) {
    return auditorName;
  }

  if (type == 6) {
    return '上级机构' + roleName;
  }

  if (type == 7) {
    return '挂靠机构' + roleName;
  }

  if (type == 8) {
    return '当前班团' + roleName
  }

  if (type == 9) {
    return '当前组织' + roleName
  }

  if (type == 10) {
    return '当前团队' + roleName
  }
  
  if (type == 11) {
    return '当前机构' + roleName
  }
}
