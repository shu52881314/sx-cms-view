<template>
  <div style="background:#1f1e1e12">

    <div style="float: left" class="titles backshadow">
      <div class="work-header" style="padding:0 10px">
        <span style="font-weight: bold;">全部数据</span>
      </div>
      <el-row style="margin-bottom: 1rem">
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs1">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.studentCount" :times="15" :speed="50" /></span>
              <p class="icon-title">学生总数</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs2">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.operatorCount" :times="14" :speed="50" /></span>
              <p class="icon-title">教师总数</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs3">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.organizationCount" :times="13" :speed="50" /></span>
              <p class="icon-title">团学组织</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs4">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.activityCount" :times="12" :speed="50" /></span>
              <p class="icon-title">活动数量</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 1.5rem;">
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs5">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.activityEnrollCount" :times="11" :speed="50" /></span>
              <p class="icon-title">活动参与人次</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs6">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.hoursApplyCount" :times="10" :speed="50" /></span>
              <p class="icon-title">自主申报</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs7">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.progressingCount" :times="10" :speed="50" /></span>
              <p class="icon-title">进行中活动</p>
            </div>
          </div>
        </el-col>
        <el-col class="span24 index-flex el_col_sty">
          <div class="homebackimgs2">
            <div class="bg-green bg-icon">
              <span class="fontf">
                <vns :start="0" :end="statisticsInfo.waitStartCount" :times="10" :speed="50" /></span>
              <p class="icon-title">待开始活动</p>
            </div>
          </div>
        </el-col>

      </el-row>
    </div>

    <div style="width: 40%;float: right" class="titles backshadow">
      <div class="work-header" style="padding:0 10px">
        <span style="font-weight: bold;">审核通知</span>
      </div>
      <el-row>
        <el-col class="span24 index-flex">
          <div style="max-width: 100%;min-height: 100px" class="homebackimgs8 xx">
            <div class="bg-green bg-icon tips-tips">
              <p class="icon-title">待审活动</p>
              <span style="margin-left:8rem;" class="fontf">
                <vns :start="0" :end="statisticsInfo.waitAuditCount" :times="10" :speed="50" /></span>

            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="span24 index-flex">
          <div style="max-width: 100%;min-height: 100px" class="homebackimgs9 xx">
            <div class="bg-green bg-icon tips-tips">
              <p class="icon-title">待审组织</p>
              <span style="margin-left:8rem;" class="fontf">
                <vns :start="0" :end="statisticsInfo.waitAuditOrgCount" :times="10" :speed="50" /></span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="span24 index-flex">
          <div style="max-width: 100%;min-height: 100px" class="homebackimgs10 xx">
            <div class="bg-green bg-icon tips-tips">
              <p class="icon-title">待审申报</p>
              <span style="margin-left:8rem;" class="fontf">
                <vns :start="0" :end="statisticsInfo.waitAuditProjectCount" :times="10" :speed="50" /></span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>


    <div style="padding:1rem;display: flex;flex-direction: column;width: 98%" class="titles backshadow">
      <div class="work-header" style="padding:0 10px">
        <span style="font-weight: bold;">最近活动及活跃组织</span>
      </div>
      <el-row>
        <el-col :span="12" class="span12 index-flex">
          <div style="max-width: 95%;" class="homebackimgs11">
            <div class="bg-green bg-icon tips-tips">
              <div style="margin-left: 1rem;line-height: 3rem">
                <p style="font-size: 1.6rem" class="icon-title">最近两周活动数</p>
                <p style="font-size: 1rem" class="icon-title">最近两月活动数 {{statisticsInfo.monthActCount}}</p>
              </div>

              <span style="margin-left:8rem;font-size: 2.5rem" class="fontf">
                <vns :start="0" :end="statisticsInfo.weekActCount" :times="10" :speed="50" /></span>

            </div>
          </div>
        </el-col>
        <el-col :span="12" class="span12 index-flex">
          <div style="max-width: 95%;" class="homebackimgs12">
            <div class="bg-green bg-icon tips-tips">
              <div style="margin-left: 1rem;line-height: 3rem">
                <p style="font-size: 1.6rem" class="icon-title">最近两周活跃组织</p>
                <p style="font-size: 1rem" class="icon-title">最近两月活跃组织 {{statisticsInfo.monthActiveActCount}}</p>
              </div>
              <span style="margin-left:8rem;font-size: 2.5rem" class="fontf">
                <vns :start="0" :end="statisticsInfo.weekActiveActCount" :times="10" :speed="50" /></span>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>


    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      <!--趋势分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">活动分类占比</span>
          </div>
          <div class="work-body">
            <div id="container3" style="height:325px"></div>
          </div>
        </div>
      </el-col>
      <!--来源分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">活动类型占比</span>
          </div>
          <div class="work-body">
            <div id="container4" style="height:300px"></div>
          </div>
        </div>
      </el-col>
    </el-row>


    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      <!--趋势分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">活动模式占比</span>
          </div>
          <div class="work-body">
            <div id="container5" style="height:325px"></div>
          </div>
        </div>
      </el-col>
      <!--来源分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">全校学生总数与团员数占比</span>
          </div>
          <div class="work-body">
            <div id="container6" style="height:300px"></div>
          </div>
        </div>
      </el-col>
    </el-row>


    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      <!--趋势分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">项目分类获奖人数占比</span>
          </div>
          <div class="work-body">
            <div id="container7" style="height:325px"></div>
          </div>
        </div>
      </el-col>
      <!--来源分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">各年级学生总数与团员数占比图</span>
            <el-select @change="schoolPkStudentsGrades" clearable v-model="params.grade" placeholder="请选择年级">
              <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="work-body">
            <div id="container8" style="height:300px"></div>
          </div>
        </div>
      </el-col>
    </el-row>


    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      <!--趋势分析-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" class="span24 backshadow">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">活动态势图</span>
            <el-select @change="orgTopTenOfLine" clearable v-model="params.year" placeholder="请选择学年">
              <el-option v-for="item in years" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="work-body">
            <div id="container9" style="height:325px"></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;    padding-bottom: 60px;">
      <!--团学组织活跃度Top10-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" class="span24 backshadow">
        <div>
          <div class="work-header">
            <span style="font-weight: bold;">团学组织活跃度Top10</span>
          </div>
          <div style="height: auto;" class="work-body">
            <el-table :data="topTenData" style="width: 100%">
              <el-table-column type="index" label="排名" width="180">
              </el-table-column>
              <el-table-column prop="name" label="团学组织名称" width="180">
              </el-table-column>
              <el-table-column prop="className" label="类别">
              </el-table-column>
              <el-table-column prop="actNum" label="发布活动总数">
              </el-table-column>
              <el-table-column prop="peopleNum" label="参与总人次">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--<el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      &lt;!&ndash;趋势分析&ndash;&gt;
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow" style="width:100%">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">活动数据</span>
            <span>仅显示7天数据</span>
          </div>
          <div class="work-body">
            <div id="container" style="height:325px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
      &lt;!&ndash;来源分析&ndash;&gt;
      <el-col :xs="24" :sm="24" :md="24" :lg="12" class="span24 backshadow" style="width:100%">
        <div class="h358">
          <div class="work-header">
            <span style="font-weight: bold;">发布活动院系排行</span>
            <span>最多只展示10个院系</span>
          </div>
          <div class="work-body">
            <div id="container2" style="height:325px"></div>
          </div>
        </div>
      </el-col>
    </el-row>-->

    <!-- <el-row :gutter="24" style="margin-left: 0px; margin-right: 0px;">
       &lt;!&ndash;趋势分析&ndash;&gt;
       <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 backshadow" style="/*width:100%*/">
         <div class="h358">
           <div class="work-header">
             <span style="font-weight: bold;">活动实时数据查看</span>
           </div>
           <div class="main-body">
             <el-table v-loading="loading1" :data="activelists" stripe size="mini" style="width: 100%" height='289'>
               <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
               <el-table-column prop="status" :formatter="formatterStatus" label="活动状态"></el-table-column>
               <el-table-column prop="enrollCount" label="报名人数" width="160" show-overflow-tooltip></el-table-column>
             </el-table>
           </div>
         </div>
       </el-col>
       &lt;!&ndash;来源分析&ndash;&gt;
       &lt;!&ndash;      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 backshadow">&ndash;&gt;
       &lt;!&ndash;        <div class="h358">&ndash;&gt;
       &lt;!&ndash;          <div class="work-header">&ndash;&gt;
       &lt;!&ndash;            <span style="font-weight: bold;">教师指导活动课时</span>&ndash;&gt;
       &lt;!&ndash;          </div>&ndash;&gt;
       &lt;!&ndash;          <div class="main-body"    >&ndash;&gt;
       &lt;!&ndash;            <el-table v-loading="loading2" :data="guideHour" stripe size="mini" style="width: 100%" height='289'  >&ndash;&gt;
       &lt;!&ndash;              <el-table-column label="排序" width="50">&ndash;&gt;
       &lt;!&ndash;                <template slot-scope="scope">&ndash;&gt;
       &lt;!&ndash;                  <span v-if="scope.$index == 0 || scope.$index == 1 || scope.$index == 2"&ndash;&gt;
       &lt;!&ndash;                        style="color: #FEA24E;font-weight: bold;"> No.{{scope.$index+1}}</span>&ndash;&gt;
       &lt;!&ndash;                  <span v-else>{{scope.$index+1}}</span>&ndash;&gt;
       &lt;!&ndash;                </template>&ndash;&gt;
       &lt;!&ndash;              </el-table-column>&ndash;&gt;
       &lt;!&ndash;              <el-table-column prop="teacherName" label="教师名称" show-overflow-tooltip></el-table-column>&ndash;&gt;
       &lt;!&ndash;              <el-table-column prop="organizationName" label="行政机构名称	" show-overflow-tooltip></el-table-column>&ndash;&gt;
       &lt;!&ndash;              <el-table-column prop="guidanceHours" label="指导总学时" width="160" show-overflow-tooltip></el-table-column>&ndash;&gt;
       &lt;!&ndash;              &lt;!&ndash;  <el-table-column prop="guidanceHours" :label=" '指导总' + hoursUnit" width="160" show-overflow-tooltip></el-table-column>&ndash;&gt;&ndash;&gt;
       &lt;!&ndash;            </el-table>&ndash;&gt;
       &lt;!&ndash;          </div>&ndash;&gt;
       &lt;!&ndash;        </div>&ndash;&gt;
       &lt;!&ndash;      </el-col>&ndash;&gt;
       &lt;!&ndash;指导老师活跃度&ndash;&gt;
       <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 backshadow">
         <div class="h358">
           <div class="work-header">
             <span style="font-weight: bold;">指导老师活跃度</span>
           </div>
           <div class="main-body">
             <el-table v-loading="loading3" :data="toauditcountlist" stripe size="mini" style="width: 100%" height='298'
                       class="zd">
               <el-table-column label="排序" width="50">
                 <template slot-scope="scope">
                   <span>{{scope.$index+1}}</span>
                 </template>
               </el-table-column>
               <el-table-column prop="name" label="教师名称" show-overflow-tooltip></el-table-column>
               <el-table-column prop="codeid" label="教师工号" show-overflow-tooltip></el-table-column>
               <el-table-column prop="audit" label="活动审核数" show-overflow-tooltip></el-table-column>
               <el-table-column prop="wanjie" label="完结审核数" width="160" show-overflow-tooltip></el-table-column>
             </el-table>
           </div>
         </div>
       </el-col>
     </el-row>-->
  </div>
