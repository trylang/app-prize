<template>
	<div>
		<div v-if="$route.path=='/activity/settingRule'" v-loading="pageLoading" element-loading-text="拼命加载中...">
			<div class="toolbar">为应用<span class="appName"> {{$store.state.appInfor.appName}} </span>创建活动</div>
        <!-- 活动抽奖设置 -->
        <el-col class="stepTitle" >活动抽奖设置</el-col>
     		<el-col>
     			<table class="formItemTable1">
			        <tr>
			        	<td class="title">抽奖概率：</td>
                <td class="item-title" colspan="3">
                    <template>
                      每抽 
                      <el-input-number :min='0' size="mini" v-model="rule"  style="width:100px" :controls="false">
                      </el-input-number> 次，中一次
                    </template>
                </td>
			        </tr>
			        <tr>
			        	<td class="title">领券数量：</td>
			            <td class="item-title" colspan="3">
			                <template>
			                  每次中奖领取 
				              	<el-input-number :min='0' size="mini" v-model='receiveNum' style="width:100px" :controls="false">
                        </el-input-number> 
                        张优惠券
                        <p><img src="../../../assets/settingsChannel/icon-tanhao.png" /> 每个券只能出一张，每次领券数量不能超过券批数</p>
			                </template>
			            </td>
			        </tr>
			    </table>
			  </el-col>

        <!-- 活动限制规则 -->
     		<el-col class="stepTitle" >活动限制规则</el-col>
     		<el-col>
     			<table class="formItemTable1">
			        <tr>
			        	<td class="title">每人每天可领：</td>
			            <td colspan="3">
			                <template>
			                  <el-radio class="radio" v-model="dispatchPedQuantityRadio" :label="0">不限定数量</el-radio>
				              	<el-radio class="radio" v-model="dispatchPedQuantityRadio" :label="1">指定数量</el-radio>
				              	<el-input-number v-if="dispatchPedQuantityRadio==1"  :min='0' size="mini" v-model="dispatchPedQuantity" style="width:100px" :controls="false"></el-input-number> 张
			                </template>
			            </td>
			        </tr>
			        <tr>
			        	<td class="title">每人累计上限：</td>
			            <td colspan="3">
			                <template>
			                  <el-radio class="radio" v-model="dispatchAccumulateQuantityRadio" :label="0">不限定数量</el-radio>
				              	<el-radio class="radio" v-model="dispatchAccumulateQuantityRadio" :label="1">指定数量</el-radio>
				              	<el-input-number v-if="dispatchAccumulateQuantityRadio==1" :min='0' size="mini" v-model='dispatchAccumulateQuantity' style="width:100px" :controls="false"></el-input-number> 张
			                </template>
			            </td>
			        </tr>
			        <tr>
			        	<td class="title">全天累计发放：</td>
			            <td colspan="3">
			                <template>
			                  <el-radio class="radio" v-model="dispatchAlldayAccumulateQuantityRadio" :label="0">不限定数量</el-radio>
				              	<el-radio class="radio" v-model="dispatchAlldayAccumulateQuantityRadio" :label="1">指定数量</el-radio>
				              	<el-input-number v-if="dispatchAlldayAccumulateQuantityRadio==1" size="mini" :min='0' v-model="dispatchAlldayAccumulateQuantity" style="width:100px" :controls="false"></el-input-number> 张
			                </template>
			            </td>
			        </tr>
			    </table>
			  </el-col>
        <el-col class="" style="text-align: center">
          <div class="goBack Button"  @click="goBackPrev" >上一步</div>
          <div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
        </el-col>
		</div>
  </div>
