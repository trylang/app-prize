<template>
	<div>
		<div v-if="$route.path == '/activity/activity'" id="activity-activity">
			<!-- 活动列表 -->
			<!-- <p>进行中活动:2</p> -->
			<div class="activity-list">
				<h1 style="color:#284567;font-size: 18px;margin-left: 10px;margin-bottom: 20px;">抽奖活动列表</h1>
				<!-- <el-input placeholder="请输入券活动组关键字"  suffix-icon="el-icon-search" @input="activityNameChange" v-model="name"></el-input> -->
				<maInput placeholder="请输入活动名称" v-model="name" @click="activityNameChange" @enterClick="activityNameChange"></maInput>
			</div>
			<el-table 
				:data="tableData" 
				stripe 
				style="width: 100%;text-align: left" @filter-change="filterChange">
				<el-table-column label="活动名称">
					<template slot-scope="scope">
					<!-- activityId -->
							<router-link class="listName" :to="{path : '/activity/detail' , query : {portalId:scope.row.portalId,activityId:scope.row.activityId,activityName:scope.row.name,status:scope.row.activityStatus}}">{{scope.row.name}}</router-link>
							<br>
							<router-link class="listName" :to="{path : '/activity/detail' , query :{portalId:scope.row.portalId,activityId:scope.row.activityId,activityName:scope.row.name,status:scope.row.activityStatus}}">{{scope.row.activityId}}</router-link>

						</template>
				</el-table-column>
				<el-table-column label="参加主体">
					<template  slot-scope="scope">
						<template  v-if="scope.row.isAllShop===1">全部主体</template>
            <template  v-if="scope.row.isAllShop===2">{{scope.row.applyShopCountStr}}个主体</template>
					</template>
				</el-table-column>
				<el-table-column 
					prop="couponBatchCount" 
					label="投放券批数量">
				</el-table-column>
				<el-table-column label="券领取量/券投放量">
					<template slot-scope="scope">
						{{scope.row.getCouponInstanceCount+'/'+scope.row.couponInstanceCount}}
					</template>
				</el-table-column>
				<el-table-column label="活动时间" width="220">
					<template slot-scope="scope">
						{{scope.row.activityStartDate+' - '+scope.row.activityEndDate}}
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					width="100"
					label="活动状态"
					column-key="status"
					:filters="[{ text: '待配置', value: '0' }, { text: '进行中', value: '1' },{ text: '暂停', value: '2' },{ text: '已结束', value: '3' },{ text: '待启动', value: '4' }]"
					:filter-multiple="false">
					<template slot-scope="scope">
						<span v-if="scope.row.activityStatus==0" style="color:#FF7633">待配置</span>
						<span v-if="scope.row.activityStatus==1" style="color:#71B900">进行中</span>
						<span v-if="scope.row.activityStatus==2" style="color:#ED0647">暂停</span>
						<span v-if="scope.row.activityStatus==3" >已结束</span>
						<span v-if="scope.row.activityStatus==4" >待启动</span>
					</template>
				</el-table-column>
				<el-table-column 
					prop="address" 
					width="100"
					label="启停">
					<template slot-scope="scope">
						<i class="icon" @click="changeStatus(2 , scope.row.portalId,scope.row.activityId)" v-if="scope.row.activityStatus==2"><img src="../../../assets/zanting.png"></i>
						<i class="icon" @click="changeStatus(1 , scope.row.portalId,scope.row.activityId)" v-else-if="scope.row.activityStatus==1"><img src="../../../assets/jinxing.png"></i>
						<i style="color: #284567" v-else>-</i>
					</template>
				</el-table-column>
				<el-table-column 
					prop="address"
					width="100"
					label="配置">
					<template slot-scope="scope">
						<i class="icon" @click="modifyActivity(scope.row)" v-if="scope.row.activityStatus==0"><img src="../../../assets/setting.png" style="cursor:pointer;" width="14" height="14"></i>
						<i class="icon" @click="modifyActivity(scope.row)" v-else-if="scope.row.activityStatus==2"><img src="../../../assets/setting.png" style="cursor:pointer;" width="14" height="14"></i>
						<i style="color: #284567" v-else>-</i>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination class="pagination"
					@current-change="handleGroupCurrentChange"
					@size-change="handleGroupSizeChange" 
					:current-page.sync="pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="PageSize"
					layout="sizes, prev, pager, next" :total="total"></el-pagination>
				<p class="total">共{{total}}条券投放记录</p>
			</div>
			<!-- </div> -->
		</div>
	  <router-view @parentFnGet="getActivityList"></router-view>
