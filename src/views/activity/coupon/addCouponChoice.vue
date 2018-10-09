<template>
  <div>
    <div v-if="$route.path=='/activity/couponChoice/add'">
      <el-row>
        <el-col class="stepTitle">{{$route.query.id? '修改优惠券' : '创建优惠券'}}</el-col>
        <el-col class="add-coupon-container" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>券类型:</span>
          <div class="coupon-item">
            <ul>
              <li class="ticket-item"
                :class="[param.categoryId == ticket.id ? `backgroundImg_${ticket.id}` : 'backgroundImg_default']"
                @click="selectedCategory(ticket)"
                v-for="(ticket, index) in categoryList" :key="index">
                  <img class="default_icon" :src="ticket.logoUrl" width="35" height="36">
                  <p class="ticket_info">
                    <strong>{{ticket.name}}</strong>
                    <span>{{ticket.comment}}</span>
                  </p>
              </li>
            </ul>
          </div>
        </el-col>

        <el-col v-if="param.categoryId==0 || param.categoryId==2" class="add-coupon-container" :offset="1" :span="17">
          <span v-if="param.categoryId==0"><strong style="color:#FF7633;">*</strong>折扣：</span>
          <span v-if="param.categoryId==2"><strong style="color:#FF7633;">*</strong>金额：</span>
          <div class="coupon-item inputwidthcount">
            <p v-if="param.categoryId==0"><el-input size="small" @change="validateNumber" v-model="param.discount" style="width:100px;" :min="10" :max="100"></el-input> 折</p>
            <p v-if="param.categoryId==2"><el-input size="small" @change="validateNumber" v-model="facePrice" style="width:100px;" :min="10" :max="100"></el-input> 元</p>
            <i class="el-icon-warning tips"> 请输入10至100内的数字</i>
          </div>
        </el-col>

        <el-col v-if="param.categoryId==6 || param.categoryId==1 || param.categoryId==7 || param.categoryId==9  || param.categoryId==8" class="add-coupon-container" :offset="1" :span="17">
          <span v-if="param.categoryId==1">礼品标题:</span>
          <span v-if="param.categoryId==7  || param.categoryId==8"><strong style="color:#FF7633;">*</strong>单品标题:</span>
          <span v-if="param.categoryId==9 || param.categoryId==6"><strong style="color:#FF7633;">*</strong>券标题:</span>
          <div class="coupon-item inputwidthcount">
            <el-input placeholder="请输入优惠券标题" size="small" v-model="param.mainInfo" style="width:300px;" :maxlength="15"></el-input>
            <em>&nbsp;{{param.mainInfo ? param.mainInfo.length : 0}}/15</em>
            <br>
            <i class="el-icon-warning tips" v-if="param.categoryId==6 || param.categoryId==9"> 建议填写商品名称，例：香草拿铁等</i>
            <i class="el-icon-warning tips" v-if="param.categoryId==1  || param.categoryId==8"> 建议填写礼品名称，例：时尚电子多功能笔等</i>
          </div>
        </el-col>

        <el-col class="add-coupon-container" :offset="1" :span="17">
          <span>副标题:</span>
          <div class="coupon-item inputwidthcount">
            <el-input placeholder="请输入优惠券副标题" size="small" v-model="param.extendInfo" style="width:300px;" :maxlength="15"></el-input>
            <em>&nbsp;{{param.extendInfo ? param.extendInfo.length : 0}}/15</em>
          </div>
        </el-col>

        <el-col v-if="param.categoryId==7" class="add-coupon-container shopSelect" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>优惠时间:</span>
          <div class="coupon-item">
            <el-date-picker
              v-model="effectiveTime"
              type="daterange"
              size="small"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-col>

        <el-col v-if="param.categoryId!=7 && param.categoryId!=8" class="add-coupon-container shopSelect" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>券有效期:</span>
          <div class="coupon-item">
            <el-radio-group v-model="param.effectiveType" size="small">
              <el-radio-button label="0">日期范围</el-radio-button>
              <el-radio-button label="1">领取后生效</el-radio-button>
            </el-radio-group>
            <div style="margin-top:10px;">
              <el-date-picker
                v-if="param.effectiveType == 0"
                v-model="effectiveTime"
                type="daterange"
                size="small"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
              </el-date-picker>

              <p v-if="param.effectiveType == 1"> 领取后
                <el-input-number :controls="false" v-model="param.activedLimitedStartDay" size="small" style="width:100px;" placeholder="请输入" :min="0"></el-input-number>
                天生效， 有效天数
                <el-input-number :controls="false" v-model="param.activedLimitedDays" size="small" style="width:100px;" placeholder="请输入" :min="1"> </el-input-number>
              </p>

            </div>

          </div>
        </el-col>

        <el-col v-if="param.categoryId==6 || param.categoryId==1 || param.categoryId==7" class="add-coupon-container" :offset="1" :span="17">
          <span v-if="param.categoryId==6"><strong style="color:#FF7633;">*</strong>食品原价:</span>
          <span v-if="param.categoryId==1"><strong style="color:#FF7633;">*</strong>礼品原价:</span>
          <span v-if="param.categoryId==7"><strong style="color:#FF7633;">*</strong>商品原价:</span>
          <div class="coupon-item inputwidthcount">
            <el-input placeholder="" size="small" v-model="unitPrice" style="width:100px;" :maxlength="15"></el-input> 元
          </div>
        </el-col>

        <el-col v-if="param.categoryId!=8" class="add-coupon-container" :offset="1" :span="17">
          <span>使用说明:</span>
          <div class="coupon-item">
            <el-input type="textarea" :rows="2" placeholder="请填写优惠券使用说明" v-model="param.descClause"></el-input>
          </div>
        </el-col>
        <el-col v-if="param.categoryId!=8" class="stepTitle">限制规则</el-col>
        <el-col v-if="param.categoryId!=8" class="add-coupon-container" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>券数量:</span>
          <div class="coupon-item">
            <el-input v-model="param.quantity" style="width:20%;" size="small" placeholder="请输入" ></el-input> 张
            <br>
            <i class="el-icon-warning tips"> 请填写优惠券的初始库存，保存后您可以在券详情为其填加库存</i>
          </div>
        </el-col>

        <el-col v-if="param.categoryId !=1 && param.categoryId !=7 && param.categoryId !=8" class="add-coupon-container shopSelect" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>使用门槛:</span>
          <div class="coupon-item">
            <el-radio-group v-model="param.conditionType" size="small">
              <el-radio-button label="0">无门槛</el-radio-button>
              <el-radio-button label="1">门槛</el-radio-button>
            </el-radio-group>
            <p v-if="param.conditionType == 1" style="margin-top:10px;">
              消费满 <el-input type="number" v-model="param.conditionPrice" style="width:24%;" size="small" placeholder="请输入"  ></el-input> 元，可使用此券
            </p>
          </div>
        </el-col>

        <el-col v-if="param.categoryId !=8" class="add-coupon-container" :offset="1" :span="17">
          <span><strong style="color:#FF7633;">*</strong>核销主体:</span>
          <div class="coupon-item shopSelect">
            <el-radio-group v-model="param.verifiyMain" size="small">
              <el-radio-button label="0">不限</el-radio-button>
              <el-radio-button label="1">选择</el-radio-button>
            </el-radio-group>
            <p style="line-height:40px;">已选 <span style="color:#ff7633">{{ choiseShopCount }}</span> 个</p>
            <el-row style="border: 1px solid #eee;position:relative;" class="shopSelect">
              <div v-if="param.verifiyMain == 0" style="position:absolute;width:100%;height:100%;background:rgba(255,255,255,0.5);z-index:99"></div>
              <span style="position:absolute;display:inline-block;height:100%;width:0;border-right:2px solid #e4e7ed;left:116px;z-index:2;"></span>
              <el-col :span="5" class="floorList" style="border-right:0;">
                <div class="search" style="height:50px;">
                  <div class="shopKeywordSearch" style="padding-top:10px;">
                    <maInput placeholder="搜索" style="border-bottom:0;" v-model="name" @click="getShopListByKeyword" @enterClick="getShopListByKeyword"></maInput>
                  </div>
                </div>
                  <ul >
                    <li v-if="floorId==''" class="active">结果</li>
                    <template  v-for="(item ,index) in floorList">
                        <li :class="[floorId ==item.floorId?  'active' : '']" @click="floorId = item.floorId;name='' ;getShopListByFloor();" :key="index">{{item.floorName}}</li>
                    </template>
                  </ul>
                </el-col>
              <el-col :span="19"   class="shop" style="padding-top:10px;">
                  <el-col :span="24">
                      <el-checkbox style="margin:10px 0px 14px;"
                      v-model="checkedall"
                      @change="choiseCurrentFloor($event)">全部选择  ({{shopsList.length}})</el-checkbox>
                  </el-col>
                  <template v-for="(item, index) in shopsList">
                      <div style="display:inline-block;width:145px;overflow:hidden;" :key="index">
                          <el-checkbox :label="item.id" v-model="item.isChecked" @change="singleShopListChange($event , item)">{{item.name}}</el-checkbox>
                      </div>
                  </template>
              </el-col>
            </el-row>
          </div>
        </el-col>

        <el-col class="stepTitle">图文设置</el-col>
        <el-col class="add-coupon-container" :offset="1" :span="17">
          <span>封面图片:</span>
          <div class="coupon-item">
            <div class="choiseInputFileArea" style="height: 216px;" v-if="param.imageList.length>0 && param.imageList[0].imgUrl">
              <img class="varArea" :src="param.imageList[0].imgUrl" width="210" height="210" @error="nofind"/>
              <input type = "file" multiple="multiple" @change="uploadFile($event, 1)">
              <div class="hoverImgBtn" style="height: 100%;">
                <i class="icon el-icon-picture" style="margin-top: 86px;">
                  <input type = "file" class="uploadImgtext" style="width: 50%; top: 23%;" multiple="multiple" @change="uploadFile($event, 1)">
                </i>
                <i class="icon el-icon-zoom-in" style="margin-top: 86px;" @click="handlePictureCardPreview(param.imageList[0].imgUrl)"></i>
              </div>
            </div>
            <div class="choiseInputFileArea" style="height: 216px;" v-else>
              <img class="varArea" src="../../../assets/couponChoice/uploadImg_default.png" width="210" height="210" />
              <input type = "file" multiple="multiple" @change="uploadFile($event, 1)">
            </div>
          </div>
        </el-col>

        <el-col class="add-coupon-container" :offset="1" :span="17"  v-for="(item, index) in imgTextList" :key="index">
          <span>增加图文:</span>
          <div class="coupon-item">
            <div class="choiseInputFileArea"  v-if="item.img">
              <img class="varArea" src="../../../assets/couponChoice/uploadImgtext.png" width="210" height="180" />
              <img class="varArea" :src="item.img" width="198" height="116" style="padding: 6px 0 0 6px;" @error="nofind"/>
              <input type = "file" class="uploadImgtext" multiple="multiple" @change="uploadFile($event, 0, item)">
              <el-input class="imgtext" type="textarea" placeholder="请输入说明文字" v-model="item.html" />
              <div class="hoverImgBtn">
                <i class="icon el-icon-picture">
                  <input type = "file" class="uploadImgtext" style="width: 50%; top: 23%;" multiple="multiple" @change="uploadFile($event, 0, item)">
                </i>
                <i class="icon el-icon-delete" @click="handleRemove(item, imgTextList)"></i>
              </div>
            </div>
            <div class="choiseInputFileArea" v-else>
              <img class="varArea" src="../../../assets/couponChoice/uploadImgtext.png" width="210" height="180" />
              <input class="uploadImgtext" type = "file" multiple="multiple" @change="uploadFile($event, 0, item)">
              <el-input class="imgtext" type="textarea" placeholder="请输入说明文字" v-model="item.html" />
            </div>
          </div>
        </el-col>

        <el-col class="add-coupon-container" :offset="2" :span="17">
          <span style="color: #ff7633; margin-top: -14%; padding-left: 16%;cursor: pointer; text-align: left;" @click="addImgText"><i class="el-icon-plus"></i> 增加图文</span>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <div class="btncon">
          <div class="inputBtn Button" @click="saveInfo">{{$route.query.id? '修改券' : '创建券'}}</div>
          <div class="goBack Button"  @click="goBackPrev" >{{$route.query.id? '取消修改' : '取消创建'}}</div>
        </div>
      </el-row>
    </div>

    <el-dialog :visible.sync="dialogVisible"> <img width="100%" :src="dialogImageUrl" alt=""> </el-dialog>

  </div>
