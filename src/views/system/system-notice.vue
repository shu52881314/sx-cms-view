<template>
  <section>
		<div class="main-header">
			<span class="main-title">公告管理</span>
      <div class="main-btn-box">
        <el-button @click="routerLink('announcement/add', 'add')"   type="primary" size="mini">发布系统公告</el-button>
      </div>
		</div>
		<!--<div class="search-box">-->
			<!--<el-form size="mini" :inline="true" class="demo-form-inline">-->
        <!--<el-form-item label="发布时间">-->
          <!--<el-form-item   >-->
            <!--<el-col :span="22">-->
              <!--<el-date-picker-->
                <!--@change="changeStartDate"-->
                <!--style="width:100%;margin-right: 0px;"-->
                <!--v-model="dateArray.startDate2"-->
                <!--type="datetime"-->
                <!--default-time="00:00:00"-->
                <!--placeholder="请选择开始日期">-->
              <!--</el-date-picker>-->
            <!--</el-col>-->
          <!--</el-form-item>-->
          <!--<span style="color:#606266;font-size:14px;">至</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
          <!--<el-form-item    >-->
            <!--<el-col :span="22">-->
              <!--<el-date-picker-->
                <!--:disabled="isShow"-->
                <!--style="width:100%;"-->
                <!--start-placeholder="2017 年 03 月 21 日"-->
                <!--v-model="dateArray.endDate2"-->
                <!--type="datetime"-->
                <!--default-time="23:59:59"-->
                <!--placeholder="请选择结束日期" :picker-options="pickerOptions1">-->
              <!--</el-date-picker>-->
            <!--</el-col>-->
          <!--</el-form-item>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态" >-->
          <!--<el-select  v-model="params.status"  placeholder="请选择状态">-->
            <!--<el-option-->
              <!--v-for="item in statues"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="创建人">-->
          <!--<el-input v-model="params.creator" placeholder="请输入创建人搜索"></el-input>-->
        <!--</el-form-item>-->
				<!--<el-form-item label="公告标题">-->
					<!--<el-input v-model="params.title" placeholder="请输入公告标题搜索"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item>-->
					<!--<el-button size="mini" type="primary" @click="search">查询</el-button>-->
				<!--</el-form-item>-->
			<!--</el-form>-->
		<!--</div>-->
		<div class="main-body">
				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="title" label="公告标题"></el-table-column>
          <el-table-column prop="creator" label="创建人"></el-table-column>
          <el-table-column prop="startTime" label="发布时间">
            <template slot-scope="scope">
                {{scope.row.startTime | formatDate}}
            </template>
          </el-table-column>

          <el-table-column prop="readNum" label="浏览人数"  align="center"></el-table-column>
					<el-table-column prop="status" label="状态"  align="center">
              <div slot-scope="scope">
                 {{scope.row.status == 1 ? '已发布' : scope.row.status == 0? '未发布' : '' }}
              </div>
          </el-table-column>
          <el-table-column  label="操作" align="left">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('announcement/show','view',scope.row.id)">详情</el-button>
              <el-button type="text" class="opreat-btn"  @click.native="routerLink('announcement/add','update',scope.row.id)">编辑</el-button>
              <el-button type="text" class="opreat-btn"    @click.native="deleteBatch(scope.row.id,scope.row.status)" >删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      isShow : true,
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.dateArray.startDate2;
          if (beginDateVal) {
            let beginYear = beginDateVal.getFullYear();
            let beginMonth = beginDateVal.getMonth() + 1;
            let beginDate = beginDateVal.getDate();
            let beginDateVal1 = beginYear + '-' + beginMonth + '-' + beginDate + ' ' + '00:00:00';
            let beginDateVal2 = beginDateVal1.replace(/-/g,'/');
            let timestamp = new Date(beginDateVal2).getTime();
            if (beginDateVal) {
              return time.getTime() < timestamp   ;
            }
          }else {
            return true
          }
        },
      },
      hoursUnit:localStorage.getItem("hoursUnit"),
    	dateArray:{
        startDate2:'',
        endDate2:'',
      },
      statues:[
        {
          id:'0',
          name:'不限'
        },
        {
          id:"1",
          name:'待发布'
        },
        {
          id:"2",
          name:'发布中'
        },
        {
          id:"3",
          name:'已结束'
        }
      ],
      loading: false,
			params: {
				current: 0,
				size: 10,
        startTime: '',
        endTime: '',
				name: '',
        status:"0"
			},
			classifies: [{id: '', name: '全部'}],
			data: [],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
    changeStartDate(value){
      if (value) {
        this.isShow = false
      }else{
        this.isShow = true
        this.dateArray.endDate2 = ""
      }
    },
		getClassify() {
			this.$http.get('/activity/classify',{params:{parentId:0}}).then(res => {
				this.classifies = this.classifies.concat(res.data)
			})
		},
		fetch() {
			this.loading = true
			this.$http.get('/system/announcement/list', {params: this.params}).then(res => {
        this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
    open() {
      this.$message('请选择结束日期');
    },
		search() {
      if (this.dateArray.startDate2 && this.dateArray.endDate2) {
        this.params.startTime = this.dateArray.startDate2.getTime();
        this.params.endTime = this.dateArray.endDate2.getTime();
      }
      if (this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.open()
        return
      }
      if (!this.dateArray.startDate2 && !this.dateArray.endDate2) {
        this.dateArray = []
        this.params.startTime = ""
        this.params.endTime = ""
      }
      this.params.current = 1
      this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		},
		deleteBatch(id,status){
			var that = this
      var message='是否删除该公告'
      if(status==2){
        message='是否删除该公告，删除后学生将无法查看'
      }
      that.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
        that.$http.post('/system/announcement/delete', {
              id:id,
            }).then(res => {
                if(res.code == '200'){
                      that.$message({
                          type: 'success',
                          message: '删除成功!'
                         });
                      that.fetch()
                }
              }).catch(error => {
            });
			})
		},
	},
	created(){
		this.getClassify()
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>

</style>
