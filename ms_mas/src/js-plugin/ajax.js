import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import { MessageBox } from 'element-ui';

axios.interceptors.response.use(function (config) {
  return config
}, function (err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        err.message = '未授权，请登录';
        break;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网关错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网关超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }
  }
  return Promise.reject(err)
})

function checkSession (obj) {
  let result = {state: false, msg: "default null"};

  if (obj.lable == "login") {
    obj.method == "post" ? PostRequest(obj) : GetRequest(obj);
    return ;
  }

  axios.post("/ms_bas/getSessionStatus", qs.stringify({}))
    .then(function (response) {
      if (response.data.exists) {
        //登录有效
        if (obj.method == "post") {
          PostRequest(obj);
        }
        else {
          GetRequest(obj);
        }
      }else {
        //登录失效
        // router.push({path: "/re_login"});
        MessageBox.alert('session过期，刷新页面吧！', '提示', {
          confirmButtonText: '刷新',
          callback: action => {
            router.go(0)
          }
        });
      };
    })
    .catch(function (error) {
      // router.push({path: "/re_login"});
      MessageBox.alert('session过期，刷新页面吧！', '提示', {
        confirmButtonText: '刷新',
        callback: action => {
          router.go(0)
        }
      });
      //alert("请稍后再试");
    });
}

function PostRequest (data) {
  axios.post(
    data.url,
    qs.stringify(data.data),
    {timeout: 1000*300},
  )
  .then(function (response) {
    if (!response) {
      // router.push({path: "/re_login"});
      MessageBox.alert('session过期，刷新页面吧！', '提示', {
        confirmButtonText: '刷新',
        callback: action => {
          router.go(0)
        }
      });
    } else {
      data.success(response);
    }
  })
  .catch(function (err) {
    data.error(err);
  });
}

function GetRequest (data) {
	axios
		.get(data.url, data.data, {timeout: 1000*300},)
		.then(function (response) {
      if (!response) {
        // router.push({path: "/re_login"});
        MessageBox.alert('session过期，刷新页面吧！', '提示', {
          confirmButtonText: '刷新',
          callback: action => {
            router.go(0)
          }
        });
      } else {
        data.success(response);
      }
    })
    .catch(function (error) {
      data.error(error);
    });
}

function init (obj) {
  checkSession(obj);
}

export default {
	init
}
