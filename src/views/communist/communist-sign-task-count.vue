<template>
  <section>
		<div class="main-header">
			<span class="main-title">打卡统计</span>

		</div>
		<div class="search-box">
			<el-form size="mini" :inline="true" class="demo-form-inline">

        <el-form-item label="名称">
					<el-input v-model="params.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
				</el-form-item>


				<el-form-item>
					<el-button size="mini" type="primary" @click="search">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="main-body">
				<el-table border :loading="loading" :data="data" stripe size="mini" style="width: 100%">
          <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="address" label="打卡地点" show-overflow-tooltip></el-table-column>
          <el-table-column label="起止日期">
            <div slot-scope="scope">
                <span>{{ scope.row.startDate | formatD}} 至 {{ scope.row.endDate | formatD}}</span>
            </div>
					</el-table-column>
					<el-table-column   label="打卡时间" width="240">
               <template slot-scope="scope">
								<span v-for="item in scope.row.options" style="padding-right:10px;">
									{{ item.startTime }} - {{ item.endTime}}<br />
<!--                   / 共<span style="color: red">{{item.signUserCount}}</span>人<br/>-->
								</span>
							</template>
					</el-table-column>
          <!--<el-table-column prop="signUserCount" label="打卡人数"  show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.options.signUserCount || 0}}
						</template>
					</el-table-column>-->
					<el-table-column prop="status" label="状态" align="center">
						<template slot-scope="scope">
							<!--'状态，0-删除，1-待开始，2-进行中，3-已结束，4-强制结束'-->
							{{scope.row.status === 0 ? '删除' : (scope.row.status === 1 ? '待开始' : (scope.row.status === 2 ? '进行中' : (scope.row.status === 3 ? '已结束' : '强制结束'))) }}
						</template>
					</el-table-column>
					<el-table-column prop="classifyName" label="创建时间" width="160">
             <div slot-scope="scope">
                {{ scope.row.ctime | formatDate}}
            </div>
					</el-table-column>
          <el-table-column  label="操作" width="160" align="center">
            <div slot-scope="scope">
              <!-- 可转载站点功能未完成 -->
              <el-button type="text" class="opreat-btn" @click.native="routerLink('signTask/detail','view',scope.row.id)">详情</el-button>
              <!-- <el-button type="text" class="opreat-btn" @click.native="routerLink('activity/launch', 'update', scope.row.id)">修改</el-button>
              <el-button type="text" class="opreat-btn" @click.native="deleteBatch($api.siteDelete,scope.row.id) ">删除</el-button> -->
            </div>
          </el-table-column>
        </el-table>
        <qu-pagination :total="total" @change="changePage"></qu-pagination>
		</div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      dateArray:[],
      loading: false,
			params: {
				current: 0,
				size: 10,
				startDate: '',
				endDate: '',
				name: ''
			},
			data: [],
			total: 0,
			options: [{id: '', name: '不限'}]
    }
  },
	methods:{
		fetch() {
			this.loading = true
			this.$http.get('/sign/statistics-list', {params: this.params}).then(res => {
				this.data = res.data.list
				this.total = res.data.total
				this.loading = false
			})
		},
		search() {
			this.params.current = 1
			this.fetch()
		},
		changePage(current, size){
			this.params.current = current
			this.params.size = size
			this.fetch()
		},
		deleteBatch(id){
			var that = this
			var ids = id+''
			this.$confirm('此操作将永久删除该活动 是否继续?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
				this.$http.post(that.$api.employeeListRemove, {id:ids}).then(res => {
					that.$message({
										type: 'success',
										message: '删除成功!'
								});
								that.initTableData(that.$api.employeeList, that.params)
					}).catch(error => {
				});
			})
		},
	},
	created(){
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>

</style>
