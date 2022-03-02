<template>
  <el-row>
    <el-table border :loading="loading" :data="list" stripe size="mini" style="width: 100%">
      <el-table-column prop="id" label="id" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cuser_id" label="提交人" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.name}} - {{scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column prop="contact_way" label="联系方式" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ctime" label="提交时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ctime | parseTime}}
        </template>
      </el-table-column>
    </el-table>
    <qu-pagination :current2="params.current" :total="total" @change="changePage" ref="mychild"></qu-pagination>
  </el-row>
</template>

<script>
  import {parseTime} from '@/utils/format.js'

  export default {
    name: "index",
    data() {
      return {
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
      }, loadList() {
        const that = this;
        that.loading = true
        that.$http.get('/system/feedback', {params: that.params}).then(res => {
          if (res.code == 200) {
            that.list = res.data.list
            that.total = res.data.total
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

<style scoped>

</style>
