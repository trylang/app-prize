<template>
	<div id="app">
		<div class="headercon clearfix">
			<div class="header">
				<ul class="headerNavs">
					<li v-for="(item,index) in menu" :key="index" :class="(item.path.indexOf(firstPath)!=-1 ? 'isActiv' : '')">
						<router-link :to="item.path"  v-on:click.native="setMenuIndex(index)" v-if="!item.hidden">
							{{item.name}}
						</router-link>
						<p></p>
					</li>
				</ul>
			</div>
		</div>
		<el-row class="wrapper">
			<el-breadcrumb separator=">" class="breadcrumb-inner" style="margin-bottom: 15px">
				<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
					<router-link :to="item.path" tag="a" class="listbtn">{{item.name}}</router-link>
				</el-breadcrumb-item>
			</el-breadcrumb>
            <div class="activityMenu">
				<div class="globalleftNavs" v-if="$route.path!='/activity/activity'&& $route.path!='/activity/detail'">
					<ul class="navsItem">
            <template v-if="isEdit">
                <template v-for="(item,index) in menu[1].children"> 
                <li :key="index" :class="[(item.path == secondPath ? 'Activ' : '') , item.class , isEdit ? 'SelectClass' : '']" @click="changeBtn(index , item.path)" v-if="!item.hidden">
                  <div class="icon_bor">◆</div>
                  <span :class="[item.className]"></span>
                  <var></var>
                  {{item.name}}
                  <!-- - {{index}} -->
                </li>
              </template>
            </template>
            <template v-else>
              <template v-for="(item,index) in menu[1].children"> 
                <li :key="index" :class="[(item.path == secondPath ? 'Activ' : '') , item.class , (index >= num)?'':'SelectClass']" @click="changeBtn(index , item.path)" v-if="!item.hidden">
                  <div class="icon_bor">◆</div>
                  <span :class="[item.className]"></span>
                  <var></var>
                  {{item.name}}
                  <!-- - {{index}} -->
                </li>
              </template>
            </template>
					</ul>
				</div>
                <div class="content rightContent">
                    <router-view></router-view>
                </div>
            </div>
			
		</el-row>
	</div>
</template>

<script>
export default {
  data() {
    return {		
        menu: []
        ,num : 0 
        ,isEdit : false 
    };
  },
  created() {
        if(this.$route.query.appId){
            this.num = 0; 
            localStorage.setItem('current' , 0);
        }
        else{
            this.num=localStorage.getItem('current');
        }
        this.menu = Object.freeze(this.$router.options.routes);
        this.num = Number(this.$store.state.appCreateSetUp);
        this.isEdit = this.$store.state.appIsEdit ; 
  },
  watch: {
        "$store.state.appCreateSetUp" : function(){
            this.num = this.$store.state.appCreateSetUp;
        },
        "$store.state.appIsEdit" : function(){
            this.isEdit = this.$store.state.appIsEdit;
        }
  },
  methods: {
    setMenuIndex: function(index) {
      
    },
    changeBtn:function (index , path) {
      if(this.$store.state.appIsEdit){
          this.num=index;
          sessionStorage.setItem('appCreateSetUp' , index) ; 
          this.$store.commit('updateAppCreateSetUp' , index);
          this.$router.push('/activity/' + path);
      }
      else{
          try{
              if(index <= this.$store.state.appCreateSetUp){
                  this.$router.push('/activity/' + path);
              }
          }catch(e){}
      }
    }
  },
  computed: {
        firstPath: function() {
          return "/" + this.$route.path.split("/")[1];
        },
        secondPath: function() {
            let pathSecound = this.$route.path.split("/");
            if(pathSecound.length > 2){
                return pathSecound[2];
            }
            else{
                return 'null';
            }
        }
  }
};
</script>

