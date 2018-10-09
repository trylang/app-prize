<template>
	<div id="template-choice">
		<div v-if="$route.path=='/activity/templateChoice'">
			<el-row >
				<div class="toolbar" >为应用<span class="appName"> {{appName}} </span>创建活动</div>
				<el-col :span="5" >
          <!-- <template >
                <el-radio class="radio" v-model="Num" label="0">时间排序</el-radio>
              <el-radio class="radio" v-model="Num" label="1">使用排序</el-radio>
          </template> -->
          <div class="search">
            <el-input 
              v-model="masterName"
              class="inputSearch"
              placeholder="请输入模板关键字"
              @blur="handleSearchMaterName"
              @keyup.enter.native="handleSearchMaterName"
              suffix-icon="el-icon-search">
            </el-input>
          </div>
          <div class="stepTitle leftTitle" >模板选择</div>

          <ul class="templateList1">
            <li v-for="(item, i) in templateList" 
              :class="{'active': templateListActive.templateId === item.templateId}"
              @click="handleTemplateClick(item)"
              :key="'temap' + i">{{item.masterName}}
              <span style="color: #ccc">
                ({{item.sceneNum}}页)
              </span>
            </li>
            <!-- <li>活动模板(3)</li> -->
          </ul>
          <!-- <el-pagination layout="total, prev, pager, next" @current-change="currentPageChange" :page-size="10" :total="total" ></el-pagination> -->
                
				</el-col>
				<el-col :span="19" style="border-left: #EEEEEE 1px solid">
	     			<el-col class="templateTitle">精准拉新 (活动样式)</el-col>
	     			<!-- <el-col class="activityAccount"><span style="color:#FF7633">44</span>个活动正在使用 (共4页)</el-col>
	     			<el-col class="activityAccount">使用活动:<span class="activeDetail">周边潜客拉动</span> <span class="activeDetail">周边潜客拉动</span> </el-col> -->
	     			<!-- <el-col :span="11">
              <img src="../../../assets/templateA.png" width="250" height="420" />
            </el-col>
	     			<el-col :span="11">
              <img src="../../../assets/templateB.png" width="250" height="420">
            </el-col> -->
            <el-col :span="24" class="template-box">
              <div v-for="(item, i) in selectTemplate" 
                :key="i"
                class="template-child-box">
                  <img v-if="i===0" src="../../../assets/templateA.png" class="template-box-img">
                  <img v-else src="../../../assets/templateB.png" class="template-box-img">
                <div class="template-box-title">{{item.sceneName}}</div>
              </div>
            </el-col>
				</el-col>
				<el-col  style="text-align: center">
            <div class="goBack Button"  @click="goBackPrev" >上一步</div>
	         <div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
        </el-col>
			</el-row>

		</div>
