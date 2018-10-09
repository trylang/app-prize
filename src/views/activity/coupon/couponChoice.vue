<template>
<div>
    <div v-if="$route.path=='/activity/couponChoice'" v-loading="pageLoading" element-loading-text="拼命加载中...">
		<el-row>
			<div class="toolbar" >为应用<span class="appName"> {{$store.state.appInfor.appName}} </span>创建活动</div>
				<el-col class="stepTitle" style="margin-bottom: 10px">优惠券投放</el-col>
        <div style="font-size:12px; color: #ccc;margin-bottom: 20px;">
          <i class="el-icon-info"></i>投放的优惠券将作为营销物料触达消费者终端，帮助吸引到场顾客
        </div>
        <el-col  :span="6" style="border-right: #EEEEEE 1px solid; padding-left: 0px;">
					<div class="search">
						<maInput placeholder="请输入优惠券关键字" v-model="mainInfo" @click="getCouponList" @enterClick="getCouponList" style="top:0px;margin-bottom:20px;"></maInput>
					</div>
					<div class="voucherName" style="margin-bottom:10px; font-weight: bold;"><img src="../../../assets/conle.png" width="12" height="16"
						style="position:relative;top:-1px;"> 券名称</div>
					<ul class="templateList" style="height:500px;overflow:auto;">
						<template v-for="(item ,index) in couponList">
								<li :class="[couponId == item.id? 'active' : '']" @click="getCouponDetailById(item.id)" :key="index">{{item.mainInfo}}</li>
						</template>
					</ul>
					<div style="width:100%">
      				<el-pagination layout="prev, pager, next" @current-change="currentPageChange" :current-page="currentPage" :page-size="10" :small="true" :total="total" ></el-pagination>
      				<p class="total" style="width:100%;text-align: center;color:#CCCCCC">共{{total}}条</p>
      		</div>
				</el-col>
        <el-col :span="17" style="" class="isVoucheDetail" v-if="!couponDetail">
          <img src="../../../assets/person.png">
          <div class="voucheExplain">请从列表中选择优惠券，再完成优惠券投放～</div>
        </el-col>
				<el-col :span="17" style="margin-top: 30px;margin-bottom: 15px;">
					<div v-if="!!couponDetail">
						<div class="couponImg">
							<img :src="imgUrl" width="110" height="70">
						</div>
						<div class="couponStatus">{{couponDetail.statusDesc}}</div>

						<div class="couponName">{{couponDetail.mainInfo}}</div>
						<div class="couponName" style="font-size: 20px;">券剩余量：{{couponDetail.surplusNum}}</div>

						<el-col class="couponKind">副标题：<span style="color:#999999">{{couponDetail.extendInfo}}</span></el-col>
						<el-col class="couponKind" v-if="couponDetail.effectiveType==0">
								券有效期：<span style="color:#999999">{{couponDetail.effectiveStartTime}} 至 {{couponDetail.effectiveEndTime}}</span>
						</el-col>
						<el-col class="couponKind" v-if="couponDetail.effectiveType==1">券有效期：<span style="color:#999999">
							<template v-if="couponDetail.activedLimitedStartDay==0">领取后当天</template>
							<template v-if="couponDetail.activedLimitedStartDay!=0">领取后 {{couponDetail.activedLimitedStartDay}} 天</template>生效，有效期 {{couponDetail.activedLimitedDays}} 天
							</span >
						</el-col>
						<el-col class="couponKind">
								券核销主体：
								<span style="color:#999999" v-if="couponDetail.isAllShop==1">全场核销</span>
								<a href="javascript:;"
									style="color:#999999;cursor: pointer;text-decoration-line: underline;"
									@click="showDialog"
									v-if="couponDetail.isAllShop==2">部分主体核销</a>
						</el-col>
						<el-col class="couponKind">券类别：<span style="color:#999999">{{couponDetail.categoryDesc}}</span></el-col>

						<el-col  class="couponKind" style="color:#999999;">
							本次投放优惠券：<el-input placeholder="0" v-model="quantity" type="number" style="width:100px;border-radius: 4px" :maxlength="9"></el-input> 张
							<span style="font-size:12px; color: #ccc; display: block; padding-top: 10px;"><i class="el-icon-info"></i>请填写50.000以内数值</span>
						</el-col>

						<el-col>
							<div v-if="true" class="coupon-setup-btn"  @click="couponBtn" style="background: #ff7633;">确定</div>
							<div v-else class="coupon-setup-btn"  @click="couponBtn">确定</div>
						</el-col>
					</div>
				</el-col>

        <el-col :span="22">
          <span style="font-size:12px; color: #ccc; padding-top: 10px;">没有适于此次活动的优惠券？试试
            <router-link to="/activity/couponChoice/add" tag="strong" style="color:rgba(255,118,51,1);cursor: pointer;"> + 创建优惠券</router-link>
          </span>
        </el-col>

        <el-col class="stepTitle" style="margin: 20px 0;">券投放记录</el-col>
				<el-col style="margin: 10px 0 20px">
          <el-table
						:data="activityCouponBatchList">
            <el-table-column
              prop="mainInfo"
              label="优惠券" align="center">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="投放张数" align="center">
            </el-table-column>
            <el-table-column
              prop="validateStatus"
              label="状态" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.validateStatus==0" style="color:#FF7633">待审核</div>
                  <div v-if="scope.row.validateStatus==1" style="color:#71B900">投放中</div>
                  <div v-if="scope.row.validateStatus==2">已驳回</div>
                  <div v-if="scope.row.validateStatus==3">结束</div>
                  <div v-if="scope.row.validateStatus==4">已撤回</div>
                  <div v-if="scope.row.validateStatus==5" style="color:#ED0647">暂停</div>
                  <div v-if="scope.row.validateStatus==6">已领光</div>
                  <div v-if="scope.row.validateStatus==7">已退回</div>
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="操作" align="center">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.validateStatus==1"
                  size="mini"
                  @click="changeBatchStatus(1, scope.row)"><img src="../../../assets/jinxing.png" alt=""></span>
                <span
                  v-else-if="scope.row.validateStatus==5"
                  size="mini"
                  type="danger"
                  @click="changeBatchStatus(0, scope.row)"><img src="../../../assets/zanting.png" alt=""></span>
                <span
                  v-else
                  size="mini">-</span>
              </template>
            </el-table-column>
 						<el-table-column prop="" label="编辑" align="center">
 								<template slot-scope="scope">
	                <span v-if="scope.row.validateStatus==5" size="mini" @click="changeBatchStatus(2, scope.row)">
										<img src="../../../assets/icon_group_edit.png" alt="">
									</span>
	                <span v-else size="mini">-</span>
               </template>
            </el-table-column>
						<el-table-column prop="" label="追加" align="center">
							<template slot-scope="scope">
								<el-popover width="280" placement="bottom-start" trigger="click">
									<div style="text-align: center; padding: 0 20px 10px;">
										<h3 style="padding: 20px 15px 15px;">追加投放</h3>
										<el-input type="number" style="padding-bottom: 10px;" v-model="addItemCouponNum" placeholder="输入追加投放张数"></el-input>
										<span>最多可投放<strong style="color:#ff7633;">50000</strong>张！</span>
									</div>
									<div style="text-align: center; margin: 0">
										<div class="inputBtn" style="width: 68px; height: 24px; line-height: 24px; border-radius: 12px;"  @click="addCoupons(scope.row)">确定</div>
										<div class="goBack" style="width: 68px; height: 24px; line-height: 24px; border-radius: 12px;" @click="scope.row.visible = false">取消</div>
									</div>
									<span v-show="scope.row.validateStatus==5" size="mini" slot="reference">
										<img src="../../../assets/icon_add1.png" alt="">
									</span>
									<span v-show="scope.row.validateStatus!=5" size="mini">-</span>
								</el-popover>
							</template>
						</el-table-column>
						<el-table-column
							prop=""
							label="审核" align="center">
							<template slot-scope="scope">
								<span
									v-if="scope.row.validateStatus==0"
									size="mini"
									@click="changeBatchStatus(3, scope.row)">
									<img src="../../../assets/icon_shenhe.png" alt="">
								</span>
								<span
									v-else
									size="mini">-</span>
							</template>
						</el-table-column>
						 <!-- <el-table-column
              prop=""
              label="删除" align="center">
							<template slot-scope="scope">
                <span
                  v-if="scope.row.validateStatus==5"
                  size="mini"
                  @click="changeBatchStatus(4, scope.row)">
									<img src="../../../assets/icon_delete.png" alt="">
								</span>
                <span
                  v-else
                  size="mini">-</span>
              </template>
            </el-table-column> -->
          </el-table>
				</el-col>
				<el-col style="margin-bottom: 20px">
					<el-pagination
						align="center"
						@size-change="handleCouponBatchListSizeChange"
						@current-change="handleCouponCurrentChange"
						:current-page="couponBatchList.page"
						:page-sizes="[10, 20, 30, 40]"
						:page-size="couponBatchList.pageSize"
						layout="prev, pager, next, sizes"
						:total="couponBatchList.total">
					</el-pagination>
					<el-col style="margin: 10px 0;text-align: center;">共{{couponBatchList.total}}条投放记录</el-col>
				</el-col>

				<el-dialog  v-if="dialogVisible" width="40%" :visible.sync="dialogVisible">
					<div class="couponImg">
						<img :src="imgUrl" width="110" height="70">
					</div>
					<div class="coupon-batch-detail-box">{{activityCouponBatchDetail.mainInfo}}</div>
					<div class="couponKind" style="color:#999999;">
						本次投放优惠券：
						<span style="width:100px;border-radius: 4px" >
							{{activityCouponBatchDetail.quantity}}
						</span>张
					</div>
					<p style="text-align: center; height: 28px; font-size: 18px; color: rgba(102,102,102,1); line-height: 45px;margin-bottom: 20px;">券使用规则</p>
					<div style="text-align: center;">
						<div class="coupon-rule-box">
							<span>每人每天可领：</span>
							<span>
								<template>
									<el-radio-group v-model="couponRule.receivesEveryDay">
										<el-radio :label="1">无限张券</el-radio>
										<el-radio :label="2">限定张数</el-radio>
									</el-radio-group>
									<el-input v-if="couponRule.receivesEveryDay === 2"
										size="small"
										v-model="couponRule.receivesEveryDayNum"  style="width:100px"></el-input>
									<span v-if="couponRule.receivesEveryDay === 2">&nbsp;张</span>
								</template>
							</span>
						</div>
						<div class="coupon-rule-box">
							<span>每人累计上限：</span>
							<span>
								<template>
									<el-radio-group
										v-model="couponRule.limitEveryOne">
										<el-radio :label="1">无限张券</el-radio>
										<el-radio :label="2">限定张数</el-radio>
									</el-radio-group>
									<el-input v-if="couponRule.limitEveryOne === 2"
										size="small"
										v-model="couponRule.limitEveryOneNum"  style="width:100px"></el-input>
									<span v-if="couponRule.limitEveryOne === 2">&nbsp;张</span>
								</template>
							</span>
						</div>
						<div class="coupon-rule-box">
							<span>全天累计发放：</span>
							<span>
								<template>
									<el-radio-group v-model="couponRule.allDayGrant">
										<el-radio :label="1">无限张券</el-radio>
										<el-radio :label="2">限定张数</el-radio>
									</el-radio-group>
									<el-input v-if="couponRule.allDayGrant === 2"
										size="small"
										v-model="couponRule.allDayGrantNum"  style="width:100px"></el-input>
									<span v-if="couponRule.allDayGrant === 2">&nbsp;张</span>
								</template>
							</span>
						</div>
					</div>
					<div class="coupon-btn-box" v-if="dialogVisibleExamine">
						<div @click="handlecouponBtnClick(true)" class="couponBtn" style="background:#FF7633">确定</div>
						<div @click="handlecouponBtnClick(false)" class="couponBtn" style="border: 1px solid #FF7633;color:#FF7633">取消</div>
					</div>
					<div class="coupon-btn-box" v-else-if="!dialogVisibleExamine">
						<div @click="handlecouponExamineBtnClick(true)" class="couponBtn" style="background:#FF7633;padding:0 10px">审核通过</div>
						<div @click="handlecouponExamineBtnClick(false)" class="couponBtn" style="border: 1px solid #FF7633;color:#FF7633">驳回</div>
					</div>
				</el-dialog>
				<el-dialog width="916px"
					custom-class="dialog_box_shop_list"
					:visible.sync="dialogShopList" :show-close="false">
					<div class="" style="padding: 0 40px 0;">
						<h1 style="color:#999">共 <span style="color: #FF7633">{{shopNameList.length}}</span> 个</h1>
						<div class="dialog_box_shop_list_body" :style="{overflowY: shopNameList.length > 4 ? 'scroll' : 'hidden', overflowX:'hidden'}">
							<p v-for="(item, index) in shopNameList" :key="'snl'+ index">
								<span>{{item.shopName}}</span>
							</p>
						</div>
						<p style="text-align:center;"><a href="javascript:;" v-on:click="dialogShopList = false" class="dialog_hide_shop_list_btn" >确认</a></p>
					</div>
				</el-dialog>
				<el-col  style="text-align: center">
					<div class="goBack Button"  @click="goBackPrev" >上一步</div>
					<div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
				</el-col>
			</el-row>

		</div>
    <router-view @parentFn="getCouponList"></router-view>
