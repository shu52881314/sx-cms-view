<template>
    <div>
      <el-upload
        v-if="fileUploadProgress.length < 9"
        drag
				class="avatar-uploader"
				action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :limit="9"
        accept=".gif,.jpeg,.png,.jpg,.doc,.docx,.xls,.xlsx,.pdf,.mp4, .mp3, .dov,"
        :show-file-list="false"
        :http-request="httpRequest"
				:headers="headers"
				:data="data">
          <i class="el-icon-upload"></i>
        <div class="el-upload__text">
         <em>点击上传</em>
          <p style="line-height:22px;font-size:12px;color:#999">支持格式：.gif .jpeg .png .jpg .doc .docx .xls .xlsx .pdf，.mp4 .mp3 .dov<br/>单个文件不能超过10M，最多上传9个附件</p>

        </div>

				<!-- <img v-if="image" :src="image"> -->
			</el-upload>

      <div class="progressStyle" id="progressStyle">
        <ul>
          <li v-for="(item,index) in fileUploadProgress">
            <div style="width:100%;">
              <span :title="item.name" style="float:left;width:270px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{item.name}}</span>
              <span style="float:right;margin-right:50px;">
               {{item.progress == 100 ? '上传成功' : '上传中'}}
              </span>
            </div>
            <div style="width:100%;">
              <span style="float:left;width:380px;"><el-progress  :percentage="item.progress" :status="item.progress == 100 ? 'success' : 'text'"></el-progress></span>
              <span style="float:left;display:inline;position: relative;margin-left: -37px;margin-top: -10px;">
                  <!-- <i v-if="item.progress != 100" class="el-icon-error" style="color:#FF3B30;font-size:12px;"></i> -->
                  <i @click="deleteFile(item)"  v-on:mouseover="changeActive($event)" v-on:mouseout="removeActive($event)"  v-if="item.progress == 100" class="el-icon-success" style="cursor:pointer;color:#67C23A;font-size:12px;"></i>
                  <!-- <i  v-if="item.progress == 100" class="el-icon-success" style="cursor:pointer;color:#67C23A;font-size:12px;"></i> -->

              </span>
            </div>
          </li>
        </ul>
      </div>


    </div>
</template>

<script>
  import {
    getRand
  } from "@/utils/random";
  import { uploadOSS } from '@/utils/filters';
  import {Encrypt, Decrypt} from '@/utils/encrypt';
