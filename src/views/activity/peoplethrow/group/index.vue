<template>
    <section>
        <div class="toolbar" >为应用<span class="appName"> {{$store.state.appInfor.appName}} </span>创建活动</div>
            <section>
            <div>
                <div class="conTitle">标签创建群组</div>
            </div>
            <table class="tagListContentWarp creatTagGroup">
                <tr>
                    <td class="title">群组名称：</td>
                    <td>
                        <el-input v-model="name" placeholder="请输入内容" style="width:160px;"></el-input>
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
                                                                <el-input v-model="secoundItem.itemValue" :disabled="secoundItem.itemChoiseModel==0" placeholder="距今" class="inputStyle"></el-input>
                                                                <span class="defaultValue" style="padding-left:10px;">
                                                                    <em class="unit">{{secoundItem.unit}}</em>
                                                                </span> 
                                                                天
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
                                                                <el-input v-model="secoundItem.maxItemValue" :disabled="secoundItem.itemChoiseModel==0" placeholder="" class="inputStyle"></el-input>
                                                                <span class="defaultValue" style="padding-left:10px;">
                                                                    <em class="unit">{{secoundItem.unit}}</em>
                                                                </span> 
                                                                
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
    </section>
</template>
<script>
export default {
    data(){
        return {
            tagTotalList : null 	//群组标签
            ,name : '' 				//群组名称
            ,comment : ''			//群组备注
        }
    }, 
    created(){
        this.getTagListOfNewGroup();
    },
    methods : {
        getTagListOfNewGroup(){
				let _this = this ; 
				let tagList = [] ;
				let param={
					portalId:JSON.parse(sessionStorage.getItem('activityInfor')).portalId,
					subjectType:JSON.parse(sessionStorage.getItem('activityInfor')).subjectType,
				};
				_this.$api.getScrmGroupTagsList(param).then(ret=>{
					ret.forEach(function(bigItem){
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
									_itemArr.tagType = Object.freeze(secoundItem.items[0].range ? 3 : 2) ; //单个输入框与多个输入框设置 tagsType  2:单；3：多
								}
							}
							_tagItem.listItem.push(_itemArr);
						});

						tagList.push(_tagItem);
						console.log(tagList);
					});
					_this.tagTotalList = tagList;
				}).catch(()=>{});
            } , 
            saveAndCreateGroupInfo(){//提交并创建群组
				let _this = this ; 
				if(_this.name ===''){
                    _this.error('群组名称不能为空') ; 
                    return false;
				}
				if(_this.comment == ''){
                    _this.error('群组备注不能为空') ; 
                    return false; 
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
                                        _this.error('请选择'+bigItem.name+'-'+secoundItem.name+'信息');
                                        return false;
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
								if(secoundItem.itemChoiseModel == 1){
									if(!secoundItem.itemValue){
                                        _this.error('请输入 '+bigItem.name+'-'+secoundItem.name+' 值');
                                        return false;
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
                                        _this.error('请输入 '+bigItem.name+'-'+secoundItem.name+' 区间最小值');
                                        return false;
									}
									if(!secoundItem.maxItemValue){
                                        _this.error('请输入 '+bigItem.name+'-'+secoundItem.name+' 区间最大值');
                                        return false;
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
						seniorTags : choiseTags , 
						tenantId : _this.$store.state.appInfor.portalId , 
						tenantType : _this.$store.state.appInfor.subjectType 
					}; 
				_this.$api.scrmCreateGroupByTags(params).then(ret=>{
					_this.success('群组创建成功');
					_this.$emit('parentFn');
					_this.$router.push('/activity/PeopleThrow');
				}).catch(()=>{});

			}
    }
}
</script>
<style>
.el-checkbox{margin:0px 30px 10px 0px;}
.el-checkbox+.el-checkbox{margin-left:0px;}
.creatTagGroup .el-input__inner{line-height: 32px;height: 32px;padding-right:60px;}
.creatTagGroup .inputwidthcount{width:460px;}
.creatTagGroup .inputwidthcount{width:460px}
.creatTagGroup .inputwidthcount em{right: 10px;left: initial;}
.creatTagGroup .el-radio__input.is-checked+.el-radio__label {color: #284567;}
.creatTagGroup .el-radio__input.is-checked .el-radio__inner {border-color: #284567;background: #284567;}
.creatTagGroup .el-radio-button__orig-radio:checked+.el-radio-button__inner {color: #284567;background-color: #fff;border-color: #284567}
.creatTagGroup .el-radio-button__inner{line-height: 0.58}
.el-checkbox__input.is-checked+.el-checkbox__label {color: #284567;}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {background-color: #284567;border-color: #284567;}
</style>
