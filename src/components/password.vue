<template>

 <div>

   <div class="passWord">
     <span style="float:left;width:500px;">
        <el-input clearable type="textarea" :rows="15" v-model="getPassword">
        </el-input>
     </span>
     <span style="float:left;width:200px;text-align:center;">
       <p> <el-button @click="jiami" type="primary">加密</el-button> </p>
       <p> <el-button @click="jiemi" type="success">解密</el-button> </p>
     </span>
     <span style="float:left;width:500px;">
       <el-input clearable type="textarea" v-model="OutPassword" :rows="15">

       </el-input>
     </span>
   </div>

 </div>

</template>

<script>
import {Encrypt, Decrypt} from '@/utils/encrypt';
import qs from 'querystring'
 import store from '@/store'
    export default {
        data() {
            return {
              getPassword:'',
              OutPassword:''
            }
        },
        methods: {
            jiami(){
              if(this.getPassword){
                 this.OutPassword  = Encrypt(this.getPassword)
              }
            },
            jiemi(){
               this.OutPassword  =  Decrypt(this.getPassword)
            }
        }
    }
</script>
<style scoped>
  .passWord{width:1400px;overflow:hidden;margin:0 auto;margin-top:20px;}
</style>
