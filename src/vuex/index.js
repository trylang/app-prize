import Vue from 'vue' 
import Vuex from 'vuex' 

Vue.use(Vuex) 

// 创建 store 实例  appId=123162&portalId=290&subjectType=1&appName=推广应用&activityId=A05WlGF8F 
export default new Vuex.Store({
    state : {
        domain : 'http://www.baidu.com'  , 
        userInfor : null, 
        appInfor: null,           //创建应用所需要的基础信息
        appCreateSetUp : 0 ,        //创建应用第几步
        appIsEdit : false,          //是否是修改
        isLoading : false 
    } , 
    mutations : {
        updateUserInfo(state, newUserInfo) {
            state.userInfor = newUserInfo;
        },
        updateAppInfor(state , newAppInfor){
            state.appInfor = newAppInfor ; 
        } , 
        updateAppCreateSetUp(state , newAppCreateSetUp){
            state.appCreateSetUp = newAppCreateSetUp ;
        }, 
        updateAppIsEdit(state , newAppIsEdit){
            state.appIsEdit = newAppIsEdit ; 
        }
    }
})


