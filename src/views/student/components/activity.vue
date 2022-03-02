<template>
       <div style="width:100%;height:100%" id="activity"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'activity',
    props:[
      "activityClassifyData"
    ],
    data() {
      return {
        activityClassifyData2:this.activityClassifyData
      }
    },
    computed:{
      fillterData:function(){
        let fillterData = []
        if(this.activityClassifyData2){
          this.activityClassifyData2.forEach( item => {
            fillterData.push({name:item.label,value:item.id})
          })
        }
        return fillterData;
      },
      fillterData2:function(){
        let fillterData = []
        if(this.activityClassifyData2) {
          this.activityClassifyData2.forEach(item => {
            fillterData.push({name: item.label})
          })
        }
        return fillterData;
      }
    },
    created(){

    },
    watch:{
      activityClassifyData (val) {
            this.activityClassifyData2  = val
            this.fetchdata()
        },
    },
    mounted () {
       this.fetchdata();
    },
    methods:{
        fetchdata(){
      const option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
         x: 'left',
        data:this.fillterData2
    },
    color:['#7FC4FF', '#846cde','#DE26FF','#FF42A4','#02DBAC'],
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%','70%'],
            center: ['70%', '50%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:this.fillterData
        }
    ]
};

        const activity = echarts.init(document.getElementById('activity'));
        activity.setOption(option);

        window.addEventListener('resize', function () {
            activity.resize();
        });
    }
    }
};
</script>
