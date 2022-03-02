<template>
       <div style="width:100%;height:100%;" id="department"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'department',
    props:[
      "activeData"
    ],
    data() {
      return {
           getdata:this.activeData
      }
    },
    created(){

    },
    mounted () {
      this.fetchData();
    },
    methods:{
      fetchData(){
        const option = {
          color: ['#7FC4FF'],
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top:'3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data :this.formalData,
                  axisTick: {
                      alignWithLabel: true
                  },axisLabel:{
                  interval:0,
                  rotate:45,//倾斜度 -90 至 90 默认为0
                  margin:2
                }
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'活动总数',
                  type:'bar',
                  barWidth: '60%',
                  data:this.formalToal
              }
          ]
      };

        const department = echarts.init(document.getElementById('department'));
        department.setOption(option);

        window.addEventListener('resize', function () {
            department.resize();
        });
      }
    },
    computed:{
      formalData:function(){
        let formalData = [];
        this.getdata.forEach( item => {
           formalData.push(item.name)
        })
        return formalData;
      },
      formalToal:function(){
        let formalData = [];
        this.getdata.forEach( item => {
           formalData.push(item.total)
        })
        return formalData;
      }
    },
    watch: {
      activeData (val) {
        this.getdata  = val
        this.fetchData()
      }
    }

};
</script>