</template>
<script>
export default {
	data(){
		return {
			rule: 0,
			receiveNum: 0,
			dispatchPedQuantityRadio : 0 //
			,dispatchPedQuantity : 0 
			,dispatchAccumulateQuantityRadio : 0 
			,dispatchAccumulateQuantity : 0 
			,dispatchAlldayAccumulateQuantityRadio : 0 
			,dispatchAlldayAccumulateQuantity : 0 
			,pageLoading : false 
		}
	} , 
	created(){
		if(this.$store.state.appInfor.activityId){
			this.getActivityRuleDetail();
		}
	},
	methods : {
		getActivityRuleDetail(){	//获取规则详情
			let _this = this ; 
			_this.$api.getActivityRuleDetail({
				portalId : _this.$store.state.appInfor.portalId , 
					activityId : _this.$store.state.appInfor.activityId 
			}).then(ret=>{
				ret = ret[0];
				if(ret.dispatchPedQuantity==0){
					_this.dispatchPedQuantityRadio = 0 ;
				}
				else{
					_this.dispatchPedQuantityRadio = 1 ; 
					_this.dispatchPedQuantity = ret.dispatchPedQuantity ;
				}
				if(ret.dispatchAccumulateQuantity==0){
					_this.dispatchAccumulateQuantityRadio = 0 ;
				}
				else{
					_this.dispatchAccumulateQuantityRadio = 1 ; 
					_this.dispatchAccumulateQuantity = ret.dispatchAccumulateQuantity ; 
				}
				if(ret.dispatchAlldayAccumulateQuantity == 0){
					_this.dispatchAlldayAccumulateQuantityRadio = 0 ;
				}
				else{
					_this.dispatchAlldayAccumulateQuantityRadio = 1 ; 
					_this.dispatchAlldayAccumulateQuantity = ret.dispatchAlldayAccumulateQuantity;
				}
				_this.rule = ret.rule;
				_this.receiveNum = ret.receiveNum;
				console.log(_this.rule)
			}).catch(()=>{});
		},	
		clickAndSaveInfor(){		//确定提交
			if(!this.rule){
				this.error('请输入抽奖概率');
				return false;
			}
			if(!this.receiveNum){
				this.error('请输入领券数量');
				return false;
			}
			if(this.dispatchAccumulateQuantityRadio == 1 && this.dispatchAccumulateQuantity==undefined){
				this.error('请输入每人累计可领取数量');
				return false;
			}
			if(this.dispatchAlldayAccumulateQuantityRadio == 1 && this.dispatchAlldayAccumulateQuantity==undefined){
				this.error('请输入累计全天发放数量');
				return false;
			}
			let _this = this ,
				params = {
					rule: _this.rule,
					receiveNum: _this.receiveNum,
					dispatchPedQuantity : _this.dispatchPedQuantityRadio == 0 ? 0 : _this.dispatchPedQuantity , 
					dispatchAccumulateQuantity : _this.dispatchAccumulateQuantityRadio == 0 ? 0 : _this.dispatchAccumulateQuantity , 
					dispatchAlldayAccumulateQuantity : _this.dispatchAlldayAccumulateQuantityRadio == 0 ? 0 : _this.dispatchAlldayAccumulateQuantity ,
					portalId : _this.$store.state.appInfor.portalId , 
					activityId : _this.$store.state.appInfor.activityId 
				};
			_this.$api.createActivityRule(params).then(ret=>{
				sessionStorage.setItem('appCreateSetUp' , 3) ;
				_this.$router.push('/activity/couponChoice');
			}).catch(()=>{});
		},
		goBackPrev(){	//返回上一步
			sessionStorage.setItem('appCreateSetUp' , 1) ;
			this.$router.push('/activity/businessChoice');
		}
	}
}
</script>

<style type="text/css">
.goBack {
  color: #ff7633;
  border: 1px solid #ff7633;
}
.goBack:hover {
  color: #ff7633;
  border: 1px solid #ff7633;
}
table.formItemTable1 {
  margin: 20px;
  color: #475669;
  width: 100%;
}
table.formItemTable1 td.title {
  color: #666666;
  font-size: 14px;
  font-weight: bold;
  width: 400px;
  text-align: right;
  padding-right: 15px;
}

table.formItemTable1 td.item-title {
  color: #666666;
  font-size: 14px;
  font-weight: bold;
}

table.formItemTable1 td.item-title p{
	height: 13px;
	font-family: MicrosoftYaHei;
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	line-height: 22px;
	letter-spacing: 0px;
	color: #cccccc;
}

table.formItemTable1 td {
  color: #999999;
  font-size: 14px;
  padding: 10px 0;
}
table.formItemTable1 i.tips {
  color: #cccccc;
  padding-top: 15px;
}
</style>