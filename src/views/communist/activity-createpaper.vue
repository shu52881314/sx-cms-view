<template>
    <div>
      <div class="main-header">
        <span class="main-title">{{pagerParam.type==1?'添加投票':pagerParam.type==2?'添加问卷':pagerParam.type==3?'添加测评':pagerParam.type==4?'添加征集':pagerParam.type==5?'添加留言':''}}</span>
      </div>
      <div v-if="pagerParam.type<4" class="tianjia">
        <el-tabs v-model="statusAcitive"  type="border-card"  @tab-click="handleClickti(statusAcitive)">
          <el-tab-pane label="添加单选题" name="1" >
            <el-form v-if="statusAcitive=='1'"  style="width: 50%"  ref="activityone" class="demo-ruleForm" :model="paramsxiao" :rules="ruleone"   >

              <el-form-item label="标题:" label-width="60px"  prop="questionStem">
                  <el-input placeholder="请输入小题题目" v-model="paramsxiao.questionStem" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="选项:" label-width="60px"  >
                <div v-if="options.length >= 1" v-for="(option,index) in options" style="margin-top: 20px">
                  <el-input style="width: 65%" :placeholder="'请输入选项' + (++index)" type="textarea" v-model="option.value" :style="option.allRight == 1?'border: 1px solid red':''"></el-input>
                    <div style="width: 20%;
    display: inline-block;">
                      <el-button @click="deleteOption(option.id)" style="    padding-bottom: 8px;
    padding-top: 8px;  margin-bottom: 10px;margin-left: 6px">删除</el-button>

                      <el-button v-if="pagerParam.type == 3" @click="rightOption(option)"  style="    padding-bottom: 8px;
    padding-top: 8px;">
                        {{option.allRight == 1 ? '取消正确项' : '设为正确项'}}
                      </el-button>
                    </div>

                </div>

              </el-form-item>

              <span @click="addOptions()" style="color:#10aeff;margin-left: 56px;cursor: pointer" class="cu-form-group">
                + 添加选项
              </span>
                <el-form-item  label="分值:" label-width="109px"  prop="questionScore" style="margin-top: 15px" v-if="pagerParam.type == 3" >
                  <el-input placeholder="请填写分值" v-model="paramsxiao.questionScore" type="number" style="width: 57%"></el-input>
                </el-form-item>
              <el-form-item label="是否必答:" label-width="138px"   style="margin-top: 10px">
                <el-radio v-model="paramsxiao.required" label="2">否</el-radio>
                <el-radio v-model="paramsxiao.required" label="1">是</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('activityone')" style="    width: 60%;
    margin-left: 56px;">编辑完成</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="添加多选题" name="2" >
            <el-form v-if="statusAcitive=='2'" style="width: 50%"  ref="activityone" class="demo-ruleForm" :model="paramsxiao" :rules="ruleone"   >

              <el-form-item label="标题:" label-width="60px"  prop="questionStem">
                <el-input  placeholder="请输入小题题目" v-model="paramsxiao.questionStem" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="选项:" label-width="60px"  >
                <div v-if="options.length >= 1" v-for="(option,index) in options" style="margin-top: 20px">
                  <el-input style="width: 65%" :placeholder="'请输入选项' + (++index)" type="textarea" v-model="option.value" :style="option.allRight == 1?'border: 1px solid red':''"></el-input>
                  <div style="width: 20%;
    display: inline-block;">
                    <el-button @click="deleteOption(option.id)" style="    padding-bottom: 8px;
    padding-top: 8px;  margin-bottom: 10px;margin-left: 6px">删除</el-button>

                    <el-button v-if="pagerParam.type == 3" @click="rightOption(option)"  style="    padding-bottom: 8px;
    padding-top: 8px;">
                      {{option.allRight == 1 ? '取消正确项' : '设为正确项'}}
                    </el-button>
                  </div>

                </div>

              </el-form-item>

              <p @click="addOptions()" style="color:#10aeff;margin-left: 56px;cursor: pointer" class="cu-form-group">
                + 添加选项
              </p>
              <div style="margin-top: 10px;margin-left: 56px">
                <el-form-item  prop="limitFew" style="display: inline-block;width: 32%;margin-bottom: 0">
                  <el-select clearable v-model="paramsxiao.limitFew"  placeholder="请选择最少选择几项">
                    <el-option
                      v-for="item in zui"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="limitMore" style="display: inline-block;width: 32%;margin-bottom: 0;margin-left: 5px">
                  <el-select clearable v-model="paramsxiao.limitMore"  placeholder="请选择最多选择几项">
                    <el-option
                      v-for="item in zui"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item  label="分值:" label-width="109px"  prop="questionScore" style="margin-top: 15px" v-if="pagerParam.type == 3" >
                <el-input placeholder="请填写分值" v-model="paramsxiao.questionScore" type="number" style="width: 57%"></el-input>
              </el-form-item>
              <el-form-item label="是否必答:" label-width="138px"   style="margin-top: 10px">
                <el-radio v-model="paramsxiao.required" label="2">否</el-radio>
                <el-radio v-model="paramsxiao.required" label="1">是</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('activityone')" style="    width: 60%;
    margin-left: 56px;">编辑完成</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="添加填空题" name="4" v-if="pagerParam.type>1">
            <el-form v-if="statusAcitive=='4'" style="width: 50%"  ref="activityone" class="demo-ruleForm" :model="paramsxiao" :rules="ruleone"   >

              <el-form-item label="标题:" label-width="60px"  prop="questionStem">
                <el-input placeholder="请输入小题题目" v-model="paramsxiao.questionStem" type="textarea"></el-input>
              </el-form-item>
              <span @click="addInput()" style="color:#10aeff;margin-left: 56px;cursor: pointer" class="cu-form-group" v-if="paramsxiao.questionType == 4">
                + 添加填空符
              </span>
              <el-form-item  label="分值:" label-width="109px"  prop="questionScore" style="margin-top: 15px" v-if="pagerParam.type == 3" >
                <el-input placeholder="请填写分值" v-model="paramsxiao.questionScore" type="number" style="width: 57%"></el-input>
              </el-form-item>
              <el-form-item label="是否必答:" label-width="138px"   style="margin-top: 10px">
                <el-radio v-model="paramsxiao.required" label="2">否</el-radio>
                <el-radio v-model="paramsxiao.required" label="1">是</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('activityone')" style="    width: 60%;
    margin-left: 56px;">编辑完成</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="添加问答题" name="5" v-if="pagerParam.type>1">
            <el-form v-if="statusAcitive=='5'" style="width: 50%"  ref="activityone" class="demo-ruleForm" :model="paramsxiao" :rules="ruleone"   >

              <el-form-item label="标题:" label-width="60px"  prop="questionStem">
                <el-input placeholder="请输入小题题目" v-model="paramsxiao.questionStem" type="textarea"></el-input>
              </el-form-item>
              <el-form-item  label="分值:" label-width="109px"  prop="questionScore" style="margin-top: 10px" v-if="pagerParam.type == 3" >
                <el-input placeholder="请填写分值" v-model="paramsxiao.questionScore" type="number" style="width: 57%"></el-input>
              </el-form-item>
              <el-form-item label="是否必答:" label-width="138px"   style="margin-top: 10px">
                <el-radio v-model="paramsxiao.required" label="2">否</el-radio>
                <el-radio v-model="paramsxiao.required" label="1">是</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('activityone')" style="    width: 60%;
    margin-left: 56px;">编辑完成</el-button>
              </el-form-item>
            </el-form>


          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="margin-top: 20px">
        <p style="line-height: 44px;">
           <span style="color:red;">*</span> {{pagerParam.type==1?'投票名称':pagerParam.type==2?'问卷名称':pagerParam.type==3?'测评名称':pagerParam.type==4?'征集名称':pagerParam.type==5?'留言名称':''}}
          <span style="width: 30%;display: inline-block;margin-left: 10px">
          <el-input v-model="params.name" placeholder="请输入内容"></el-input>
          </span>
        </p>
        <p style="line-height: 44px;">
          <span style="color:red;">*</span> {{pagerParam.type==1?'投票说明':pagerParam.type==2?'问卷说明':pagerParam.type==3?'测评说明':pagerParam.type==4?'征集说明':pagerParam.type==5?'留言说明':''}}
          <span style="width: 30%;display: inline-block;margin-left: 10px;vertical-align: text-top">
          <el-input v-model="params.introduction" placeholder="请输入内容"  type="textarea" resize="none"></el-input>
          </span>
        </p>
        <p style="line-height: 44px;" v-if="pagerParam.type==5">
          开启留言审核
          <span style="width: 30%;display: inline-block;margin-left: 10px;">
            <el-radio v-model="params.audit" :label="0">关闭</el-radio>
         <el-radio v-model="params.audit" :label="1">开启</el-radio>

          </span>
        </p>
          <div v-for=" (question,index) in questions" style="  width: 75%;margin-top: 10px;"  v-if="pagerParam.type <= 3">
            <p class="xinxitou">
              <span v-if="question.required == 1" style="color: red">*</span>
              <span v-if="question.question_type != 4"> {{(index + 1) + '、' + question.question_stem}}
                    {{pagerParam.type==3 ? question.question_score + '分': ''}}
                </span>
              <span v-if="question.question_type == 4"
                    v-html="(index + 1) + '、' + question.question_stem.replace(new RegExp('_','g'),tempInput)"></span>
            </p>
            <!--单选-->
            <div>
              <p v-for=" (xuanxiang,index) in question.option" style="padding: 10px" class="xuan" v-if="question.question_type == 1">

                <span ><el-radio :value="radioModel" ></el-radio></span>
                <span >{{index+1}}.</span>
                <span>{{xuanxiang.option_cont}}</span>
              </p>
            </div>

            <!--多选-->
            <div>
              <p v-for=" (xuanxiang,index) in question.option" style="padding: 10px" class="xuan" v-if="question.question_type ==2">

                <span ><el-checkbox :value="radioModel" ></el-checkbox></span>
                <span style="margin-left: 15px">{{index+1}}.</span>
                <span>{{xuanxiang.option_cont}}</span>
              </p>
            </div>

            <!--问答题-->
            <p style="margin-top: 1rem" v-if="question.question_type == 5">
              <span style=" margin-left: 18px;">
                答：<el-input style="display: inline-block;
    width: 50%;vertical-align: text-top;" type="textarea" class="my-input"/>
              </span>
            </p>

          <p style="text-align: center">

              <el-button type="primary" @click="bianji(question)" style="margin: 15px;">编辑</el-button>
              <el-button type="primary" @click="listUp(index)" style="margin: 15px;">上移</el-button>
              <el-button type="primary" @click="listDown(index)" style="margin: 15px;">下移</el-button>
              <el-button type="primary" @click="listDelete(question.question_id)" style="margin: 15px;">删除</el-button>
          </p>
        </div>
      </div>
      <div style="text-align: center; width: 75%;" v-if="questions.length>0">
        <el-button type="primary" @click="savePaper()" style="margin: 15px;">保存并继续</el-button>
      </div>
      <div style="margin-left: 74px; width: 75%;" v-if="questions.length<=0">
        <el-button type="primary" @click="savePaper()" style="margin: 15px;">保存并继续</el-button>
      </div>
    </div>
