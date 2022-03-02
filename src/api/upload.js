
import request from '../http'

// 组件上传请求

export const OrgUploadFileFroCicc = (url,obj) => request({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary0h259iBkAigOjWV3',
    },
    data: obj
  })

  // 下载组件通过文件流
export function getDownLoadOrgFileFroCiic(url,contentId) {
    return request({
      url: url + `/${contentId}`,
      method: 'get',
      responseType: 'arraybuffer',
    });
  }