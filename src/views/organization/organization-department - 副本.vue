<template>
  <section>


    <el-dialog
  title="选择教职工"
  :visible.sync="dialogVisibleSelect"
    @close="beforeCloseHandlerTeacher"
  width="570px">

   <div>

    <el-transfer
     :left-default-checked="Alldata"
     :right-default-checked="currentData"
     @change="changeTeacher"
     filterable
     v-model="teacherArray"
     :titles="['所有教职工','当前教职工']"
     :props="{
       key: 'id',
       label: 'name'
     }"
     :data="teacherData">
   </el-transfer>

    <div style="padding:20px 0;text-align:center;">
        <el-button type="primary"  @click="saveTeacher()">保存</el-button>
    </div>

   </div>

</el-dialog>



		<div class="main-header">
      <span class="main-title">行政机构列表</span>
			<div class="main-btn-box">
						<el-button type="primary" size="mini" @click="routerLink('department/detail', 'update')" v-perms="'/organization/department/add'">添加</el-button>
			</div>
		</div>
		<div class="main-body">


      <div class="search-box">
  			<el-form size="mini" :inline="true" class="demo-form-inline">
  				<el-form-item label="级别">
  					<el-select v-model="params.level" placeholder="请输入级别">
  						<el-option v-for="level in levels" :key="level.key" :label="level.value" :value="level.key"></el-option>
  					</el-select>
  				</el-form-item>
  				<el-form-item label="名称">
  					<el-input v-model="params.name" maxlength=30  placeholder="请输入名称搜索"></el-input>
  				</el-form-item>

  				<el-form-item>
  					<el-button size="mini" type="primary" @click="search">查询</el-button>
  				</el-form-item>
  			</el-form>
  		</div>
  		<div class="main-body">
  				<el-table :loading="loading" :data="data" stripe size="mini" style="width: 100%">
            <el-table-column prop="name" label="行政机构" ></el-table-column>
            <el-table-column prop="level" label="级别">
               <div slot-scope="scope">
                 {{scope.row.level == 1 ? '校级' : '院系级'}}
              </div>
  					</el-table-column>
            <!-- <el-table-column prop="userCount" label="职工"  align="center">
            	<template slot-scope="scope">
								<span>{{scope.row.userCount}}人</span>
							</template>
            </el-table-column> -->
            <!--<el-table-column prop="remark" label="备注" align="center"></el-table-column>-->
            <el-table-column  label="操作" width="220" align="center">
              <div slot-scope="scope">
                <!-- 可转载站点功能未完成 -->
                <el-button type="text" class="opreat-btn" @click="addTeacher(scope.row.id)">添加职工</el-button>
                <el-button type="text" class="opreat-btn" @click.native="routerLink('department/detail','update',scope.row.id)" v-perms="'/organization/department/edit'">编辑</el-button>
              </div>
            </el-table-column>
          </el-table>
          <qu-pagination :total="total" @change="changePage"></qu-pagination>
  		</div>

		</div>
  </section>
</template>
<script>

export default {
  data() {
    return {
      formSave:{
        id:"",
        users:""
      },
      teacherData:[],
      roleData:[],
      Alldata:[],
      currentData:[],
      teacherArray:[],
      treedata:[],
      roleId:'',
      dialogVisibleSelect: false,
      loading: false,
			data: [],
      levels:[
        {
          key:6,
          value:'校级'
        },
        {
          key:8,
          value:'院系级'
        }
      ],
      total:0,
      params:{
        size: 10,
        current:1,
        level: '',
        nature:1,
        level: '',
        name: ''
      }
    }
  },
	methods:{
    saveTeacher(){
      this.formSave.users = this.teacherArray.join(",")
      this.$http.post("/organization/select/members/add",this.formSave).then( (res) => {
         if (res.code == '200') {
           this.$message({
             type: 'success',
             message: '保存成功!'
           });
           this.dialogVisibleSelect = false;
           this.fetch()
           this.teacherArray = [];
         }
     })
    },
    addTeacher(id){

      this.$http.get('/organization/select/members',{
        params:{
          id:id
        }
       }).then(res => {

           this.formSave.id = id

           this.dialogVisibleSelect = true

           if (res.data.teachers.length || res.data.institutionTeacher.length) {
             this.teacherData = res.data.teachers
              // this.teacherData = res.data.teachers.concat(res.data.institutionTeacher)
           }

           let data = []

           if (res.data.institutionTeacher.length) {
             res.data.institutionTeacher.forEach(item => {
               data.push(item.id)
             })
           }



           this.teacherArray = data

      })

    },
    changeTeacher(value){
      this.formSave.users = value
    },
    beforeCloseHandlerTeacher(){
       this.teacherArray = [];
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
		fetch() {
			this.$http.get('/organization/department/allInfo',{params:this.params}).then(res => {
        this.data = res.data.list
        this.total = res.data.total
				// this.data = res.data
			})
		}
	},
	created(){
		this.fetch()
	},
	mounted(){

	}
}
</script>
<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
