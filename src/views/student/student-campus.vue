<template>
  <section>
    <!--<el-tabs v-model="activeName" @tab-click="goTab">-->
      <!--<el-tab-pane label="校区" name="0"></el-tab-pane>-->
      <!--<el-tab-pane label="院系" name="1"></el-tab-pane>-->
      <!--<el-tab-pane label="专业" name="2"></el-tab-pane>-->
      <!--<el-tab-pane label="班级" name="3"></el-tab-pane>-->
      <!--<el-tab-pane label="学生" name="4"></el-tab-pane>-->
    <!--</el-tabs>-->
		<div class="main-header" v-if="$root.ItemData && $root.ItemData.length && $root.ItemData.length == 1">
			<span class="main-title">
				校区管理
        <small>学校存在多个校区或者独立院校的情况，在此处可进行对校区或者独立学校进行设置;</small>
			</span>
		</div>

		<div class="main-body">

      <!-- <div class="campus">
				<table  width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="left" colspan="2" valign="middle">
							<span class="campus-name"><b>{{school.schoolName}}</b> </span>
						</td>
						<td align="right"  valign="middle">
						</td>
					</tr>
					<tr>
						<td width="33%" align="left"  valign="middle">
							院系数：{{school.collegeCounts}} 个
						</td>
						<td width="33%" align="left"  valign="middle">
							专业数：{{school.majorCounts}} 个
						</td>
						<td width="33%" align="left" valign="middle">
              班级数：{{school.classCounts}} 个
						</td>
					</tr>

       </table>
			</div> -->


			<div class="campus" v-for="item in data">
				<table v-loading="loading" width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td align="left" colspan="2" valign="middle">
							<span class="campus-name"><b>{{item.name}}</b> </span>
						</td>
						<td align="right"  valign="middle">
							<el-button  @click='modify("modify", item)' size="mini" type="text"  v-perms="'/student/campus/edit'">编辑</el-button>
							<el-button  @click='deleteCampus(item)' size="mini"  v-perms="'/student/campus/delete'" type="text">删除</el-button>
						</td>
					</tr>
					<tr>
						<td width="33%" align="left"  valign="middle">
							院系总数：{{item.collegeCount}} 个
						</td>
						<td width="33%" align="left"  valign="middle">
							专业总数：{{item.majorCount}} 个
						</td>
						<td width="33%" align="left" valign="middle">
              班级数：{{item.classCount}} 个
						</td>
					</tr>

       </table>
			</div>
			<div class="campus-add"  @click="modify('add')"  v-perms="'/student/campus/add'">
				<span v-if="data.length"> +继续添加校区 </span>
				<span v-else> +添加校区 </span>
			</div>
		</div>

		<el-dialog title="添加校区" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler">
			<el-form size="mini" :model="campus" :rules="rules" ref="ruleForm" label-width="80px">
				<el-form-item label="校区名称">
					<el-input v-model="campus.name" auto-complete="off" maxlength='30'></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
				<el-button size="mini" type="primary" @click="submitForms()">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="编辑校区" :visible.sync="editor" :close-on-click-modal="false" width="550px" @close="beforeCloseHandler">
			<el-form size="mini" :model="campus" :rules="rules" ref="ruleForm" label-width="80px">
				<el-form-item label="校区名称">
					<el-input v-model="campus.name" auto-complete="off" maxlength='30' @change="nowval"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="editor = false,tijiao=false">取 消</el-button>
				<el-button size="mini" type="primary" @click="submitForm()">确 定</el-button>
			</div>
		</el-dialog>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        tijiao:false,
        activeName:'0',
      	editor:false,
        loading: false,
				dialogFormVisible: false,
        data: [],
        school:{},
        tabsList:['/student/campus','/student/college','/student/major','/student/class','/student/list'],
				rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
				campus: {
					id: '',
					name: '',
					method: 'modify'
				}
      }
    },
    methods: {
      nowval(val){
      this.tijiao=true
      },
      goTab(){
        const that = this;
        this.$router.push({ path: that.tabsList[parseInt(that.activeName)], query: { type:that.activeName }});
      },
      deleteCampus(item){

        this.$confirm('是否确定删除该校区?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {

          this.$http.post('/school/campus/delete', {
            id:item.id
          }).then( (res) => {

            if (res.code == '200') {
              this.fetch();
              this.$message({
                  type: 'success',
                  message: '删除成功!'
              });
            }

          })

        }).catch(() => {

        });


      },
			fetch() {
				this.loading = true;
				this.$http.get('/school/campuses').then(res => {
          this.school = res.data
					this.data = res.data.campusList
					this.loading = false;
				})
			},
			modify(method, item){
				this.campus.method = method
				if (item) {
					this.editor = true
					this.campus.id = item.id
					this.campus.name = item.name
				}else{
					this.dialogFormVisible = true
				}
			},
			beforeCloseHandler() {
        this.tijiao=false
				this.$refs['ruleForm'].resetFields();
        this.campus = {
           id:'',
           name: '',
					 method: 'modify'
         }
			},
			resetForm(formName) {
        this.$refs[formName].resetFields();
      },
			submitForm() {
        if(this.campus.name=='' ){

          this.$message({
            type: 'error',
            message: '请输入校区名称'
          });
          return
        }
        if(this.campus.name &&this.tijiao==true){

          this.$http.post('/school/campus/handle',this.campus).then( (res) => {
            if (res.code === '200') {
               this.resetForm('ruleForm')
               this.$message({
                 type: 'success',
                 message: this.campus.id ?  '修改成功!' : "添加成功"
               });
              this.dialogFormVisible = false;
              this.editor = false
              this.fetch();
            }else{
               this.$message({
                 type: 'error',
                 message: res.msg
               });
            }
          })

        }else {
          this.tijiao=false
          this.editor = false
        }






			},
      submitForms() {
        if(this.campus.name=='' ){

          this.$message({
            type: 'error',
            message: '请输入校区名称'
          });
          return
        }
        if(this.campus.name ){

          this.$http.post('/school/campus/handle',this.campus).then( (res) => {
            if (res.code === '200') {
              this.resetForm('ruleForm')
              this.$message({
                type: 'success',
                message: this.campus.id ?  '修改成功!' : "添加成功"
              });
              this.dialogFormVisible = false;
              this.editor = false
              this.fetch();
            }else{
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })

        }






      }
    },
    created() {
      const that = this;
      that.activeName = that.$route.query.type;
      that.fetch();
    },
    mounted() {

    }
  }
</script>
<style scoped lang="scss">
  .campus {
    border: 1px solid #dedede;
    padding: 10px 20px 20px 20px;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
  }

  .campus td {
    padding-top: 10px;
  }

  .campus-name {
    float: left;
    font-size: 16px;
  }

	.campus-add {
    margin: 0 auto;
    border:1px dashed #e4e1e1;
    margin-top:20px;
		margin-bottom: 20px;
    overflow:hidden;
    font-size:16px;
		height: 60px;
		line-height: 60px;
    text-align:center;
    cursor:pointer;
   }
</style>
