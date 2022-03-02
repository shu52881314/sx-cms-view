<template>
  <div style="width:1000px;height:500px;" id="dataCore"></div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    name: 'dataCore',
    props:["maxCoreValue","myCoreValue"],
    data() {
      return {
        maxValue2:this.maxCoreValue,
        myValue2:this.myCoreValue,
      }
    },
    watch: {
      maxCoreValue (val) {
        this.maxValue2  = val
        this.fetchData()
      },
      myCoreValue (val) {
        this.myValue2  = val
        this.fetchData()
      }
    },
    mounted () {
       this.fetchData()
    },
    methods:{
      fetchData(){
        const option = {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: ['学生个人能力值']
          },
          radar: {
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: this.maxCoreValue
          },
          series: [{
            name: 'xxx',
            type: 'radar',
            data : [
              {
                value : this.myCoreValue,
                name : '学生个人能力值'
              }
            ]
          }]
        };
        const dataStudent = echarts.init(document.getElementById('dataCore'));
        dataStudent.setOption(option);
        window.addEventListener('resize', function () {
          dataStudent.resize();
        });
      }
    }
  };
</script>
