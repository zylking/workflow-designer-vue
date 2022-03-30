import axios from 'axios';
import message from './message';
import qs from 'qs';
// import store from '@/store';
// import { getToken } from '@/utils/auth'
// import Vue from 'vue';


// 创建Axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookies
  timeout: 15000 // 请求超时时间timeout
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请求前的处理，例如：参数序列化、取消pending中的请求队列

    // 切换路由时，取消上一页所有pending中的请求
    // 当路由已经跳转，而上一页的请求还在pending状态
    // 如果数据量小还好，数据量大时，跳到新页面，旧的请求依旧没有停止，这将会十分损耗性能
    // 请求拦截器中将请求加入cancel队列

    let CancelToken = axios.CancelToken;
    config.cancelToken = new CancelToken(function executor(c) {
      // eslint-disable-next-line no-undef
      Vue.$httpRequestList.push(c);
    });

    // 请求头为上传文件所需格式
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      return config;
    }

    // 增加token、empid(userName)
    // let {token: access_token, userName: empid, hospitalRdn: hospitalrdn} = store.getters;
    // if (access_token) {
    //   Object.assign(config.data, {access_token, empid, hospitalrdn});
    // }

    // 序列化参数
    if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
      config.data = qs.stringify(config.data);
    }

    return config;
  },
  error => {
    // 处理请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
// 如果您想要获取诸如头或状态之类的http信息 返回 response => response
service.interceptors.response.use(
  response => {
    const
      res = response.data,
      {code, type, message: msg} = res;

    // 根据实际请求处理响应
    if (code !== 200) {
      message.promptMessage({type: type || 'error', message: msg || '请求失败！', duration: 1000});
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  error => {
    console.log(error);
    let {message: cancelMessage, response} = error;
    // 切换路由而取消pending状态请求的错误不弹出提示
    if (cancelMessage !== 'cancel_pending') {
      // 默认错误提示
      let messageText = '请求失败！', type = 'error';
      // 超时
      if (cancelMessage.indexOf('timeout') !== -1) {
        messageText = '请求超时！';
      }
      // 后端返回，拦截的异常错误信息
      if (response) {
        if (response.data.message) {
          messageText = response.data.message;
        }
        if (response.data.type) {
          type = response.data.type;
        }
      }
      message.promptMessage({type: type || 'error', message: messageText, duration: 1000});
    }
    return Promise.reject(error);
  }
);

export default service;
