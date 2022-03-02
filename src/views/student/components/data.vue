<template>
       <div style="width:1000px;height:500px;" id="dataStudent"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'dataStudent',
    props:["myValue","schoolValue","maxValue"],
    watch: {
      maxValue (val) {
        this.maxValue2  = val
        this.fetchData()
      },
      myValue (val) {
        this.myValue2  = val
        this.fetchData()
      },
      schoolValue (val) {
        this.schoolValue2  = val
        this.fetchData()
      }
    },
    mounted () {
        this.fetchData()
    },
    data(){
        return{
          maxValue2:this.maxValue,
          myValue2:this.myValue,
          schoolValue2:this.schoolValue,
        }
    },
    methods:{
          fetchData(){
           const option = {
    title: {
        text: ''
    },
    tooltip: {},
    legend: {
        data: ['用户个人能力', '学校平均能力']
    },
    radar: {
        // shape: 'circle',
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
           }
        },
        indicator: this.maxValue
    },
    series: [{
        name: 'xxx',
        type: 'radar',
        // areaStyle: {normal: {}},
        data : [
            {
                value : this.myValue,
                name : '用户个人能力'
            },
             {
                value : this.schoolValue,
                name : '学校平均能力'
            }
        ]
    }]
};


        const dataStudent = echarts.init(document.getElementById('dataStudent'));
        dataStudent.setOption(option);

        window.addEventListener('resize', function () {
            dataStudent.resize();
        });
        }
    }
};
</script>
