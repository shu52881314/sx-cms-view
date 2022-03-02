<template>

  <div class="rightBg">

    <el-dialog title="新增学期" :visible.sync="dialogVisible" @close="beforeCloseHandler" :close-on-click-modal="false"
               width="550px">
      <div>

        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">

          <el-form-item label="选择学年" prop="yearId">
            <el-col :span="22">
              <el-select clearable style="width:100%" v-model="ruleForm.yearId" placeholder="请选择学年" @change="cxn">
                <el-option v-for="item in termYears" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="学期名称" prop="name">
            <el-col :span="22">
              <el-input maxLength="30" v-model.trim="ruleForm.name"></el-input>
              <!--                    <el-select clearable style="width:100%" v-model="ruleForm.type" placeholder="请选择学期">-->
              <!--                        <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item.id"> </el-option>-->
              <!--                    </el-select>-->
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间" prop="startDate2">
            <el-col :span="22">
              <el-date-picker
                @change="changeStartDate"
                style="width:100%;"
                v-model="ruleForm.startDate2"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="请选择开始日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间" prop="endDate2">
            <el-col :span="22">
              <el-date-picker
                :disabled="isShow"
                style="width:100%;"
                start-placeholder="2017 年 03 月 21 日"
                v-model="ruleForm.endDate2"
                format="yyyy 年 MM 月 dd 日"
                type="date"
                placeholder="请选择结束日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">确定添加</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>

    <el-dialog title="新增学年" :visible.sync="dialogVisible2" :close-on-click-modal="false" width="550px">
      <div>

        <el-form size="mini" :model="ruleForm2" ref="ruleForm2" class="demo-ruleForm">

          <el-form-item align="center">
            <el-select clearable style="width:200px" v-model="ruleForm2.startYear">
              <el-option :value="dqnf-3"></el-option>
              <el-option :value="dqnf-2"></el-option>
              <el-option :value="dqnf-1"></el-option>
              <el-option :value="dqnf"></el-option>
              <el-option :value="dqnf+1"></el-option>
              <el-option :value="dqnf+2"></el-option>
              <el-option :value="dqnf+3"></el-option>

            </el-select>
            -
            <el-select clearable style="width:200px" v-model="ruleForm2.endYear">
              <el-option :value="dqnf-3"></el-option>
              <el-option :value="dqnf-2"></el-option>
              <el-option :value="dqnf-1"></el-option>
              <el-option :value="dqnf"></el-option>
              <el-option :value="dqnf+1"></el-option>
              <el-option :value="dqnf+2"></el-option>
              <el-option :value="dqnf+3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm2()" type="primary">确定添加</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>

    <el-dialog title="编辑年级" :visible.sync="dialogVisible3" :close-on-click-modal="false" width="550px"
               @close="beforeCloseTransForm">
      <div>

        <el-form size="mini" :model="ruleFormnj" ref="ruleFormnj" class="demo-ruleForm nj" :rules="rules">

          <el-form-item align="center" label="年级名称" prop="njname">
            <el-input v-model="ruleFormnj.njname" style="width: 84%"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm3('ruleFormnj')" type="primary">确定提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>
    <el-dialog title="编辑年制" :visible.sync="dialogVisible4" @close="beforeCloseTransForm" :close-on-click-modal="false"
               width="550px">


      <div>

        <el-form size="mini" :model="ruleFormnz" ref="ruleFormnz" class="demo-ruleForm nj" :rules="rules">

          <el-form-item align="center" label="年制名称" prop="njname">
            <el-input v-model="ruleFormnz.njname" style="width: 84%"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm4('ruleFormnz')" type="primary">确定提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>
    <el-dialog title="添加单位" :visible.sync="dialogVisible5" :close-on-click-modal="false" width="550px">
      <div>
        <el-form size="mini" :model="ruleFormdw" ref="ruleFormdw" class="demo-ruleForm nj" :rules="rules">

          <el-form-item align="center" label="单位名称" prop="njname">
            <el-input v-model="ruleFormdw.njname" style="width: 84%"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button @click="submitForm5('ruleFormdw')" type="primary">确定提交</el-button>
          </el-form-item>
        </el-form>

      </div>

    </el-dialog>
    <el-tabs v-model="statusAcitive" @tab-click="handleClick(statusAcitive)">
      <el-tab-pane label="学期管理" name="1">
        <div class="page-head" style="width:98%;margin:0 auto;overflow:hidden;padding-top:20px;">
          <span class="page-title" style="float:left;">学期设置</span>
          <span class="page-tool" style="float:right;margin-right:20px;font-size:12px;">
           <span class="term-icon"><i class="fa fa-exclamation-circle"></i> 学期设置完成后将不可修改,请谨慎填写</span>
          <el-button @click="addTerm" type="increase" size="mini"><i class="fa fa-plus"
                                                                     v-perms="'/system/term/semesrer'"></i> 添加学期</el-button>
        </span>
          <div class="termAll">
            <div class="termMain" v-for="item in term">
              <div class="term-year">{{item.name}}</div>
              <!--占用框-->
              <div v-if="item.terms <= 0" :class="{'show':item.terms <= 0}">

              </div>

              <div style="padding:10px 20px;" v-for="item2 in item.terms">
                <div class="term-term">{{item2.name}}</div>
                <div class="term-data">
                  <div class="term-dataBegin">
                    开始日期
                    {{item2.startDateL | formatD}}
                    <!-- <el-input :disabled="true" v-model="item.startDate | formatDate "  size="mini" class="termPut"></el-input> -->
                  </div>
                  <div class="term-dataEnd">
                 <span>
                   结束日期
                  {{item2.endDateL | formatD}}
                   <!-- <el-input :disabled="true" v-model="item.endDate | formatDate " size="mini" class="termPut"></el-input> -->
                 </span>
                  </div>
                </div>
              </div>
            </div>

            <div @click="dialogVisible2 =  true" class="termMain"
                 style="text-align:center;line-height:250px;font-size:22px;" v-perms="'/system/term/year'">
              + 添加新学年
            </div>


          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="年级管理" name="2">
        <div style="text-align: center;line-height:80px;border: 1px solid #ccc;cursor: pointer;color: #3a8ee6"
             @click="allnj(1)">+ 添加新年级
        </div>
        <div style="height:100px;border: 1px solid #ccc;margin-top: 20px" v-for="(item,index) in nianji">
          <div style="width: 95%;
    height: 58%;
    margin: 20px auto;">
            <p style="overflow: hidden">
          <span style="font-size: 16px;font-weight: 600">
            {{item.name}}
          </span>
              <span style="float: right;">
           <el-button style="    padding: 15px;
    padding-top: 5px;
    padding-bottom: 5px;" @click="allnj(2,item)">修改</el-button>
             <el-button style="    padding: 15px;
    padding-top: 5px;
    padding-bottom: 5px;margin-left: 5px" @click="sanchunianji(item.id)"
                        v-if="item.classNum<=0&&item.studentNum<=0">删除</el-button>
          </span>
            </p>
            <p style="margin-top: 10px;font-size: 14px;">
              <span>班级总数: {{item.classNum}}个</span>
              <span style="margin-left: 88px">学生总数: {{item.studentNum}}个</span>
            </p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="年制管理" name="3">
        <div style="text-align: center;line-height:80px;border: 1px solid #ccc;cursor: pointer;color: #3a8ee6"
             @click="allnz(1)">+ 添加年制
        </div>
        <div style="height:100px;border: 1px solid #ccc;margin-top: 20px" v-for="(item,index) in nianjzhi">
          <div style="width: 95%;
    height: 58%;
    margin: 20px auto;">
            <p style="overflow: hidden">
          <span style="font-size: 16px;font-weight: 600">
            {{item.name}}
          </span>
              <span style="font-size: 14px; margin-left: 20px">专业总数:{{item.majorNum}}个</span>
              <span style="float: right;">
           <el-button style="    padding: 15px;
    padding-top: 5px;
    padding-bottom: 5px;" @click="allnz(2,item)">修改</el-button>
             <el-button style="    padding: 15px;
    padding-top: 5px;
    padding-bottom: 5px;margin-left: 5px" @click="sanchunianzhi(item.id)" v-if="item.majorNum<=0">删除</el-button>
          </span>
            </p>

          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="单位管理" name="4">

        <el-tabs v-model="statusAcitive2" type="card" @tab-click="handleClickdawei(statusAcitive2)" style="width: 50%">
          <el-tab-pane label="单位管理" name="1">
            <div class="main-header"><span v-for="item in danwei" class="main-title" v-if="item.status==1">当前所选单位: {{item.name}}</span>
              <div class="main-btn-box" @click="dialogVisible5=true">
                <button type="button" class="el-button el-button--increase el-button--mini"><span><i
                  class="fa fa-plus"></i> 添加单位</span>
                </button>

              </div>
            </div>
            <div>
              <el-table border :data="danwei" stripe size="mini" style="width: 100%;margin-top: 30px">
                <el-table-column prop="name" label="单位名称" align='center'></el-table-column>
                <el-table-column label="操作" align='center'>
                  <div slot-scope="scope">
                    <p>
                      <el-button type="text" class="opreat-btn" @click.native="setdanwei(scope.row.id,scope.row.name) "
                                 v-if="scope.row.status!=1">设为当前单位
                      </el-button>
                      <span v-if="scope.row.status==1">无</span>
                    </p>
                  </div>
                </el-table-column>

              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="兑换比例" name="2">

          </el-tab-pane>

        </el-tabs>
      </el-tab-pane>

    </el-tabs>


  </div>

