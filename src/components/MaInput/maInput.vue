<template>
	<div class="searchinputarea">
		<input type="text" name="" v-model="modelValue" @input="keyupInputEvent" class="searchinput" :placeholder="placeholder" @keyup.13="keybordEnterClick" />
		<span class="searchIcon" @click="searchIconClick"></span>
	</div>
</template>
<script type="text/javascript">
	export default{
		props : {
			value : {
				type : String  , 
                default : '' , 
                required : false  //验证是否从父组件传递值过来
			} , 
			placeholder : {
				type : String , 
				default : '' 
			} , 
			inputEvent : {
				type : String , 
				default : '' 
			}
		} ,
		watch : {
			'value' : function(){
				this.modelValue = this.value;
			}
		},
		data(){
			return {
				modelValue : this.value 
			}
		} , 
		created(){
			
		} , 
		methods : {
			keybordEnterClick(){ //回车
				this.$emit('input' , this.modelValue);
				this.$emit('enterClick');
			},
			searchIconClick(){	//点击搜索
				this.$emit('input' , this.modelValue);
				this.$emit('click');
			} , 
			keyupInputEvent(){
				this.$emit('input' , this.modelValue);
			}
		}
	};
</script>
<style type="text/css">
	.searchinputarea{width:230px;border-bottom:2px solid #CCC;height:36px;display:inline-block;overflow:hidden;position:relative;top:14px;margin-right:20px;}
	.searchinputarea:focus-within{border-bottom:2px solid #409EFF;}
	.searchinputarea .searchinput{border:none;display:inline-block;width:150px;height:34px;line-height:34px;text-indent:10px;position:relative;top:-1px;float:left;}
	.searchinputarea .searchIcon{display:inline-block;width:50px;height:36px;float:right;background:url(../../assets/icon_searchInput.png) no-repeat center center;cursor:pointer;}
</style>