</div>
</template>
<script>
export default {
  data() {
    return {
			addItemCouponNum: "", // 追加优惠券数量
      pageLoading: false, //加载
      mainInfo: "", //搜索关键字
      couponId: 0, //选择券ID
			couponList: [], //券种列表
			currentPage: 1, // 当前页
			pageSize: 10, //每页数量
			total: 0,
      couponDetail: null, //券详情
      dialogVisible: false, //弹出层
      dialogVisibleExamine: true, //审核弹出层
      NumAuditEdit: false,
      quantity: 0,
      couponRule: {
        receivesEveryDay: 1, // 每人每天可领input状态
        receivesEveryDayNum: 0, // 每人每天可领数
        limitEveryOne: 1, // 每人累计上限input状态
        limitEveryOneNum: 0, // 每人累计上限数
        allDayGrant: 1, // 全天累计上限input状态
        allDayGrantNum: 0, // 全天累计上限数
        quantity: 0 // 投放券数量
      },
			activityCouponBatchList: [], // 券投放记录
			activityCouponBatchDetail: {}, // 券投放记录
			couponBatchList: { // 券投放分页
				total: 1,
				pageSize: 10,
				pages: 1,
				page: 1,
			},
			imgUrl: null,
			changeBatchStatusData: {},
			shopNameList:[],
			dialogShopList: false,
    };
  },
  created() {
		this.getCouponList();
		if (this.$store.state.appInfor.activityId) {
    	this.getCouponVoucherBatchList();
		}
  },
  methods: {
    showDialog() {
      this.shopNameList = this.couponDetail.couponApplyShopList;
      this.dialogShopList = true;
    },
    addCoupons(row) {
			let that = this;
			if (parseInt(that.addItemCouponNum) <= 0 || parseInt(that.addItemCouponNum) >= 50000) {
        that.$message.warning("优惠券投放张数需大于0且小于50000张");
        return;
      }
      this.$api.activityCouponVoucherNum({
      	couponActivityId: row.couponActivityId,
      	voucherNum: that.addItemCouponNum,
      }).then(res => {
				that.getCouponVoucherBatchList();
				that.$message.success("优惠券追加成功！");
      })
    },
    getCouponList() {
      //获取券列表
      let _this = this;
      _this.$api
        .activityCouponList({
          portalId: _this.$store.state.appInfor.portalId,
          subjectType: _this.$store.state.appInfor.subjectType,
          mainInfo: _this.mainInfo,
          page: _this.currentPage,
          pageSize: _this.pageSize
        })
        .then(ret => {
          _this.couponList = ret.list.map(function(item) {
            return {
              id: item.id,
              mainInfo: item.mainInfo
            };
					});
					_this.total = ret.total;
        })
        .catch(() => {});
    },
    getCouponDetailById(id) {
      //获取券详情
      this.couponId = id;
      let _this = this;
      _this.$api
        .activityCouponDetail({
          couponId: _this.couponId
        })
        .then(ret => {
          _this.couponDetail = ret;
          !!ret.couponImageList &&
            (_this.imgUrl = ret.couponImageList[0].imgUrl || null);
        })
        .catch(() => {});
    },
    clickAndSaveInfor() {
			sessionStorage.setItem('appCreateSetUp' , 4) ;
    	this.$router.push({
        path: "/activity/templateChoice",
      });
      //保存并继续
    },
    goBackPrev() {
			//返回上一步
			sessionStorage.setItem('appCreateSetUp' , 2) ;
      this.$router.push({
        path: "/activity/settingRule",
      });
    },
    addCoupons(row) {
			let that = this;
			if (parseInt(that.addItemCouponNum) <= 0 || parseInt(that.addItemCouponNum) >= 50000) {
        that.$message.warning("优惠券投放张数需大于0且小于50000张");
        return;
      }
      this.$api.activityCouponVoucherNum({
      	couponActivityId: row.couponActivityId,
      	voucherNum: that.addItemCouponNum,
      }).then(res => {
				that.getCouponVoucherBatchList();
				that.$message.success("优惠券追加成功！");
      })
    },
    couponBtn() {
      // 优惠券--单个券种注到单个活动(生成券批)接口
			const that = this;
			if (!that.$store.state.appInfor.activityId) {
				that.$message.warning('请先填写活动的基础信息');
				return;
			}
			if (parseInt(that.quantity) <= 0 || parseInt(that.quantity) >= 50000) {
				that.$message.warning('优惠券投放张数需大于0且小于50000张');
				return;
			}
      const params = {
        couponId: that.couponId,
        activityId: that.$store.state.appInfor.activityId,
        quantity: that.quantity, // 投放券数量
        mainInfo: that.couponDetail.mainInfo, //券主标题
        dayLimit: 0, // 每日领取数限制
        cumulativeLimit: 0, // 累计领取数限制
        alldayIssueLimit: 0 // 券批全天发放量
      };
      that.$api.activityCouponActivity(params).then(res => {
        // 这里刷新列表
				this.$message.success('券添加成功');
				that.getCouponVoucherBatchList();
				that.getCouponDetailById(that.couponId);
      });
    },
    getCouponVoucherBatchList() {
			// 券批分页列表接口
      const that = this;
			const params = {
				page: this.couponBatchList.page,
				pageSize: this.couponBatchList.pageSize,
				activityId: that.$store.state.appInfor.activityId
			}
      that.$api.activityCouponVoucherBatchList(params).then(res => {
        that.activityCouponBatchList = res.list;
        that.couponBatchList.total = res.total;
        that.couponBatchList.pages = res.pages;
      });
		},
		currentPageChange(val) {
			// 第几页
			this.currentPage = val;
			this.getCouponList();
		},
		handleCouponBatchListSizeChange(pageSize) {
			// 几条/页
			this.couponBatchList.pageSize = pageSize;
			this.getCouponVoucherBatchList();
		},
		handleCouponCurrentChange(val) {
			// 第几页
			this.couponBatchList.page = val;
			this.getCouponVoucherBatchList();
		},
		changeBatchStatus(thekey, data) {
			// 功能icon 事件
			const that = this;
			const params = {
				couponActivityId: data.couponActivityId,
			};
			that.changeBatchStatusData = data;
			switch (thekey) {
				case 0:
					params.operateAction = 'restart';
					that.$api.activityCouponVoucherStatus(params).then(res => {
						that.$message.success('券已开始投放');
						// 券批状态修改接口
						that.getCouponVoucherBatchList();
					})
					break;

				case 1:
					params.operateAction = 'pause';
					that.$api.activityCouponVoucherStatus(params).then(res => {
						that.$message.success('券已暂停');
						// 券批状态修改接口
						that.getCouponVoucherBatchList();
					})
					break;

				case 2:
					// that.$message.success('编辑');
				  that.$api.activityCouponVoucherBatchDetail(params).then(res => {
						// 优惠券--券批详情接口
						that.activityCouponBatchDetail = res;
						that.renderCouponRule(res);
					});
					that.dialogVisible = true;
					break;

				case 3:
					// that.$message.success('审核');
					that.$api.activityCouponVoucherBatchDetail(params).then(res => {
						// 优惠券--券批详情接口
						that.activityCouponBatchDetail = res;
						that.renderCouponRule(res);
					});
					that.dialogVisible = true;
					that.dialogVisibleExamine = false;
					break;

				case 4:
					that.$message.success('删除')
					break;

				default:
					break;
			}

		},
		renderCouponRule(data) {
			// 规则渲染
			const that = this;
			that.couponRule.quantity = data.quantity;
			if (!!data.dayLimit) {
				that.couponRule.receivesEveryDay = 2;
				that.couponRule.receivesEveryDayNum = data.dayLimit;
			}else{
				that.couponRule.receivesEveryDay = 1;
				that.couponRule.receivesEveryDayNum = 0;
			}

			if (!!data.cumulativeLimit) {
				that.couponRule.limitEveryOne = 2;
				that.couponRule.limitEveryOneNum = data.cumulativeLimit;
			}else{
				that.couponRule.limitEveryOne = 1;
				that.couponRule.limitEveryOneNum = 0;
			}

			if (!!data.alldayIssueLimit) {
				that.couponRule.allDayGrant = 2;
				that.couponRule.allDayGrantNum = data.alldayIssueLimit;
			}else{
				that.couponRule.allDayGrant = 1;
				that.couponRule.allDayGrantNum = 0;
			}
		},
		handlecouponBtnClick(bool) {
			const that = this;
			// 规则
			if (bool) {
				const params = {
					couponActivityId: that.changeBatchStatusData.couponActivityId,
					dayLimit: that.couponRule.receivesEveryDayNum, // 每日领取数限制
					cumulativeLimit: that.couponRule.limitEveryOneNum, // 累计领取数限制
					alldayIssueLimit: that.couponRule.allDayGrantNum // 券批全天发放量
				}
				that.$api.activityCouponVoucherRule(params).then(res => {
					that.getCouponVoucherBatchList();
					that.dialogVisible = false;

				})

				// const param = {
				// 	couponActivityId: that.changeBatchStatusData.couponActivityId,
				// 	voucherNum: that.couponRule.quantity,
				// }
				// that.$api.activityCouponVoucherNum(param).then(res => {
				// 	that.getCouponVoucherBatchList();
				// 	that.dialogVisible = false;
				// })
				// console.log(params);
			} else {
				that.dialogVisible = false;
			}
		},

		handlecouponExamineBtnClick(bool) {
			// 券 审核/驳回
			const that = this;
			const params = {
				couponActivityId: that.changeBatchStatusData.couponActivityId,
				operateAction: '',
			}
			if (bool) {
				params.operateAction = 'audit'
			} else {
				params.operateAction = 'reject'
			}
			that.$api.activityCouponVoucherStatus(params).then(res => {
				that.getCouponVoucherBatchList();
			})
			const param = {
				couponActivityId: that.changeBatchStatusData.couponActivityId,
				dayLimit: that.couponRule.receivesEveryDayNum, // 每日领取数限制
				cumulativeLimit: that.couponRule.limitEveryOneNum, // 累计领取数限制
				alldayIssueLimit: that.couponRule.allDayGrantNum // 券批全天发放量
			}
			that.$api.activityCouponVoucherRule(param).then(res => {
				that.getCouponVoucherBatchList();
			})
			that.dialogVisible = false;
			that.dialogVisibleExamine = true;
		},

  }
};
</script>