<style lang="scss">
body{min-width:1200px;font-family: "SF Pro SC", "SF Pro Display", "SF Pro Icons", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif;height: 100%;}
a {
  text-decoration: none;
  color: #999999;
}
* {
  padding: 0;
  margin: 0;
}
ul li {
  list-style: none;
}
#app {
  background: #eeeeee;
}
#app .header {
  margin-bottom: 20px;
}
#app .wrapper {
  max-width: 1200px;
  margin: 0 auto 30px;
}
.headercon {
  width: 100%;
  height: 85px;
  background: #284567;
  padding-top:10px;
  margin-bottom:15px;
}
.headercon .header{width:1200px;margin:0px auto;}
ul.headerNavs li a {
  text-align: center;
  font-size: 16px;
  line-height: 0px;
  /* padding: 0; */
  /* width: 14px; */
  color: #fff;
  display: inline-block;
  padding: 39px 0 21px;
}
.headerNavs li{
	line-height: 30px;
}
ul.headerNavs li {
  float: left;
  // margin: 0 20px;
  line-height: 90px;
}
.navsItem {
  /*margin-left: 30px;*/
  text-align: center;
}
.navsItem li{
    cursor: pointer ;
  width: 100px;
  padding-top: 14px;
  height: 66px;
  background: #fff;
  font-size: 14px;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
  color: #999999;
}

.navsItem .Activ span{
    background-position: center -24px;
}
.navsItem .Activ a {
  color: #284567;
}
.rightContent {
  background: #fff;
  border-radius: 5px;
  padding: 25px;
  flex: 1;
  margin-bottom: 20px;
}
.isActiv p{
	width: 14px;
	height: 4px;
	text-align: center;
	background: #ff7633;
	margin: -20px auto
}
.el-radio__label{color: #999999}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #284567 !important;
  background: #284567 !important;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #284567 !important;
}
@font-face {
  font-family: "iconfont"; /* project id 676502 */
  src: url("//at.alicdn.com/t/font_676502_i385gkkcx04ibe29.eot");
  src: url("//at.alicdn.com/t/font_676502_i385gkkcx04ibe29.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_676502_i385gkkcx04ibe29.woff") format("woff"),
    url("//at.alicdn.com/t/font_676502_i385gkkcx04ibe29.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_676502_i385gkkcx04ibe29.svg#iconfont")
      format("svg");
}

.el-table thead tr,
.el-table thead th {
  background-color: #284567;
  color: #fff;
  text-align: center;
}
.el-table tbody {
  color: #284567;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba(230, 239, 249, 1);
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #b0c7e1;
}
.activity-list .el-input__inner {
  border: none;
  border-bottom: 2px solid #ccc;
}
div.activityMenu{
    display: flex;
    width:1200px;
    div.globalleftNavs{
        flex:0 0 0 120px;
        padding-right:20px;
    }
    .content{
        flex: 1;
        width: 1080px;
    }
}


ul li span{
    display: block;
    margin: auto; 
    margin-bottom: 8px;
    /* width: 26px; */
    height: 24px;
    line-height: 24px;
    background-position: center -24px;
}
.basicInfor{
    background: url(../assets/icon_baseInfor.png) no-repeat center center;
    background-position: center 0px;
}
.Merchant{
    background: url(../assets/icon_store.png) no-repeat center center;
    background-position: center 0px;
}
.crowd{
    background: url(../assets/icon_group.png) no-repeat center center;
    background-position: center 0px;
}
.coupons{
    background: url(../assets/icon_youhuiquan.png) no-repeat center center;
    background-position: center 0px;
}
.mo{
    background: url(../assets/icon_copy.png) no-repeat center center;
    background-position: center 0px;
}
.setting{
    background: url(../assets/icon_guizhe.png) no-repeat center center;
    background-position: center 0px;
}
.channel{
    background: url(../assets/icon_qudao.png) no-repeat center center;
    background-position: center 0px;
}
.icon_bor{
	display: none;
    color: #fff;
    font-size: 12px;
    position:absolute;
    top:50%;
    margin-top: -6px;
    right: -6px;
    z-index: 99;
}
.navsItem .Activ .icon_bor {
	display: block
}
.SelectClass{
	position:relative;
}
.SelectClass var{
	position: absolute;
    background: url(../assets/selected.png) no-repeat;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
}
.SelectClass a{
	color: #ccc
}
.SelectClass span{
	background-position: center -48px;
}
table.formItemTable td .el-input__inner{height: 32px}
.disabled { pointer-events: none; cursor: default; opacity: 0.6; z-index: 100}
.daterange .el-date-editor .el-range__icon{position: absolute;left: 270px}



</style>