</template>

<script>
  import axios from 'axios'
  import vns from 'vue-number-scroll'

  export default {
    components: {
      vns
    },
    data() {
      return {
        topTenData: [],
        showSetCharge: false,
        hoursUnit: localStorage.getItem("hoursUnit"),
        statisticsInfo: '',
        activelists: [],
        loading1: true,
        guideHour: [],
        loading2: true,
        params: {
          grade: '',
          year: ''
        },
        toauditcountlist: [],
        grades: [],
        years: [],
        loading3: true,
        current: 1,
        size: 10,
        total: '',
        //一周活动数量
        option: {
          //渐变色后期修改
          //	    		color:[this.$echarts.graphic.LinearGradient(
          //	                        0, 0, 0, 1,
          //	                        [
          //	                            {offset: 0, color: '#68aaff'},
          //	                            {offset: 0.5, color: '#5e9aff'},
          //	                            {offset: 1, color: '#4c7bff'}
          //	                        ]
          //	                    ),this.$echarts.graphic.LinearGradient(
          //	                        0, 0, 0, 1,
          //	                        [
          //	                            {offset: 0, color: '#ffac46'},
          //	                            {offset: 0.5, color: '#ff9c2c'},
          //	                            {offset: 1, color: '#fe8c11'}
          //	                        ]
          //	                    )],
          color: ['#4c7bff', '#fe8c11'],
          tooltip: {
            trigger: 'axis',
            axisTick: {
              show: true
            },
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['待审核活动', '进行中活动']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['bar', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            data: []
          }],
          yAxis: [{
            type: 'value'
          }],
          grid: {
            x: 15,
            x2: 15,
          },
          series: [{
              name: '待审核活动',
              type: 'bar',
              barGap: 0,
              data: []
            },
            {
              name: '进行中活动',
              type: 'bar',
              barGap: 0,
              data: []
            },

          ]
        },
        option2: {
          color: ['#4c7bff', '#fe8c11'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['bar', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            x: 25,
            x2: 15,
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: []
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              type: 'line',
              data: []
            },

          ]
        },
        option3: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // top: 'middle',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动分类占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },

        option4: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // top: 'middle',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动类型占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },
        option5: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // top: 'middle',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动分类占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },
        option6: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // top: 'middle',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动分类占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },
        option7: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // top: 'middle',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动分类占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },
        option8: {
          color: ['#fe8d12', '#4d7cff', '#1cbcb2', '#0bc9ff', '#ea5a7d', '#fe69bd', '#f3899f', '#86c8de', '#899cfb',
            '#87b7e8', '#2beafd', '#ffb5cd', '#57d994', '#00a8ff'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: 0,
            top: 20,
            bottom: 20,
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + "...") : name);
            },
            data: []
          },
          series: [{
            name: '活动分类占比',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['30%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        },
        option9: {
          tooltip: {
            trigger: 'axis',
            position: function(pt) {
              return [pt[0], '100%'];
            }
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
          }, {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [{
            name: '值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(255, 158, 68)'
            },
            areaStyle: {
              color: ''
            },
            data: []
          }]
        }
      }
    },
    createChart() { //构造图表
      //
    },
    created() {

      if (localStorage.getItem("IsfirstLogin") && localStorage.getItem("IsfirstLogin") != 0) {
        this.showSetCharge = true
      } else {
        this.showSetCharge = false
      }

    },
    methods: {
      beforeRoleCloseSetCharge() {
        localStorage.setItem("IsfirstLogin", 0)
      },
      formatterStatus(row, column, cellValue) {

        if (cellValue == 1 || cellValue == 2 || cellValue == 3) {
          return "审核中"
        } else if (cellValue == 4) {
          return "被驳回"
        } else if (cellValue == 5) {
          return "报名中"
        } else if (cellValue == 6) {
          return "待开始"
        } else if (cellValue == 7) {
          return "进行中"
        } else if (cellValue == 8) {
          return "待完结"
        } else if (cellValue == 9) {
          return "完结审核中"
        } else if (cellValue == 10) {
          return "完结被驳回"
        } else if (cellValue == 11) {
          return "已完结"
        } else if (cellValue == 12) {
          return "已完结"
        } else {
          return "其他"
        }


      },
      statisticsinfo() {
        var that = this
        this.$http.get('/index/statistics/info').then(res => {
          if (res.code == 200) {
            that.statisticsInfo = res.data
          }
        })
      },
      activelist() {
        var that = this
        this.$http.get('/index/activity/list').then(res => {
          if (res.code == 200) {
            that.activelists = res.data
            that.loading1 = false
          }
        })
      },
      toauditcount() {
        this.$http.get('/activity/to-audit-count', {
          params: {
            current: this.current,
            size: this.size,
            usercode: '',
          }
        }).then(res => {
          if (res.code == 200) {

            this.total = res.data.total
            if (this.current == 1) {
              this.toauditcountlist = res.data.list
            } else {
              for (let i = 0; i < res.data.list.length; i++) {
                this.toauditcountlist.push(res.data.list[i])
              }

            }

            this.loading3 = false
          }
        })
      },
      guideHours() {
        var that = this
        this.$http.get('/index/operator/guideHours').then(res => {
          if (res.code == '200') {
            that.guideHour = res.data.sort(that.createComprisonFunction('guidanceHours')).reverse()
            that.loading2 = false
          }
        })
      },
      createComprisonFunction(propertyName) {
        return function(object1, object2) {
          var value1 = object1[propertyName];
          var value2 = object2[propertyName];

          if (value1 < value2) {
            return -1;
          } else if (value1 > value2) {
            return 1;
          } else {
            return 0;
          }
        }
      },
      //一周活动数量
      activitycount() {
        var that = this
        this.$http.get('/index/week/activity/count').then(res => {
          if (res.code == '200') {
            for (var i = 0; i < res.data.length; i++) {
              that.option.xAxis[0].data.push(res.data[i].dateTime)
              that.option.series[0].data.push(res.data[i].waitAuditCount)
              that.option.series[1].data.push(res.data[i].progressingCount)
            }
            that.container = that.$echarts.init(document.getElementById("container"));
            that.container.setOption(that.option);
          }
        })
      },
      //发布活动院系排行
      collegeactivitylist() {
        var that = this
        this.$http.get('/college/activity/list').then(res => {
          if (res.code == '200') {
            for (var i = 0; i < res.data.length; i++) {
              that.option2.xAxis[0].data.push(res.data[i].name)
              that.option2.series[0].data.push(res.data[i].activityCount)
            }
            that.container2 = that.$echarts.init(document.getElementById("container2"));
            that.container2.setOption(that.option2);
          }
        })
      },
      //活动分类占比
      activityclassifylists() {
        var that = this
        this.$http.get('/activity/classify/lists').then(res => {
          if (res.code == '200') {
            for (var i = 0; i < res.data.length; i++) {
              that.option3.legend.data.push(res.data[i].name)
              var s = {
                value: res.data[i].classifyCount,
                name: res.data[i].name
              }
              that.option3.series[0].data.push(s)
            }
            that.container3 = that.$echarts.init(document.getElementById("container3"));
            that.container3.setOption(that.option3);
          }
        })
      },
      //活动类型占比
      hoursAvg() {
        var that = this
        this.$http.get('/activity/type/act-type-lists').then(res => {
          if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
              that.option4.legend.data.push(res.data[i].name)
              var s = {
                value: res.data[i].count,
                name: res.data[i].name
              }
              that.option4.series[0].data.push(s)
            }
            that.container4 = that.$echarts.init(document.getElementById("container4"));
            that.container4.setOption(that.option4);
          }
        })
      },
      // 滚动事件
      // 如果不绑定到元素上，则只能监听页面滚动
      orderScroll(e) {
        let that = this
        $('.zd').find('.is-scrolling-none').on('scroll', function() {
          var scrollTop = $(this).scrollTop();

          var ks_area = $(this).innerHeight();

          var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)

          nScrollHight = $(this)[0].scrollHeight;


          if (scrollTop + ks_area >= nScrollHight) {
            that.current++
            if (that.toauditcountlist.length == that.total) {

            } else {
              that.toauditcount()
            }
          }
        });
      },
      ActityModel() { //活动模式占比
        var that = this
        this.$http.get('/activity/act-oto-lists').then(res => {
          if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
              that.option5.legend.data.push(res.data[i].name)
              var s = {
                value: res.data[i].count,
                name: res.data[i].name
              }
              that.option5.series[0].data.push(s)
            }
            that.container5 = that.$echarts.init(document.getElementById("container5"));
            that.container5.setOption(that.option5);
          }
        })
      },
      schoolPkStudents() {
        var that = this
        this.$http.get('/index/student-groupStudent').then(res => {
          if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
              that.option6.legend.data.push(res.data[i].name)
              var s = {
                value: res.data[i].count,
                name: res.data[i].name
              }
              that.option6.series[0].data.push(s)
            }
            that.container6 = that.$echarts.init(document.getElementById("container6"));
            that.container6.setOption(that.option6);
          }
        })
      },
      projectType() {
        var that = this
        this.$http.get('/project/classify/lists').then(res => {
          if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
              that.option7.legend.data.push(res.data[i].name)
              var s = {
                value: res.data[i].classifyCount,
                name: res.data[i].name
              }
              that.option7.series[0].data.push(s)
            }
            that.container7 = that.$echarts.init(document.getElementById("container7"));
            that.container7.setOption(that.option7);
          }
        })
      },
      getGrades() {
        this.$http.get('/school/grade/partake/list').then(res => {
          this.grades = res.data
          this.schoolPkStudentsGrades();
        })
      },
      schoolPkStudentsGrades() {
        let that = this
        that.$http.get('/index/student-groupStudent', {
          params: this.params
        }).then(res => {
          if (res.code == 200) {
            that.option8.legend.data = [];
            that.option8.series[0].data = [];
            for (let i = 0; i < res.data.length; i++) {
              that.option8.legend.data.push(res.data[i].name)
              let s = {
                value: res.data[i].count,
                name: res.data[i].name
              }
              that.option8.series[0].data.push(s)
            }
            that.container8 = that.$echarts.init(document.getElementById("container8"));
            that.container8.setOption(that.option8);
          }
        })
      },
      orgTopTenOfLine() { //团学组织活跃度TOP10
        let that = this

        that.$http.get('/index/act-SituationByYear', {
          params: that.params
        }).then(res => {
          if (res.code == 200) {
            that.option9.series[0].areaStyle.color = that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(255, 158, 68)'
            }, {
              offset: 1,
              color: 'rgb(255, 158, 66)'
            }])

            that.option9.xAxis.data = [];
            that.option9.series[0].data = [];
            for (let i = 0; i < res.data.length; i++) {
              that.option9.xAxis.data.push(res.data[i].datem)
              that.option9.series[0].data.push(res.data[i].actNum);
            }
            that.container9 = that.$echarts.init(document.getElementById("container9"));
            that.container9.setOption(that.option9);
          }
        })
      },
      getAllYear() { //获取学年
        this.$http.get('/system/school-year/terms').then(res => {
          this.years = res.data
          this.params.year = this.years[this.years.length - 1].id;
          this.orgTopTenOfLine();
        })
      },
      getTopTenData() { //获取top10数据
        this.$http.get('/index/orgGroup-active').then(res => {
          this.topTenData = res.data;
        })
      }
    },
    mounted() {
      this.getGrades();
      this.hoursAvg()
      this.ActityModel();
      this.activityclassifylists();
      this.schoolPkStudents();
      this.projectType();
      this.getAllYear();
      this.getTopTenData();
      this.statisticsinfo()
    }
  };
