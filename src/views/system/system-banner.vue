<template>
<div class="rightBg">

    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cleardata" width="50%">
        <div>

            <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

                  <el-form-item label="上传图片" prop="url">
                    <el-col :span="22">
                      <upload  type="4" :image='ruleForm.url' id="upImg2" upload="/upload/image" @uploadSuccessed="uploadSuccessed">
                      </upload>
                      <p  style="color:#999999">为了保证图片效果，banner尺寸为：260*750px</p>
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
              <el-form-item :label="bannerName" >
                <el-col :span="22">
                  <el-input maxlength="100"    v-model="ruleForm.link_uri"></el-input>

                </el-col>
              </el-form-item>

                <!--<el-form-item :label="bannerName" :prop="ruleForm.type == 1 ? 'jumpInfo2' : 'jumpInfo'">-->
                    <!--<el-col :span="22">-->
                         <!--<el-input maxlength="100"  v-if="ruleForm.type == 1"   v-model="ruleForm.jumpInfo"></el-input>-->
                         <!--<el-select style="width:100%;" v-if="ruleForm.type == 2"   v-model="ruleForm.jumpInfo" placeholder="请选择">-->
                           <!--<el-option-->
                             <!--v-for="item in optionAcitvity"-->
                             <!--:key="item.id"-->
                             <!--:label="item.name"-->
                             <!--:value="item.id">-->
                           <!--</el-option>-->
                       <!--</el-select>-->
                       <!--<el-select style="width:100%;" v-if="ruleForm.type == 3"   v-model="ruleForm.jumpInfo" placeholder="请选择">-->
                         <!--<el-option-->
                           <!--v-for="item in optionTribe"-->
                           <!--:key="item.id"-->
                           <!--:label="item.name"-->
                           <!--:value="item.id">-->
                         <!--</el-option>-->
                     <!--</el-select>-->
                    <!--</el-col>-->
                <!--</el-form-item>-->

                <el-form-item label="文字说明" >
                    <el-col :span="22">
                        <el-input maxlength="100" v-model="ruleForm.remark"></el-input>
                    </el-col>
                </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-col :span="22">
                  <el-input maxlength="100" v-model="ruleForm.sort" type="number"></el-input>
                </el-col>
              </el-form-item>
                <el-form-item>
                    <el-button v-if="ruleForm.id" type="primary" @click="submitForm('ruleForm',1)">修改</el-button>
                    <el-button v-if="!ruleForm.id" type="increase" @click="submitForm('ruleForm',2)">添加</el-button>
                </el-form-item>
            </el-form>

        </div>

    </el-dialog>



    <div class="page-head" style="margin:0 auto;padding-top:20px;width:98%;">
        <span class="page-title">轮播图管理</span>
        <span class="page-tool" style="float:right;" v-perms="'/system/banner/add'">
          <el-button  type="increase" size="mini" @click="modify(1)"><i class="fa fa-plus"></i> 添加</el-button>
        </span>
    </div>


    <el-table border ref="multipleTable" header-row-class-name="table-header-row" size="mini" :data="data" style="width: 98%;padding-top:12px;margin:0 auto;">

        <el-table-column prop="url" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.url" style="max-width:150px;">
          </template>
        </el-table-column>
        <!--<el-table-column prop="jumpInfo" label="标题">-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.jumpInfoName}}-->
            <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="type" label="类型">
            <template slot-scope="scope">
              {{scope.row.type==1 ? "内链" : (scope.row.type==2 ? "外联" : "无连接")}}
           </template>
        </el-table-column>
        <el-table-column prop="remark" label="文字说明"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column  label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.status==1?"启用":"禁用"}}
        </template>
      </el-table-column>
        <el-table-column header-align="center" width="150" label="操作">
            <template slot-scope="scope">
               <div  style="text-align:center">
                 <el-button   type="text" size="mini" @click="zhuangtai(scope.row)">{{scope.row.status==1?'禁用':'启用'}}</el-button>
                 <el-button   type="text" size="mini" @click="modify(2,scope.row)" v-perms="'/system/banner/edit'">编辑</el-button>
                 <el-button  type="text" size="mini" @click="deleteBanner(scope.row.id)" v-perms="'/system/banner/delete'">删除</el-button>
               </div>
         </template>
        </el-table-column>
    </el-table>

    <!--<div class="block text-center mt20" style='padding-top:20px;' v-if="params.total!=0">-->
      <!--<qu-pagination :current2="params.current" :total="params.total" @change="changePagexf"-->
                     <!--ref="mychilds"></qu-pagination>-->
    <!--</div>-->

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
                value:0,
                label:'无链接',

              },
              {
                value:1,
                label:'内链',

              },
              {
                value:2,
                label:'外链',

              },

            ],
          val:'',
            imageUrl: '',
            ruleForm: {
                id: '',
              link_uri: '',
                url: '',
                type:'',
              sort:'',
              remark: '',
                position:1,
            },
            params: {
                total: 0,
                current: 1,
                size: 1,
                // position:1,
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
              sort: [{
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
      cleardata(){
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields()
        })
this.dialogVisible=false
      },
      zhuangtai(row){

        if (row.status==1){
          var obj={
            id:row.id,
            status:0
          }
        } ;
        if (row.status==0){
          var obj={
            id:row.id,
            status:1
          }
        } ;
        this.$http.post("/system/slideshow-editStatus", obj).then((res) => {

          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.fetchData();
          }
        })

      },
      changePagexf(current, size) {
        this.params.current = current
        this.params.size = size
        this.fetchData();
      },
        changeType(val){

        // this.ruleForm.type=val.urltype
          // if (val==1){
          //
          // }

           // if (type==1) {
           //   this.ruleForm.jumpInfo = ""
           // }else if (type==2) {
           //   this.bannerName = '链接地址'
           //   this.$http.get("/system/banner/activity",{params:{
           //   	status:'5'
           //   }}).then(res => {
           //     this.optionAcitvity = res.data;
           //     this.ruleForm.jumpInfo = ""
           //   })
           // }else if (type==3) {
           //   this.bannerName = '组织名称'
           //   this.$http.get("/organization/department",{params:{
           //   	nature:'2,3,5'
           //   }}).then(res => {
           //     this.optionTribe = res.data;
           //     this.ruleForm.jumpInfo = ""
           //   })
           //
           // }
        },
        uploadSuccessed(url) {
          var that = this
          this.$set(that.ruleForm,'url', url)
        },
        fetchData() {
            this.$http.get('/system/slideshow-list', {params: this.params}).then(res => {
                this.data = res.data.list
                // this.params.current = res.data.pageNum
                // this.params.total = res.data.total
            })
        },
        // handleSizeChange(pageSize) {
        //  this.params.pageSize = pageSize;
        //  this.fetchData();
        // },
        // handleCurrentChange(page) {
        //     this.params.currentPage = page;
        //     this.fetchData();
        // },
      position() {
          this.imageUrl = ""
          this.ruleForm = {
            id: '',
            link_uri: '',
            url: '',
            type:'',
            sort:'',
            remark: '',
            position:1,
          }
          this.optionAcitvity = []
          this.optionTribe = []

        },
        modify(type,row) {
          getOssToken()
          // setTimeout(() => {
          //   this.$refs['ruleForm'].resetFields();
          // }, 10);
          this.dialogVisible = true;

         if(type==1){
          this.position()
         }else {
           if (row.id) {
             let _this = this;
             this.title = '修改'
             _this.ruleForm.id = row.id
             _this.ruleForm.link_uri = row.link_uri
             _this.ruleForm.remark = row.remark
             _this.ruleForm.type = parseInt(row.type)
             _this.ruleForm.sort = row.sort
             _this.ruleForm.url = row.url


           }
         }


        },
        submitForm(formName, type) {

            this.$refs[formName].validate((valid) => {
                if (valid) {
                  if (this.ruleForm.type!=0&&this.ruleForm.link_uri==''){
                    this.$message({
                      type: 'error',
                      message: '请输入链接地址'
                    });
                    return
                  } ;
                    if (type == 1) {
                      this.$http.post("/system/slideshow-edit", this.ruleForm).then((res) => {

                        if (res.code == '200') {
                          this.$message({
                            type: 'success',
                            message: '修改成功!'
                          });
                          this.dialogVisible = false;
                          this.fetchData();
                        }
                      })


                    } else if (type == 2) {


                      this.$http.post("/system/slideshow-add", this.ruleForm).then((res) => {
                        if (res.code == '200') {
                          this.$message({
                            type: 'success',
                            message: '添加成功!'
                          });

                          this.dialogVisible = false;
                          this.position()
                          this.fetchData();

                        }
                      })

                    }

                } else {
                    return false;
                }
            });
        },
        deleteBanner(id){
          this.$confirm('是否删除此图片吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/system/slideshow-del', {id: id}).then(res => {
                if (res.code === '200') {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.fetchData();
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