</template>
<script>
// import * as $api from "../../../api/api";
export default {
  mounted() {
    this.getCouponTypeList();
    this.getFloorList();
  },
  created() {},
  data() {
    return {
      options: Array.from({ length: 90 }, (v, k) => {
        return { label: k, value: k };
      }).slice(1),
      checkedall: false,
      facePrice: 10,
      unitPrice: 0,
      effectiveTime: [],
      imgTextList: [{img: '', html: ''}], // 图文list
      dialogImageUrl: "",
      dialogVisible: false,
      selectedBGUrl: "",
      categoryList: [],
      tickets: [
        {
          id: 0,
          selectedBGUrl: require("../../../assets/couponChoice/discount.png"),
          iconUrl: require("../../../assets/couponChoice/discount_icon.png"),
          title: "折扣券",
          desc: "达到指定消费金额时享受折扣"
        },
        {
          id: 1,
          selectedBGUrl: require("../../../assets/couponChoice/gift.png"),
          iconUrl: require("../../../assets/couponChoice/gift_icon.png"),
          title: "礼品券",
          desc: "免费兑换礼品"
        },
        {
          id: 6,
          selectedBGUrl: require("../../../assets/couponChoice/taste.png"),
          iconUrl: require("../../../assets/couponChoice/taste_icon.png"),
          title: "免费试吃试用券",
          desc: "免费享受服务或商品",
        },
        {
          id: 9,
          selectedBGUrl: require("../../../assets/couponChoice/common.png"),
          iconUrl: require("../../../assets/couponChoice/common_icon.png"),
          title: "通用券",
          desc: "以上券均无法满足时创建此券"
        },
        {
          id: 8,
          selectedBGUrl: require("../../../assets/couponChoice/brand.png"),
          iconUrl: require("../../../assets/couponChoice/brand_icon.png"),
          title: "品牌活动",
          desc: "品牌大促，推广"
        },
        {
          id: 2,
          selectedBGUrl: require("../../../assets/couponChoice/voucher.png"),
          iconUrl: require("../../../assets/couponChoice/voucher_icon.png"),
          title: "代金券",
          desc: "支付时直接抵消对应金额"
        },
        {
          id: 7,
          selectedBGUrl: require("../../../assets/couponChoice/preference.png"),
          iconUrl: require("../../../assets/couponChoice/preference_icon.png"),
          title: "单品优惠",
          desc: "引爆潮流"
        }
      ],
      floorList: [], //楼层列表
      floorId: "", //楼层选中
      shopsList: [], //店铺列表
      shopListBySearch: "", //是否是搜索关键字
      choiseShopCount: 0, //选择的店铺数量
      choiseShopList: {}, //选择的店铺
      name: "",
      param: {
        verifiyMain: '0', // 核销主体限制类型
        portalId: this.$store.state.appInfor.portalId,  // 登录主体ID *
        categoryId: 0, // 券类型  *
        mainInfo: '', // 券标题	  *
        discount: 10,
        descClause: null,
        imageList: [], // 券图片集合  *
        imgtxtInfo: null,
        quantity: '', // 券总数量  *
        conditionType: 0,
        effectiveType: 0, //  券有效类型 0 固定日期 1 领取后多少天生效  *
        effectiveStartTime: null, //  券日期开始时间（券有效类型为0时必须）  *
        effectiveEndTime: null, //  券结束时间（券有效类型为0时必须）  *
        activedLimitedStartDay: 0,
        activedLimitedDays: 1,
        isAllShop: 2,  // 是否全场核销:是否全场核销:1：是 2：否(1：不需选适用商户)  *
        applyShopList: [],
        rectangle: 1, // 建券方：1：商场 2：商户  *
        extendInfo: undefined,
        precouponCode: undefined,
        precouponId: undefined, //	外部券ID
        facePrice: undefined, //	券面值 单位：分
        unitPrice: undefined, //	单间 单位：分
        conditionPrice: 1, //券使用门槛 消费满多少可以使用 单位：分
        buyValue: undefined, //
      }
    };
  },
  computed: {
    isIndeterminate: function() {
      //   let checkedCount = this.checkedshopIds.length;
      //   return checkedCount > 0 && checkedCount < this.allShopList.length;
    }
  },
  methods: {
    getCouponTypeList() {
      const that = this;
      const params = {};
      this.$api.activityCategoryList().then(res => {
          let data = res;
          let arr = [];
          data.forEach(item => {
            if (item.children.length > 0) {
              arr.push(...item.children);
            }
          });

          arr.forEach(item => {
            let valItem = that.tickets.find(val => val.id === item.id);
            item.title = item.name;
            item.selectedBGUrl = valItem.selectedBGUrl;
            item.logoUrl = valItem.iconUrl;
            item.iconWidth = valItem.iconWidth;
            item.iconHeight = valItem.iconHeight;
            item.desc = item.comment;
          });
          const categoryOrder = [0, 1, 2, 6, 7, 8, 9];
          const newlist = [];
          categoryOrder.forEach(item => {
            newlist.push(arr.find(val => val.id === item));
          });
          that.categoryList = newlist;
      });
    },
    renderCategoryList(data) {
      const that = this;
      const _arr = [];
      // that.categoryList
      data.length &&
        data.map(item => {
          if (!item.leaf) {
            item.children.map(v => {
              if (v.leaf) {
                _arr.push(v);
              }
            });
          }
        });
      console.log(that.categoryList);
    },
    validateNumber(e) {
      if (!e) return;
      let value = parseInt(e);
      if(value < 10 || value > 100) {
        if (this.param.categoryId == 0) this.$set(this.param, 'discount', 10);
        if (this.param.categoryId == 2) this.$set(this, 'facePrice', 10);
      } else {
        if (this.param.categoryId == 0) this.$set(this.param, 'discount', value);
        if (this.param.categoryId == 2) this.$set(this, 'facePrice', value);
      }
    },
    nofind(event) {
      var img=event.srcElement;
      img.src = require("../../../assets/couponChoice/nophoto.gif");
      img.onerror=null;
    },
    handleRemove(file, fileList) {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let index = fileList.indexOf(file);
          if (index >= 0) {
            fileList.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});;
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    addImgText: function() {
      this.imgTextList.push({
        img: "",
        html: ""
      });
    },
    selectedCategory: function(item) {
      this.selectedBGUrl = `backgroundImg_${item.id}`;
      this.param.categoryId = item.id;
    },
    uploadFile: function(e, type, item) {
      let dataParam = new FormData();
      let _this = this;
      dataParam.append("file", e.target.files[0]);
      _this.$api.file_upload(dataParam).then(res => {
        if (type == 0) {
          // 非封面
          item.img = res.path;
        } else if (type == 1) {
          _this.$set(_this.param.imageList, 0, {
            imgType: 0,
            imgUrl: res.path
          });
        }
      });
    },
    addImgText: function() {
      this.imgTextList.push({
        img: "",
        html: ""
      });
    },
    getFloorList() {
      //获取楼层列表
      let that = this,
        params = {
          portalId: that.$store.state.appInfor.portalId,
          subjectType: that.$store.state.appInfor.subjectType
        };
      that.$api
        .getFloorList(params)
        .then(ret => {
          that.floorList = ret;
          that.floorId = ret[0].floorId;
          if (that.$store.state.appInfor.activityId) {
            that.getShopListByFloor();
          }
        })
        .catch(() => {});
    },
    getShopListByFloor() {
      //获取店铺列表根据楼层
      let that = this;
      that.$api
        .getShopListByFloor({
          portalId: that.$store.state.appInfor.portalId,
          floorId: that.floorId
        })
        .then(ret => {
          that.shopsList = ret.map(function(item) {
            let isChecked = false;
            if (that.choiseShopList.hasOwnProperty("shop_" + item.id)) {
              isChecked = true;
            }
            return {
              id: item.id,
              name: item.name,
              isChecked: isChecked
            };
          });
        })
        .catch(() => {});
    },
    getShopListByKeyword() {
      let that = this;
      that.floorId = "";
      that.$api
        .searchAllShopListByKeyword({
          portalId: that.$store.state.appInfor.portalId,
          subjectType: that.$store.state.appInfor.subjectType,
          name: that.name
        })
        .then(ret => {
          that.shopsList = ret.map(function(item) {
            let isChecked = that.choiseShopList.hasOwnProperty(
              "shop_" + item.id
            )
              ? true
              : false;
            return {
              id: item.id,
              name: item.name
            };
          });
        })
        .catch(() => {});
    },
    choiseCurrentFloor(event) {
      let that = this;
      if (event) {
        that.shopsList.forEach(function(item) {
          if (!that.choiseShopList.hasOwnProperty("shop_" + item.id)) {
            item.isChecked = event;
            that.choiseShopCount++;
            that.choiseShopList["shop_" + item.id] = item;
          }
        });
      } else {
        that.shopsList.forEach(function(item) {
          if (that.choiseShopList.hasOwnProperty("shop_" + item.id)) {
            item.isChecked = event;
            that.choiseShopCount--;
            delete that.choiseShopList["shop_" + item.id];
          } else {
            item.isChecked = event;
          }
        });
      }
      console.log(this.choiseShopList);
    },
    singleShopListChange(event, item) {
      //单个复选框选中
      if (event) {
        this.choiseShopCount++;
        this.choiseShopList["shop_" + item.id] = item;
      } else {
        if (this.choiseShopList.hasOwnProperty("shop_" + item.id)) {
          this.choiseShopCount--;
          delete this.choiseShopList["shop_" + item.id];
        }
      }
      console.log(this.choiseShopList);
    },
    handleCheckAllChange(val) {
      //全选
      let arr = [];
      if (val) {
        for (var variable in this.floorList) {
          if (this.floorList.hasOwnProperty(variable)) {
            arr = arr.concat(this.floorList[variable].shops);
          }
        }
        let shop = arr.map(item => {
          return item;
        });
        this.checkList = shop;
        this.checkedshopIds = shop.map(item => item.shopId);
      } else {
        for (var variable in this.floorList) {
          if (this.floorList.hasOwnProperty(variable)) {
            this.floorList[variable].checked = false;
          }
        }
        this.checkList = [];
        this.checkedshopIds = [];
      }
    },
    goBackPrev() {
      this.$router.push("/activity/couponChoice");
    },
    saveInfo() {
      let that = this;
      let regNum = /\D|^0/; //正整数
      let regFNum = /^(?:[1-9]+\d*|0)(\.\d+)?$/;  // 非负数
      if(that.param.categoryId != 1 && that.param.categoryId != 7 && that.param.categoryId != 8 && (that.param.conditionType == 1 && (that.param.conditionPrice <= 0 || that.param.conditionPrice > 99999))){
        that.$message.warning("使用门槛消费数需大于0且小于100000");
        return false;
      };

      if(that.param.categoryId != 0 && that.param.categoryId != 2 && that.param.mainInfo == ''){
        that.$message.warning("请输入优惠券名称");
        return false;
      };

      if(that.param.categoryId == 0 && that.param.discount == ''){
        that.$message.warning("请输入折扣数");
        return false;
      };

      if(that.param.categoryId == 2 && that.facePrice == ''){
        that.$message.warning("请输入金额数");
        return false;
      };

      if (that.param.categoryId != 8 && that.param.effectiveType == 0) {
        if (that.effectiveTime == null || that.effectiveTime == "") {
          that.$message.warning("请选择券有效期");
          return false;
        }
        that.param.activedLimitedDays = null;
        that.param.activedLimitedStartDay = null;

        that.param.effectiveStartTime = that.effectiveTime[0];
        that.param.effectiveEndTime = that.effectiveTime[1];
      }
      if (that.param.effectiveType == 1) {
        that.param.effectiveStartTime = null;
        that.param.effectiveEndTime = null;
      }
      if(that.param.categoryId != 8 && !regFNum.test(that.unitPrice)){
        that.$message.warning("商品原价只能是正数！");
        return false;
      }

      if(that.param.categoryId != 8 && regNum.test(that.param.quantity) || that.param.quantity == 0){
        that.$message.warning("券数量只能是正整数！");
        return false;
      }

      if(parseInt(that.param.quantity) > 1000000){
        that.$message.warning("券数量只能在999999以内！");
        return false;
      }

      that.param.applyShopList = that.checkList;

      if(that.param.categoryId == 8){
        that.param.isAllShop = 1;
        that.param.effectiveStartTime = new Date();
        that.param.effectiveEndTime = new Date();
      };

      if (that.param.categoryId == 0) {
        that.param.mainInfo = `${that.param.discount}折折扣券`;
      }

      if (that.param.categoryId == 2) {
        that.param.facePrice = that.facePrice * 100;
        that.param.mainInfo = `${that.facePrice}元代金券`;
      }

      that.param.unitPrice = that.unitPrice * 100;
      that.param.imgtxtInfo = JSON.stringify(that.imgTextList);

      that.param.isAllShop = that.param.verifiyMain == 0 ? 1 : 2;
      if (that.param.isAllShop === 2){
        if (!that.param.applyShopList) that.param.applyShopList = [];
        for (let item in that.choiseShopList) {
          that.param.applyShopList.push({
            shopId: that.choiseShopList[item].id,
            shopName: that.choiseShopList[item].name
          });
        }
      } else {
        that.param.applyShopList = [];
      }
      if(that.param.categoryId != 8 && that.param.isAllShop == 2 &&  that.param.applyShopList.length<=0){
        that.$message.warning("请选择核销主体");
        return false;
      }

      let newArr = [];
      that.param.imageList.forEach(item => {
        if (item) newArr.push(item);
      });
      that.param.imageList = newArr;

      if (that.param.conditionType == 1) {
        if (regNum.test(that.param.conditionPrice)) {
          that.$message.warning("请输入合理的券消费限额");
          return false;
        } else {
          that.param.conditionPrice *= 100;
        }
      }
      that.$api.activityCouponCreate(that.param).then(res => {
        that.$message({
          message: "创建成功",
          type: "success"
        });
        that.$router.push("/activity/couponChoice");
      });
    }
  }

};
</script>
<style>
.add-coupon-container {
  margin-top: 30px;
  display: flex;
  color: #666666;
}

