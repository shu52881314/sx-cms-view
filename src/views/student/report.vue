
<template>

  <div >
    <p class="xinxitou">成绩单</p>
    <ul  class="tou" style=" margin-bottom: 19px; padding-bottom: 19px; border-bottom: 1px solid rgb(190, 224, 247);">
      <li >
        <img :src="infodata.avatar" alt="" style="width: 96px;height: 96px;border-radius: 50%;display: block">
      </li>
      <li style="width: 820px; margin-left: 32px;">
        <p style="margin-top: 10px">
          <span style="width: 270px;display: inline-block">姓名: {{infodata.name}} </span>
          <span style="width: 270px;display: inline-block">学号:  {{infodata.code}}</span>
          <span style="width: 270px;display: inline-block">年级:  {{infodata.gradeName}}</span>
        </p>
        <p style="margin-top: 30px">
          <span style="width: 270px;display: inline-block">所在院系:  {{infodata.collegeName}}</span>
          <span style="width: 270px;display: inline-block">专业: {{infodata.majorName}}</span>
          <span style="width: 270px;display: inline-block">班级:  {{infodata.className}}</span>
        </p>
      </li>
    </ul>
    <div id="container" style="height:500px"></div>
    <div style="position: relative;margin-top: 10px">
      <div id="container1" style="height:325px"></div>
      <div class="zcj"  >
        <p style="font-size: 20px">{{cycj}}</p>
        <p style="font-size: 18px; margin-top: 5px;">{{hoursUnit}}</p>
      </div>
    </div>
    <div style="position: relative;margin-top: 10px">
      <div id="container2" style="height:325px"></div>
      <div class="zcj">
        <p style="font-size: 20px">{{sbcj}}</p>
        <p style="font-size: 18px;  margin-top: 5px;">{{hoursUnit}}</p>
      </div>
    </div>
    <div>
      <div id="container3" style="height:325px"></div>
    </div>
    <div>
      <div id="container4" style="height:325px"></div>
    </div>
    <p class="xinxitou">明细</p>
    <el-form size="mini" :inline="true" class="demo-form-inline" style="width: 98%;display: block; margin: 0 auto;">
      <el-form-item label="学年">
        <el-select clearable v-model="params.yearId" placeholder="请选择学年" @change="huoquxq">
          <el-option v-for="option in optionyearId" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期">
        <el-select clearable v-model="params.semesterId" placeholder="请选择学期">
          <el-option v-for="option in optionsemester" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select clearable  filterable  v-model="params.classId" placeholder="请选择分类">
          <el-option v-for="option in optionclassify" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select clearable v-model="params.type" placeholder="请选择类型">
          <el-option v-for="option in optiontype" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源">
        <el-select clearable v-model="params.sourceType" placeholder="请选择来源">
          <el-option v-for="option in optionsource" :key="option.id" :label="option.name" :value="option.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="main-body cjd" style="padding-bottom: 60px">
      <el-table border v-if="loading" :data="tableData"  stripe size="mini" style="width: 100%">
        <el-table-column prop="yearName" label="学年" ></el-table-column>
        <el-table-column prop="semesterName" label="学期" ></el-table-column>
        <el-table-column prop="itemName" label="活动/项目名称" width="300"></el-table-column>
        <el-table-column prop="creditType" label="类型" ></el-table-column>
        <el-table-column prop="className" label="所属分类" ></el-table-column>
        <el-table-column prop="score" :label="hoursUnits" ></el-table-column>
        <el-table-column label="发放时间" width="130" >
          <template slot-scope="scope">
            <span >{{scope.row.sendTime | formatDate}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注"  ></el-table-column>

        <el-table-column prop="sourceType" label="来源" ></el-table-column>
      </el-table>
      <qu-pagination :total="total" @change="changePage"></qu-pagination>
    </div>
  </div>

</template>

<script>

  export default {
    name:'report',

    data() {
      return {
        infodata:{},
        loading:false,
        tableData: [],
        total: 0,
        rowIndex: "-1",
        OrderIndexArr: [],
        semesterNameArr: [],
        params:{
          userid:this.$route.query.id,
          yearId:'',
          semesterId:'',
          classId:'',
          sourceType:'',
          type:'',
          size: 10,
          current: 1,
        },
        optionsemester:[],
        optionclassify:[],
        optionyearId:[],
        optionsource:[
          {id:'1',name:'自主获得'},
          {id:'2',name:'后台导入'},
          {id:'3',name:'历史数据'},
        ],
        optiontype:[
          {id:'1',name:'活动'},
          {id:'2',name:'项目'},
          {id:'3',name:'奖惩'},

        ],
        cycj:'',
        sbcj:'',
        hoursUnit:'',
        hoursUnits:localStorage.getItem("hoursUnit"),
        option :{
          title: {
            text: '获得总'+localStorage.getItem("hoursUnit")
          },

          legend: {
            data: ['成员分值', '学校平均分']
          },
          radar: {
            center: ['50%', '55%'],
            name: {
              textStyle: {
                color: '#000',
                backgroundColor: '#fff',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: []
          },
          series: [{

            type: 'radar',


            data: [
              {
                areaStyle: {
                  normal: {
                    color: 'rgba(222, 84, 103, 0.8)' // 选择区域颜色
                  }
                },

                value: [],
                name: '成员分值'
              },
              {
                areaStyle: {
                  normal: {
                    color: 'rgba(69, 142, 247, 0.8)' // 选择区域颜色
                  }
                },
                value: [],
                name: '学校平均分'
              }
            ]
          }]
        },
        option1 : {
          title: {
            text: '参与活动'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top:50,
            data: []
          },
          series: [

            {
              name: '参与活动',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {

                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },

                  b: {
                    fontSize: 16,
                    lineHeight: 34
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: [

              ]
            }
          ]
        },
        option2 : {
          title: {
            text: '申报项目'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top:50,
            data: []
          },
          series: [

            {
              name: '申报项目',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {

                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },

                  b: {
                    fontSize: 16,
                    lineHeight: 34
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: [

              ]
            }
          ]
        },
        option3: {
          title: {
            text: '加分项',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top:50,
            data: []
          },
          series: [
            {
              name: '加分项',
              type: 'pie',
              radius: '55%',
              // center: ['40%', '55%'],
              label: {
                formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {

                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },

                  b: {
                    fontSize: 16,
                    lineHeight: 34
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        option4: {
          title: {
            text: '减分项',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top:50,
            data: []
          },
          series: [
            {
              name: '减分项',
              type: 'pie',
              radius: '55%',
              // center: ['40%', '55%'],
              label: {
                formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {

                  // abg: {
                  //     backgroundColor: '#333',
                  //     width: '100%',
                  //     align: 'right',
                  //     height: 22,
                  //     borderRadius: [4, 4, 0, 0]
                  // },

                  b: {
                    fontSize: 16,
                    lineHeight: 34
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }

    }
    },
    mounted(){
      this.studentlist()
      this.getstucred()
      this.getxuenian()

      this.getfenlei()
      this.fetch()
    },
    methods:{
      search() {
        this.params.current = 1
        this.fetch()
      },
      fetch() {
        this.loading = false
        this.$http.get('/school/getstucreditdetail', {params: this.params}).then(res => {
          this.tableData =[]
            this.tableData = res.data.list
          this.total = res.data.total
         // this. OrderIndexArr=[]
         //  this.semesterNameArr= []
          // if(this.tableData.length>0){
          //   this.merge()
          // }

          this.loading =true

        })
      },
      studentlist() {

        this.$http.get('/school/getstudentinfo',{params: {userid:this.$route.query.id}}).then(res => {
        this.infodata=res.data
        })
      },
      huoquxq(val){
        this.params.semesterId=''
        if(val){
          this.getxueqi(val)
        }

      },
      getxueqi(id) {

        this.$http.get('/system/getschoolyeartearms',{params:{id:id}}).then(res => {

        this.optionsemester=res.data
        })
      },
      getxuenian() {

        this.$http.get('/system/getschoolyear').then(res => {
        this.optionyearId=res.data
        })
      },
      getfenlei() {

        this.$http.get('/activity/classifies/list').then(res => {

        this.optionclassify=res.data
        })
      },
      getstucred() {

        this.$http.get('/school/getstucreditstatistics',{params: {userid:this.$route.query.id}}).then(res => {
          let num=0
          let num2=0
          for (var i = 0; i < res.data.length; i++) {

            var s = {
              name: res.data[i].classifyName,
              max: res.data[i].classifySumHours,

            }
            this.option.radar.indicator.push(s)
            // console.log(this.option.series[0].data)
            this.option.series[0].data[0].value.push(res.data[i].classifyHours)
            this.option.series[0].data[1].value.push(res.data[i].average)
            var s1 = {
              name: res.data[i].classifyName,
              value: res.data[i].classActHours.toFixed(2),

            }
            this.option1.legend.data.push(res.data[i].classifyName)
            this.option1.series[0].data.push(s1)
            var s2 = {
              name: res.data[i].classifyName,
              value: res.data[i].classProHours.toFixed(2),
            }
            var s3 = {
              name: res.data[i].classifyName,
              value: res.data[i].classAwardHours.toFixed(2),
            }
            var s4 = {
              name: res.data[i].classifyName,
              value: res.data[i].classDeductionHours.toFixed(2),
            }
            this.option2.legend.data.push(res.data[i].classifyName)
            this.option2.series[0].data.push(s2)
            this.option3.legend.data.push(res.data[i].classifyName)
            this.option3.series[0].data.push(s3)
            this.option4.legend.data.push(res.data[i].classifyName)
            this.option4.series[0].data.push(s4)
            num+=res.data[i].classActHours
            num2+=res.data[i].classProHours

          }
          this.cycj=num.toFixed(2)
          this.sbcj=num2.toFixed(2)
          this.hoursUnit=localStorage.getItem("hoursUnit")

          this.container = this.$echarts.init(document.getElementById("container"));
          this.container.setOption(this.option);


          this.container1 = this.$echarts.init(document.getElementById("container1"));
          this.container1.setOption(this.option1);
          this.container2 = this.$echarts.init(document.getElementById("container2"));
          this.container2.setOption(this.option2);
          this.container3 = this.$echarts.init(document.getElementById("container3"));
          this.container3.setOption(this.option3);
          this.container4 = this.$echarts.init(document.getElementById("container4"));
          this.container4.setOption(this.option4);
        })
      },
      changePage(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetch()


      },
      // merge() {
      //   let OrderObj = {};
      //   let semesterNameObj = {};
      //   this.tableData.forEach((element, index) => {
      //     element.rowIndex = index;
      //     if (OrderObj[element.yearName]) {
      //       let nextItem = this.tableData[index + 1]
      //         ? this.tableData[index + 1].yearName
      //         : undefined;
      //       let prevItem = this.tableData[index - 1].yearName
      //         ? this.tableData[index - 1].yearName
      //         : undefined;
      //       let nextPro = this.tableData[index + 1]
      //         ? this.tableData[index + 1].semesterName
      //         : undefined;
      //       let prevPro = this.tableData[index - 1].semesterName
      //         ? this.tableData[index - 1].semesterName
      //         : undefined;
      //       // if (element.yearName == nextItem) {
      //       //   OrderObj[element.yearName].push(index);
      //       // } else if (element.yearName == prevItem) {
      //       //   OrderObj[element.yearName].push(index);
      //       // }
      //       if (element.semesterName == nextPro && element.yearName == nextItem ) {
      //         OrderObj[element.yearName].push(index);
      //         semesterNameObj[element.semesterName].push(index);
      //
      //       } else if (element.yearName == prevItem && element.semesterName == prevPro) {
      //         semesterNameObj[element.semesterName].push(index);
      //         OrderObj[element.yearName].push(index);
      //       }
      //     } else {
      //       OrderObj[element.yearName] = [];
      //       OrderObj[element.yearName].push(index);
      //       semesterNameObj[element.semesterName] = [];
      //       semesterNameObj[element.semesterName].push(index)
      //     }
      //
      //     // console.log(this.tableData[index + 1].yearName)
      //
      //     // if (semesterNameObj[element.semesterName]) {
      //     //   let nextPro = this.tableData[index + 1]
      //     //     ? this.tableData[index + 1].semesterName
      //     //     : undefined;
      //     //   let prevPro = this.tableData[index - 1].semesterName
      //     //     ? this.tableData[index - 1].semesterName
      //     //     : undefined;
      //     //
      //     //   if (element.semesterName == nextPro ) {
      //     //     semesterNameObj[element.semesterName].push(index);
      //     //   } else if (element.semesterName == prevPro ) {
      //     //     semesterNameObj[element.semesterName].push(index);
      //     //   }
      //     // } else {
      //     //   semesterNameObj[element.semesterName] = [];
      //     //   semesterNameObj[element.semesterName].push(index);
      //     // }
      //
      //   });
      //
      //   // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      //   for (let k in OrderObj) {
      //     if (OrderObj[k].length > 1) {
      //       this.OrderIndexArr.push(OrderObj[k]);
      //     }
      //   }
      //
      //   for (let i in semesterNameObj) {
      //     if (semesterNameObj[i].length > 1) {
      //       this.handleData(semesterNameObj[i])
      //     }
      //   }
      //
      // },
      // handleData(data){
      //   // console.log(data,'data');
      //   let temp = data;
      //   let itemArr = [];
      //   let itemArrNew = [];
      //   let resArr = [];
      //   if (data.length>2) {
      //     for (let i = 0; i < data.length; i++) {
      //       if (data[i+1]) {
      //         if (data[i+1] - data[i] > 1) {
      //           itemArr = data.slice(0,i+1)
      //           itemArrNew = temp.slice(i+1,temp.length)
      //           break;
      //         }else{
      //           resArr = data
      //         }
      //       }
      //     }
      //     if (itemArr.length>0 || itemArrNew.length>0) {
      //       this.semesterNameArr.push(itemArr)
      //       this.semesterNameArr.push(itemArrNew)
      //     }else{
      //       this.semesterNameArr.push(data)
      //     }
      //   }else{
      //     this.semesterNameArr.push(data)
      //   }
      // },
      // objectSpanMethod({ row, rowIndex, column, columnIndex }) {
      //   if (columnIndex === 0) {
      //     for (let i = 0; i < this.OrderIndexArr.length; i++) {
      //       let element = this.OrderIndexArr[i];
      //       for (let j = 0; j < element.length; j++) {
      //         let item = element[j];
      //         if (rowIndex === item) {
      //           if (j === 0) {
      //             return {
      //               rowspan: element.length,
      //               colspan: 1
      //             };
      //           } else if (j !== 0) {
      //             return {
      //               rowspan: 0,
      //               colspan: 0
      //             };
      //           }
      //         }
      //       }
      //     }
      //   }
      //   if (columnIndex === 1) {
      //     for (let j = 0; j < this.semesterNameArr.length; j++) {
      //       let element = this.semesterNameArr[j];
      //       for (let k = 0; k < element.length; k++) {
      //         let item = element[k];
      //         if (rowIndex === item) {
      //           if (k === 0) {
      //             return {
      //               rowspan: element.length,
      //               colspan: 1
      //             };
      //           } else if (k !== 0) {
      //             return {
      //               rowspan: 0,
      //               colspan: 0
      //             };
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
</script>
<style>

</style>
<style scoped>

  @media screen and (min-width: 1600px) {
    .zcj{
      left:772px!important;
    }
  }

  .zcj{
    width: 128px;
    position: absolute;
    top: 139px;
    left: 532px;
    text-align: center;
  }


  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }
  .tou{
    overflow: hidden;
  }
  .tou li{
    float: left;
  }


</style>
