import axios  from 'axios'   //引入 axios
import config from './config.js' //倒入默认配置
import qs from 'qs'  //序列化数据，视服务端的要求
import {
    MessageBox,
    Message
} from 'element-ui'

export default function $axios(options){
     return new Promise((resolve , reject)=>{
          const instance = axios.create({
               baseURL : config.baseURL , 
               headers : config.headers , 
               transformResponse : [function(data){}],
          }) ; 

          instance.interceptors.request.use(config =>{
               //Tip : 1 
               //请求开始的时候可以结合 vuex 开户全屏的 loading 动画

               /*
               //Tip : 2 
               //带上 token  ， 可以结合 vuex 或者 localStorage 
               if(store.getters.token){
                    config.headers['X-Token'] = getToken() ; //让每个请求携带 token 
               }
               else{
                    //重定向到登录页
               }*/

               //Top : 3 
               //根据请求方法，序列化传来的参数，根据后端需求是否序列化
            //    if(config.method.toLocaleLowerCase() === 'post'
            //         || config.method.toLocaleLowerCase() === 'put' 
            //         || config.method.toLocaleLowerCase() === 'delete'){
            //         config.data = qs.stringify(config.data)
            //    }
               return config ;

          } , error => { 
               //请求错误时（接口错误、超时等）
               //Tip : 4 
               //关闭loading 
               console.log('request:' , error) ; 
               
               //判断请求超时
               if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1){
                    console.log('根据你设置的 timeout 判断请求超时了，你可以在这里加入超时的处理方案') ;
                    // return service.request(originalRequest); //例如再重复请求一次
               }

               //需要重定向到错误页面
               const errorInfo = error.response ; 
               console.log(errorInfo); 

               if(errorInfo){
                    //error = errorInfo.data //页面那边 catch 的时候就能拿到详细的错误信息，看最下边的 Promise.reject 
                    const errorStatus = errorInfo.status ; //404 500 403 ... 等
                    router.push({
                         path : `/error/${errorStatus}`
                    })
               }
               return Promise.reject(error);  //在调用的那边可以拿到(catch)你想返回的错误信息

          }) ; 

          instance.interceptors.response.use(response =>{
               let data ; 
               //IE9 时 response.data 是 undefined， 因此需要使用 response.request.responseText(Stringify后的字符串)
               if(response.data == undefined){
                    data = JSON.parse(response.request.responseText) ; 
               }else{
                    data = response.data ; 
               }

               // let result = null ; 
               
               //根据返回的code值来做不同的处理(和后端约定)
               switch (data.status) {
                    case 200:
                         return data.data;
                         break; 
                    case 514 : 
                         return Promise.reject();
                         break ; 
                    default: 
                            // Message({
                            //     message: data.message,
                            //     type: 'warning'
                            // });
                            alert(data.message);
                            return Promise.reject();
                         break ; 
               }
               //若不是正确的返回code，且已登录，就显示错误
               // const err = new Error(data.description);
               // err.data = data ; 
               // err.response = response ;

               // return data ; 
          } , err =>{
               if(err && err.response){
                    switch(err.response.status){
                         case 400 : 
                              err.message = '请求错误' ; 
                              break ; 
                         case 401 : 
                              err.message = '未授权，请登录' ; 
                              break ; 
                         case 403 : 
                              err.message = '拒绝访问' ; 
                              break ; 
                         case 404  : 
                              err.message = `请求地址错误：${err.response.config.url}` ; 
                              break; 
                         case 408 : 
                              err.message = '请求超时'  ; 
                              break ; 
                         case 500 : 
                              err.message = '服务器内部错误' ; 
                              break ; 
                         case 501 : 
                              err.message = '服务未实现' ; 
                              break ; 
                         case 502 : 
                              err.message = '网关错误' ; 
                              break ; 
                         case 503 : 
                              err.message = '服务不可用' ; 
                              break;
                         case 504 : 
                              err.message = '网关超时' ; 
                              break ; 
                         case 505 : 
                              err.message = 'HTTP版本不受支持' ; 
                              break ; 
                         default : 
                         
                    }
               }
               console.log(err) ; 
               Message({
                   message: err.message,
                   type: 'warning'
               });
               //此处使用 element UI 的组件提示
               // Message.error(`Error:${err}`);
               return Promise.reject(err) ; //返回接口返回的错误信息
          });

          instance(options).then((res)=>{
               resolve(res) ; 
               return false ; 
          }).catch((error)=>{
               reject(error);
          });
     })
}