</div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      PageSize: 10,
      pageNum: 1,
      status: "",
      name: ""
    };
  },
  created() {
    // if(this.$route.query.appId && this.$route.query.portalId && this.$route.query.subjectType){
    // 	localStorage.setItem("portalId",this.$route.query.portalId);
    // 	localStorage.setItem("appId",this.$route.query.appId);
    // 	localStorage.setItem("subjectType",this.$route.query.subjectType);
    // 	localStorage.setItem("appName",this.$route.query.appName);
    // }
    this.getActivityList();
  },
  methods: {
    filterChange(e) {
      if (e.status.length) {
        this.status = e.status[0][0];
        console.log(this.status);
      } else {
        this.status = undefined;
      }
      this.getActivityList();
    },
    getActivityList() {
      let _this = this;
      let params = {
        portalId: _this.$store.state.appInfor.portalId,
        subjectType: _this.$store.state.appInfor.subjectType,
        activityName: _this.name,
        activityStatus: _this.status,
        page: _this.pageNum,
        pageSize: _this.PageSize
      };
      this.$api.activityList(params).then(res => {
        _this.tableData = res.list;
        _this.total = res.total;
      });
    },
    activityNameChange() {
      this.getActivityList();
    },
    changeStatus(val, portalId, activityId) {
      let _this = this;
      let params = {
        portalId: portalId,
        activityId: activityId
      };
      if (val == 1) {
        this.$api.activityListStop(params).then(res => {
          _this.getActivityList();
        });
      } else if (val == 2) {
        this.$api.activityListStart(params).then(res => {
          _this.getActivityList();
        });
      }
    },
    modifyActivity(row) {
      let arr = [];
      arr.push("appId=" + this.$store.state.appInfor.appId);
      arr.push("appName=" + this.$store.state.appInfor.appName);
      arr.push("portalId=" + this.$store.state.appInfor.portalId);
      arr.push("subjectType=" + this.$store.state.appInfor.subjectType);
      arr.push("activityId=" + row.activityId);
      arr.push("activityName=" + row.name);
      console.log(arr.join("&"));
      this.$router.push("/?" + arr.join("&"));
    },
    handleGroupSizeChange(size) {
      this.PageSize = size;
      this.getActivityList();
    },
    handleGroupCurrentChange() {
      this.getActivityList();
    }
    // activityDetail(id){
    // 	let _this = this;
    // 	_this.$router.push({
    //       path: "/activity/basicInfor",
    //       query: { id: id }
    //     });
    // },
  }
};
</script>
<style>
#activity-activity .el-table tr, 
#activity-activity .el-table thead th,
#activity-activity .el-table tr, 
#activity-activity .el-table tbody td{
	text-align: left;
	font-weight: bold;
}

</style>

<style scoped >
.icon {
  font-family: iconfont;
  font-size: 20px;
  font-style: normal;
  color: #ed0647;
  cursor: pointer;
}
.activity-list .el-input {
  width: 220px;
  margin-right: 20px;
}
.activity-list .el-input__inner {
  border: none;
}
.activity-list .el-input .el-input__inner {
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  height: 36px;
  line-height: 36px;
}
.el-table thead th,
.el-table thead tr {
  background-color: #5e406f;
  color: #fff;
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
.el-table th {
  background-color: #5e406f !important;
}
.el-table {
  margin-top: 20px;
}
.block {
  text-align: center;
  margin: 15px 0;
}
.total {
  height: 14px;
  font-size: 12px;
  color: #ccc;
  line-height: 14px;
  margin: 10px 0;
}
</style>
