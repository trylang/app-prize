<template>
  <div>
    <div v-if="$route.path=='/activity/PeopleThrow'">
      <el-row>
     		<div class="toolbar" >为应用<span class="appName"> {{$store.state.appInfor.appName}} </span>创建活动</div>

        <el-col class="stepTitle">投放人群</el-col>
        <table class="formItemTable">
          <tr>
            <td class="title">投放人群：</td>
            <td colspan="3">
              <el-radio-group v-model="geoRailType">
                  <el-radio-button :label="1">场外人群</el-radio-button>
                  <el-radio-button :label="2">场内人群</el-radio-button>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td class="title"></td>

            <td colspan="3" v-if="geoRailType==1">
              <el-select  v-model="railScope" style='width:100px' >
                  <el-option v-for="(item , index) in railScopeList"  :key="index" :label="item"  :value="item"></el-option>
              </el-select> km 之内
            </td>
            <td colspan="3" v-if="geoRailType==2">
               <el-radio  :label="0" v-model="floorType">全场</el-radio><br>
               <el-radio  :label="1" v-model="floorType" class="selectFloor"></el-radio>
              <el-select  style='width:100px;margin-top: 30px' v-model="floor" :disabled="floorType==0">
                  <el-option v-for="(item , index) in floorList"  :key="index" :label="item.floorName"  :value="item.floorId"></el-option>
              </el-select> 楼层
            </td>
          </tr>
          <tr>
            <td class="title">泛会员群组：</td>
            <td colspan="3" class="peoplecontainer">
              <el-select v-model="crmGroupId" placeholder="请选择" style='width:300px' >
                <el-option
                v-for="(item , index) in crmGroupList"
                :key="index"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
              <router-link to='/activity/PeopleThrow/tags' tag="strong"> + 创建标签群组</router-link>
            </td>
          </tr>
        </table>

        <div class="peoplecontainer">
          
          
        </div>

        <el-col class="" style="text-align: center">
          <div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
          <div class="goBack Button"  @click="goBackPrev" >上一步</div>
        </el-col>
      </el-row>
      
    </div>
	<router-view @parentFn="scrmCustomerGroupList"></router-view>
  </div>
</template>
<script>
export default {
    data(){
		return {
			crmGroupList : []	//人群投放列表
			,crmGroupId : '-1'	//人群投放编号
			,geoRailType : 1 	//人群类型
			,railScopeList : [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10] 	//距离列表
			,railScope : 0.5		//场外距离
			,floorList : [] 	//楼层列表
			,floorType : 0 		//
			,floor 		: '-1' 	//
		}
	} , 
	created(){
		this.scrmCustomerGroupList() ;
	},
	methods : {
		scrmCustomerGroupList(){	//人群投放列表
			let _this = this ; 
			_this.$api.scrmCustomerGroupList({
				pageNum : 1 , 
				pageSize : 100 , 
				portalId : _this.$store.state.appInfor.portalId , 
				subjectType : _this.$store.state.appInfor.subjectType 
			}).then(ret=>{
				_this.crmGroupList = ret.list.map(function(item){
					return {
						id : item.id , 
						name : item.name  , 
						tenantId : item.tenantId 
					}
				});
				_this.crmGroupList.unshift({
					id : '-1' , 
					name : '请选择' , 
					tenantId : -1000
				});
				_this.getFloorList();
			}).catch(()=>{});
		} , 
		getFloorList(){	//获取楼层列表
			let _this = this ; 
			_this.$api.getFloorList({
				portalId : _this.$store.state.appInfor.portalId , 
				subjectType : _this.$store.state.appInfor.subjectType 
			}).then(ret=>{
				_this.floorList = ret.map(function(item){
					return {
						floorId : item.floorId , 
						floorName : item.floorName 
					}
				});
				_this.floorList.unshift({
					floorId : '-1' , 
					floorName : '请选择'
				});
				if(_this.$store.state.appInfor.activityId){
					_this.getInforByActivityId();
				}
			}).catch(()=>{});
		},	
		getInforByActivityId(){	//获取详细信息
			let _this = this ,
				params = {
					portalId : _this.$store.state.appInfor.portalId , 
					activityId : _this.$store.state.appInfor.activityId , 
				};
			_this.$api.activityGetCrowdDetail(params).then(ret=>{
				_this.geoRailType = ret.geoRailType ; 
				_this.railScope = parseFloat(ret.railScope / 1000) ; 
				if(ret.floor == '0'){
					_this.floorType = 0 ;
				}
				else{
					_this.floorType = 1 ;
					_this.floor = ret.floor ;
				}
				_this.crmGroupId = ret.crmGroupId;
			}).catch(()=>{});
		},
		clickAndSaveInfor(){	//保存信息
			// alert(this.floorType);
			if(this.geoRailType==2 && this.floorType==1 && this.floor=='-1'){
				this.error('请选择楼层');
				return false;
			}
			if(this.crmGroupId=='-1'){
				this.error('请选择泛会员群组');
				return false;
			}
			let _this = this , 
				params = {
					portalId : _this.$store.state.appInfor.portalId , 
					activityId : _this.$store.state.appInfor.activityId , 
					geoRailType : _this.geoRailType ,
					crmGroupId : _this.crmGroupId 
				}
			if(_this.geoRailType==1){
				params.railScope = _this.railScope * 1000; 
			}
			if(_this.geoRailType == 2){
				params.floor = _this.floorType == 0 ? 0 : _this.floor ; 
			}
			_this.$api.activityCreateCrowdCreate(params).then(ret=>{
				sessionStorage.setItem('appCreateSetUp' , 4) ;
				_this.$router.push('/activity/couponChoice');
			}).catch(()=>{});
		},
		goBackPrev(){	//返回上一步
				sessionStorage.setItem('appCreateSetUp' , 2) ;
				this.$router.push('/activity/settingRule');
		}
	}
}
</script>

<style type="text/css">
.peoplecontainer {
  width: 300px;
  margin: 0 auto;
}
.peoplecontainer > h5 {
  text-align: center;
  font-size: 18px;
  color: #666666;
  margin-bottom: 30px;
}
.peoplecontainer > p {
  padding-top: 29px;
  margin-bottom: 40px;
  color: #cccccc;
  height: 14px;
  font-size: 14px;
  font-weight: bold;
}
.peoplecontainer > p strong {
  padding-left: 14px;
  color: #ff7633;
  cursor: pointer;
}
.selectFloor .el-radio__label{color: #FFF}
.selectFloor .el-radio__input.is-checked + .el-radio__label {
    color: #FFF !important;
}
</style>

