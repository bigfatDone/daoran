import router from '@/router'
import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (config) {
  return config
}, function (err) {
  // Do something with request error
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
    }
  }
  return Promise.reject(err)
})

function PostRequest (data) {
  axios.post(
    data.url,
    data.data,
    {timeout: 1000*120},
  ).then(function (response) {
    let obj = response.data;
    let count = 0;
    for (let item in obj) {
      count += 1;
    }
    if (obj.msg === "SESSION_OUT") {
      window.location.href = "http://cms.daoran.tv";
   //    window.location.href = "http://192.168.1.96:9081/cms";
    } else {
      data.success(response);
    }
  })
    .catch(function (err) {
      data.error(err);
    });
}

function GetRequest (data) {
  axios.get(data.url, data.data, {timeout: 1000*120},)
    .then(function (response) {
      let obj = response.data;
      let count = 0;
      for (let item in obj) {
        count += 1;
      }
      if (typeof(response.data) == "string" && response.data.indexOf("html") > -1) {
        // router.push({path: "/login"});
      } else {
        data.success(response);
      }
    })
    .catch(function (error) {
      data.error(error);
    });
}

function init (obj) {
  if (obj.method == "post") {
    PostRequest(obj);
  } else {
    GetRequest(obj);
  }
}

export default {
  init
}
