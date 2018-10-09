import axios from './api'

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */

let domain = document.domain;

let urlBase = '';
switch (domain) {
    case '127.0.0.1':
    case '10.10.10.141':
        urlBase = 'http://10.10.11.166:8180';
        break;
    case '59.110.106.142':
    case '47.93.174.52':
    case 'app-coupon-luck.rtmap.com':
        urlBase = 'http://47.93.179.12:8180';
        break;
    default:
        break;
}

export const query = params => {
    return axios({
        url: '/api/lottery/lottery.do',
        method: 'get',
        params
    })
}

export const mock = params => {
    return axios({
        url: '/mock',
        method: 'get',
        params
    });
}

export const upload = data => {
    return axios({
        url: '/lottery/lottery.do',
        method: 'post',
        data
    })
}
// 图片上传接口
export const file_upload = data => { 
    return axios({
        url: `${urlBase}/rtmap-app/file/upload`,
        method: 'post',
        data
    });
}

// 发布渠道--查询主体信息
export const enterpriseBasicDetail = params => {
    return axios({
        url: `/channel/enterprise/basic/detail`,
        method: 'get',
        params
    })
}
// 发布渠道--渠道列表接口
export const channelList = params => {
    return axios({
        url: `/channel/list`,
        method: 'get',
        params
    })
}
// 发布渠道--查询活动下的渠道配置列表接口
export const channelRequisitionList = params => {
    return axios({
        url: `/channel/requisition/list`,
        method: 'get',
        params
    })
}
// 发布渠道--查询渠道申请单和物料详情
export const channelRequisitionDetail = params => {
    return axios({
        url: `/channel/requisition/detail`,
        method: 'get',
        params
    })
}
// 发布渠道--微信申请单--微信模板列表接口
export const channelTemplateList = params => {
    return axios({
        url: `/channel/template/list`,
        method: 'get',
        params
    })
}
// 发布渠道--创建微信渠道申请单
export const requisitionWxSaveOrUpdate = data => {
    return axios({
        url: `/channel/requisition/wx/saveOrUpdate`,
        method: 'post',
        data
    })
}
// 发布渠道--创建短信渠道申请单
export const requisitionSmsSaveOrUpdate = data => {
    return axios({
        url: `/channel/requisition/sms/saveOrUpdate`,
        method: 'post',
        data
    })
}
// 发布渠道--活动创建完成确认接口
export const activityFinish = params => {
    return axios({
        url: `/api/activity/confirm/config/finish`,
        method: 'get',
        params
    })
}

// 发布渠道--创建或者修改落地页地址
export const saveChannelUrL = data => {
    return axios({
        url: `/api/activity/saveChannelUrL`,
        method: 'post',
        data
    })
}

// 模版列表-感知应用
export const activityTemplateList = params => {
    return axios({
        url: `/template/templateList`,
        method: 'get',
        params
    })
}
// 母版下场景列表-感知应用
export const activitySelectTemplateScene = params => {
    return axios({
        url: `/template/selectTemplateScene`,
        method: 'get',
        params
    })
}
// 模版列表-查询活动下模板和场景数据-感知应用
export const selectActivityTemplateScene = params => {
    return axios({
        url: `/template/selectActivityTemplateScene`,
        method: 'get',
        params
    })
}
// 模版列表-创建/编辑活动模板和场景数据-感知应用
export const saveOrUpdateTemplate = data => {
    return axios({
        url: `/template/saveOrUpdateTemplate`,
        method: 'post',
        data
    })
}

/**活动基本信息 - begin */
export const activityGroupList = params => { //获取活动组列表
    return axios({
        url: '/activityGroup/list',
        method: 'get',
        params
    })
}
export const activityGroupCreate = data => { //创建活动组
    return axios({
        url: '/activityGroup/create',
        method: 'post',
        data
    })
}
export const createActivity = data => { //创建新的活动
    return axios({
        url: '/api/activity/create',
        method: 'post',
        data
    })
}
export const activityBaseInforSearch = params =>{   //查询活动基本信息
    return axios({
        url: '/api/activity/basicInfo' , 
        method : 'get' , 
        params
    })
}
export const activityBaseInforUpdate = data =>{ //修改基础信息
    return axios({
        url: '/api/activity/update/basicInfo' , 
        method : 'post' , 
        data
    })
}
/**活动基本信息 - end */

/**参与商户相关接口 - begin */
export const searchAllShopListByKeyword = params => { //根据关键字查询店铺列表
    return axios({
        url: '/api/apply/market/shop/list/condition',
        method: 'get',
        params
    })
}
export const getFloorList = params => { //查询楼层
    return axios({
        url: '/api/activity/floorList',
        method: 'get',
        params
    })
}

export const getShopListByFloor = params => { //查询楼层下的店铺
    return axios({
        url: '/api/activity/floorShopList',
        method: 'get',
        params
    })
}
export const activityCreateSendShopList = data => {
    return axios({
        url: '/api/activity/createOrUpdateShopList',
        method: 'post',
        data
    })
}
export const activityShopListSearch = params =>{    //查询活动参与的商户
    return axios({
        url: '/api/activity/shopList' , 
        method : 'get' , 
        params
    })
}
/**参与商户相关接口 - end */
/**活动设置 - begin */
export const createActivityRule = data => { //创建活动规则
    return axios({
        url: '/api/activity/group/rule/create',
        method: 'post',
        data
    })
}
export const getActivityRuleDetail = params =>{ //查询活动规则 
    return axios({
        url: '/api/activity/group/rule/detail' , 
        method : 'get' , 
        params
    })
}
/**活动设置 - end */