</div>
</template>
<script >
import {
  activityTemplateList, // 母版列表-感知应用
  activitySelectTemplateScene, // 母版下场景列表-感知应用
  selectActivityTemplateScene, // 查询活动下模板和场景数据-感知应用
  saveOrUpdateTemplate, // 创建/编辑活动模板和场景数据-感知应用
} from '../../../http/interface.js'
export default {
  created() {
    const _state = this.$store.state;
    this.appName = _state.appInfor.appName;  
    this.getData(); 
  },
  mounted() {
  },
  data() {
    return {
      masterName: '',
      templateList: [],
      activityTemplateId: '1',
      templateListActive: {},
      selectTemplate: [],
      templateId: '',
      total: 1,
      pageSize: 20,
      pages: 1,
      page: 1
    };
  },
  methods: {
    getData() {
      const params = {
        masterName: this.masterName,
        appId: this.$store.state.appInfor.appId,
      }
      activityTemplateList(params).then(res => {
        if(res.length>0){
          this.templateList = res; 
          if (!!this.masterName) {
            res.map(item => {
              if (item.templateId === this.templateId) {
                this.templateListActive = item;
              } 
            })
          } else {
              this.templateListActive = res[0];
              this.templateId = res[0].templateId;
          }
          if (this.$store.state.appIsEdit==true) {
            this.getSearchTemplateScene();
          } else {
            this.getTempList();
          }
        }
      }).catch(res =>{

      })
    },
    handleSearchMaterName() {
      this.getData();
    },
    getSearchTemplateScene() { // 查询活动下模板和场景数据
      const that = this;

      const _state = this.$store.state;

      const params = {
        activityId: _state.appInfor.activityId,
      }
     
      selectActivityTemplateScene(params).then(res => {
        if(!!res){
          // that.templateId = res.templateId; 
          that.templateListActive=that.templateList.find(item => {
            if (item.templateId === that.templateId) {
              return item;
            } 
          });          
          that.activityTemplateId = res.activityTemplateId;
          that.getTempList();
        }
        
      })
    },
    getTempList() { // 母版下场景列表
      if (!this.templateId) return;
      const params = {
        templateId: this.templateId,
      }
      activitySelectTemplateScene(params).then(res => {
        this.selectTemplate = res;
        this.selectTemplate = res.map((item)=>{
          return {
            sceneName:item.sceneName,
            sceneId:item.sceneId,
            content:item.content,
            templateId:item.templateId,
            isDefault:item.isDefault,
            createTime:item.createTime

          }
        })  
      })
    },
    saveUpdateTemplate() {
      const _state = this.$store.state;
      if (!this.templateListActive) { // 暂时对于没有模板的处理
        this.$router.push("/activity/settingsChannel");
      }
      const that = this;
      const params = {
        templateId: this.templateId,
        appId: this.templateListActive.appId,
        activityId: _state.appInfor.activityId,
        masterName: this.templateListActive.masterName,
        sceneNum: this.templateListActive.sceneNum,
        templateScenes: this.selectTemplate,
        tenantType: _state.appInfor.subjectType,
        tenantId:  _state.appInfor.portalId,
        activityName:  _state.appInfor.activityName,
      }
      if(this.$store.state.appIsEdit==true){//活动编辑状态时   不请求修改模板接口  直接跳转下一步
        that.$router.push("/activity/settingsChannel");
      }else{
        saveOrUpdateTemplate(params).then(res => {
        that.$router.push("/activity/settingsChannel");
      })
      }
    },
    handleTemplateClick(data) {
      this.templateListActive = data;
      this.templateId = data.templateId;
      this.getTempList();
    },
    currentPageChange(val) {
      this.page = val;
      // this.getConditionList();
    },
    clickAndSaveInfor() {
      this.saveUpdateTemplate();
      sessionStorage.setItem('appCreateSetUp' , 6) ;
    },
    goBackPrev() {
      this.$router.push({
        path: "/activity/couponChoice",
      });
      sessionStorage.setItem('appCreateSetUp' , 4) ;
    }
  }
};
</script>{
<style type="text/css">
.leftTitle {
  margin-bottom: 20px;
}
.search .inputSearch {
  width: 200px;
  margin-right: 20px;
  margin: 20px 0;
}
.search .inputSearch .el-input__inner {
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  height: 36px;
  line-height: 36px;
}
.templateList1 {
  color: #666666;
  font-size: 14px;
}
.templateList1 li {
  /*margin: 20px;*/
  height: 48px;
  line-height: 48px;
  font-weight: bold;
  padding-left: 18px;
  color: #999;
  cursor: pointer;
}
.templateList1 li span{
  display: inline-block;
}
.templateList1 .active {
  color:#284567;
  background: #E6EFF9;
  /*font-family: PingFangSC-Medium;*/
}
.templateTitle {
  /*width:317px;*/
  height: 36px;
  font-size: 36px;
  text-align: center;
  font-weight: bold;
  color: #284567;
  line-height: 36px;
}
#template-choice .template-box{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}
#template-choice .template-box .template-child-box{
  margin: 10px;
  cursor: pointer;
}
#template-choice .template-box .template-child-box.active{
  border: 1px solid red;
}
#template-choice .template-box .template-box-img{
  width: 240px;
}
#template-choice .template-box .template-box-title{
  text-align: center;
  padding: 15px;
  font-weight: bold;
  color: #999;
}
.activityAccount {
  font-size: 14px;
  color: #999999;
  text-align: center;
  margin: 15px 0 15px 0;
  font-weight: bold;
}
.activityAccount .activeDetail {
  color: #666666;
}
/*.templateCase{text-align: cen}*/
.pagination {
  display: inline-block;
}
.block {
  text-align: center;
  margin: 15px 0;
}
</style>

