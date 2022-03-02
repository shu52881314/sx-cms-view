
<template>

   <section>
	<back></back>

	<!-- <back v-if="id"></back> -->
	<div class="main-header">
		<span class="main-title"> {{ id ? "修改" : "新增"}}打卡任务</span>
	</div>
	<div class="main-body">

            <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

		 <el-row class="activity-info">
			 <div class="basic-title"><span>基本信息</span></div>
              <el-col  :md="13">

				<el-form-item label="事项名称" prop="name">
                    <el-col :span="22">
                        <el-input clearable v-model="ruleForm.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属学校">
                    <el-col :span="22">
                        <el-select multiple @change="changeSchool" style="width:100%" v-model="campusArr" placeholder="请选择学校">
                            <el-option v-for="item in schools" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属院系">
                    <el-col :span="22">
                        <el-select multiple clearable style="width:100%" v-model="collegeArr" placeholder="请选择院系">
                            <el-option v-for="item in colleges" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="参与年级">
                    <el-col :span="22">
                        <el-select multiple  clearable style="width:100%" v-model="gradeArr" placeholder="请选择院系">
                            <el-option v-for="item in grades" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <!-- <el-form-item label="参与班级">
                 <el-select multiple  clearable style="width:100%"  v-model="classId" placeholder="请选择班级">
                   <el-option v-for="item in classes2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                 </el-select>
               </el-form-item> -->

				</el-col>
           </el-row>

            <el-row class="activity-info">
			 <div class="basic-title"><span>填写时间</span></div>
              <el-col  :md="13">


                <el-form-item label="起止日期"  prop="dateArr">
                    <el-col :span="22">
                      <el-date-picker class="selectWidth" :editable="false" type="daterange" v-model="ruleForm.dateArr" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                    </el-col>
                </el-form-item>


                <el-form-item style="margin-bottom:0;background:#F2F2F2;padding-top:20px;" v-for="(domain, index) in ruleForm.options2"
                :label="'打卡时间' + (index+1)"
                :key="domain.key"
                 required>
                 <el-col :span="22">
                   <el-form-item
                     :prop="'options2.' + index + '.temporaryTime'"
                     :rules="{
                       required: true, message: '打卡时间不能为空', trigger: 'change'
                     }"
                   >

                       <el-time-picker style="float:left;width:350px;"
                        is-range
                        format="HH:mm"

                        @change="changeTime(domain[index])"
                        v-model="domain.temporaryTime"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                      </el-time-picker>

                     <el-button style="margin-left:10px;float:left;" @click.prevent="removeDomain(domain)">删除</el-button>
                   </el-form-item>
                 </el-col>
               </el-form-item>

               <el-form-item style="margin-top:20px;">
                 <el-button size="medium" class="blue-btn" style="width:404px" @click="addDomain">新增打卡时间</el-button>
               </el-form-item>

			   		</el-col>
           </el-row>

            <el-row class="activity-info">
			 <div class="basic-title"><span>打卡地点</span></div>
              <el-col  :md="24">

                <el-form-item>
                    <el-col :span="22">
                        <div class="amap-page-container" style="position:relative">
                            <el-amap-search-box style="position:absolute;left:20px;top:20px;" :on-search-result="onSearchResult"></el-amap-search-box>
                            <el-amap vid="amapDemo" :zoom="zoom" :center="mapCenter" class="amap-demo" :plugin="plugin">

                                <!-- <el-amap-marker v-for="marker in markers" :position="marker" ></el-amap-marker> -->
                                <el-amap-marker ref="myRef" v-for="(marker, index) in markers" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index" :key="index"></el-amap-marker>
                                <!-- <el-amap-info-window  :position="mywindow.position" :content="mywindow.content" :visible="mywindow.visible" :events="mywindow.events"></el-amap-info-window> -->
                                <!-- <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker> -->
                                <el-amap-circle :visible="circle.visible" :center="circle.center" :radius="circle.radius" :fillOpacity="circle.fillOpacity" :events="circle.events" :strokeColor="circle.strokeColor" :strokeStyle="circle.strokeStyle" :fillColor="circle.fillColor">

                                </el-amap-circle>
                            </el-amap>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item style="padding-top:10px;">
                    <el-col :span="22">
                        打卡地址：{{ address }}
                    </el-col>
                    <el-col :span="22">
                        详细地址：打卡地点默认为中心点100m范围内
                        <el-select @change="changeRadio" v-model="SelectValue" placeholder="请选择">
                            <el-option v-for="item in Selectoptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="ruleForm.signId" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
                    <el-button v-if="!ruleForm.signId" type="primary" @click="submitForm('ruleForm',2)">添加</el-button>
                </el-form-item>

				  </el-col>
           </el-row>

            </el-form>






	</div>
  </section>



