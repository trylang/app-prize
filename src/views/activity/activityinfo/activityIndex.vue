<template>
	<div>
		<div v-if="$route.path=='/index'" >
			<p>活动总数:{{activityTotalNum}}</p>
			<p>进行中活动:{{activityEffectiveNum}}</p>
		</div>
	  <router-view></router-view>
</div>
</template>
<script>
export default {
    data(){
        return {
          appId:localStorage.getItem("appId"),
          activityTotalNum:"",
          activityEffectiveNum:"",
        }
    } , 
    created(){
    	this.getStatistics()
    } , 
    methods : {
    	
      	getStatistics(){
      		let _this = this;
      		let dataParam={
      			appId:_this.appId,
      		}

      		statistics(dataParam).then(ret=>{
      			if(ret.status == 200){
      				_this.activityTotalNum = ret.data.activityTotalNum;
              _this.activityEffectiveNum = ret.data.activityEffectiveNum;


      			}
      		})

      	},
    }
}
</script>
