import apiList from './interface' 

const install = Vue =>{
     if(install.installed){
          return ; 
     }
     install.installed = true ; 

     Object.defineProperties(Vue.prototype , {
          //挂载在Vue原型的 $api 对象上
          $api : {
               get(){
                    return apiList 
               }
          }
     })
}

export default install ; 