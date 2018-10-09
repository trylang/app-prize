<template>
	<section>
		<div>
	    <div class="conTitle">标签创建群组</div>
	    </div>
	    <table class="tagListContentWarp">
			<tr>
				<td class="title">群组名称：</td>
				<td>
					<el-input v-model="name" placeholder="请输入内容" style="width:260px;"></el-input>
				</td>
			</tr>
			<tr>
				<td class="title">群组备注：</td>
				<td>
					<div class="inputwidthcount">
						<el-input v-model="comment" maxlength="30" placeholder="请输入备注内容"></el-input>
						<em>{{comment.length}} / 30</em>
					</div>
				</td>
			</tr>
			<tr>
				<td class="title tagstitle">选择标签：</td>
				<td>
					<div class="tagsAreaWarp">

						<!--标签大项循环-->
						<template v-for="(bigItem , index) in tagTotalList">
							<div class="tagsItem">
								<h3 class="itemTitle">
									<span></span>{{bigItem.name}}
								</h3>
								<table class="tagsItemTable">
									<template v-for="(secoundItem , index) in bigItem.listItem">
										<tr>
											<td class="itemTdTitle">{{secoundItem.name}}：</td>
											<td>
												<!--多选循环-->
												<template v-if="secoundItem.tagType==0">
													<div class="tagItemCheckbox">
														<el-radio-group v-model="secoundItem.itemChoiseModel">
															<el-radio-button label="0">不限</el-radio-button>
															<el-radio-button label="1">选择</el-radio-button>
														</el-radio-group>
													</div>
												  <div class="checkboxItemArea" v-if="secoundItem.itemChoiseModel==1">
												   		<!-- {{secoundItem.itemModel}} -->
														<el-checkbox-group v-model="secoundItem.itemModel">
															<template v-for="(item , index) in secoundItem.item">
														    	<el-checkbox :label="item.id" :disabled="secoundItem.itemChoiseModel==0">{{item.name}}</el-checkbox>
														    </template>
														</el-checkbox-group>
												  </div>
											  </template>

												<template v-if="secoundItem.tagType==1">
													<!-- {{secoundItem.itemModel}} -->
													<el-radio-group v-model="secoundItem.itemModel">
														<el-radio :label="0">不限</el-radio>
														<template v-for="(item , index) in secoundItem.item">
															<el-radio :label="item.id">{{item.name}}</el-radio>
														</template>
													</el-radio-group>
												</template>

												<template v-if="secoundItem.tagType==2">
													<!-- {{secoundItem.maxItemValue}} -->
													<div class="tagItemCheckbox">
														<el-radio-group v-model="secoundItem.itemChoiseModel">
																<el-radio-button label="0">不限</el-radio-button>
																<el-radio-button label="1">选择</el-radio-button>
														</el-radio-group>
													</div>
													<div class="checkboxItemArea" v-if="secoundItem.itemChoiseModel==1">
														<div class="oneInputSet">
															<el-input v-model="secoundItem.itemValue" :disabled="secoundItem.itemChoiseModel==0" placeholder="距今" class="inputStyle"></el-input> &nbsp;天
															<span class="defaultValue" style="padding-left:10px;">
																<em class="unit">{{secoundItem.unit}}</em>
															</span> 
															
														</div>
													</div>
												</template>

												<template v-if="secoundItem.tagType==3">
													<!-- {{secoundItem.maxItemValue}} -->
													<div class="tagItemCheckbox">
														<el-radio-group v-model="secoundItem.itemChoiseModel">
																<el-radio-button label="0">不限</el-radio-button>
																<el-radio-button label="1">选择</el-radio-button>
														</el-radio-group>
													</div>
													<div class="checkboxItemArea" v-if="secoundItem.itemChoiseModel==1">
														<div class="oneInputSet">
															<el-input v-model="secoundItem.minItemValue" placeholder="最低消费" class="inputStyle" :disabled="secoundItem.itemChoiseModel==0"></el-input> - 
														</div>
														<div class="oneInputSet">
															<el-input v-model="secoundItem.maxItemValue"  :disabled="secoundItem.itemChoiseModel==0" placeholder="最高消费" class="inputStyle"></el-input> &nbsp;元
															<span class="defaultValue" style="padding-left:10px;">
																<em class="unit">{{secoundItem.unit}}</em>
															</span> 
															
														</div>
													</div>
												</template>

												<template v-if="secoundItem.tagType==4">
													<!-- {{secoundItem.maxItemValue}} -->
													<div class="tagItemCheckbox">
														<el-radio-group v-model="secoundItem.itemChoiseModel">
																<el-radio-button label="0">不限</el-radio-button>
																<el-radio-button label="1">选择</el-radio-button>
														</el-radio-group>
													</div>
													<div class="checkboxItemArea" v-if="secoundItem.itemChoiseModel==1">
														<div class="oneInputSet">
															<!-- <el-input v-model="secoundItem.minItemValue" placeholder="选择日期" class="inputStyle" :disabled="secoundItem.itemChoiseModel==0"></el-input> -  -->
															<el-date-picker
																class="" :disabled="secoundItem.itemChoiseModel==0"
																v-model="secoundItem.itemValue"
																type="date"
																placeholder="选择日期"
																format="yyyy 年 MM 月 dd 日"
																value-format="yyyy-MM-dd">
															</el-date-picker>
														</div>
													</div>
												</template>
											</td>
										</tr>
									</template>
									
								</table>
							</div>
						</template>

					</div>
				</td>
			</tr>
			<tr>
				<td class="title"></td>
				<td>
					<a href="javascript:void(0);" class="createOrEditGroup" @click="saveAndCreateGroupInfo">创建群组</a>
				</td>
			</tr>
	    </table>
	</section>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				demoActivityAdd: null,
				demoActivityId: '',
				tagTotalList : null 	//群组标签
				,name : '' 				//群组名称
				,comment : ''			//群组备注
			}
		}, 
		computed : {
			groupId : function(){
				return this.$route.query.id ; 
			}
		},
		created(){
			this.demoActivityAdd = JSON.parse(localStorage.getItem("demoActivityAdd"));
			this.demoActivityId = localStorage.getItem("demoActivityId");
			if(this.groupId){

			}
			else{
				this.getTagListOfNewGroup();
			}
			
		} , 
		methods : {
			getTagListOfNewGroup(){
				let _this = this ; 
				let tagList = [] ; 
				peoplethrowTagList({
					tenantType: this.demoActivityAdd.subjectType,
        	tenantId: this.demoActivityAdd.portalId
				}).then(ret=>{
					ret.data.forEach(function(bigItem){
						let _tagItem = {
							name : bigItem.name , 
							id : bigItem.id  , 
							listItem : [] 
						}
						bigItem.tagConfigList.forEach(function(secoundItem){
							let _itemArr = {
								dbColumn : secoundItem.dbColumn , 
								hasFunction : secoundItem.hasFunction , 
								function : secoundItem.function  , 
								id : secoundItem.id , 
								name : secoundItem.name , 
								visiable : secoundItem.visiable
							} ; 
							if(secoundItem.multiple){
								_itemArr.tagType = 0 ; 		//如果是多选，则为0 
								_itemArr.itemModel = [] ; 
								_itemArr.itemChoiseModel = 0;
								_itemArr.id = secoundItem.id ; 
								_itemArr.item = secoundItem.items.map(function(item){
									return Object.freeze({
											id : item.id + '_' + item.itemValue , 
											name : item.label 
										});
								});
							}
							else{
								if(!secoundItem.items[0].input){
									_itemArr.tagType = 1 ; //单选时设置 tagsType = 1 ; 
									_itemArr.itemModel = 0 ; 
									_itemArr.item = secoundItem.items.map(function(item){
										return {
											id : item.id + '_' + item.itemValue, 
											name : item.label 
										};
									});
								}
								
								else{
									_itemArr.minItemValue = secoundItem.items[0].minItemValue ; 
									_itemArr.maxItemValue = secoundItem.items[0].maxItemValue; 
									_itemArr.itemValue = secoundItem.items[0].itemValue ; 
									_itemArr.valueType = Object.freeze(secoundItem.items[0].valueType) ; 
									_itemArr.valueFormat = Object.freeze(secoundItem.items[0].valueFormat);
									_itemArr.sId = Object.freeze(secoundItem.items[0].id) ; 
									_itemArr.unit = Object.freeze(secoundItem.items[0].unit ? secoundItem.items[0].unit : '');
									_itemArr.itemChoiseModel = 0 ;
									_itemArr.tagType = Object.freeze( secoundItem.items[0].valueFormat === "MMdd" ? 4 : (secoundItem.items[0].range ? 3 : 2)); //单个输入框与多个输入框设置 tagsType  2:单；3：多
								}
							}
							_tagItem.listItem.push(_itemArr);
						});

						tagList.push(_tagItem);
					});
					_this.tagTotalList = tagList;
				}).catch(()=>{});
			} , 
			saveAndCreateGroupInfo(){//提交并创建群组
				let _this = this ; 
				if(_this.name ===''){
					return _this.checkAndAlertData('群组名称不能为空') ; 
				}
				if(_this.comment == ''){
					return _this.checkAndAlertData('群组备注不能为空') ; 
				}
				let choiseTags =  [] ; 
				for(let bigIndex = 0 ; bigIndex < _this.tagTotalList.length ; bigIndex ++){
					let bigItem = _this.tagTotalList[bigIndex];
					for(let secoundIndex = 0 ; secoundIndex < bigItem.listItem.length ; secoundIndex++){
						let secoundItem = bigItem.listItem[secoundIndex];
						switch(secoundItem.tagType){
							case 0 : 
								if(secoundItem.itemChoiseModel == 1){
									if(secoundItem.itemModel.length <1){
										return _this.checkAndAlertData('请选择'+bigItem.name+'-'+secoundItem.name+'信息');
									}
									else{
										let checkboxItem = {
											id : secoundItem.id 
										};
										checkboxItem.items = secoundItem.itemModel.map(function(i){
											if(secoundItem.id=='25315529078079509'){
												return {
													id : i.split('_')[0]  , 
													itemValue : i.split('_')[1]
												}
											}
											else{
												return {
													id : i.split('_')[0]
												}
											}
										});
										choiseTags.push(checkboxItem);
									}
								}
								break;
							case 1 : 
								if(secoundItem.itemModel != 0){
									let radioItem = {
										id : secoundItem.id
									};
									if(secoundItem.id == '25315529078079509'){
										radioItem.items = [
											{
												id : secoundItem.itemModel.split('_')[0] , 
												itemValue : secoundItem.itemModel.split('_')[1] 
											}
										]
									}
									else{
										radioItem.items = [
											{
												id : secoundItem.itemModel.split('_')[0]
											}
										]
									}
									choiseTags.push(radioItem);
								}
								break;
							case 2 : 
							case 4 :
								if(secoundItem.itemChoiseModel == 1){
									if(!secoundItem.itemValue){
										return _this.checkAndAlertData('请输入 '+bigItem.name+'-'+secoundItem.name+' 值');
									}
									let oneInput = {
										id : secoundItem.id , 
										items : [{
											id : secoundItem.id ,
											itemValue : secoundItem.itemValue
										}]
									}
									choiseTags.push(oneInput);
								}
								break; 
							case 3 : 
								if(secoundItem.itemChoiseModel == 1){
									if(!secoundItem.minItemValue){
										return _this.checkAndAlertData('请输入 '+bigItem.name+'-'+secoundItem.name+' 区间最小值');
									}
									if(!secoundItem.maxItemValue){
										return _this.checkAndAlertData('请输入 '+bigItem.name+'-'+secoundItem.name+' 区间最大值');
									}
									let twoInput = {
										id : secoundItem.id , 
										items : [{
											id : secoundItem.sId ,
											maxItemValue : secoundItem.maxItemValue , 
											minItemValue : secoundItem.minItemValue
										}]
									}
									choiseTags.push(twoInput);
								}
								break;
						}
					}
				}
				console.log(choiseTags);
				_this.saveToDataBase(choiseTags);
			} , 
			saveToDataBase(choiseTags){	//确定保存操作
				let _this = this , 
					params = {
						name : _this.name , 
						comment : _this.comment , 
						seniorTags : choiseTags,
						tenantType: _this.demoActivityAdd.subjectType,
        		tenantId: _this.demoActivityAdd.portalId
					}; 
				peoplethrowCreate(params).then(ret=>{
					_this.$message({
						message : '群组创建成功' , 
						type : 'success'
					});
					_this.$emit('parentFn');
					if (this.$route.query.id) {
						_this.$router.push({
							path: "/activity/peoplethrow",
							query: { id: this.$route.query.id }
						});
					} else {
					_this.$router.push('/activity/peoplethrow');
					}
				}).catch(()=>{});

			},
			checkAndAlertData(){	//检查数据并弹出数据内容
				let args = arguments ; 
				if(args.length==1){
					this.$message({
						message : args[0] , 
						type : 'warning'
					}) ; 
					return false ;
				}
			}
		}
	};
