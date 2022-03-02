<template>
    <div style="width:1000px;height:500px;" id="categoryList"></div>
</template>

<script>
	import echarts from 'echarts';
	export default {
		name: 'categoryList',
	    props:[
	      "categoryClassifyData"
	    ],
	    watch:{
	    	categoryClassifyData(val){
	    		this.builderJson.charts = val
	    		this.fristData()
	    	}
	    },
	    data(){
	    	return {
	    		builderJson : {
				  "charts": {}
				}
	    	}
	    },
	    mounted () {
//	    	this.fristData()
	    },
	    methods:{
	    	fristData(){
	    		var canvas = document.createElement('canvas');
				canvas.width = canvas.height = 100;
	    		var that = this
	    		const option = {
	    			color:['#4c7bff','#fe8c11'],
				    backgroundColor: {
				        type: 'pattern',
				        image: canvas,
				        repeat: 'repeat'
				    },
				    grid: [{
				        top: 50,
				        width: '90%',
				        left: 10,
				        containLabel: true
				    }],
				    xAxis: [{
				        type: 'value',
				        splitLine: {
				            show: false
				        }
				    }],
				    yAxis: [{
				        type: 'category',
				        data: Object.keys(that.builderJson.charts),
				        axisLabel: {
				            interval: 0,
				            rotate: 30
				        }
				    },],
				    series: [{
				        type: 'bar',
				        stack: 'chart',
				        z: 3,
				        label: {
				            normal: {
				                position: 'right',
				                show: true
				            }
				        },
				        data: 

						Object.keys(that.builderJson.charts).map(function (key) {
						            return that.builderJson.charts[key];
						        })
				    }]
				}
//	    		Object.keys(that.builderJson.charts).map(function (key) {
//				            return that.builderJson.charts[key];
//				)}
				const categoryList = echarts.init(document.getElementById('categoryList'));
		        categoryList.setOption(option);
		
		        window.addEventListener('resize', function () {
		            categoryList.resize();
		        });
	    	}
	    }
	}
</script>

<style>
</style>