.add-coupon-container > span {
  flex: 2;
  text-align: right;
  padding-top: 5px;
  padding-right: 10px;
}

.add-coupon-container > .coupon-item {
  flex: 14;
}
.ticket-item {
  display: inline-flex;
  margin-right: 30px;
  margin-bottom: 14px;
  width: 280px;
  height: 70px;
  cursor: pointer;
}
.coupon-item .el-input__inner {
  text-indent: 10px;
  /* color: #D9D9D9; */
}
.backgroundImg_default {
  background: url("../../../assets/couponChoice/unselected.png") no-repeat;
}

.backgroundImg_0 {
  background: url("../../../assets/couponChoice/discount.png") no-repeat;
}

.backgroundImg_1 {
  background: url("../../../assets/couponChoice/gift.png") no-repeat;
}

.backgroundImg_2 {
  background: url("../../../assets/couponChoice/taste.png") no-repeat;
}

.backgroundImg_8 {
  background: url("../../../assets/couponChoice/common.png") no-repeat;
}

.backgroundImg_9 {
  background: url("../../../assets/couponChoice/brand.png") no-repeat;
}

.backgroundImg_6 {
  background: url("../../../assets/couponChoice/voucher.png") no-repeat;
}

.backgroundImg_7 {
  background: url("../../../assets/couponChoice/preference.png") no-repeat;
}

