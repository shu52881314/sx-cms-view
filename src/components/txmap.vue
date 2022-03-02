<template>

  <div>
    <!--// 搜索的表单-->
    <el-form style="margin-left: 20px" class="searchForm" size="small" :model="searchFrom">
      <el-row :gutter="5">
        <el-col :span="10">
          <el-form-item prop="name">
            <el-input clearable placeholder="请输入搜索位置信息"
                      v-model="searchFrom.name"
                      name="name"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button icon="el-icon-search" type="primary" size="mini"
                     @click="searchAddress">搜索位置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--// 地图显示 注意id必须要加。因为下面会指定id加载地图-->
    <div id="mapContainer" style="width:100%;height:300px;"></div>
    <!--// 附近地点显示-->
    <el-table
      highlight-current-row
      :data="nearPointList"
      max-height="300"
      style="width: 100%">
      <el-table-column
        label="附近地点名称">
        <div slot-scope="scope">
          <span>{{scope.row.address }}{{scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="selectAddress(scope.row)"
            type="text"
            size="small">
            确认选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


</template>
<script>
  // 引入qqmap
  import maps from 'qqmap'

  export default {
    name: "index",
    data() {
      return {
        rootAddress: '',
        searchFrom: {name: ''},
        nearPointList: [],
        showStatus: false,
        map: '',
        data: '',
        markersArray: [],
        ssx:{}
      }
    },
    mounted() {
      // 初始化地图
      this.initMap()
    },
    methods: {
      // 搜索地址
      searchAddress() {
        if (!this.searchFrom.name) {
          this.$message.error('未输入搜索内容')
          return
        }
        this.setLocationByAddress(this.searchFrom.name)
      },
      // 初始化地图
      initMap() {
        let that = this
        maps.init('4TWBZ-2XDO4-G27U2-D5MK4-GS5F6-Y2F5H', () => {
          let latLon = new qq.maps.LatLng(39.90374,116.397827)
          let myOpts = {
            zoom: 10,
            center: latLon,
            mapTypeId: qq.maps.MapTypeId.ROADMAP
          }
          that.map = new qq.maps.Map(
            document.getElementById('mapContainer'),
            myOpts
          )
          qq.maps.event.addListener(that.map, 'click', function (event) {
            that.setLocationByLatLng(event.latLng.getLat(), event.latLng.getLng())
          })
        })
        // 经纬度解析类回调函数
        that.geocoder = new qq.maps.Geocoder({
          complete: function (result) {
            that.ssx = result.detail.addressComponents
            that.nearPointList = result.detail.nearPois
            that.map.setCenter(result.detail.location);
            let marker = new qq.maps.Marker({
              map: that.map,
              position: result.detail.location
            });
            that.markersArray.push(marker);
            if (that.markersArray.length > 1) {
              for (let i = 0; i < that.markersArray.length - 1; i++) {
                that.markersArray[i].setMap(null);// 清除标记
              }
            }
          }
        });
        // 地址解析回调函数
        that.geocoderLocation = new qq.maps.Geocoder({
          complete: function (result) {
            // 查找附近的点
            let latLng = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng);
            that.geocoder.getAddress(latLng);
          }
        });
      },
      // 选择地址时间
      selectAddress(row) {
      console.log(this.ssx)
        this.$emit("on-select",row.id, row.address, row.name, row.latLng.lat, row.latLng.lng,this.ssx.province,this.ssx.city,this.ssx.district)
        this.showStatus = false
      },
      // 父组件调用显示抽屉的方法
      show() {
        this.initMap()
        this.showStatus = true
      },
      // 父组件设置初始显示 省市区数据
      setLocationByAddress(address) {
        this.rootAddress = address
        this.geocoderLocation.getLocation(address);
      },
      // 父组件设置初始显示 经纬度数据
      setLocationByLatLng(lat, lng) {
        let latLng = new qq.maps.LatLng(lat, lng);
        this.geocoder.getAddress(latLng);
      }

    }
  }
</script>

<style scoped>

</style>
