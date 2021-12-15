import md5 from 'md5';

/**
 * 生成签名
 * @param appcode appcode
 * @param timestap 事件戳
 * @param data body
 * @param params params
 */
export const signature = (appcode, timestap, data, params) => {
    return md5(appcode + '__' + timestap + '__' + JSON.stringify(data) + '__' + JSON.stringify(params))
}

/**
 * 获取地址中的CompanyCode
 */
export const getCompanyCodeFromUrl = () => {
    const shapIndex = window.location.href.indexOf('#')
    const urlStr = window.location.href.substring(0, shapIndex)
    const startIndex = urlStr.lastIndexOf('/')
    const str = urlStr.substring(startIndex + 1, shapIndex)
    return str
}