<template>
	<section>
		创建活动地址：http://127.0.0.1:8011/#/?appId=123166&portalId=290&subjectType=1&appName=感知应用
		编辑活动地址：http://127.0.0.1:8011/#/?appId=123166&portalId=290&subjectType=1&appName=感知应用&activityId=A052oEEhJ&activityName=哈哈
		<router-view></router-view>
	</section>
</template>
<script type="text/javascript">
export default {
	data(){
		return {

		}
	} , 
	created(){
		var queryInfor = this.$route.query ; 
		// var queryInfor = {appId: 123169, portalId: 290, subjectType: 1, appName: "哈哈"};
		sessionStorage.setItem('activityInfor' , JSON.stringify(queryInfor));
		sessionStorage.setItem('appCreateSetUp' , 0) ;
		this.$store.commit('updateAppInfor' , queryInfor);
		if(!queryInfor.activityId){
			sessionStorage.removeItem('isEditInfor');
		}
		else{
			sessionStorage.setItem('isEditInfor' , 'true');
		}
		// if(this.$store.state.appInfor.portalId){
			this.$router.push('/activity/basicInfor');
		// }
	} , 
	methods : {
		
	}
}
</script>