<style scoped>
.couponImg {
  width: 100%;
  text-align: center;
  height: 70px;
	margin: 10px auto;
}
.couponStatus {
  width: 46px;
  height: 18px;
  background: #ff7633;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  margin: 10px auto;
}
.coupon-batch-detail-box{
	text-align: center;
	font-size: 24px;
	color: #284567;
	font-weight: bold;
}
.couponName {
  margin: 20px auto;
  /*width:150px;*/
  text-align: center;
  height: 24px;
  font-size: 24px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: #284567;
  line-height: 45px;
}
.el-icon-info{
	margin-right: 5px;
}
.couponKind {
  color: #cccccc;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
  font-weight: bold;
}
.coupon-rule-box{
	height: 30px;
	margin: 10px 0;
	font-weight: bold;
}
.coupon-rule-box span{
	font-weight: bold;
}
.coupon-rule-box span label{
	font-weight: bold;
}
.coupon-rule-title {
  text-align: center;
  height: 20px;
  margin: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #284567;
}
.coupon-rule-row {
  margin: 5px;
}
.dialog_box_shop_list_body{
	min-height: 300px;
	max-height: 370px;
	margin: 30px 0 40px;
	border: 1px solid #ccc;
	padding: 20px 0 0 20px;
	box-sizing: border-box;
}
.dialog_box_shop_list_body p{
  margin-bottom: 20px;
}
.dialog_box_shop_list_body p span{
  display: inline-block;
  max-width: 125px;
  min-width: 122px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dialog_hide_shop_list_btn{
  display: inline-block;
  width: 140px;
  height: 48px;
  line-height: 48px;
  border-radius: 24px;
  background: #FF7633;
  text-align: center;
  color: white;
  font-size: 18px;
}
table.couponTable td {
  padding: 10px 0;
}
table.couponTable {
  margin-top: 0;
}
.coupon-btn-box{
	display: flex;
	justify-content: center;
	align-items: center;
}
.couponBtn {
	display: inline-block;
  width: 68px;
  height: 32px;
  line-height: 32px;
  border-radius: 20px;
	margin: 10px;
  cursor: pointer;
  background: #fff;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.coupon-setup-btn {
	margin: 10px auto;
  width: 68px;
  height: 32px;
  line-height: 32px;
  border-radius: 20px;
  cursor: pointer;
  background: #999;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
table.ruleslist {
  width: 100%;
  color: #999999;
  border-collapse: collapse;
  margin-left: 10px;
}
table.ruleslist tbody tr,
table.ruleslist thead th {
  border-bottom: 1px solid #999999;
}
table.ruleslist td {
  text-align: center;
  vertical-align: middle;
  padding: 5px 0;
  margin: 0;
  box-sizing: border-box;
}
.el-button--primary {
  color: #fff;
  background-color: #ff7633 !important;
  border-color: #ff7633 !important;
}
.templateList {
  color: #666666;
  font-size: 14px;
}
.templateList li {
  /*margin: 20px;*/
  height: 48px;
  line-height: 48px;
  font-weight: bold;
  padding-left: 18px;
}
.templateList .active {
  color: #284567;
  background: #e6eff9;
  border-right: 2px solid #ff7633;
  /*font-family: PingFangSC-Medium;*/
}
.templateList li {
  cursor: pointer;
}

table.formItemTableNew {
  margin: 20px;
  color: #475669;
  width: 90%;
}

table.formItemTableNew td.title {
  color: #666666;
  font-size: 14px;
  font-weight: bold;
  /*width: 310px;*/
  text-align: right;
  padding-right: 15px;
  vertical-align: middle;
}
table.formItemTableNew td {
  padding: 15px 0;
  color: #999999;
  font-size: 14px;
}
.voucherName {
  color: #284567;
  font-size: 16px;
}
.isVoucheDetail {
  margin-top: 30px;
  margin-bottom: 15px;
  text-align: center;
  height: 510px;
}
.isVoucheDetail img {
  margin: 10px 0;
}
.voucheExplain {
  height: 18px;
  font-size: 18px;
  line-height: 48px;
  color: #eeeeee;
}
input::-webkit-input-placeholder{
	color:#eee;
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
	color:#eee;
}
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
	color:#eee;
}
input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
	color:#eee;
}
</style>