</template>

<script>
  export default {
    data() {
      return {
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.ruleForm.startDate2;
            if (beginDateVal) {
              return time.getTime() <= beginDateVal;
            }
          }
        },
        pickerOptions: {
          disabledDate: (time) => {

            // return time.getTime()<=this.xianzhikssj.getTime()
            // let beginDateVal = this.ruleForm.startDate2;
            // if (beginDateVal) {
            //   return time.getTime() <= beginDateVal;
            // }
          }
        },
        // yearPickerOptions: {
        //   disabledDate(time) {
        //    return time.getYear() < new Date().getYear()-1 || time.getYear() > new Date().getYear();
        // }},
        xianzhikssj: '',
        xianzhijissj: '',
        statusAcitive2: "1",
        njtype: "",
        ruleFormnj: {njname: ""},
        ruleFormnz: {njname: ""},
        ruleFormdw: {njname: ""},
        dialogVisible3: false,
        dqnf: "",
        statusAcitive: "1",
        danwei: [],
        nianji: [],
        nianjzhi: [],
        isButton: false,
        dialogVisible2: false,
        isShow: true,
        dialogVisible: false,
        dialogVisible4: false,
        dialogVisible5: false,
        term: [],
        termYears: [],
        ruleForm2: {
          startYear: "",
          endYear: ""
        },
        terms: [
          {
            id: 1,
            name: "第一学期"
          },
          {
            id: 2,
            name: "第二学期"
          }
        ],
        ruleForm: {
          yearId: "",
          name: "",
          type: "",
          startDate: "",
          startDate2: "",
          endDate: "",
          endDate2: ""
        },
        rules: {
          beginYear: [{
            required: true,
            message: "请输入年份",
            trigger: "change"
          }
          ],
          njname: [{
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
          ],
          yearId: [{
            required: true,
            message: "请输入学年",
            trigger: "change"
          }
          ],
          name: [{
            required: true,
            message: "请输入学期名称",
            trigger: "change"
          }
          ],
          startDate2: [{
            required: true,
            message: "请选择开始日期",
            trigger: "change"
          }
          ],
          endDate2: [{
            required: true,
            message: "请选择结束日期",
            trigger: "change"
          }
          ]
        }
      };
    },
    created() {

      this.fetchData();
      this.dqnf = this.doHandleYear();
    },
    methods: {
      beforeCloseTransForm() {
        this.ruleFormnj.id = '';
        this.ruleFormnj.njname = '';
        this.ruleFormnz.id = '';
        this.ruleFormnz.njname = '';
      },
      cxn(val) {

        this.xianzhikssj = ''
        this.xianzhijissj = ''
        for (let i = 0; i < this.termYears.length; i++) {
          if (parseInt(val) == parseInt(this.termYears[i].id)) {
            this.xianzhikssj = this.termYears[i].startYear
            this.xianzhijissj = this.termYears[i].endYear
          }
        }
        ;
        console.log(this.xianzhikssj)
        console.log(this.xianzhijissj)
      },
      handleClick(aname) {
        if (aname == "2") {
          this.getxuenian();
        }
        if (aname == "3") {
          this.getnianzhi();
        }
        if (aname == "4") {
          this.getdanwei();
        }
      },
      handleClickdawei(aname) {
        if (aname == "1") {
          this.getdanwei();
        }
        if (aname == "2") {
          // this.getnianzhi();
        }

      },
      setdanwei(id, name) {
        this.$http.post("/system/unit-use", {
          id: id
        }).then((res) => {
          if (res.code == "200") {
            this.$message({
              type: "success",
              message: "设置成功!"
            });
            localStorage.setItem("hoursUnit", name)
            this.getdanwei();
          }
        })
      },
      allnj(type, item) {
        this.njtype = type;
        console.log(item)
        if (type == 2) {
          this.ruleFormnj.id = item.id;
          this.ruleFormnj.njname = item.name;
        }
        this.dialogVisible3 = true;
      },
      allnz(type, item) {
        this.njtype = type;
        if (type == 2) {
          this.ruleFormnz.id = item.id;
          this.ruleFormnz.njname = item.name;
        }
        this.dialogVisible4 = true;
      },
      sanchunianji(id) {

        this.$confirm("是否确定删除该年级?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

          this.$http.post("/system/grade-del", {
            id: id
          }).then((res) => {

            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getxuenian();

            }

          });

        }).catch(() => {

        });

      },
      sanchunianzhi(id) {

        this.$confirm("是否确定删除该年制?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

          this.$http.post("/system/year-del", {
            id: id
          }).then((res) => {

            if (res.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getnianzhi();

            }

          });

        }).catch(() => {

        });

      },
      getxuenian() {
        this.$http.get("/system/grade-list").then(res => {
          this.nianji = res.data;

        });
      },
      getnianzhi() {
        this.$http.get("/system/year-list").then(res => {
          this.nianjzhi = res.data;

        });
      },
      getdanwei() {
        this.$http.get("/system/unit-list").then(res => {
          this.danwei = res.data;

        });
      },
      doHandleYear() {
        var myDate = new Date();
        var tYear = myDate.getFullYear();

        return tYear;
      },
      submitForm2() {
        if (!this.ruleForm2.startYear) {
          this.$message({
            message: "请选择开始学年",
            type: "warning"
          });
          return;
        }
        if (!this.ruleForm2.endYear) {
          this.$message({
            message: "请选择结束学年",
            type: "warning"
          });
          return;
        }
        this.$http.post("/system/school-year/add", this.ruleForm2).then(res => {
          if (res.code == "200") {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.dialogVisible2 = false;
            this.fetchData();
          }
        });
      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {
            console.log();
            if (this.njtype == 1) {
              let name = this.ruleFormnj.njname;
              this.$http.post("/system/grade-add", {name: name}).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.dialogVisible3 = false;
                  this.getxuenian();
                }
              });
            }
            ;
            if (this.njtype == 2) {
              let obj = {
                name: this.ruleFormnj.njname,
                id: this.ruleFormnj.id
              };
              this.$http.post("/system/grade-edit", obj).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  this.dialogVisible3 = false;
                  this.getxuenian();
                }
              });
            }
            ;

          }
        });

      },
      submitForm4(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {

            if (this.njtype == 1) {
              let name = this.ruleFormnz.njname;
              this.$http.post("/system/year-add", {name: name}).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "添加成功!"
                  });
                  this.dialogVisible4 = false;
                  this.getnianzhi();
                }
              });
            }
            ;
            if (this.njtype == 2) {
              let obj = {
                name: this.ruleFormnz.njname,
                id: this.ruleFormnz.id
              };
              this.$http.post("/system/year-edit", obj).then(res => {
                if (res.code == "200") {
                  this.$message({
                    type: "success",
                    message: "编辑成功!"
                  });
                  this.dialogVisible4 = false;
                  this.getnianzhi();
                }
              });
            }
            ;

          }
        });

      },
      submitForm5(formName) {
        this.$refs[formName].validate((valid) => {

          if (valid) {
            let name = this.ruleFormdw.njname;
            this.$http.post("/system/unit-add", {name: name}).then(res => {
              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.dialogVisible5 = false;
                this.getdanwei();
              }
            });


          }
        });

      },
      beforeCloseHandler() {
        this.resetForm("ruleForm");
        this.ruleForm = {
          type: "",
          startDate2: "",
          endDate2: ""
        };
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getTermYears() {
        this.$http.get("/system/years").then(res => {
          this.termYears = res.data;
        });
      },
      changeStartDate(value) {
        if (value) {
          this.isShow = false;
        } else {
          this.isShow = true;
          this.ruleForm.endDate = "";
        }
      },
      fetchData() {
        this.$http.get("/system/school-year/terms").then(res => {
          this.term = res.data;
        });
      },
      addTerm() {
        this.dialogVisible = true;
        this.getTermYears();

      },
      changYear(value) {
        var date = new Date(value).getYear();
        this.ruleForm.endYear = new Date().setYear(date + 1900 + 1);
      },
      submitForm(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(parseInt(this.ruleForm.startDate2.getFullYear()))
            this.isButton = true;
            if (parseInt(this.ruleForm.startDate2.getFullYear()) >= parseInt(this.xianzhikssj) && parseInt(this.ruleForm.endDate2.getFullYear()) <= parseInt(this.xianzhijissj)) {

            } else {
              this.$message({
                type: "error",
                message: '选择的日期应该在' + this.xianzhikssj + '到' + this.xianzhijissj + '范围之内'
              });
              return
            }
            this.ruleForm.startDate = this.ruleForm.startDate2.getTime();
            this.ruleForm.endDate = this.ruleForm.endDate2.getTime();

            this.$http.post("/system/school-term/add", this.ruleForm).then(res => {

              if (res.code == "200") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.dialogVisible = false;
                this.fetchData();
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });

          }
        });
      }
    }
  };
