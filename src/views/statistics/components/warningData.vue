<template>
  <div style="height:500px;" id="dataStudent"></div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    name: 'dataStudent',
    props:["showData","classifyData","valueData1","valueData2","valueData3","valueData4","valueData5","valueData6","valueData7","valueData8","valueData9"],
    watch: {
      showData (val) {
        this.showData2  = val
        this.fetchData()
      },
      classifyData (val) {
        this.classifyData2  = val
        this.fetchData()
      },
      valueData1 (val) {
        this.valueData12  = val
        this.fetchData()
      },
      valueData2(val) {
        this.valueData22  = val
        this.fetchData()
      },
      valueData3 (val) {
        this.valueData32  = val
        this.fetchData()
      },
      valueData4 (val) {
        this.valueData42  = val
        this.fetchData()
      },
      valueData5 (val) {
        this.valueData52  = val
        this.fetchData()
      },
      valueData6 (val) {
        this.valueData62  = val
        this.fetchData()
      },
      valueData7 (val) {
        this.valueData72  = val
        this.fetchData()
      },
      valueData8 (val) {
        this.valueData82  = val
        this.fetchData()
      },
      valueData9 (val) {
        this.valueData92  = val
        this.fetchData()
      }
    },
    mounted () {
      this.fetchData()
    },
    data(){
      return{

      }
    },
    methods:{
      fetchData(){
        const option =  {
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data:this.showData
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : this.classifyData,
            axisLabel:{
                interval:0,
                  rotate:30,//倾斜度 -90 至 90 默认为0
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
              name:this.showData[0],
              type:'bar',
              stack: this.showData[0],
              itemStyle:{
                normal:{
                  color: '#0033ff'
                }
              },
              data:this.valueData1
            },
            {
              name:this.showData[1],
              type:'bar',
              stack:this.showData[0],
              itemStyle:{
                normal:{
                  color: '#0099ff'
                }
              },
              data:this.valueData2
            },
            {
              name:this.showData[2],
              type:'bar',
              stack: this.showData[0],
              itemStyle:{
                normal:{
                  color: '#00ccff'
                }
              },
              data:this.valueData3
            },
            {
              name:this.showData[3],
              type:'bar',
              stack: this.showData[2],
              itemStyle:{
                normal:{
                  color: '#ff3300'
                }
              },
              data:this.valueData4
            },
            {
              name:this.showData[4],
              type:'bar',
              stack: this.showData[2],
              itemStyle:{
                normal:{
                  color: '#ff9900'
                }
              },
              data:this.valueData5
            },
            {
              name:this.showData[5],
              type:'bar',
              stack: this.showData[2],
              itemStyle:{
                normal:{
                  color: '#ffff00'
                }
              },
              data:this.valueData6
            },
            {
              name:this.showData[6],
              type:'bar',
              stack: this.showData[5],
              itemStyle:{
                normal:{
                  color: '#55c023'
                }
              },
              data:this.valueData7
            },
            {
              name:this.showData[7],
              type:'bar',
              stack: this.showData[5],
              itemStyle:{
                normal:{
                  color: '#8ad955'
                }
              },
              data:this.valueData8
            },
            {
              name:this.showData[8],
              type:'bar',
              stack: this.showData[5],
              itemStyle:{
                normal:{
                  color: '#abf682'
                }
              },
              data:this.valueData9
            }
          ]
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
