<template lang="html">
  <div class="detail" >
    <div class="h-title" >
        <span class="h-title-text">基本信息</span>
        <el-button v-if="status==0||status==2" class="editeActive"  size="small" @click="modifyActivity">编辑活动</el-button>

    </div>
    <el-row style="padding-left:12px;">
      	<el-col :span="2"><div>活动名称：</div></el-col><el-col :span="20"><div>{{demoAppActivity.name}}</div></el-col>
    </el-row>
    <el-row style="padding-left:12px;">
      	<el-col :span="2"><div>相关应用：</div></el-col><el-col :span="20"><div>{{demoAppActivity.appName}}</div></el-col>
    </el-row>
    <el-row style="padding-left:12px;">
		<el-col :span="2"><div>类型：</div></el-col><el-col :span="20">
				<div  v-if="demoAppActivity.activityType==0">长期活动</div>
				<div  v-if="demoAppActivity.activityType==1">短期活动</div>
		</el-col>
    </el-row>
    <el-row style="padding-left:12px;">
      	<el-col :span="2"><div>日期：</div></el-col><el-col :span="20"><div>{{demoAppActivity.activityStartDate+ ' 至 '+ demoAppActivity.activityEndDate}}</div></el-col>
    </el-row>
    <el-row style="padding-left:12px;">
      <el-col :span="2"><div>活动组：</div></el-col><el-col :span="20"><div>{{demoAppActivity.activityGroupName}}</div></el-col>
    </el-row>
    <el-row style="padding-left:12px;">

      <el-col :span="2" style="display: inline-block"><div>备注：</div></el-col>
      <el-col :span="20" style="display: inline-block">
        <div style="display: inline-block;word-break: break-all;min-width: 700px">{{demoAppActivity.remarks}}</div>
      </el-col>
    </el-row>
    <div class="h-title">
      <span class="h-title-text">参与主体</span>
    </div>
    <div style="padding-left:12px;">
      <template v-if="demoAppActivity.isAllShop==1">
        所有关联主体
      </template>
      <el-tag  v-if="demoAppActivity.activityShops!=null || demoAppActivity.isAllShop==2" type="info" v-for="(item, i) in demoAppActivity.activityShops" :key="i" style="margin-bottom: 15px">{{item.shopName}}</el-tag>
    </div>

    <div class="h-title">
      <span class="h-title-text">优惠券</span>
    </div>
    <div style="padding-left:12px;">
      <el-table  :data="demoAppActivity.couponActivities" border>
        <el-table-column prop="mainInfo" label="优惠券" width="180"></el-table-column>
        <el-table-column prop="quantity" label="券数量" width="180"></el-table-column>
        <el-table-column prop="address" label="限制">
          <template slot-scope="scope">
            {{'每人每天最多'+(scope.row.dayLimit==0 ? '不限' : scope.row.dayLimit + '张')+'，每人最多'+(scope.row.cumulativeLimit==0 ? '不限' : scope.row.cumulativeLimit + '张')+'，每天发放总数'+(scope.row.alldayIssueLimit==0 ? '不限' : scope.row.alldayIssueLimit + '张')}}
            <!-- {{scope.row.preDayPersonNum!=0?'每人每天最多'+scope.row.preDayPersonNum+'张':"每人每天可领：不限"}}，
            {{scope.row.prePersonNum!=0?'每人最多'+scope.row.prePersonNum+'张':"每人累计上限：不限"}}，
            {{scope.row.preDayNum!=0?'每天发放总数'+scope.row.preDayNum+'张':"全天累计发放：不限"}} -->
            <!-- {{scope.row.preDayNum!=0?'每日领取数限制'+scope.row.dayLimit+'张':"全天累计发放：不限"}} -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-title"><span class="h-title-text">模板</span></div>
    <div style="padding-left:12px;" v-if="demoAppActivity.templates!=null">
        模板id：{{demoAppActivity.templates.templateId}}
        <br/>
        相关母版：{{demoAppActivity.templates.masterName}}

    </div>
    <div class="h-title"><span class="h-title-text">规则</span></div>
    <div v-if="demoAppActivity.activityGroupRule!=null">
    <div class="setRule">抽奖概率：{{demoAppActivity.activityGroupRule.rule}}</div>
    <div class="setRule">领券数量：{{demoAppActivity.activityGroupRule.receiveNum}} 张</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchPedQuantity!=0">每人每天可领：{{demoAppActivity.activityGroupRule.dispatchPedQuantity}} 张</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchPedQuantity==0">每人每天可领：不限</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchAccumulateQuantity!=0">每人累计上限：{{demoAppActivity.activityGroupRule.dispatchAccumulateQuantity}} 张</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchAccumulateQuantity==0">每人累计上限：不限</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchAlldayAccumulateQuantity!=0">全天累计发放：{{demoAppActivity.activityGroupRule.dispatchAlldayAccumulateQuantity}} 张</div>
    <div class="setRule" v-if="demoAppActivity.activityGroupRule.dispatchAlldayAccumulateQuantity==0">全天累计发放：不限</div>
    </div>

    <div class="h-title"> <span class="h-title-text">渠道设置</span></div>
    <div class="channelCon" style="padding-left:12px;">
      <el-row class="channelCon-item">
        <el-col :span="3"><div class=""></div>落地页网址：</el-col>
        <el-col :span="20">
          <div class="">
            <p>{{demoAppActivity.channelUrl}}</p>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>

