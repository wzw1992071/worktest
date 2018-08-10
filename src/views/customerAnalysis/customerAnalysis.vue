<template>
	<div id="analysis">
	 <div class="layout-content-main">
	 	 <Tabs>
	 	 	<Tab-pane label="客户增长">
	 	 		<router-view></router-view>
	 	 	</Tab-pane>
	 	 </Tabs>
	 </div>
	 <dcm-footer></dcm-footer>
	</div>
</template>
<script>
import dcmFooter from './../../components/footer.vue';
	export default {
		components: {dcmFooter}
	};
</script>
<style lang="less">
#analysis {
	.ivu-select-arrow{right: 17px;}
background-color: #FFFFFF;height:100%;
.ivu-select-selection { .ivu-select-placeholder {font-size: 14px}}
.ivu-select-selected-value {font-size: 14px;padding-left: 23px;}
.ivu-input {font-size: 14px;}
.layout-copy{margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
}
</style>
