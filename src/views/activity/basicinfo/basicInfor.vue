<template>
	<div>
		<div v-if="$route.path=='/activity/basicInfor'" v-loading="pageLoading" element-loading-text="拼命加载中...">
     		<div class="toolbar" >为应用<span class="appName"> {{appName}} </span>创建活动</div>
     		<el-col class="stepTitle">基础信息</el-col>
     		<el-col>
     			<table class="formItemTable" id="choujiang_baseInfo_table">
			        <tr>
                <td class="title">活动名称：</td>
                <td colspan="3">
                  <template>
										<label style="position:relative;" class="baseInfo_act_name">
                      <el-input placeholder="请输入活动名称"  v-model="name" style="width:300px;" :maxlength="15"></el-input>
											<span style="position:absolute;right:5px;line-height:32px;">&nbsp;{{name.length}}/15</span>
										</label>
									</template>
                </td>
			        </tr>
			        <tr>
			          <td class="title">活动时间：</td>
                <td colspan="3" class="daterange">
                    <template >
                      <!-- <el-col :span="24"  style="margin-bottom: 12px;">
                        <el-radio class="radio fix" :label="0" v-model="activityType">长期活动</el-radio>&nbsp;&nbsp;
                        <el-date-picker  v-model="activeDate" type="date" value-format="yyyy-MM-dd" style="width:300px"  placeholder="选择日期" @change="dateChange"> </el-date-picker>
                      </el-col> -->
                      <el-col :span="24">
                        <!-- <el-radio class="radio fix" :label="1" v-model="activityType">短期活动</el-radio>&nbsp;&nbsp; -->
                        <el-date-picker placeholder="请选择日期范围" v-model="datetime" type="daterange" value-format="yyyy-MM-dd" style="width:300px;position: relative;" @change="activeDateChange"> </el-date-picker>
                      </el-col>
                  </template>
                </td>
			        </tr>
			        <tr>

                <td class="title" style="vertical-align: top;padding-top:22px;">活动组：</td>
                <td colspan="3" >
                  <template v-if="!createActive">
                      <!-- <el-select v-model="activityGroupId" style="width:300px;" >
                        <el-option v-for="(item , index) in activityGroup" :key="index" :label="item.groupName" :value="item.id"></el-option>
                    </el-select>&nbsp;&nbsp; -->
                    <el-select v-model="activityGroupId" style="width:300px;" >
                        <el-option
                        v-for="item in activityGroup"
                        :key="item.id"
                        :label="item.groupName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <!-- <el-button class="inputBtn addGroup"  @click.native.prevent="createActiveBut">+ 创建活动组</el-button> -->
                      <strong @click="createActive=!createActive"> + 创建活动组</strong>
                      <i class="el-icon-warning tips" style="display: inline-block"> 活动组将帮助您更好地对活动进行分组管理，并生成活动组营销报告，</i><br>
                      <i class="el-icon tips" style="display: inline-block;font-style: normal;padding-top:6px">&nbsp;&nbsp;&nbsp;&nbsp;全方位评估您的营销活动效率。</i>
                  </template>
                  <template v-if="createActive">
                    <input placeholder="请输入活动组名称" v-model="groupName" class="input" style="width:300px;" :maxlength="9" @keyup.13="groupCreaCtet()" />&nbsp;&nbsp;<span>{{groupName.length}}/9  字</span>
                    <strong @click="groupCreateByName">确认</strong>
                    <span @click="createActive = !createActive" class="canle">取消</span>
                  </template>
                </td>
			        </tr>
			        <tr>
                <td class="title">备注：</td>
                <td colspan="3">
                  <template >
                    <el-input type="textarea"  v-model="remarks" style="width:500px" :rows="5"  placeholder="请输入备注" ></el-input>
                  </template>
                </td>
			        </tr>

			    </table>
     		</el-col>
        <el-col class="" style="text-align: center">
            <div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
            <!-- <el-button class="goBack Button"  @click.native.prevent="goBackPrev">下一步</el-button> -->
        </el-col>
			<!-- <h2 class="stepTitle">基础信息</h2> -->
			<!-- <p>进行中活动:2</p> -->
		</div>