</template>

<script>

// import {
//     cascade2,
//     getNode,
//     deleteArrSame
// } from '@/util/filters'
// import {
//     isFloat
// } from '@/util/validate'
// import {cascade,timestampToTime,formatDate,getFullDate} from '@/util/filters'

import {formatDate,timestampToTime,getFullDate} from '@/utils/filters'
import listMixins from '@/mixins/form';
import va from '@/rules'
var validCode2 = (rule, value, callback) => {
   if (!value) {
       callback(new Error('请输入学时'))
   } else if (!isFloat(value)) {
       callback(new Error('请输入正确的学时'))
   } else {
       callback()
   }
}

export default {
    mixins:[listMixins],
    data() {
      return{
        classId:[],
        classes2:[],
        campusArr:[],
        collegeArr:[],
        gradeArr:[],
        validCode:validCode2,
        schools:[],
        grades: [ ],
            colleges: [],
            SelectValue: '100',
            statuss:[
              {
                  value: 1,
                  label: '待开始'
              },
              {
                  value: 2,
                  label: '进行中'
              },
              {
                  value: 3,
                  label: '已结束'
              },
              {
                  value: 4,
                  label: '强制结束'
              }
            ],
            Selectoptions: [
               {
                   value: '50',
                   label: '50'
               },
               {
                    value: '100',
                    label: '100'
                },
                {
                    value: '200',
                    label: '200'
                },
                {
                    value: '500',
                    label: '500'
                }
            ],
            loading: true,
            zoom: 15,
            mapCenter: [121.5273285, 31.21515044],
            address: '',
            searchOption: {
                city: '',
                citylimit: false
            },
            circle: {
                visible: false,
                clickable: false,
                center: [121.5273285, 31.21515044],
                radius: 100,
                fillOpacity: 0.3,
                strokeStyle: 'dashed',
                fillColor: '#FFFF00',
                strokeColor: '#00BFFF'
            },
            markers: [{
                // position: [121.5273285, 31.21515044],
                position: [0,0],
                events: {
                    click: (obj) => {
                        this.circle.visible = true
                        this.circle.center = this.markers[0].position

                        this.ruleForm.longitude   = this.circle.center[0]
                        this.ruleForm.latitude   = this.circle.center[1]

                        // 这里通过高德 SDK 完成。
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        let _this = this
                        geocoder.getAddress(this.markers[index].position, function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.regeocode) {
                                  let addr = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district
                                  let addr2  = result.regeocode.formattedAddress.replace(addr,"")
                                  _this.address = addr2
                                  _this.ruleForm.address  =  _this.address
                                }
                            }
                        });

                    },
                    dragend: (e) => {
                        this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
                        this.circle.center = [e.lnglat.lng, e.lnglat.lat]
                        this.ruleForm.longitude   = this.circle.center[0]
                        this.ruleForm.latitude   = this.circle.center[1]
                        // 这里通过高德 SDK 完成。
                        var geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                        });
                        let _this = this
                        geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.regeocode) {
                                  let addr = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district
                                  let addr2  = result.regeocode.formattedAddress.replace(addr,"")
                                  _this.address = addr2
                                  _this.ruleForm.address  =  _this.address
                                }
                            }
                        });

                    }
                },
                visible: true,
                draggable: true
            }],
            mywindow: {
                position: [121.5273285, 31.21515044],
                content: '<h4>该点数据信息</h4><div class="text item">Information A: ...</div><div class="text item">Information B: ...</div>',
                visible: false,
                events: {
                    close() {
                        this.mywindow.visible = false
                    }
                }
            },
            plugin: {
                pName: 'Scale',
                events: {
                    init() {

                    }
                }
            },
            options: [],
            options2: [],
            dialogVisible: false,

            ruleForm: {
                signId: '',
                name: '',
                campusId: '',
                collegeLimit: '',
                gradeLimit: '',
                dateArr: [],
                startDate:'',
                endDate:'',
                options2: [
                  {
                  temporaryTime:'',
                  startTime: '',
                  endTime: ''
                 }
               ],
               options: [
                 {
                 temporaryTime:'',
                 startTime: '',
                 endTime: ''
                }
              ],
               longitude:'',
               latitude:'',
               ranges:100,
               address:''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                dateArr: [{
                    required: true,
                    message: '请选择起止日期',
                    trigger: 'change'
                }]
            },
            params: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                name: '',
                dateArray:[],
                startDate:'',
                endDate:'',
                status:''
            },
            data: []
    }
},
created() {
        // this.fetchData();
        this.getCampus();
        // this.getOrganizations();
        this.getClass();
        // this.$http.get('/school/class/partake/list').then(res => {
        //   this.classes2   = res.data
        // })


        if(this.id){
            this.$http.get("/sign/detail",{
                params:{
                    id:this.id
                }
            }).then(res => {
                 let row = res.data
                  this.ruleForm.signId = this.id;
                  this.ruleForm.name = row.name;
                  let arrs = []
                   row.campusLimit.forEach(  (item) => {
                    arrs.push(item.id)
                  });
                  this.campusArr = arrs
                  this.campusArr.forEach( item => {
                    this.$http.get('/school/college/list', {
                        params: {
                            campusId: item
                        }
                    }).then(res => {
                        this.colleges = this.colleges.concat(res.data)
                    })
                  })

                  let arrs2 = []
                   row.collegeLimit.forEach(  (item) => {
                    arrs2.push(item.id)
                  });

                  this.collegeArr = arrs2

                  let arrs3 = []
                  row.gradeLimit.forEach(  (item) => {
                    arrs3.push(parseInt(item))
                  });
                  this.gradeArr = arrs3
                  this.$http.get('/school/grade/partake/list').then(res => {
                    this.grades = res.data
                  })
                 this.ruleForm.dateArr.push( formatDate(row.startDate) )
                 this.ruleForm.dateArr.push( formatDate(row.endDate) )
                  this.ruleForm.dateArr = [new Date(this.ruleForm.dateArr[0]),new Date(this.ruleForm.dateArr[1])]

                 let tempTime = []
                 row.signTimeList.forEach(item =>{
                   tempTime.push({
                     temporaryTime:[getFullDate(item.startTime),getFullDate(item.endTime)],
                     startTime:item.startTime,
                     endTime:item.endTime
                   })
                 })
                 this.ruleForm.options2 = tempTime


                 this.ruleForm.longitude = row.longitude
                 this.ruleForm.latitude = row.latitude
                 this.ruleForm.ranges = row.ranges
                 this.ruleForm.address = row.address
                 this.address = row.address

                 let position = [this.ruleForm.longitude,this.ruleForm.latitude]
                 this.circle.center = position
                 this.mapCenter = position
                 this.markers[0].position = position
                 this.circle.visible = true
                 this.circle.radius = row.ranges

                 this.SelectValue = row.ranges

            })
        }

  },
    mounted() {},
    methods: {
      getClass() {
        this.$http.get("/school/grade/partake/list").then(res => {
          this.grades = this.grades.concat(res.data)
        })
      },
      changeTime(value){
      },
      removeDomain(item) {

       var index = this.ruleForm.options2.indexOf(item)

       if (index !== 0) {
         this.ruleForm.options2.splice(index, 1)
       }else{
         this.$message({
             type: 'error',
             message: '打卡时间至少填写一个!'
         });
       }
       // if (index !== -1) {
       //   this.ruleForm.options.splice(index, 1)
       // }
     },
      addDomain() {
         this.ruleForm.options2.push({
           temporaryTime:'',
           startTime: '',
           endTime: ''
         });
       },
        changeSchool(value) {
            // let value2 = value[value.length - 1]
            let value2=value.join(',');
            this.$http.get('/school/all/college/cascader', {
                params: {
                    campusId: value2
                }
            }).then(res => {
                this.colleges = res.data
            })
        },
        changeRadio(value) {
            this.circle.radius = parseInt(value);
            this.ruleForm.ranges  = this.circle.radius
        },
        onSearchResult(pois) {
            this.markers = []
            let latSum = 0;
            let lngSum = 0;
            if (pois.length > 0) {
                pois.forEach((poi, index) => {
                    let {
                        lng,
                        lat
                    } = poi;
                    lngSum += lng;
                    latSum += lat;

                    this.markers.push({
                        position: [poi.lng, poi.lat],
                        events: {
                            click: (e) => {
                                this.circle.visible = true;
                                this.circle.center = this.markers[index].position
                                this.ruleForm.longitude   = this.circle.center[0]
                                this.ruleForm.latitude   = this.circle.center[1]
                                // 这里通过高德 SDK 完成。
                                var geocoder = new AMap.Geocoder({
                                    radius: 1000,
                                    extensions: "all"
                                });
                                let _this = this
                                geocoder.getAddress(this.markers[index].position, function(status, result) {
                                    if (status === 'complete' && result.info === 'OK') {
                                        if (result && result.regeocode) {

                                            let addr = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district
                                            let addr2  = result.regeocode.formattedAddress.replace(addr,"")
                                            _this.address = addr2
                                            _this.ruleForm.address  =  _this.address
                                        }
                                    }
                                });
                            },
                            dragend: (e) => {

                                this.circle.visible = true;
                                this.markers[index].position = [e.lnglat.lng, e.lnglat.lat];
                                this.circle.center = [e.lnglat.lng, e.lnglat.lat]
                                this.ruleForm.longitude   = this.circle.center[0]
                                this.ruleForm.latitude   = this.circle.center[1]
                                // 这里通过高德 SDK 完成。
                                var geocoder = new AMap.Geocoder({
                                    radius: 1000,
                                    extensions: "all"
                                });
                                let _this = this
                                geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result) {
                                    if (status === 'complete' && result.info === 'OK') {
                                        if (result && result.regeocode) {
                                          let addr = result.regeocode.addressComponent.province + result.regeocode.addressComponent.city + result.regeocode.addressComponent.district
                                          let addr2  = result.regeocode.formattedAddress.replace(addr,"")
                                          _this.address = addr2
                                          _this.ruleForm.address  =  _this.address
                                        }
                                    }
                                });


                            }
                        },
                        visible: true,
                        draggable: true
                    });


                });
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                };
                this.mapCenter = [center.lng, center.lat];

            }
        },
        beforeCloseHandler() {

          this.ruleForm = {
              signId: '',
              name: '',
              campusId: '',
              collegeLimit: '',
              gradeLimit: '',
              dateArr: [],
              startDate:'',
              endDate:'',
              options: [
                {
                temporaryTime:'',
                startTime: '',
                endTime: ''
               }
             ],
             options2: [
               {
               temporaryTime:'',
               startTime: '',
               endTime: ''
              }
            ],
             longitude:'',
             latitude:'',
             ranges:100,
             address:''
           }


           this.collegeArr = []
           this.gradeArr = []
           this.colleges = []

           this.circle.center = [121.5273285, 31.21515044]
           this.mapCenter = [121.5273285, 31.21515044]
           this.markers[0].position = [121.5273285, 31.21515044]
           this.circle.visible = false
           this.circle.radius = '100'
           this.address = ''
           this.SelectValue = '100'



        },
        getCampus() {
            this.$http.get('/school/all/campus').then(res => {
                this.schools = res.data
            })
        },
        resetForm(formName) {

          this.ruleForm = {
              signId: '',
              name: '',
              campusId: '',
              collegeLimit: '',
              gradeLimit: '',
              dateArr: [],
              startDate:'',
              endDate:'',
              options: [
                {
                temporaryTime:"",
                startTime: '',
                endTime: ''
               }
             ],
             options2: [
               {
               temporaryTime:"",
               startTime: '',
               endTime: ''
              }
            ],
             longitude:'',
             latitude:'',
             ranges:100,
             address:''
           }
           this.collegeArr = []
           this.gradeArr = []
           this.colleges = []

           this.circle.center = [121.5273285, 31.21515044]
           this.mapCenter = [121.5273285, 31.21515044]
           this.markers[0].position = [121.5273285, 31.21515044]
           this.circle.visible = false
           this.circle.radius = '100'
           this.SelectValue = '100'
           this.address = ''
            // this.ruleForm.organizations.splice(0, this.ruleForm.organizations.length);
            this.$refs[formName].resetFields();
        },
        search() {
            this.params.current = 1;
            this.fetchData();
        },
          changeDate(){
            if (this.params.dateArray && this.params.dateArray.length) {
              this.params.startDate = this.params.dateArray[0].getTime();
              this.params.endDate = this.params.dateArray[1].getTime();
            }else{
              this.params.dateArray = []
              this.params.startDate = ""
              this.params.endDate = ""
            }
          },
        modify(rows) {
            this.dialogVisible = true;
            if (rows) {
              this.$http.get('/api/v1/sign/detail', {params: {id:rows.id}}).then(res => {

                  let row = res.data
                  this.ruleForm.signId = rows.id;
                  this.ruleForm.name = row.name;
                  let arrs = []
                   row.campusLimit.forEach(  (item) => {
                    arrs.push(item.id)
                  });
                  this.campusArr = arrs
                  this.campusArr.forEach( item => {
                    this.$http.get('/api/v1/student/all-colleges', {
                        params: {
                            campus: item
                        }
                    }).then(res => {
                        this.colleges = this.colleges.concat(res.data)
                    })
                  })

                  let arrs2 = []
                   row.collegeLimit.forEach(  (item) => {
                    arrs2.push(item.id)
                  });

                  this.collegeArr = arrs2


                 this.gradeArr = row.gradeLimit
                 this.ruleForm.dateArr.push( formatDate(row.startDate) )
                 this.ruleForm.dateArr.push( formatDate(row.endDate) )



                  this.ruleForm.dateArr = [new Date(this.ruleForm.dateArr[0]),new Date(this.ruleForm.dateArr[1])]

                 let tempTime = []
                 row.signTimeList.forEach(item =>{
                   tempTime.push({
                     temporaryTime:[getFullDate(item.startTime),getFullDate(item.endTime)],
                     startTime:item.startTime,
                     endTime:item.endTime
                   })
                 })
                 this.ruleForm.options2 = tempTime


                 this.ruleForm.longitude = row.longitude
                 this.ruleForm.latitude = row.latitude
                 this.ruleForm.ranges = row.ranges
                 this.ruleForm.address = row.address
                 this.address = row.address

                 let position = [this.ruleForm.longitude,this.ruleForm.latitude]
                 this.circle.center = position
                 this.mapCenter = position
                 this.markers[0].position = position
                 this.circle.visible = true
                 this.circle.radius = row.ranges

                 this.SelectValue = row.ranges

              })


            }
        },
        submitForm(formName, type) {

            this.$refs[formName].validate((valid) => {
              if (valid) {


                if (this.ruleForm.longitude == "" && this.ruleForm.latitude == "" && this.ruleForm.address == "") {
                  this.$message({
                      type: 'error',
                      message: '请正确选择打卡地点'
                  })
                } else {

                  this.ruleForm.campusId = this.campusArr.join(",")
                  this.ruleForm.collegeLimit = this.collegeArr.join(",")
                  this.ruleForm.gradeLimit = this.gradeArr.join(",")
                  this.ruleForm.startDate = this.ruleForm.dateArr[0].getTime();
                  this.ruleForm.endDate = this.ruleForm.dateArr[1].getTime();

                  let tempArr = []
                  this.ruleForm.options2.forEach( item =>{
                    tempArr.push({
                        startTime: timestampToTime(item.temporaryTime[0].getTime()),
                        endTime: timestampToTime(item.temporaryTime[1].getTime())
                    })
                  })
                  this.ruleForm.options = tempArr
                    if (type == 1) {
                        this.$http.post('/sign/update', this.ruleForm).then(res => {
                            if (res.code == '200') {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.dialogVisible = false;
                                this.resetForm('ruleForm');
                                this.$router.push("/communist/signTask")
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }

                        })
                    } else if (type == 2) {


                        this.$http.post('/sign/add', this.ruleForm).then(res => {

                            if (res.code == '200') {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.dialogVisible = false;
                                this.resetForm('ruleForm');
                                this.$router.push("/communist/signTask")
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        })
                    }

                 }

                } else {
                    return false;
                }
            });
        },
        indexMethod(index) {
            return index + 1
        },
        handleSizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.fetchData();
        },
        handleCurrentChange(page) {
            this.params.currentPage = page;
            this.fetchData();
        },
        deleteOrganization(id,status) {
            this.$confirm(status == 0 ? '是否删除该打卡事项?' : '是否强制结束该打卡事项?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/api/v1/sign/delete', {
                    id: id,
                    status:status
                }).then(res => {
                    if (res.code === '200') {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.fetchData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                })
            }).catch(() => {

            })
        }
    }
}
</script>

