<template>
<section>
		<div v-if="$route.path=='/activity/businessChoice'">
      <div class="toolbar" >为应用<span class="appName"> {{$store.state.appInfor.appName}} </span>创建活动</div>
      <div class="stepTitle" style="margin-bottom: 20px;">选择参加主体</div>
			<table class="formItemTable" style="margin:0 0 0 12px;" id="choujiang_join_main">
				<tr>
					<td style="width:80px;">参加主体：</td>
					<td>
						<el-radio-group v-model="verifyMainType">
								<el-radio-button :label="0">不限</el-radio-button>
								<el-radio-button :label="1">选择</el-radio-button>
						</el-radio-group>
						<p class="selectedNum" style="margin:0;line-height:40px;">已选<span style="color: #FF5400"> {{choiseShopCount}} </span>个 </p>
						<el-row style="position:relative;width:930px;" class="shopSelect">
							<div v-if="verifyMainType == 0" style="position:absolute;top:0;width:100%;height:100%;z-index:99;background:rgba(255,255,255,0.5)"></div>
							<span style="position:absolute;display:inline-block;height:100%;width:0;border-right:2px solid #e4e7ed;left:116px;z-index:2;"></span>
							<el-col :span="5" class="floorList">
								 <div class="search" style="height:50px;">
										 <div class="shopKeywordSearch">
													<maInput placeholder="搜索" v-model="name" @click="getShopListByKeyword" @enterClick="getShopListByKeyword"></maInput>
										</div>
									</div>
									<ul >
											<li v-if="floorId==''" class="active">结果</li>
											<template  v-for="(item ,index) in floorList">
													<li :class="[floorId ==item.floorId?  'active' : '']" @click="floorId = item.floorId;name='' ;getShopListByFloor();" :key="index">{{item.floorName}}</li>
											</template>
									</ul>
								</el-col>
							<el-col :span="19"   class="shop" style="padding-top:5px;width: 810px;">
									<el-col :span="24">
											<el-checkbox style="margin:10px 0px 14px;" v-model="choiseCurrentPageShop" @change="choiseCurrentFloor($event)">全部选择  ({{shopsList.length}})</el-checkbox>
									</el-col>
									<template v-for="(item, index) in shopsList">
											<div style="display:inline-block;width:145px;overflow:hidden;" :key="index">
													<el-checkbox :label="item.id" v-model="item.isChecked" @change="singleShopListChange($event , item)">{{item.name}}</el-checkbox>
											</div>
									</template>
						 </el-col>
				 </el-row>
					</td>
				</tr>
			</table>
        <!-- {{choiseShopList}} -->

        <div class="btncon">
          <div class="goBack Button"  @click="goBackPrev" >上一步</div>
					<div class="inputBtn Button" @click="clickAndSaveInfor">保存并继续</div>
        </div>
		</div>
</section>
</template>

