import axios from 'axios';

const http = axios.create({
    baseURL: 'http://127.0.0.1:3000'
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem('mytoken')
    if (token) {
        config.headers.authorization = token;
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


export default http;