</div>
</template>
<script>
export default {
	data(){
		return {
			name : '',			//活动名称
			activityType : 1,  		//活动类型
			datetime : [] ,		//活动时间
			activityGroupId : -1 	//活动组ID
			,pageLoading : false 	//页面加载
			,createActive : false 	//是否创建组
			,activityGroup : []		//活动组列表
			,groupName : ''		//活动组名称
			,remarks : ''	,		//备注
      groupListObject:{},
		}
	} ,
	computed : {
		appName:function(){
			return JSON.parse(sessionStorage.getItem('activityInfor')).appName ;
		}
	},
	created(){
		this.getActivityGroupList();
	},
	methods : {
		getActivityGroupList(){	//获取组列表
      let _this = this ;
      let param={
          portalId:JSON.parse(sessionStorage.getItem('activityInfor')).portalId,
          subjectType:JSON.parse(sessionStorage.getItem('activityInfor')).subjectType,
      };
			_this.$api.activityGroupList(param).then(ret=>{
				_this.activityGroup = ret ;
        ret.forEach(function(item){
              _this.groupListObject[item.id]=item.groupName;
            });
        _this.activityGroup.unshift({id: -1 , groupName:'请选择'});
        if(_this.$store.state.appInfor.activityId){
          _this.getActivityBaseInfor();
        }
			}).catch(()=>{});
    },
    getActivityBaseInfor(){
        let _this = this ;
        _this.$api.activityBaseInforSearch({
            portalId : _this.$store.state.appInfor.portalId ,
            activityId : _this.$store.state.appInfor.activityId
        }).then(ret=>{
            _this.name = ret.name ;
            _this.datetime=[];
            _this.datetime.push(ret.activityStartDate);
            _this.datetime.push(ret.activityEndDate);
            _this.activityGroupId = ret.activityGroupId ;
            _this.remarks = ret.remarks ;
        }).catch(()=>{});
    },
		activeDateChange(){

		} ,
		groupCreateByName(){	//创建活动组
			if(this.groupName == ''){
				this.error('请输入活动组名称');
				return false ;
			}

			let _this = this ,
				params = {
					groupName : _this.groupName ,
					portalId : _this.$store.state.appInfor.portalId ,
					subjectType : _this.$store.state.appInfor.subjectType
				}
			this.$api.activityGroupCreate(params).then(ret=>{
				_this.success('活动组创建请求成功');
				_this.getActivityGroupList() ;
				_this.createActive = !_this.createActive ;
			}).catch(()=>{});
		},
		clickAndSaveInfor(){	//保存
			if(this.name ==''){
				this.error('请输入活动名称') ;
				return false ;
			}
      if(!this.datetime || this.datetime.length < 2 || !this.datetime){
				this.error('请选择活动时间');
				return false ;
			}
			if(this.activityGroupId == -1){
				this.error('请选择活动组');
				return false;
			}
			let _this = this ,
				params = {
					portalId : _this.$store.state.appInfor.portalId ,
					subjectType : _this.$store.state.appInfor.subjectType ,
					appId : _this.$store.state.appInfor.appId   ,
					name : _this.name ,
					activityType : 1   ,
					remarks : _this.remarks,
					activityGroupId : _this.activityGroupId,
        activityGroupName: _this.groupListObject[_this.activityGroupId],


				};
			if(this.datetime.length >1 && !!this.datetime[0]){
				params.activityStartDate = this.datetime[0];
			}
			if(this.datetime.length >1 && !!this.datetime[1]){
				params.activityEndDate = this.datetime[1];
      }
      console.log(params);
      if(_this.$store.state.appInfor.activityId){
          params.activityId = _this.$store.state.appInfor.activityId ;
          _this.$api.activityBaseInforUpdate(params).then(ret=>{
              sessionStorage.setItem('appCreateSetUp' , 1) ;
              _this.$router.push('/activity/businessChoice');
          }).catch(()=>{});
      }
      else{
        _this.$api.createActivity(params).then(ret=>{
          // _this.success('添加成功');
          let appInfor = _this.$store.state.appInfor ;
          appInfor.activityId = ret.activityId ;
          appInfor.activityName = _this.name ;
          sessionStorage.setItem('activityInfor' , JSON.stringify(appInfor));
          // _this.$store.commit('updateAppInfor' , appInfor);
          sessionStorage.setItem('appCreateSetUp' , 1) ;
          // _this.$store.commit('updateAppCreateSetUp' , 1);
          _this.$router.push('/activity/businessChoice');
        }).catch(()=>{});
      }
		}
	}
}
</script>
<style type="text/css">
.el-textarea__inner{resize:none;}
.toolbar {
  background: #e6eff9;
  padding: 0px 10px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 30px;
  font-size: 14px;
  color: #999999;
  line-height: 38px;
  border-radius: 4px;
}
.toolbar .appName {
  color: #ff7633;
  font-weight: 600;
}
.stepTitle {
  border-left: 4px solid #284567;
  color: #284567;
  height: 20px;
  font-size: 18px;
  padding-left: 5px;
  line-height: 20px;
}
table.formItemTable {
  margin: 20px;
  color: #475669;
  width: 100%;
}
table.formItemTable   strong {
    padding-left: 14px;
    color: #ff7633;
    cursor: pointer;
}
table.formItemTable   span.canle{
    color: #999999;
    cursor: pointer;
    margin-left: 14px;
}

table.formItemTable td.title {
  color:#666666;
  font-size: 14px;
  font-weight: bold;
  width: 310px;
  text-align: right;
  padding-right: 15px;
  vertical-align: middle;
}
table.formItemTable td {
  padding: 15px 0;
  color: #999999;
  font-size: 14px;
}
table.formItemTable i.tips {
  color: #CCCCCC;
  padding-top: 15px;
}
.Button {
  width: 160px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  font-size: 18px;
  border-radius: 24px;
}
.inputBtn {
  background: #ff7633;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  border: 1px solid #ff7633;
}
.addGroup:hover {
  border: 1px solid #ff7633;
  color: #fff;
  background: #ff7633;
}

.cancelBtn {
  background: #999999;
  color: #fff;
}
.cancelBtn:hover {
  border: 1px solid #999999;
  color: #fff;
  background: #999999;
}
.input {
  width: 300px;
  height: 30px;
  background: #fff;
  border: 1px solid #bfcbd9;
  text-indent: 8px;border-radius: 4px;
}
.goBack {
  color: #ff7633;
  border: 1px solid #ff7633;
  display: inline-block;
  cursor: pointer;
}
#choujiang_baseInfo_table .baseInfo_act_name input{
	padding-right: 45px;
}
#choujiang_baseInfo_table .daterange .el-range__icon.el-icon-date{
	font-size: 18px;
	font-weight: 600;
}
</style>
