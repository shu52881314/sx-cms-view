<template>
  <div>
    <el-dialog title="编辑类型" :visible.sync="dialogVisible" :close-on-click-modal="false" width="550px">
      <div>

        <el-form size="mini" :model="ruleFormnj" ref="ruleFormnj" class="demo-ruleForm nj" :rules="rules">

          <el-form-item align="center" label="类型名称" prop="name">
            <el-input v-model="ruleFormnj.name" style="width: 84%"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm3('ruleFormnj')" type="primary">确定提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>
    <div class="page-head" style="margin:15px auto;padding-top:20px;width:98%;">
      <span class="page-title" >类型</span>
      <span class="page-tool" style="float:right;" @click="alllx(1)">
          <el-button  type="increase" size="mini" ><i class="fa fa-plus"></i> 添加</el-button>
        </span>
    </div>
    <el-row>
      <el-table border :loading="loading" :data="list" stripe size="mini" style="width: 100%">
        <el-table-column prop="name" label="类型名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actNum" label="举办活动数" show-overflow-tooltip></el-table-column>
        <el-table-column  label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.status==1?"启用":"禁用"}}
          </template>
        </el-table-column>
        <el-table-column header-align="center" width="150" label="操作">
          <template slot-scope="scope">
            <div  style="text-align:center">
              <el-button   type="text" size="mini" @click="zhuangtai(scope.row)">{{scope.row.status==1?'禁用':'启用'}}</el-button>
              <el-button   type="text" size="mini" @click="alllx(2,scope.row)" >编辑</el-button>
              <el-button  type="text" size="mini" @click="deleteBanner(scope.row.id)" v-if="scope.row.actNum<=0">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>-->
    </el-row>
  </div>

</template>

<script>
  import {parseTime} from '@/utils/format.js'

  export default {
    name: "index",
    data() {
      return {
        njtype:'',
        dialogVisible:false,
        ruleFormnj: { name: "" },
        rules: {

          name: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }],


        },
        list: [],
        total: 0,
        loading: false,
        params: {
          current: 1,
          size: 10,
        }
      }
    }, methods: {
      changePage(current, size) {
        const that = this;
        that.params.current = current
        that.params.size = size
        that.loadList()
      },
      deleteBanner(id){
        this.$confirm('是否删除此类型吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/system/dictType-del', {id: id}).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.loadList();
            }
          })
        }).catch( () => {

        })

      },
      alllx(type, row) {
        this.ruleFormnj.name=''
        this.ruleFormnj.id=''
        this.njtype = type;
        if(row){
          this.ruleFormnj.id =row.id;
          this.ruleFormnj.name =row.name;
        }

        this.dialogVisible = true;
      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            if (this.njtype == 1) {
              let name = this.ruleFormnj.name;
              this.$http.post("/system/dictType-add", { name: name }).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.dialogVisible = false;

                  this.loadList();
                }
              });
            }

            if (this.njtype == 2) {
              let obj = {
                name: this.ruleFormnj.name,
                id: this.ruleFormnj.id
              };
              this.$http.post("/system/dictType-edit", obj).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });

                  this.dialogVisible = false;
                  this.loadList();
                }
              });
            }
            ;

          }
        });

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
        this.$http.post("/system/dictType-editStatus", obj).then((res) => {

          if (res.code == '200') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });
            this.loadList()
          }
        })

      },
      loadList() {
        const that = this;
        that.loading = true
        that.$http.get('/system/dictType-list').then(res => {
          if (res.code == 200) {
            that.list = res.data
            // that.total = res.data.total
            that.loading = false
          }
        })
      }
    }, mounted() {
      const that = this;
      that.loadList();
    }, filters: {
      parseTime(time) {
        return parseTime(time);
      }
    }
  }
</script>
<style>
  .nj .el-form-item__error {
    left: 80px !important;
  }
</style>
<style scoped>

</style>