export default {
  data(){
    return {
      detail:{},
      activityId:"",
      activityName:"",
      demoAppActivity:{
        "name": "",
        "activityType": null,
        "activityStartDate": null,
        "activityEndDate": null,
        "activityGroupName": "",
        "remarks": null,
        "isAllShop": 1,
        "appName": "",
        "activityShops": [
       ],
        "customerGroupName": "",
        "activityCrowd": {
            "activityId": "",
            "geoRailType": 1,
            "railScope": 40,
            "floor": "F10",
            "crmGroupId": "",
            "createTime": ""
       },
        "couponActivities": [
       ],
        "templates": {
            "id": 12,
            "activityId": "横版券列表"
       },
        "activityRule": {
            "id": "GfPi4liS",
            "activityId": "A05giureZ",
            "rule": 1,
            "receiveNum": 1,
            "dispatchPedQuantity": 1,
            "dispatchAccumulateQuantity": 1,
            "dispatchAlldayAccumulateQuantity": 1,
            "status": 1,
            "createTime": ""
       },
        "channelUrl": ""
   },
      activityCouponDTO:[],
      activityShopDTO:[],
      activityRuleDTO:[],
      activityChannelDTO: [], // 渠道
      perDayPerson:"",
      personTotal:"",
      perDayTotal:"",
      url: "",
      status:0,
    }
  },
  created(){
    this.activityId = this.$route.query.activityId;
    this.activityName = this.$route.query.activityName;
    this.portalId = this.$route.query.portalId;
    this.status = this.$route.query.status;
    this.getActivityDetail()
  },
  methods : {
    getActivityDetail(){
      let _this= this;
      let params={
		      portalId:_this.portalId,
		      activityId:_this.activityId
      }
      this.$api.getActivityDetail(params).then(res=>{
		_this.demoAppActivity=res;
		// _this.getTemplateDetail(res.templates.id);
      })
	},
	getTemplateDetail(id){

	},
			modifyActivity(){
				let arr=[];
				arr.push("appId="+this.$store.state.appInfor.appId);
				arr.push("appName="+this.$store.state.appInfor.appName);
				arr.push("portalId="+this.$store.state.appInfor.portalId);
				arr.push("subjectType="+this.$store.state.appInfor.subjectType);
				arr.push("activityId="+this.activityId);
				arr.push("activityName="+this.activityName);
				console.log(arr.join('&'));
				this.$router.push('/?'+arr.join('&'));
		    },
  }
}
</script>

<style scoped lang="scss">
.detail{
   .el-tag+.el-tag{
     margin-left: 10px;
   }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .h-title{
    color: #284567;
    padding: 15px 0;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 15px;
  }
  .h-title-text{
    display: inline-block;
    padding-left: 8px;
    border-left: 4px solid #284567;
    font-size: 16px;
    line-height: 16px;
    font-weight: 600;
  }
  .editeActive{
    margin-left: 10px;
    color: #fff;
    background:#ff7633;
    border-radius: 17px;
  }
  .setRule{margin:15px}
</style>