.ticket-item .default_icon {
  flex: 1;
  padding: 20px;
}

.ticket-item .ticket_info {
  flex: 6;
  display: flex;
  flex-direction: column;
  padding-top: 6px;
  color: #fff;
}

.ticket-item .ticket_info strong {
  margin-bottom: 5px;
  font-size: 16px;
}

.ticket-item .ticket_info span {
  margin-left: 0px;
  margin-top: 0px;
  padding-right: 10px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 116px;
  line-height: 116px;
  text-align: center;
}
.btncon {
  margin-bottom: 30px;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}

.el-upload__text {
  margin: 0 auto;
  width: 141px;
  height: 44px;
  font-size: 13px;
  color: rgba(204, 204, 204, 1);
}

div.choiseInputFileArea {
  position: relative;
  height: 270px;
  width: 210px;
  cursor: pointer;
}
div.choiseInputFileArea .varArea {
  cursor: pointer;
  display: block;
  position: absolute;
  font-size: 30px;
  color: #ccc;
  text-align: center;
  /* border: 1px dotted #cdcdcd; */
}

.hoverImgBtn {
  display: none;
  position: absolute;
  width: 100%;
  height: 116px;
}

.hoverImgBtn .icon {
  margin: 40px auto;
  font-size: 30px;
  color: #fff;
}

