<template>
<div class="rightBg">

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="beforeCloseHandler" width="30%">
        <div>

            <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

                <el-form-item label="上传banner" prop="url">
                    <el-col :span="22">
                      <upload type="6" :image='ruleForm.url' id="upImg2" upload="/upload/image" @uploadSuccessed="uploadSuccessed">
                      </upload>
                    </el-col>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                  <el-select @change="changeType" size="mini" v-model="ruleForm.type" placeholder="请选择类型">
                    <el-option
                      v-for="item in types"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="bannerName"  :prop="ruleForm.type == 1 ? 'jumpInfo2' : 'jumpInfo'">
                    <el-col :span="22">
                         <el-input maxlength="100" v-if="ruleForm.type == 1"   v-model="ruleForm.jumpInfo"></el-input>
                         <el-select style="width:100%;" v-else   v-model="ruleForm.jumpInfo" placeholder="请选择">
                           <el-option
                             v-for="item in optionAcitvity"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                           </el-option>
                       </el-select>
                       <!-- <el-select style="width:100%;" v-if="ruleForm.type == 3"   v-model="ruleForm.jumpInfo" placeholder="请选择">
                         <el-option
                           v-for="item in optionTribe"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                         </el-option>
                     </el-select> -->
                    </el-col>
                </el-form-item>

                <el-form-item label="文字说明" prop="comment">
                    <el-col :span="22">
                        <el-input maxlength="100" v-model="ruleForm.comment"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
                    <el-button v-if="!ruleForm.id" type="primary" @click="submitForm('ruleForm',2)">添加</el-button>
                </el-form-item>
            </el-form>

        </div>

    </el-dialog>



    <div class="page-head" style="margin:0 auto;padding-top:20px;width:98%;"  v-perms="'/system/banner/add'">
        <span class="page-title">banner管理</span>
        <span class="page-tool" style="float:right;" v-if="data.length < 5">
          <el-button type="warning" size="mini" @click="modify()"><i class="fa fa-plus"></i> 添加</el-button>
        </span>
    </div>


    <el-table ref="multipleTable" header-row-class-name="table-header-row" size="mini" :data="data" style="width: 98%;padding-top:12px;margin:0 auto;">

        <el-table-column prop="url" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.url" style="max-width:200px;">
          </template>
        </el-table-column>
        <el-table-column prop="jumpInfo" label="标题">
            <template slot-scope="scope">
              {{scope.row.jumpInfoName}}
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
            <template slot-scope="scope">

              {{scope.row.type==1 ? "H5" : (scope.row.type== 4 ? "党建活动" : (scope.row.type== 5 ? '团建活动' : (scope.row.type == 6 ? '先进管理' : (scope.row.type == 7 ? '宣传平台' : '其他' ) ) ) )}}

           </template>
        </el-table-column>
        <el-table-column prop="comment" label="文字说明"></el-table-column>
        <!--<el-table-column prop="orderNo" label="排序"></el-table-column>-->
        <el-table-column header-align="center" width="150" label="操作">
            <template slot-scope="scope">
               <div  style="text-align:center">
                 <el-button   type="text" size="mini" @click="modify(scope.row)" v-perms="'/system/banner/edit'">编辑</el-button>
                 <el-button  type="text" size="mini" @click="deleteBanner(scope.row.id)" v-perms="'/system/banner/delete'">删除</el-button>
               </div>
         </template>
        </el-table-column>
    </el-table>

    <!--<div class="block text-center mt20" style='padding-top:20px;' v-if="params.total!=0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.currentPage" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="params.total">
      </el-pagination>-->
    </div>

</div>
</template>

