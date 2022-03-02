<template>
  <div>
    <el-upload
       id="uploadSquare"
        drag
        class="upload-demo"
        ref='upload'
        :limit="1"
        :data="dataObjParmas"
        :headers="headers"
        :on-change="handleChange"
        :action='actionUrl'
        :accept="uploadType"
        :on-success="handleAvatarSuccess"
        :show-file-list="false"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :auto-upload="false"
       :on-progress="uploadFileProcess">
        <p style="padding-top:45px;"><img src="../assets/images/upload_one@2x.png" style="width:80px;"></p>
        <p style="font-size:12px;">将文件拖拽此区域，或<span style='color:#4D98FF'>点此上传</span></p>
        <div slot="tip"  style="font-size:14px;color:#333;" class="el-upload__tip">仅支持xls、xlsx格式，文件大小不超过5M，单次最多支持1万条数据</div>
    </el-upload>
  </div>
</template>

<script>
import {Encrypt, Decrypt} from '@/utils/encrypt';
import { Message } from 'element-ui'
import store from '../store/index'
import router from '../router/index'
// import http from 'axios'

 export default{
  props:{

  },
   data(){
     return{
     	name:'',
         dataObjParmas:{
           params:{}
         },
         isLoading:true,
         fileList: [],
         isUpload:false,
         actionUrl: this.$store.state.sys.baseUrl + this.uploadUrl,
       progressInfo:{
         showfileInfor:true,
         showfileInforDetail:false,
         fileUploadPercent:0
       }
     }
   },
   props:[
     'dataObj',
     'uploadUrl',
     'uploadSzie',
     'uploadSzieTips',
     'uploadId',
     'uploadType'
   ],
   created(){

     if (this.dataObj) {

       if (process.env.NODE_ENV === 'production') {

           this.dataObjParmas.params = Encrypt(JSON.stringify(this.dataObj))


       }
       if (process.env.NODE_ENV === 'development') {

            this.dataObjParmas.params = JSON.stringify(this.dataObj)
       }





     }else{
            this.dataObjParmas.params  = ""
     }



   },
   // mounted(){
   // },
   watch: {
     uploadId (val) {
       this.uploadId  = val;
     }
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
   methods:{
     uploadFileProcess(event, file, fileList){

       this.progressInfo.showfileInfor = true;
       this.progressInfo.showProgress = true;
       this.progressInfo.showfileInforDetail = false;
       this.progressInfo.fileUploadPercent =file.percentage
     },
	   	handleChange(file, fileList){
        this.fileList = fileList
        if (this.fileList && this.fileList.length) {

          this.$emit("setFileList",this.fileList)
        }
      	store.commit('setClick',false)
	   		if(file.name){
	   			this.$emit('childByValue', file.name)
	   		}
	   	},
      httpRequest(item) {

        if (item) {
           this.isUpload = true
        }else{
           this.isUpload = false
        }
          let params = new FormData();
          params.append('file', item.file);

          if (typeof(this.uploadId) == 'object') {
            let data = this.uploadId
            params.append('params', Encrypt(JSON.stringify(data)))
          }

          http.post( process.env.API_HOST + this.uploadUrl, params, {
              headers:{
                'Access-Token': localStorage.getItem("Token"),
                'Content-Type':'multipart/form-data'
              }
          }).then(res => {
              // this.fileInforamtion  = JSON.parse(Decrypt(res.data))

               this.$emit('fileInfor',JSON.parse(Decrypt(res.data)));
          })
      },
      beforeUpload(file){
         const isLt2M = file.size / 1024 / 1024 < this.uploadSzie;
         if (!isLt2M) {
           this.$message.error(this.uploadSzieTips);
         }
         return isLt2M;
      },
       closeUpload(){
         this.$refs.upload.clearFiles()
       },
       submitUpload2(){
         this.$refs.upload.submit();
         if (!this.isUpload) {
           // this.$message({
           //   type: 'error',
           //   message: '请选择上传文件'
           // });
         }else{
           // this.isUpload = false
           // this.fileList = []
         }

       },
        showError(value) {
			  return Message({
			    showClose: true,
			    message: value,
			    type: 'error',
			    duration: 3500
			  })
			},
      handleAvatarSuccess(res,file) {
      //   this.isLoading  = false

          let data = ''
          if (process.env.NODE_ENV === 'production') {
            let  data2 = JSON.parse(Decrypt(res));
            data = data2
          }
          if (process.env.NODE_ENV === 'development') {
               data = res
               // data = JSON.parse(Decrypt(res.data));
          }
            if (data.code == 200) {

              // this.isLoading = false
              // this.$emit("setLoading",this.isLoading)
            	this.$emit('fileInfor',data.data);
					  }else if(data.code == 10001){
					  	localStorage.setItem('sessionKey', '')
			        localStorage.setItem('username', '')
			        router.push('/login')
					  	this.showError(data.msg)

					  }else{
              //  this.$emit("setloading2",this.isLoading)
              this.$emit('fileInfor',false);
					  	this.showError(data.msg)
					  }




         // let result = JSON.parse(Decrypt(res));
         // if (result.code == 0) {
         //     // this.fileInforamtion = result.data
         //     // this.showfileInfor = true;
         //     // this.$emit('fileInfor',result.data);
         // } else {
         //     this.$message({
         //         type: 'error',
         //         message: result.msg
         //     });
         // }
     }
   }
 }
</script>

<style>

</style>
