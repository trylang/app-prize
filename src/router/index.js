import Login from '../views/Login.vue'   //登录页面
import NotFound from '../views/404.vue'  //404页面
import Main from '../views/main.vue'  //main页面
import Home from '../views/Home.vue' //首页
import activityIndex from '../views/activity/index.vue' //活动首页
import activityList from '../views/activity/activityinfo/activityList.vue'
import basicInfor from '../views/activity/basicinfo/basicInfor.vue'
import businessChoice from '../views/activity/shopselect/businessChoice.vue'
import PeopleThrow from '../views/activity/peoplethrow/peoplethrow.vue'
import scrmGroupTags from '../views/activity/peoplethrow/group/index.vue'
import addPeoplethrow from '../views/activity/peoplethrow/add-peoplethrow.vue'
import couponChoice from '../views/activity/coupon/couponChoice.vue'
import addCouponChoice from '../views/activity/coupon/addCouponChoice.vue'
import templateChoice from '../views/activity/template/templateChoice.vue'
import settingRule from '../views/activity/rulesetting/settingRule.vue'
import settingsChannel from '../views/activity/channel/settingsChannel.vue'
import activetyDetail from '../views/activity/activityinfo/activetyDetail.vue'

let routes = [
	{
		path: '/',
		component: Home,
		name: '首页',
		hidden: true,
		redirect: '/activity/index'
	}, {
		path: '/activity',
		component: Home,
		iconCls: 'el-icon-message', //图标样式 
		name: '抽奖发券活动',
		hidden: false,
		redirect: '/activity/activity',
		children: [

			{
				path: 'basicInfor',
				component: basicInfor,
				hidden: false,
				name: '基础信息',
				className: 'basicInfor'
			},
			{
				path: 'businessChoice',
				component: businessChoice,
				hidden: false,
				name: '参加主体',
				className: 'Merchant'
			},
			{
				path: 'settingRule',
				component: settingRule,
				hidden: false,
				name: '活动设置',
				className: 'setting'
			},
			// {
			// 	path: 'PeopleThrow',
			// 	component: PeopleThrow,
			// 	hidden: false,
			// 	name: '人群投放',
			// 	className: 'crowd',
			// 	children: [{
			// 		path: 'tags',
			// 		component: scrmGroupTags,
			// 		name: '标签创建群组'
			// 	}]
			// },
			{
				path: 'couponChoice',
				component: couponChoice,
				hidden: false,
				name: '优惠券投放',
				className: 'coupons',
				children: [{
					path: 'add',
					component: addCouponChoice,
					hidden: true,
					name: '创建优惠券',
					className: 'coupons'
				}]
			},
			{
				path: 'templateChoice',
				component: templateChoice,
				hidden: false,
				name: '模板展示',
				className: 'mo'
			},
			{
				path: 'settingsChannel',
				component: settingsChannel,
				hidden: false,
				name: '渠道设置',
				className: 'channel'
			}, {
				path: 'index',
				component: activityIndex,
				hidden: true,
				name: '活动首页'
			}, {
				path: 'activity',
				component: activityList,
				hidden: true,
				name: '活动管理'
			}, {
				path: 'detail',
				component: activetyDetail,
				hidden: true,
				name: '活动详情'
			}, {
				path: 'peoplethrow/add',
				component: addPeoplethrow,
				hidden: true,
				name: '添加人群',
				className: 'crowd'
			},

		]
	}, {
		path: '/404',
		component: NotFound,
		name: '',
		hidden: true
	}, {
		path: '*',
		hidden: true,
		redirect: { path: '/404' }
	}
]


export default routes;