<script>
import {getOssToken,getAliyunImageUrl} from "@/utils/filters"
export default {
    data() {
        return {
        	title:'添加',
            optionTribe:[],
            optionAcitvity:[],
            bannerName:"链接地址",
            id:"fileUpload",
            fileURl:"",
            ossUrl:'',
            types:[
              {
                value:1,
                label:'H5'
              },
              // {
              //   value:4,
              //   label:'党建活动'
              // },
              // {
              //   value:5,
              //   label:'团建活动'
              // },
              {
                value:6,
                label:'先进管理'
              },
              {
                value:7,
                label:'宣传平台'
              }
            ],
            imageUrl: '',
            ruleForm: {
                id: '',
                type:1,
                jumpInfo: '',
                url: '',
                comment: '',
                position:2,
            },
            params: {
                current:1,
                size:10,
                position:2
            },
            rules: {
                url: [{
                        required: true,
                        message: '请上传banner',
                        trigger: 'blur'
                    },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                jumpInfo: [{
                        required: true,
                        message: '请正确输入内容',
                        trigger: 'change'
                    },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                type: [{
                        required: true,
                        message: '请选择类型',
                        trigger: 'blur'
                    },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                comment: [{
                        required: true,
                        message: '请输入文字说明',
                        trigger: 'blur'
                    },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                orderNo: [{
                        required: true,
                        message: '请输入排序',
                        trigger: 'blur'
                    },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
            data: [],
            credentials:{}
        }
    },
    props:{
           name:String,
       },
    created() {
       this.fetchData();
       // this.getStsToken();
    },
    methods: {
        changeType(type){

           if (type==1) {
             this.bannerName = '链接地址'
             this.ruleForm.jumpInfo = ""
           }else if (type==4) {
             this.bannerName = '党建活动'
             this.$http.get("/activity/list",{params:{
                 current: 1,
         				 size: 1000,
                 type:3,
             }}).then(res => {

               this.optionAcitvity = res.data.list;
               this.ruleForm.jumpInfo = ""
             })
           }else if (type==5) {
             this.bannerName = '团建活动'
             this.$http.get("/activity/list",{params:{
               current: 1,
               size: 1000,
               type:2,
             }}).then(res => {
               this.optionAcitvity = res.data.list;
               this.ruleForm.jumpInfo = ""
             })
           }else if (type==6) {
             this.bannerName = '先进管理'
             this.$http.get("ideology/advancdes",{params:{
               current: 1,
               size: 1000,
             }}).then(res => {
               this.optionAcitvity = res.data.map( item => {
                 return {
                   id:item.id,
                   name:item.theme
                 }
               });
               this.ruleForm.jumpInfo = ""
             })
           }else if (type==7) {
             this.bannerName = '宣传平台'
             this.$http.get("ideology/studio/list",{params:{
               current: 1,
               size: 1000,
             }}).then(res => {

               this.optionAcitvity = res.data.list.map( item => {
                 return {
                   id:item.id,
                   name:item.theme
                 }
               });
               this.ruleForm.jumpInfo = ""
             })
           }
        },
        uploadSuccessed(url) {

          var that = this
          this.$set(that.ruleForm,'url', url)
        },
        fetchData() {
            this.$http.get('/system/banners', {params: this.params}).then(res => {
                // this.data = res.data.list.filter( item => {
                //   return item.url = getAliyunImageUrl(item.url,100,100)
                // })
                this.data = res.data.list
                this.params.currentPage = res.data.pageNum
                this.params.total = res.data.total
            })
        },
        handleSizeChange(pageSize) {
         this.params.pageSize = pageSize;
         this.fetchData();
        },
        handleCurrentChange(page) {
            this.params.currentPage = page;
            this.fetchData();
        },
        beforeCloseHandler() {
          this.imageUrl = ""
          this.ruleForm = {
              id: '',
              jumpInfo: '',
              href: '',
              position:3,
              type:1,
              comment: '',
          }
          this.optionAcitvity = []
          this.optionTribe = []
          this.bannerName = '链接地址'
        },
        modify(row) {
            let _this = this;
            this.dialogVisible = true;
            if (row) {
            	this.title = '编辑'
                _this.ruleForm.id = row.id
                _this.ruleForm.url = row.url
                _this.ruleForm.comment = row.comment
                _this.ruleForm.type = parseInt(row.type)
                // _this.ruleForm.orderNo = row.orderNo
               _this.imageUrl = row.url
               if (row.type == 1) {
               	this.ruleForm.jumpInfo = row.jumpInfoName
              } else if (row.type == 4) {

                this.bannerName = '党建活动'
                this.$http.get("/activity/list",{params:{
                    current: 1,
            				 size: 1000,
                    type:3,
                }}).then(res => {
                  this.optionAcitvity = res.data.list;
                  this.ruleForm.jumpInfo = parseInt(row.jumpInfoId)
                })

              }else if (row.type == 5) {
                this.bannerName = '团建活动'
                this.$http.get("/activity/list",{params:{
                  current: 1,
                  size: 1000,
                  type:2,
                }}).then(res => {
                  this.optionAcitvity = res.data.list;
                  this.ruleForm.jumpInfo = parseInt(row.jumpInfoId)
                })
              }else if (row.type == 6) {
                this.bannerName = '先进管理'
                this.$http.get("ideology/advancdes",{params:{
                  current: 1,
                  size: 1000,
                }}).then(res => {
                  this.optionAcitvity = res.data.map( item => {
                    return {
                      id:item.id,
                      name:item.theme
                    }
                  });
                  this.ruleForm.jumpInfo = parseInt(row.jumpInfoId)
                })
              }else if (row.type == 7) {
                this.bannerName = '宣传平台'
                this.$http.get("ideology/studio/list",{params:{
                  current: 1,
                  size: 1000,
                }}).then(res => {

                  this.optionAcitvity = res.data.list.map( item => {
                    return {
                      id:item.id,
                      name:item.theme
                    }
                  });
                    this.ruleForm.jumpInfo = parseInt(row.jumpInfoId)
                })


               }

               // if (row.type == 2) {
               //   _this.$http.get("/system/banner/activity",{params:{
               //   	status:'5'
               //   }}).then(res => {
               //     _this.optionAcitvity = res.data;
               //     _this.bannerName = '活动名称'
               //     _this.ruleForm.jumpInfo = parseInt(row.jumpInfo);
               //   })
               // }else if (row.type == 3) {
               //   _this.$http.get("/organization/department",{params:{
               //   	nature :'2,3,5'
               //   }}).then(res => {
               //     _this.optionTribe = res.data;
               //     _this.bannerName = '部落名称'
               //     _this.ruleForm.jumpInfo = parseInt(row.jumpInfo)
               //   })
               // }

            }
        },
        submitForm(formName, type) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (type == 1) {
                      this.$http.post("/system/banner/modify", this.ruleForm).then((res) => {

                        if (res.code == '200') {
                          this.$message({
                            type: 'success',
                            message: '修改成功!'
                          });
                          this.dialogVisible = false;
                          this.fetchData();
                        }else{
                         //  this.$notify({
                         //   title: '警告',
                         //   message: res.msg,
                         //   type: 'warning'
                         // });
                        }
                      })


                    } else if (type == 2) {
                      this.$http.post("/system/banner/add", this.ruleForm).then((res) => {
                        if (res.code == '200') {
                          this.$message({
                            type: 'success',
                            message: '添加成功!'
                          });
                          this.dialogVisible = false;
                          this.fetchData();
                        }else{
                         //  this.$notify({
                         //   title: '警告',
                         //   message: res.msg,
                         //   type: 'warning'
                         // });
                        }
                      })

                    }

                } else {
                    return false;
                }
            });
        },
        deleteBanner(id){
          this.$confirm('是否删除此banner?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/system/banner/delete', {id: id}).then(res => {
                if (res.code === '200') {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.fetchData();
                } else {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    });
                }
            })
          }).catch( () => {

          })

        }
    },
    mounted () {

    }

}

</script>
<style>
#upImg2 i{
	border-radius:0;
	height: 140px;
	width: 280px;
	line-height: 140px;
}
#upImg2 img{
	border-radius:0;
	height: 140px;
	width: 280px;
	line-height: 140px;
}
.hrefColor {
    color: #66b1ff;
}
</style>