/**投放人群相关 - begin */
export const scrmCustomerGroupList = params => { //人群投放列表
    return axios({
        url: '/api/activity/scrmCustomerGroupList',
        method: 'get',
        params
    })
}
export const activityCreateCrowdCreate = data => { //创建活动中的人群投放接口
    return axios({
        url: '/api/crowd/createOrUpdate',
        method: 'post',
        data
    })
}
export const activityGetCrowdDetail = params => { //获取活动的投放人群详细信息
    return axios({
        url: '/api/crowd/detail',
        method: 'get',
        params
    })
}
export const activityCrowdUpdate = data =>{
    return axios({
        url: '/api/crowd/update' , 
        method : 'post' , 
        data
    })
}
export const getScrmGroupTagsList = params =>{ //查询群组标签列表
    return axios({
        url: '/api/activity/customerGroupTagList',
        method : 'get' , 
        params 
    })
}
export const scrmCreateGroupByTags = data =>{ //创建标签群组
    return axios({
        url: '/api/activity/create/scrmCustomerGroupTag',
        method : 'post' ,
        data 
    })
}
/**投放人群相关 - end */

/**优惠券投放 - begin */
export const activityCouponList = data =>{      //优惠券种列表
    return axios({
        url: '/api/coupon/kind/list' , 
        method : 'post' , 
        data
    })
}
export const activityCouponDetail = params =>{  //券种详情获取 
    return axios({
        url: '/api/coupon/kind/detail' ,
        method : 'get' , 
        params
    })
}
export const activityCategoryList = params => {  //券类型下拉列表接口 
    return axios({
        url: '/api/coupon/category/list' ,
        method : 'get' , 
        params
    })
}
export const activityCouponActivity = data => {  // 优惠券--单个券种注到单个活动(生成券批)接口
    return axios({
        url: '/api/coupon/activity/add' ,
        method : 'post', 
        data
    })
}
export const activityCouponVoucherBatchList = params => {  //优惠券--券批分页列表接口
    return axios({
        url: '/api/coupon/activity/list' ,
        method : 'get' , 
        params
    })
}
export const activityCouponVoucherBatchDetail = params => {  //优惠券--优惠券--券批详情接口
    return axios({
        url: '/api/coupon/activity/detail' ,
        method : 'get' , 
        params
    })
}
export const activityCouponVoucherStatus = data => {  //优惠券--券批状态修改接口
    return axios({
        url: '/api/coupon/activity/status/update' ,
        method : 'post' , 
        data
    })
}
export const activityCouponVoucherRule = data => {  //优惠券--券批规则修改接口
    return axios({
        url: '/api/coupon/activity/rule/update' ,
        method : 'post' , 
        data
    })
}

export const activityCouponVoucherNum = params => {  //优惠券--券批数量修改接口
    return axios({
        url: '/api/coupon/activity/num/update' ,
        method : 'get' , 
        params
    })
}
export const activityCouponCreate = data => {  // 优惠券--创建优惠券接口
    return axios({
        url: '/api/coupon/create' ,
        method : 'post' , 
        data
    })
}
/**优惠券投放 - end */


export const activityList = data => { // 活动列表
    return axios({
        url: '/api/activity/list',
        method: 'post',
        data
    })
}
export const activityListStart = params => { // 活动列表启动
    return axios({
        url: '/api/activity/start',
        method: 'get',
        params
    })
}
export const activityListStop = params => { // 活动列表暂停
    return axios({
        url: '/api/activity/stop',
        method: 'get',
        params
    })
}
export const getActivityDetail = params => { // 活动列表详情
    return axios({
        url: '/api/activity/selectActivityDetail',
        method: 'get',
        params
    })
}
export default {
    query,
    mock,
    upload,
    file_upload, // 图片上传
    enterpriseBasicDetail, // 感知应用=渠道↓↓↓↓↓↓↓
    channelList,
    channelRequisitionList,
    channelTemplateList,
    requisitionWxSaveOrUpdate,
    requisitionSmsSaveOrUpdate,
    channelRequisitionDetail, // 感知应用=渠道↑↑↑↑↑↑↑
    activityTemplateList, // 感知应用=母版列表↓↓↓↓↓↓↓
    activitySelectTemplateScene,
    selectActivityTemplateScene,
    saveOrUpdateTemplate, //感知应用=母版列表↑↑↑↑↑↑↑
    createActivity,
    activityGroupList,
    activityGroupCreate,
    searchAllShopListByKeyword,
    getFloorList,
    getShopListByFloor,
    activityCreateSendShopList,
    createActivityRule,
    scrmCustomerGroupList,
    activityCreateCrowdCreate,
    activityGetCrowdDetail , 
    activityBaseInforSearch , 
    activityShopListSearch ,
    activityList , 
    getActivityRuleDetail , 
    activityBaseInforUpdate , 
    getScrmGroupTagsList , 
    scrmCreateGroupByTags , 
    activityCouponList , 
    activityCategoryList,
    activityCouponActivity,
    activityCouponVoucherBatchList,
    activityCouponVoucherBatchDetail,
    activityCouponVoucherStatus,
    activityCouponVoucherRule,
    activityCouponVoucherNum,
    activityCouponCreate,
    activityCouponDetail ,
    getActivityDetail,
    activityListStart,
    activityListStop,
    activityFinish,
}
