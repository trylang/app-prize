import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

import VueRouter from 'vue-router'
import store from './vuex/index'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './router/index'
import api from './http/index'
import MaInput from './components/MaInput'
Vue.use(MaInput)


import { MessageBox , Message } from 'element-ui'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(api)
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let user = JSON.parse(localStorage.getItem('user'));
  if (to.path == '/login') {
    localStorage.removeItem('user');
    store.commit('updateUserInfo' , null) ; 
    next();
  }
  else{
    if(!store.state.userInfor){
      if(user){
        store.commit('updateUserInfo' , user) ; 
        NProgress.start();
        next();
      }
      else{
        NProgress.start();
        // next({path : '/login'});
        next();
      }
    }
    else{
      next();
    }
  }
})

router.afterEach(transition => {
  if (sessionStorage.getItem('activityInfor')) {
    store.commit('updateAppInfor', JSON.parse(sessionStorage.getItem('activityInfor')));
  }
  if (sessionStorage.getItem('isEditInfor')) {
    store.commit('updateAppIsEdit', true);
  } else {
    store.commit('updateAppIsEdit', false);
  }
  if (sessionStorage.getItem('appCreateSetUp')) {
    store.commit('updateAppCreateSetUp', Number(sessionStorage.getItem('appCreateSetUp')));
  }
  NProgress.done();
});


//整理全局弹出框
Vue.prototype.alert = function (obj) {
  let str = obj.str ? obj.str : '',
    title = obj.title ? obj.title : '提示',
    btnText = obj.btnText ? obj.btnText : '确定';
  MessageBox.alert(str, title, {
    confirmButtonText: btnText,
    callback: action => {
      if (obj.callBack) {
        obj.callBack(action);
      }
    }
  })
}
//整理全局访问框
Vue.prototype.confirm = function (obj) {
  let str = obj.str ? obj.str : '',
    title = obj.title ? obj.title : '提示',
    btnText = obj.btnText ? obj.btnText : '确定',
    cancelText = obj.cancelText ? obj.cancelText : '取消',
    type = obj.type ? obj.type : 'warning';
  MessageBox.confirm(str, title, {
    confirmButtonText: btnText,
    cancelButtonText: cancelText,
    type: type
  }).then(() => {
    if (obj.callBack) {
      obj.callBack();
    }
  }).catch(() => {
    if (obj.cancelCallBack) {
      obj.cancelCallBack();
    }
  });
}
//整理全局错误信息
Vue.prototype.error = function (str) {
  Message({
    message: str,
    type: 'warning'
  });
}
//整理全局成功信息
Vue.prototype.success = function (str) {
  Message({
    message: str,
    type: 'success'
  });
}


//将axios中参数传递形式由 Request Payload 转换成 FromData   ****慎用
// Vue.prototype.setFormDataParams = function(obj) {
//     var params = new URLSearchParams();
//     for (let item in obj) {
//         params.append(item, obj[item]);
//     }
//     return params;
// }


new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')