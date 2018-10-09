<template>
  	<el-form label-position="left" label-width="0px" class="demo-ruleForm login-container">
	    <h3 class="title">系统登录</h3>
	    <el-form-item>
	      <el-input type="text" v-model="account" auto-complete="off" placeholder="账号"></el-input>
	    </el-form-item>
	    <el-form-item>
	      <el-input type="password" v-model="checkPass" auto-complete="off" placeholder="密码"></el-input>
	    </el-form-item>
	    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
	    <el-form-item style="width:100%;">
	      <el-button type="primary" style="width:100%;" @click.native.prevent="submitSureLogin" :loading="logining">登录</el-button>
	    </el-form-item>
  	</el-form>
</template>
<script type="text/javascript">
	export default{
		data(){
			return {
				account : '' , 
				checkPass : ''  , 
				checked : false  , 
				logining : false 
			}
		} , 
		methods : {
			submitSureLogin(){

			}
		}
	}
</script>
<style type="text/css" scoped>
	
	.login-container {
    	-webkit-border-radius: 5px;
    	border-radius: 5px;
    	-moz-border-radius: 5px;
    	background-clip: padding-box;
	    margin: 180px auto;
	    width: 350px;
	    padding: 35px 35px 15px 35px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    box-shadow: 0 0 25px #cac6c6;    
 	}
 	.login-container .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .login-container .remember {
      margin: 0px 0px 35px 0px;
    }
</style>