<template>
<div>

  <el-radio-group v-model="list.assignFirst" @change="changeType">
    <div class="radioPadding" v-if='visualRange == 2' >
      <el-radio :label="3">上级机构</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="1">指定机构</el-radio>
    </div>
    <div v-if='visualRange == 2' class="radioPadding">
      <el-radio :label="4">挂靠单位</el-radio>
    </div>
    <div v-if='visualRange == 2' class="radioPadding">
      <el-radio :label="5">指导老师</el-radio>
    </div>
    <div v-if='visualRange == 2 || visualRange == 3' class="radioPadding">
      <el-radio :label="6">指定组织</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="2">指定人员</el-radio>
    </div>
  </el-radio-group>

  <div class="parentLine" v-if="list.assignFirst == 1">
    请选择指定机构成员类型：
  </div>

  <el-radio-group v-if="list.assignFirst == 1" v-model="list.assignSecond" style="padding-top:30px;">
    <div class="radioPadding">
      <el-radio :label="2">负责人</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="3">管理员</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="4">负责人或管理员</el-radio>
    </div>
  </el-radio-group>

  <div class="parentLine" v-if="list.assignFirst == 3">
    请选择上级机构成员类型：
  </div>

  <el-radio-group v-if="list.assignFirst == 3" v-model="list.assignSecond" style="padding-top:30px;">
    <div class="radioPadding">
      <el-radio :label="11">负责人</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="12">管理员</el-radio>
    </div>
    <div class="radioPadding">
      <el-radio :label="13">负责人或管理员</el-radio>
    </div>
  </el-radio-group>

  <div v-if="list.assignFirst == 1">
    <el-select clearable v-model="list.sourceId" filterable value-key="value" @change="changeDepaetement" :multiple-limit=1 remote placeholder="输入机构名称搜索" :remote-method="remoteMethod">
      <el-option v-for="item in options4" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
      </el-option>
    </el-select>
  </div>

  <div v-if="list.assignFirst ==2">
    <el-select clearable v-model="list.sourceId" filterable value-key="value" :multiple-limit=1 @change="changeMember" remote placeholder="输入姓名搜索" :remote-method="remoteMethod2">
      <el-option v-for="item in options42" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id">
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
      </el-option>
    </el-select>
  </div>

  <div v-if="list.assignFirst == 6">
    <el-select clearable v-model="list.sourceId" filterable value-key="value" @change="changeOrg" :multiple-limit=1 remote placeholder="输入组织名称搜索" :remote-method="remoteMethod3">
      <el-option v-for="item in options43" :key="item.id" :label="item.organizationName" :value="item.id">
        <span style="float: left">{{ item.organizationName }}</span>
      </el-option>
    </el-select>
  </div>




</div>
</template>

<style scoped lang="scss">
.radioPadding {
    padding-bottom: 25px;
}
.parentLine {
    border-top: 1px solid #F2F2F2;
    padding-top: 20px;
    font-size: 14px;
    color: #666;
}
</style>

<script>
export default {
  props: ["visualRange"],
  data() {
    return {
      organazitionName: '',
      options4: [],
      options42: [],
      options43: [],
      list: {
        // assignFirst: this.visualRange,
        assignFirst: 1,
        assignSecond: 2,
        sourceId: '',
        sourceName: '',
      }
    }
  },
  watch: {
    // visualRange(val) {
    //   (this.visualRange == 1 || this.visualRange == 3) ? this.list.assignFirst = 1: (this.visualRange == 2 ? this.list.assignFirst = 2 : "")
    // }
  },
  created() {

  },
  methods: {
    changeDepaetement(vId) {
      let obj = {};
      obj = this.options4.find((item) => {
        return item.id === vId;
      });
      this.list.sourceName = obj.name
    },
    changeMember(vId) {
      let obj = {};
      obj = this.options42.find((item) => {
        return item.id === vId;
      });
      this.list.sourceName = obj.name + ' - ' + obj.code
    },
    changeOrg(vId) {
      let obj = {};
      obj = this.options43.find((item) => {
        return item.id === vId;
      });
      this.list.sourceName = obj.organizationName
    },
    changeType(type) {
      this.options4 = []
      this.options42 = []
      this.options43 = []
      this.list.sourceId = ""
    },
    //上级机构显示判断
    isShow(type) {

      switch (type) {
        case 3:
          return false
          break;
        case 4:
          return false
          break;
        case 5:
          return false
          break
        case 6:
          return false
          break
        default:
          return true

      }

    },

    //搜索机构
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;

        this.$http.get("/organization/administration/list", {
          params: {
            keyWord: query
          }
        }).then(res => {
          this.loading = false;
          this.options4 = res.data
        })

      } else {
        this.options4 = [];
      }
    },
    //搜索人员
    remoteMethod2(query) {
      if (query !== '') {
        this.loading = true;

        this.$http.get("/school/students/NoPage", {
          params: {
            key: query,
            identity:''
          }
        }).then(res => {
          this.loading = false;
          this.options42 = res.data
        })

      } else {
        this.options42 = [];
      }
    },
    //搜索组织
    remoteMethod3(query) {
      if (query !== '') {
        this.loading = true;

        this.$http.get("/organization/clubs", {
          params: {
            current: 1,
    				size: 10,
    				level: '',
    				nature:'2,3,5,19',
    				name: query
          }
        }).then(res => {
          this.loading = false;
          this.options43 = res.data.list
        })
      } else {
        this.options43 = [];
      }
    },

  }
}
</script>