<script>
export default {
    data(){
        return {
						verifyMainType: '0'  // 核销主体限制
            ,floorList : []      //楼层列表
            ,floorId : ''       //楼层选中
            ,shopsList : []         //店铺列表
            ,shopListBySearch : ''  //是否是搜索关键字
            ,choiseShopCount : 0        //选择的店铺数量
            ,choiseShopList : {}        //选择的店铺
            ,name : ''                  //店铺搜索关键字
            ,choiseCurrentPageShop : false
        }
    } ,
    created(){
        this.getFloorList();
    },
    methods : {
        getFloorList(){ //获取楼层列表
            let _this = this ,
                params = {
                    portalId : _this.$store.state.appInfor.portalId ,
                    subjectType : _this.$store.state.appInfor.subjectType
                };
            _this.$api.getFloorList(params).then(ret=>{
                _this.floorList = ret;
                _this.floorId = ret[0].floorId ;
                if(_this.$store.state.appInfor.activityId){
                    _this.getJoinShopList();
                }
                else{
                    if(ret.length > 0){
                        _this.getShopListByFloor();
                    }
                }
            }).catch(()=>{});
        } ,
        getJoinShopList(){
            let _this = this ;
            let param={
                portalId:JSON.parse(sessionStorage.getItem('activityInfor')).portalId,
                subjectType:JSON.parse(sessionStorage.getItem('activityInfor')).subjectType,
                activityId:_this.$store.state.appInfor.activityId,
            };
            _this.choiseCurrentPageShop = false ;
            _this.$api.activityShopListSearch(param).then(ret=>{
                ret.forEach(function(item){
                    _this.choiseShopList['shop_'+item.shopId] = {};
                    _this.choiseShopList['shop_'+item.shopId].id = item.shopId;
                    _this.choiseShopList['shop_'+item.shopId].name = item.shopName;
                    _this.choiseShopList['shop_'+item.shopId].isChecked = true;
                    _this.choiseShopCount ++
                });
                _this.verifyMainType = _this.choiseShopCount > 0 ? 1 : 0;
                if(_this.floorList.length > 0){
                    _this.getShopListByFloor();
                }
            }).catch(()=>{});
        },
        getShopListByFloor(){   //获取店铺列表根据楼层
            let _this = this ;
            _this.choiseCurrentPageShop = false ;
            _this.$api.getShopListByFloor({
                portalId :_this.$store.state.appInfor.portalId ,
                floorId:_this.floorId
            }).then(ret=>{
                _this.shopsList = ret.map(function(item){
                    let isChecked = false ;
                    if(_this.choiseShopList.hasOwnProperty('shop_'+item.id)){
                        isChecked = true
                    }
                    return {
                        id : item.id ,
                        name : item.name  ,
                        isChecked : isChecked
                    }
                }) ;
                if(_this.choiseShopCount == _this.shopsList.length){
                    _this.choiseCurrentPageShop = true ;
                }
                else{
                    _this.choiseCurrentPageShop = false ;
                }
            }).catch(()=>{});
        },
        singleShopListChange(event , item){     //单个复选框选中
            if(event){
                this.choiseShopCount ++ ;
                this.choiseShopList['shop_'+item.id] = item ;
            }
            else{
                if(this.choiseShopList.hasOwnProperty('shop_'+item.id)){
                    this.choiseShopCount -- ;
                    delete this.choiseShopList['shop_'+item.id];
                }
            }
            let _pageCheckedCount = 0 ;
            for(let i = 0 ; i<this.shopsList.length ; i ++){
                if(this.shopsList[i].isChecked){
                    _pageCheckedCount ++ ;
                }
            }
            if(_pageCheckedCount >= this.shopsList.length){
                this.choiseCurrentPageShop = true ;
            }
            else{
                this.choiseCurrentPageShop = false;
            }
        },
        choiseCurrentFloor(event){
            let _this = this ;
            if(event){
                _this.shopsList.forEach(function(item){
                    if(!_this.choiseShopList.hasOwnProperty('shop_'+item.id)){
                        item.isChecked = event ;
                        _this.choiseShopCount ++ ;
                        _this.choiseShopList['shop_'+item.id] = item;
                    }
                });
            }
            else{
                _this.shopsList.forEach(function(item){
                    if(_this.choiseShopList.hasOwnProperty('shop_'+item.id)){
                        item.isChecked = event ;
                        _this.choiseShopCount -- ;
                        delete _this.choiseShopList['shop_'+item.id];
                    }
                    else{
                        item.isChecked  = event;
                    }
                });
            }
        },
        getShopListByKeyword(){
            let _this = this ;
            _this.floorId  = '' ;
            _this.$api.searchAllShopListByKeyword({
                portalId : _this.$store.state.appInfor.portalId ,
                subjectType : _this.$store.state.appInfor.subjectType ,
                name : _this.name
            }).then(ret=>{
                _this.shopsList = ret.map(function(item){
                    let isChecked = _this.choiseShopList.hasOwnProperty('shop_'+item.id) ? true : false ;
                    return {
                        id : item.id ,
                        name : item.name  ,
                    }

                });
            }).catch(()=>{});
        },
        clickAndSaveInfor(){    //提交
            if(this.verifyMainType == 1 && this.choiseShopCount < 1){
                this.error('请选择店铺');
                return false;
            }
            let _this = this ,
                params = {
                    portalId : _this.$store.state.appInfor.portalId  ,
                    activityId : _this.$store.state.appInfor.activityId ,
                    isAllShop : _this.verifyMainType == 0 ? 1 : 2 ,
                    applyShops : []
                } ;
            for(let item in _this.choiseShopList){
                params.applyShops.push({
                    shopId : _this.choiseShopList[item].id ,
                    shopName : _this.choiseShopList[item].name
                })
            }
            console.log(params)
            _this.$api.activityCreateSendShopList(params).then(ret=>{
                sessionStorage.setItem('appCreateSetUp' , 2) ;
				_this.$router.push('/activity/settingRule');
            }).catch(()=>{});
        } ,
        goBackPrev(){   //上一步
            sessionStorage.setItem('appCreateSetUp' , 0) ;
            this.$router.push('/activity/basicInfor');
        }
    }
}
</script>
<style lang="scss" >
.shopKeywordSearch{
    .searchinputarea{
        width:115px;
        top:0px;
        .searchinput{
            width:80px;
        }
        .searchIcon{
            width:30px;
						height: 30px;
        }
    }
}
.shopSelect {
  .el-tabs__active-bar {
    background-color: #ff7633;
  }
  .el-tabs__item.is-active {
    background-color: #e6eff9;
  }
  .el-tabs__item {
    color: #999;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__inner {
    background-color: #fff;
    border-color: #284567;
  }
  .el-checkbox__inner::after {
    border-color: #284567;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #284567;
  }
  .el-checkbox {
    color: #999;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  }
}
</style>
<style lang="scss" scoped >
p.selectedNum{color: #999999;}
.btncon {
  margin-top: 20px;
  text-align: center;
  .next {
    background-color: #ff7633;
  }
}
.floorList{
    width: 116px;
    border-right: 0;
    float: left;
}


.floorList {
    color: #666;
    font-size: 14px;
}
.floorList .active{
    color: #284567;
    background: #e6eff9;
    border-right: 2px solid #ff7633;
}

.floorList li{
    cursor: pointer;
    height: 48px;
    line-height: 48px;
    font-weight: 700;
    padding-left: 18px;
}
 .shop{
    padding-left: 20px;
    border-left: 0;
    float: left;
}
.shopSelect{
    border: 1px solid #e4e7ed;
}
.shopKeywordSearch{
	padding-top: 10px;
}
.search .searchinputarea{
	border-bottom: 0;
}
.shopKeywordSearch .search .searchinputarea .searchIcon{
	height: 30px;
}
</style>
<style>
.shopKeywordSearch{
	padding-top: 10px;
}
.search .searchinputarea{
	border-bottom: 0;
}
</style>
<style>
#choujiang_join_main .el-radio-group .el-radio-button__inner{
	padding: 8px 20px;
}
#choujiang_join_main .shopKeywordSearch .searchinputarea .searchIcon{
	height:30px;
}
</style>
