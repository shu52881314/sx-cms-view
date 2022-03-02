<template>
    <div ref="editor" ></div>
</template>

<script>
    /* eslint-disable */
    import '../assets/js/jquery-2.1.1.min'
    import '../../static/UMeditor/umeditor.config'
    import '../../static/UMeditor/umeditor';
    import '../../static/UMeditor/lang/zh-cn/zh-cn';
    import '../../static/UMeditor/themes/default/css/umeditor.min.css';

    export default {
        data() {
            return {
                id: Math.ceil(Math.random()*100000)+'umeditorId',
            };
        },
        props: {
            value: {
                type: String,
                default: null,
            }
        },
        watch: {
            value: function value(val, oldVal) {
                this.editor = UM.getEditor(this.id, this.config);
                if (val !== null) {
                    this.editor.setContent(val);
                }
            },
        },
        mounted() {
            this.$nextTick(function f1() {
                // 保证 this.$el 已经插入文档

                this.$refs.editor.id = this.id;
                this.editor = UM.getEditor(this.id, this.config);

                this.editor.ready(function f2() {
                    this.editor.setContent(this.value);

                    this.editor.addListener("contentChange", function () {
                        const wordCount = this.editor.getContentLength(true);
                        const content = this.editor.getContent();
                        const plainTxt = this.editor.getPlainTxt();

                        this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt });
                    }.bind(this));

                    this.$emit('ready', this.editor);
                }.bind(this));
            });
        },
    };
</script>

<style>
  
</style>
