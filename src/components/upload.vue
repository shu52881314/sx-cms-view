<template>
    <div>
      <el-upload
				class="avatar-uploader"
				action=""
        accept="image/gif, image/jpeg, image/jpg, image/png"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        :http-request="httpRequest"
				:headers="headers"
				:data="data"

      >
				<img v-if="image" :src="image" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
    </div>
</template>

<script>
  import {
    getRand
  } from "@/utils/random";

  import {Encrypt, Decrypt} from '@/utils/encrypt';
  import { uploadOSS } from '@/utils/filters';

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
			image: {
				type: String,
				default: ''
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
				actionUrl: this.$store.state.sys.baseUrl + this.upload
      };
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
      handleAvatarSuccess(res, file) {
      	let o;
      		if (process.env.NODE_ENV === 'production') {
                o = JSON.parse(Decrypt(res))
           } else {
           	o = res
           }
			if (o && o.data) {

				this.$emit('uploadSuccessed', o.data)
			}
      },
      httpRequest(file){
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
        let url =  uploadOSS(file,"2room",folderName + "/",0).then( res => {

          this.$emit('uploadSuccessed',res)
        })
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isLt2M;
      }
    }
  }
</script>

<style scoped >
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;

    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    border: 1px dashed #d9d9d9;
    border-radius: 50px;
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