</script>
<style type="text/css">
.tagListContentWarp{width:100%;margin-top:20px;}
.tagListContentWarp td{padding:10px 0px;}
.tagListContentWarp td.title{width:85px;text-align:right;vertical-align:middle;color:#666;font-size:14px;}
.tagListContentWarp td.tagstitle{vertical-align: top;padding-top:15px;}
.inputwidthcount{width:460px;position:relative;height:40px;}
.inputwidthcount em{position:absolute;display:block;height:40px;line-height:40px;top:0px;right:10px;color:#D9D9D9;}
.tagsAreaWarp{border:1px solid #CCC;border-radius:5px;padding:20px 0px 0px 20px;width:870px;}
.tagsItem{margin-bottom:40px;}
.tagsItem h3.itemTitle{height:35px;color:#284567;line-height:35px;font-size:18px;}
.tagsItem h3.itemTitle span{display:inline-block;width:5px;height:5px;background:#284567;margin-right:8px;position:relative;top:-4px;}
.tagsItemTable{width:100%;margin-top:20px;}
.tagsItemTable td{min-height:40px;padding-left:10px;}
.tagsItemTable td.itemTdTitle{width:120px;text-align:right;color:#666;font-size:14px;padding:0px;}
.tagsItemTable div.tagItemCheckbox{margin-bottom:15px;}
.tagsItemTable div.checkboxItemArea .oneInputSet{position:relative;display:inline-block;color:#666;}
.tagsItemTable div.checkboxItemArea .oneInputSet .inputStyle{width:160px;}
.tagsItemTable div.checkboxItemArea .oneInputSet .inputStyle .el-input__inner{padding-left:20px;}
.tagsItemTable div.checkboxItemArea .oneInputSet span.defaultValue{display:block;position:absolute;height:40px;top:0px;left:140px;line-height:40px;color:#d9d9d9;}
.tagsItemTable div.checkboxItemArea .oneInputSet em.unit{color:#d9d9d9;font-size:14px;padding-left:20px;}
a.createOrEditGroup{display:block;width:160px;height:48px;border-radius:24px;margin:20px auto;color:#FFF;font-size:18px;text-align:center;background:#ff7633;line-height:48px;}
.el-checkbox{margin:0px 30px 10px 0px;}
.el-checkbox+.el-checkbox{margin-left:0px;}
</style>