div.choiseInputFileArea:hover > .hoverImgBtn {
  background: #000;
  opacity: 0.5;
  display: flex;
}

div.choiseInputFileArea input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

div.choiseInputFileArea input[type="file"].uploadImgtext {
  /*width: 50%;*/
  height: 39%;
}

div.choiseInputFileArea .imgtext {
  position: absolute;
  top: 44%;
  left: 8px;
  width: 190px;
  font-size: 10px;
}

.imgtext.el-textarea textarea.el-textarea__inner {
  border: 0;
}

.shopSelect .el-tabs__active-bar {
  background-color: #ff7633;
}
.shopSelect .el-tabs__item.is-active {
  background-color: #e6eff9;
}
.shopSelect .el-tabs__item {
  color: #999;
}
.shopSelect .el-radio-button__inner {
  color: #999;
}
.shopSelect .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #fff;
  border-color: #284567;
  color: #284567;
  box-shadow: -1px 0 0 0 #284567;
}
.shopSelect .el-radio-button__inner:hover {
  color: #284567;
}
.shopSelect .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
  background-color: #284567;
}
.shopSelect .el-checkbox__input.is-checked .el-checkbox__inner,
.shopSelect .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fff;
  border-color: #284567;
}
.shopSelect .el-checkbox__input.is-checked .el-checkbox__inner,
.shopSelect .el-checkbox__inner {
  background-color: #fff;
  border-color: #284567;
}
.shopSelect .el-checkbox__inner::after {
  border-color: #284567;
}
.shopSelect .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #284567;
}
.shopSelect .el-checkbox {
  color: #999;
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

.goBack {
  color: #ff7633;
  border: 1px solid #ff7633;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
}

.stepTitle {
  border-left: 4px solid #284567;
  color: #284567;
  height: 20px;
  font-size: 18px;
  padding-left: 5px;
  line-height: 20px;
}
.inputwidthcount em {
  position: absolute;
  display: block;
  height: 40px;
  line-height: 32px;
  top: 0px;
  left: 250px;
  color: #d9d9d9;
}
.inputwidthcount {
  /*width: 460px;*/
  position: relative;
  height: 40px;
}
.tips {
  color: #ff7633;
  font-size: 12px;
  margin-top: 10px;
}
p.selectedNum {
  color: #999999;
  margin-bottom: 18px;
}
.btncon {
  margin-top: 20px;
  text-align: center;
}
.next {
  background-color: #ff7633;
}
.floorList {
  width: 116px;
  border-right: 1px solid #eee;
  float: left;
}

.floorList {
  color: #666;
  font-size: 14px;
}
.floorList .active {
  color: #284567;
  background: #e6eff9;
  border-right: 2px solid #ff7633;
}

.floorList li {
  cursor: pointer;
  height: 48px;
  line-height: 48px;
  font-weight: 700;
  padding-left: 18px;
}
.shop {
  /* width: 900px; */
  padding-left: 20px;
  border-left: 1px solid #eeeeee;
  float: left;
}
</style>
