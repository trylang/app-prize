<template>
	<div id="settings-channel-price-box">
		<div v-if="$route.path=='/activity/settingsChannel'">
      <div class="toolbar" >为应用<span class="appName"> {{_appName}} </span>创建活动</div>
      <el-col class="stepTitle">落地页网址</el-col>
      <el-col class="input-content" :span="18" :offset="5">
        <el-input id="copyURL" type="email" v-model="channelUrl" auto-complete="false" 
          placeholder="请输入落地页网址" class="input-email">
        </el-input> 
        <span class="btn_copy" @click="copyContent">复制</span>
        <span @click="handleQRCode">下载二维码</span>
        <span id="qrcodeImg"></span>
      </el-col>
      <el-col  style="text-align: center">
        <div class="goBack Button"  @click="goBackPrev" >上一步</div>
        <div class="inputBtn Button"  @click="clickAndSaveInfor">保存并继续</div>
      </el-col>
    </div>
  </div>
</template>
<script>
import { saveChannelUrL, activityFinish } from "../../../http/interface.js";
import ClipboardJS from "clipboard";
import QRCode from "../../../util/qrCode.js";

let clipboard = null;
export default {
  created() {
    const _state = this.$store.state;
    this._appName = _state.appInfor.appName;
    this.getActivityDetail();
  },
  mounted() {
    // this.copyContent();
    setTimeout(function(){
      clipboard = new ClipboardJS(".btn_copy", {
        text: function(target) {
          return '';
        }
      });
    }, 0);
  },
  data() {
    return {
      channelUrl: ""
    };
  },
  methods: {
    copyContent() {
      let _this = this;
      // if (!this.channelUrl) {
      //   setTimeout(function(){
      //     clipboard = new ClipboardJS(".btn_copy", {
      //       text: function(target) {
      //         return '';
      //       }
      //     });
      //   }, 0);
        // this.$api.getActivityDetail({
        //   portalId: _this.$store.state.appInfor.portalId,
        //   activityId: _this.$store.state.appInfor.activityId
        // }).then(res => {
        //   clipboard = new ClipboardJS(".btn_copy", {
        //     text: function(target) {
        //       return res.channelUrl;
        //     }
        //   });
        // });
      //   return;
      // }
      this.saveURL(this.channelUrl, res => {
        clipboard = null;
        clipboard = new ClipboardJS(".btn_copy", {
          text: function(target) {
            return res.channelUrl;
          }
        });
        clipboard.on("success", function(e) {
          _this.$message.success("已复制成功！");
        });
      });
    },
    handleQRCode() {
      let _this = this;
      this.saveURL(this.channelUrl, function(res) {
        var qrContainer = document.getElementById("qrcodeImg");
        let qrcode = QRCode.getCanvas(res.channelUrl).then(canvas => {
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          qrContainer.innerHTML = "";
          qrContainer.appendChild(canvas);
        });
      });
    },
    getActivityDetail() {
      let _this = this;
      let params = {
        portalId: _this.$store.state.appInfor.portalId,
        activityId: _this.$store.state.appInfor.activityId
      };
      this.$api.getActivityDetail(params).then(res => {
        _this.channelUrl = res.channelUrl;
      });
    },
    saveURL(url, callback) {
      let _this = this;
      if (!url) {
        this.$message.warning("请输入网址内容！");
        return;
      }
      var reg = /http(s)?:\/\//;
      if (!reg.test(url)) {
        this.$message.warning("请输入正确的网址格式！");
        return;
      }
      saveChannelUrL({
        channelUrl: url,
        activityId: this.$store.state.appInfor.activityId,
        tenantType: this.$store.state.appInfor.subjectType,
        tenantId: this.$store.state.appInfor.portalId
      }).then(res => {
        if (callback) callback(res);
      });
    },
    // 保存按钮
    clickAndSaveInfor() {
      let _this = this;
      _this.saveURL(this.channelUrl, function() {
        activityFinish({
          activityId: _this.$store.state.appInfor.activityId,
          portalId: _this.$store.state.appInfor.portalId
        }).then(res => {
          _this.$router.push("/activity/activity");
        });
      });
    },
    // 上一页
    goBackPrev() {
      let _this = this;
      if (this.tableActive === 2) {
        this.tableActive = 0;
      } else if (this.tableActive === 1) {
        this.tableActive = 0;
      } else {
        _this.$router.push("/activity/templateChoice");
      }
    }
  }
};
</script>
<style type="text/css" scope>
#settings-channel-price-box .input-content {
  margin-top: 12%;
  margin-bottom: 3%;
}

#settings-channel-price-box .input-content span {
  color: #ff7633;
  padding-right: 10px;
  cursor: pointer;
}

#settings-channel-price-box .input-content .input-email {
  width: 80%;
  padding-right: 10px;
}

#settings-channel-price-box #qrcodeImg {
  display: block;
  float: right;
  width: 100px;
  height: 100px;
}
</style>

