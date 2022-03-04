
import request from '../http'

// 组件上传请求

export const OrgUploadFileFroCicc = (url, obj) => request({
  url: url,
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary0h259iBkAigOjWV3',
  },
  data: obj
})

// 下载组件通过文件流
export function getDownLoadOrgFileFroCiic(url, contentId) {
  return request({
    url: url + `/${contentId}`,
    method: 'get',
    responseType: 'arraybuffer',
  });
}

/*
* downUrl和uploadUrl 都是 服务名+ 接口地址
* let calUrl = '/ciic-ihr-salary-service'
* eq: calUrl + `/mvc/WageTotalBudget/template`,
* */

//下载导入模板
export function downTemplate(downUrl, methods) {
  return request({
    url: downUrl,
    method: methods ? methods : 'get',
    responseType: 'arraybuffer',
    header: {
      contentType: 'application/octet-stream; charset=utf-8'
    }
  });
}