</template>

<script>

  export default {
    name: "activity-createpaper",

    data() {
      return{
        ruleone: {
          questionStem: [{
            required: true, message: "请输入题目标题", trigger: "blur"
          }],
          questionScore: [{
            required: true, trigger: 'blur',  pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: "必须大于0"
          }],
          limitMore: [{
            required: true, message: "请选择最多几项", trigger: "change"
          }],
          limitFew: [{
            required: true, message: "请选择最少几项", trigger: "change"
          }],
        },
        zui:[],

        options: [],
        tempInput: '<input style="border: none;border-bottom:1px solid #ccc" class="my-input"/>',
        radioModel:'',
        statusAcitive:'',
        tabBar:[],
        questions: [],
        pagerParam: {
          type: this.$route.query.papertype,
          paperId: '',
          actId: this.$route.query.actiyId,
        },
        params: {
          paperId: '',
          actId: this.$route.query.actiyId,
          paperType: this.$route.query.papertype,
          name: '',
          introduction: '',
          status: 0,
          questions: null,
          audit: 0,
        },
        paramsxiao: {
          required: '1',//是否必答
          questionType: '',//小题类型
          questionStem: '',//题干
          limitMore: '',//最多选项
          limitFew: '',//最少几项
          options: [],
          questionSort: 0,
          paperId: '',
          questionScore:''
        },
        queryPro: {//回显时使用的临时变量
          id: '',
        },
        tempParams: {//只有征集和留言使用此对象
          required: 0,//是否必答
          questionType: 5,//征集和留言需要创建一条问答题
          questionStem: '',//题干
          limitMore: 1,//最多选项
          limitFew: 1,//最少几项
          options: [],
          questionSort: 0,
          paperId: '',
          questionScore: 0
        },
      }
    },
    mounted(){
    this.initVolume()
    },
    methods:{
      submit(formName) {
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.saveQuestion()
          } else {
            return false;
          }
        });
      },
      initVolume() {//创建临时答卷
        const that = this;
        this.$http.post('/activity/paper/save', this.params).then(res => {
          if (res.code == 200) {
            that.pagerParam.paperId = res.data
            that.initPager();
          } else {
            this.$message({
              type: 'error',
              message: '临时问卷创建失败，请稍后重试'
            });

          }
        })
      },
      initPager() {//初始化答卷
        const that = this;

        if (that.pagerParam.paperId) {
          this.$http.get('/activity/paper/info',{ params: this.pagerParam }  ).then(res => {

            if (res.code == 200) {
              that.tabBar = [];
              that.questions = res.data.question;
              for (let i = 0; i < res.data.question.length; i++) {
                that.tabBar.push(false);
              }
            } else {
              this.$message({
                type: 'error',
                message: '临时问卷创建失败，加载题列表失败'
              });
            }

          })
        } else {
          this.$message({
            type: 'error',
            message: '临时问卷创建失败，加载题列表失败'
          });
        }
      },
      initOptions() {//默认初始化4个选项
        const that = this;
        that.options = [];
        for (let i = 0; i < 4; i++) {
          let tempOption = new Object();
          tempOption.value = '';
          tempOption.id = i;
          tempOption.allRight = 0;
         that.options.push(tempOption);
        }
      },
      initOptionszui() {//默认初始化4个下拉选项
        const that = this;
        that.zui = [];
        for (let i = 0; i < 4; i++) {
          let tempOption = new Object();
          tempOption.name = i+1+'项';
          tempOption.id = i+1;
         that.zui.push(tempOption);
        }
      },
      deleteOption(id) {//删除选项
        const that = this;
        this.paramsxiao.limitFew=""
        this. paramsxiao.limitMore=""
        if (that.options.length <= 1) {
          that.$message('至少保留一项选项')
          return;
        }
        if (that.options.length <= 2&& that.paramsxiao.questionType==2) {
          that.$message('至少保留两项选项')
          return;
        }
        let tempOptions = []
        for (let i = 0; i < that.options.length; i++) {
          let tempObj = that.options[i];
          if (tempObj.id != id) {
            tempOptions.push(tempObj)
          }
        }
        that.options = tempOptions;
        that.zui=[]
        for (let i = 0; i < that.options.length; i++) {
          let tempOption = new Object();
          tempOption.name = i+1+'项';
          tempOption.id = i+1;
          that.zui.push(tempOption);
        }
      },
      rightOption(option) {//设为正确选项
        option.allRight = option.allRight == 1 ? 0 : 1;

      },
      addOptions(index) {//添加选项
        const that = this;
        let tempOption = new Object();
        tempOption.value = '';
        tempOption.allRight = 0;
        tempOption.id = (parseInt(that.options[that.options.length - 1].id) + 1);
        that.options.push(tempOption);
        that.zui=[]
        for (let i = 0; i < that.options.length; i++) {
          let tempOption = new Object();
          tempOption.name = i+1+'项';
          tempOption.id = i+1;
          that.zui.push(tempOption);
        }
      },
      saveQuestion() {//保存小题
        const that = this;
        let params = that.paramsxiao;
        let options = [];//提交时操作的options属性
        let count = 0;//如果是单选只能有一项正确项
          console.log(params.questionType)
        if ( params.questionType<3){
          for (let i = 0; i < that.options.length; i++) {
            let temp = that.options[i];
            if (!temp.value) {
              that.$message('请输入选项' + (i + 1) + '的值')
              return;
            } else {
              let tempObj = new Object();
              tempObj.optionSort = temp.id;
              tempObj.optionCont = temp.value;
              if (temp.allRight == 1 &&that.pagerParam.type == 3) {
                count += 1;
              }
              tempObj.allRight = temp.allRight;
              tempObj.questionScore = temp.questionScore;
              if (temp.optionId) {
                tempObj.optionId = temp.optionId;
              }
              options.push(tempObj);
            }
          }
        } ;


      if(this.paramsxiao.questionScore==''&&that.pagerParam.type != 3){
        this.paramsxiao.questionScore=0
      }
        if (count <= 0 && that.pagerParam.type == 3 && params.questionType<3) {
          that.$message('请至少选择一项正确选项')
          return;
        }


        if (count > 1 && that.pagerParam.type == 3 && params.questionType == 1) {
          that.$message('单选只能有一个正确选项')
          return;
        }

        if (params.questionType == 4 && params.questionStem.indexOf('_') == -1) {
          that.$message('至少插入一个填空符')
          return;
        }

        if ( params.limitFew > params.limitMore) {
          that.$message('最少项必须小于或等于最大项')
          return;
        }
        that.paramsxiao.options = options;
        // that.paramsxiao.questionSort = 8;
        that.params.questionSort = sessionStorage.getItem("qIndex") ? parseInt(sessionStorage.getItem("qIndex")) : that.paramsxiao.questionSort;
        that.paramsxiao.paperId = that.pagerParam.paperId;

        if (params.questionType!=2) {
          that.paramsxiao.limitMore = 1;
          that.paramsxiao.limitFew = 1;
        }

        that.$http.post('/activity/question/save', that.paramsxiao).then(res => {
          if (res.code == 200) {
            that.$message({
              type: "success",
              message: "编辑成功!"
            });
            sessionStorage.setItem("qIndex", that.params.questionSort + 1);
           that.params.paperId=that.pagerParam.paperId;
            this.initVolume()
          } else {
            that.$message('试题创建失败，请稍后重试')
          }
        })
      },
      // 填空题添加符号
      addInput() {
        const that = this;
        that.paramsxiao.questionStem+= '_'
      },
      handleClickti(atname){

     let paramsnos={
          required: '1',//是否必答
            questionType: '',//小题类型
            questionStem: '',//题干
            limitMore: '',//最多选项
            limitFew: '',//最少几项
            questionSort: 0,
            paperId: '',
            questionScore: ''
        }
        this.paramsxiao=paramsnos
        this.paramsxiao.questionType=parseInt(atname)
        this.initOptions()
        this.initOptionszui()
      },
      bianji(question){
        const that = this;
        that.paramsxiao.questionId = question.question_id;
        this.paramsxiao.required=question.required+""
        this.paramsxiao.questionType=question.question_type
        this.paramsxiao.questionStem=question.question_stem
        this.paramsxiao.limitMore=question.limit_more
        this.paramsxiao.limitFew=question.limit_few
        this.paramsxiao.questionSort=question.question_sort
        this.paramsxiao.questionScore=question.question_score
        this.paramsxiao.paperId=question.paper_id
        this.paramsxiao.actId=this.$route.query.actiyId
       this.statusAcitive=question.question_type+""
        if (question.question_type==1||question.question_type==2){
          this.options = [];
          for (let i = 0; i <question.option.length; i++) {
            let tempOption = new Object();
            tempOption.allRight = question.option[i].all_right;
            tempOption.id = question.option[i].option_id;
            tempOption.value =question.option[i]. option_cont;
            this.options.push(tempOption);
          }
        } ;

        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
     console.log(question)
      },
   listDelete(id) {
    const that = this;
    let temp = [];
    for (let i = 0; i < that.questions.length; i++) {
      if (that.questions[i].question_id != id) {
        temp.push(that.questions[i]);
      }
    }
    that.questions = temp;
  },
      listUp(index) {//数组上移
        const that = this;
        if (index != 0) {
          that.questions[index] = that.questions.splice(index - 1, 1, that.questions[index])[0];
          this.$set(that.tabBar, index - 1, that.tabBar[index - 1] ? false : true)
          this.$set(that.tabBar, index, that.tabBar[index] ? false : true)
        } else {
          that.$message('已经移到最顶部啦')
          /*that.questions.push(that.questions.shift());*/
        }
      },
      listDown(index) {//数组下移
        const that = this;
        if (index != that.questions.length - 1) {
          that.questions[index] = that.questions.splice(index + 1, 1, that.questions[index])[0];
          this.$set(that.tabBar, index + 1, that.tabBar[index + 1] ? false : true)
          this.$set(that.tabBar, index, that.tabBar[index] ? false : true)
        } else {
          that.$message('已经移到最底部啦')
          /*that.questions.unshift(that.questions.splice(index, 1)[0]);*/
        }
      },
      async initQuestion() {//如果type是4和5保存时要初始化一道问答题
        const that = this;
        that.tempParams.paperId = that.pagerParam.paperId
        await this.$http.post('/activity/question/save', that.tempParams).then(res => {
          if (res.code == 200) {
            let temp = new Object();
            temp.question_id = res.data;
            temp.question_type = 5;//创建问答题类型
            temp.question_sort = 0;
            temp.question_score = 0;
            temp.required = 1;//必答
            that.questions.push(temp)
          } else {
            that.$message('临时问卷创建失败，请稍后重试')
          }
        })
      },
      async savePaper() {
        const that = this;
        let params = that.params;
        that.params.questions = that.questions;
        for (let i = 0; i < that.params.questions.length; i++) {//重新排序题目
          that.params.questions[i].question_sort = i;
        }
        if (!params.name) {
          that.$message('请输入'+(this.pagerParam.type==1?'投票':this.pagerParam.type==2?'问卷':this.pagerParam.type==3?'测评':this.pagerParam.type==4?'征集':this.pagerParam.type==5?'留言':'') +'名称')
          return;
        }
        /*如果试卷类型是征集和留言需要创建问答题*/
        if (that.pagerParam.type > 3) {
          await that.initQuestion();
        }
        if (!params.introduction) {
          that.$message('请输入'+(this.pagerParam.type==1?'投票':this.pagerParam.type==2?'问卷':this.pagerParam.type==3?'测评':this.pagerParam.type==4?'征集':this.pagerParam.type==5?'留言':'') +'说明')
          return;
        }
        if (that.questions.length <= 0) {
          that.$message('至少创建一道题目')
          return;
        }

        params.status = 1;
        params.paperId =  that.pagerParam.paperId;
        this.$http.post('/activity/paper/save', params).then(res => {
          if (res.code == 200) {
            that.$confirm("保存成功", "提示", {
              confirmButtonText: "确定",
              type: "success"
            }).then(() => {
              window.close()
            });
    } else {
            that.$message('问卷创建失败，请稍后再试')
          }
        })
      },

    }
  };
</script>
<style>
  .tianjia .el-form-item__content{
    line-height: 40px;
  }
</style>
<style scoped>
  .xinxitou {
    border-radius: 5px;

    padding: 8px;
    background: rgb(190, 224, 247);
    padding-left: 18px;
    margin-bottom: 15px;
  }

</style>