import store from '@/store/index'
  import {
    signParams
  } from "@/utils/sign";
  import api from "@/api/api";
  var rand = getRand();
  export default {
    props: {

      upload: {
				type: String,
				default: ''
			},
      type: {
				type: String,
				default: ''
			},
      imageList: {
        type: Array,
        default: []
      },
			data: {
				type: Object,
				default: function () {
					return {}
				}
			}
		},
    data() {
      return {
				actionUrl: this.$store.state.sys.baseUrl + this.upload,
        fileList:[],
        fileUploadProgress:this.$store.state.sys.fileProgresss
      };
    },
    watch: {
      imageList:function(val){
        console.log(val)
        for(let i = 0 ; i < val.length;i++){
          if(val[i].async){

            this.initServerImage();
          }
        }
      }
      // editList:{
      //   handler: function (newVal, oldVal) {
      //      this.fileUploadProgress = newVal
      //   },
      //   deep: true
      // },
      // fileUploadProgress: {
      //   handler: function (newVal, oldVal) {
      //
      //
      //     this.fileUploadProgress = newVal
      //
      //
      //   },
      //   deep: true,
      //   immediate: true
      // }

    },
    created(){
      const that = this;
      that.initServerImage();
    },
    computed:{
         headers:function(){

                let AuthorObj = {}

                if (process.env.NODE_ENV === 'production') {
                    // 干一些线上才要做的事情
                    AuthorObj.token = localStorage.getItem("sessionKey") || ""
                  }
                  if (process.env.NODE_ENV === 'development') {
                    // 干一些测试时不可告人的事情
                    AuthorObj.token = localStorage.getItem("sessionKey") || ""
                  }

                   AuthorObj.timestamp =  new Date().getTime()
                   return {
                     'Authorization': Encrypt( JSON.stringify(AuthorObj) )
                   }

         }
    },
    methods: {
      initServerImage(){
        this.fileUploadProgress = this.imageList
        console.log(this.fileUploadProgress)
      },
      backfileList(){
        setTimeout( () => {
          this.fileUploadProgress = this.imageList
          store.commit('setProgresssBack',this.imageList)
        },200)


      },
      // 鼠标移入加入class
    changeActive($event){
           $event.currentTarget.className = "el-icon-error"
           $event.currentTarget.style.color = "#FF3B30"
    },
    removeActive($event){
           $event.currentTarget.className = "el-icon-success"
           $event.currentTarget.style.color = "#67C23A"
    },
    deleteFile(item){

     store.commit('deleteProgresss',item)
     this.$emit('deleteList', item)
     setTimeout( item => {
            this.fileUploadProgress = this.$store.state.sys.fileProgresss
     },200)

    },
    endWith(str,endStr){
        var d=str.length-endStr.length;
        return (d>=0&&str.lastIndexOf(endStr)==d);
    },


//     String.prototype.endWith=function(endStr){
//   var d=this.length-endStr.length;
//   return (d>=0&&this.lastIndexOf(endStr)==d);
// }
// var str="I love antzone";


      handleChange(file, fileList){

	   	},
      httpRequest(file){

        // accept="image/gif, image/jpeg, image/jpg, image/png,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/pdf"


      const isLt2M = file.file.size / 1024 / 1024 < 10;





      if (!isLt2M) {
          this.$message.error('上传附件大小不能超过 10MB!');
          return
      }
      // return isJPG||isPNG||isGIF && isLt2M;




        let folderName = ''
        if (this.type==1) {
          folderName = 'activity'
        }
        else if (this.type==2) {
          folderName = 'project'
        }
        else if (this.type==3) {
          folderName = 'org'
        }
        //通知
        else if (this.type==4) {
          folderName = 'notice'
        }
        //轮播
        else if (this.type==5) {
          folderName = 'slider'
        } else{
          folderName = 'temp'
        }
        let url =  uploadOSS(file,"2room",folderName + '/',1).then( res => {

          if (this.imageList.length) {

            let flag = 0
            this.imageList.map( item => {
              if (item.name == file.file.name) {
                 item.id = 0,
                 item.async = true,
                 item.url = res
                 item.name = file.file.name
                 item.size = file.file.size
                 item.progress = 0
                 item.type = ( this.endWith(file.file.name,".jpg") || this.endWith(file.file.name,".jpeg") || this.endWith(file.file.name,".png") ) ?  1 : (this.endWith(file.file.name,".doc") || this.endWith(file.file.name,".docx")) ? 3 : ( this.endWith(file.file.name,".xlsx") || this.endWith(file.file.name,".xls")) ? 4 : (this.endWith(file.file.name,".pdf")) ? 5 :(this.endWith(file.file.name,".mp4")) ? 6 :(this.endWith(file.file.name,".mp3")) ? 7:(this.endWith(file.file.name,".dov")) ? 8: ''
                 flag = 1
              }
            })

            if (flag) {

            }else{

              this.imageList.push(
                {
                  id:0,
                  async : true,
                  url:res,
                  name:file.file.name,
                  size:file.file.size,
                  progress :0,
                  type:( this.endWith(file.file.name,".jpg") || this.endWith(file.file.name,".jpeg") || this.endWith(file.file.name,".png") ) ?  1 : (this.endWith(file.file.name,".doc") || this.endWith(file.file.name,".docx")) ? 3 : ( this.endWith(file.file.name,".xlsx") || this.endWith(file.file.name,".xls")) ? 4 : (this.endWith(file.file.name,".pdf")) ? 5 :(this.endWith(file.file.name,".mp4")) ? 6 :(this.endWith(file.file.name,".mp3")) ? 7:(this.endWith(file.file.name,".dov")) ? 8: ''
                  }
              )

            }

          }else{

            this.imageList.push(
              {
                id:0,
                url:res,
                async : true,
                name:file.file.name,
                size:file.file.size,
                progress :0,
                type:( this.endWith(file.file.name,".jpg") || this.endWith(file.file.name,".jpeg") || this.endWith(file.file.name,".png") ) ?  1 : (this.endWith(file.file.name,".doc") || this.endWith(file.file.name,".docx")) ? 3 : ( this.endWith(file.file.name,".xlsx") || this.endWith(file.file.name,".xls")) ? 4 : (this.endWith(file.file.name,".pdf")) ? 5 :(this.endWith(file.file.name,".mp4")) ? 6 :(this.endWith(file.file.name,".mp3")) ? 7:(this.endWith(file.file.name,".dov")) ? 8: ''
              }
            )
          }
          this.$emit('uploadSuccessed', this.imageList)

        })
      },
      handleAvatarSuccess(res, file,fileList) {
      	let o;
        // 暂时去掉---
      		// if (process.env.NODE_ENV === 'production') {
          //       o = JSON.parse(Decrypt(res))
          //  } else {
           	o = res
          //  }
      			if (o && o.data) {
               this.fileList.push(
                 {
                   url:o.data
                 }
               )

      				 this.$emit('uploadSuccessed', this.imageList)
      				// this.$emit('uploadSuccessed', o.data)
      			}
      },
      handleRemove(file, fileList) {
        console.log(file)
       // let data = []
       //
       // fileList.forEach( item => {
       //   data.push(item.response.data)
       // })
       //
       // this.$emit('uploadSuccessed', data)
     },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/gif, image/jpeg, image/jpg, image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf';
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped lang="scss">

.progressStyle{
  width:400px;
}
.progressStyle li{
  float:left;
  width:100%;

}
  $width: 100px;
  $height: 100px;
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 50px;
    font-size: 28px;
    color: #8c939d;
    width: $width;
    height: $height;
    line-height: $height;
    text-align: center;
  }

  .avatar {
    border: 1px dashed #d9d9d9;
    border-radius: $width/2;
    width: $width;
    height: $height;
    display: block;
  }
</style>