</script>
<style>
  .nj .el-form-item__error {
    left: 80px !important;
  }
</style>
<style scoped>
  .term-icon {
    font-style: normal;
    color: red;
  }

  .termAll {
    width: 98%;
    margin: 40px auto 0;
    background: url("../../assets/images/term_10.png") repeat-y 3px;
  }

  .term-year {
    padding: 15px;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    background-color: #e6762f;
    color: white;
  }

  .term-term {
    background: url("../../assets/images/term_07.png") no-repeat 4px;
    height: 20px;
    color: #333;
    font-size: 14px;
    text-indent: 22px;
    font-weight: bold;
  }

  .term-data {
    margin-left: 30px;
    margin-top: 20px;
    background: url("../../assets/images/term_bg.png") repeat-y 4px;
  }

  .term-dataBegin {
    background: url("../../assets/images/term_13.png") no-repeat 4px;
    padding-left: 25px;
    font-size: 14px;
  }

  .term-dataEnd {
    background: url("../../assets/images/term_18.png") no-repeat 4px;
    padding-left: 25px;
    font-size: 14px;
    margin-top: 20px;
  }

  .termMain {
    margin-bottom: 20px;
    cursor: pointer;
    float: left;
    border: 1px solid #E4E4E4;
    width: 23%;
    margin-right: 2%;
  }

  .show {
    height: 200px;
  }
</style>
