<template>
       <div style="width:100%;height:100%;" id="addactivity"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'addactivity',
    props:[
      "topactivity"
    ],
    data(){
      return{
        getdata:this.topactivity
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
           formalData.push(item.value)
        })
        return formalData;
      }
    },
    mounted () {
      this.fetchData();
    },
    methods:{
      fetchData(){

        const option = {

          grid: {
               top:'3%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  data :this.formalData
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'邮件营销',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:this.formalToal
              }
          ]
      };
      const addactivity = echarts.init(document.getElementById('addactivity'));
      addactivity.setOption(option);
      window.addEventListener('resize', function () {
          addactivity.resize();
      });

      }
    },
    watch: {
      topactivity (val) {
        this.getdata  = val
        this.fetchData()
      }
    }



};
</script>