<style scoped>
  .blue-btn{ border-color:#02bca6; color: #02bca6 }

.activityWidth{
    width:100%
}
.activity-info {
	margin-bottom: 20px;
	border: 1px solid rgba(242, 243, 251, 1);
}
.basic-title {
	height: 40px;
	line-height: 40px;
	margin-bottom: 20px;
	background-color: rgba(242, 243, 251, 1);
}
.basic-title span {
	margin: auto 20px;
}

.el-checkbox {
    margin-left: 0;
    margin-right: 30px;
}

.moreIntroduce {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
}

.panel-options {
    width: 98%;
    overflow: hidden;
    margin: 0px auto;
    padding-bottom: 10px;
    font-size: 14px;
}

.nav-tabs>li {
    float: left;
    margin-right: 15px;
}

.nav-tabs>li>a {
    float: left;
    padding-bottom: 10px;
}

.nav-tabs>li:hover a {
    color: #008AFF
}

.nav-tabs>.active a {
    color: #008AFF;
    border-bottom: 2px solid #008AFF;
}

.showActivy {
    line-height: 30px;
}

.showActivy td {
    padding-bottom: 20px;
}

.selectWidth {
    width: 100%;
}

.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader-icon:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 29px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.amap-page-container {
    height: 500px;
}

.organization-title {
    width: 98%;
    overflow: hidden;
    margin: 0px auto;
}

.organization-btn {
    border-top: 2px solid #F2F3FB;
    padding: 8px 0;
    border-bottom: 2px solid #F2F3FB;
    text-indent: 10px;
    width: 100%;
    overflow: hidden;
    margin: 0px auto;
    background: #fff;
    margin: 5px 0;
}

.organization-titlel {
    font-size: 14px;
    color: #000;
    font-weight: bold;
    margin: 0px auto;
    margin-top: 8px;
}

.table-header-row th {
    background: #F5F7FA !important;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
}

.organization-title .el-form-item {
    margin-bottom: 12px;
    padding-bottom: 0px;
}
.el-vue-search-box-container .search-box-wrapper .search-btn{
  background:red;
}
</style>
