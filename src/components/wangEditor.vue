<template lang="html">
  <div id="editor">
  </div>
</template>

<script>
import E from 'wangeditor'
import {uploadOSS} from '@/utils/filters'
export default {
  name: 'Editorbar',
  data () {
    return {
      editor: null,
      info:null
    }
  },
  props:{
    content: {
      type: String,
      default: null
    },
    changeContent:{
      type:Function,
      default:null
    }
  },
  watch: {
    content (newOne, oldOne) {
      this.editor.txt.html(newOne)
    }
  },
  mounted () {
    this.seteditor()
  },
  methods: {
    seteditor () {
      this.editor = new E('#editor')
      //上传图片一些配置
      this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic',  // 斜体
        'underline', // 下划线
        'strikeThrough',  // 删除线
        'foreColor', // 文字颜色
        'justify', // 对齐方式
        'image', // 插入图片
      ]

      this.editor.customConfig.customUploadImg = function(files, insert) {
        var that = this
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        if(files == null || files == undefined) {
          layer.msg("请选择图片");
          return;
        }
        let folderName = ''
        if(process.env.NODE_ENV === 'production') {
          folderName = 'notice'
        } else {
          folderName = "notice"
        }
        var fileName = {
          file:files[0]
        }
        let url = uploadOSS(fileName, "2class", folderName + "/").then(res => {
          // 上传代码返回结果之后，将图片插入到编辑器中
          insert(res);
        })
      }
      this.editor.customConfig.onchange   = (html) => {
        // console.log(html)
        this.info = html // 绑定当前逐渐地值
        if (this.changeContent){
             this.changeContent(this.info)
        }
        // this.$emit('changeContent', this.info) // 将内容同步到父组件中
      }
      // // 通过 url 参数配置 debug 模式。url 中带有 wangeditor_debug_mode=1 才会开启 debug 模式
      // this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0
      // 隐藏“网络图片”tab
      this.editor.customConfig.showLinkImg = false
      // 关闭粘贴样式的过滤
      this.editor.customConfig.pasteFilterStyle = false
      // 忽略粘贴内容中的图片
      this.editor.customConfig.pasteIgnoreImg = true
      // 自定义处理粘贴的文本内容
      this.editor.customConfig.pasteTextHandle = function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        return content
      }
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>

<style >
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
</style>