</script>

<style lang="scss" scoped>
  .carouselTitle {
    width: 100%;
    text-align: center;
    line-height: 36px;

    &-title {
      font-size: 28px;
      color: #333;
      font-weight: bold;
    }

    &-second {
      font-size: 20px;
      color: #666;
    }
  }

  .carouselTitleImg {
    width: 100%;
    text-align: center;

    img {
      width: 920px;
      height: 536px;
    }
  }

  .fontf {
    font-size: 2rem;
    color: #FFFFFF;
  }

  .homebackimgs1 {
    background: url(../assets/images/home/s-1.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs2 {
    background: url(../assets/images/home/s-2.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs3 {
    background: url(../assets/images/home/s-3.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs4 {
    background: url(../assets/images/home/s-4.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs5 {
    background: url(../assets/images/home/s-5.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs6 {
    background: url(../assets/images/home/s-6.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs7 {
    background: url(../assets/images/home/s-7.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs8 {
    background: url(../assets/images/home/h-1.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs9 {
    background: url(../assets/images/home/h-2.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs10 {
    background: url(../assets/images/home/h-3.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs11 {
    background: url(../assets/images/home/z-1.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .homebackimgs12 {
    background: url(../assets/images/home/z-2.png) no-repeat;
    background-size: cover;
    max-width: 250px;
    height: 120px;
    background-position: center;
  }

  .gray-bg {}

  .span24 {
    margin-bottom: 15px;
  }

  .bg-box {
    background: #fff;
    height: 112px;
    display: flex;

    .bg-green {
      background: #17d57e;
    }

    .bg-yellow {
      background: #fec92b;
    }

    .bg-blue {
      background: #2da3fb;
    }

    .bg-purple {
      background: #c172d8;
    }
  }

  .bg-icon {
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .iconfont {

      margin-top: 24px;
      font-size: 40px;
      color: #fff;
      text-align: center;
    }

    .icon-title {
      color: #fff;
      font-size: .9rem;
    }
  }

  .xx {
    height: 100px !important;
  }

  .tips-tips {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    margin-left: 2rem;
    height: 100%;

    .icon-title {
      font-size: 1.2rem;
      margin-right: 2rem;
    }

    .bg-icon {
      height: 100px;
    }
  }

  .bg-info {
    width: 65%;
    padding: 24px;
  }

  .today-count {
    color: #5a5e66;
    font-size: 14px;

    .count-num {
      font-size: 18px;
      position: relative;
      top: 2px;
      margin-right: 4px;
      color: #353535;
    }

    .up-num {
      font-size: 14px;
      color: #ff724c;
    }
  }

  .all-count {
    font-size: 14px;
    color: #999;
    margin-top: 24px;
  }

  .h358 {
    height: 358px;
    background: #fff;
  }

  .h440 {
    height: 440px;
    background: #fff;
  }

  .work-header {
    height: 50px;
    line-height: 50px;
    padding: 0 16px 0 24px;
    display: flex;
    justify-content: space-between;

    .iconfont {
      font-size: 20px;
      color: #999999;

      &:hover {
        color: #353535;
      }
    }
  }

  .work-body {
    background: #fff;
    height: 308px;
    padding: 0 24px;
  }

  .index-table {
    width: 100%;

    th {
      color: #878d99;
      font-size: 12px;
      padding-bottom: 10px;
    }

    td {
      border-bottom: 1px dotted #e6ebf3;
      height: 32px;
      line-height: 32px;
      color: #5a5e66;
      font-size: 12px;
    }

    tr:last-child {
      td {
        border-bottom: none;
      }
    }
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .systemInfo {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;

    span {
      margin-right: 14px;
    }
  }

  .titles {
    background: #FFFFFF;
    margin: 16px 12px 16px 12px;
    width: 55%;

    .el-row {
      padding: 0 10px;

      .el-col {
        div {
          border-radius: 10px;
        }
      }
    }
  }

  .el_col_sty {
    width: 20%;
    margin: 1rem;
  }
</style>
