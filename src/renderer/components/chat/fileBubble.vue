<template>
    <div id="file-bubble">
        <div class="file-bubble-icon" style="width: 40px;margin-right: 10px"><em class="fa fa-file"></em></div>
        <div style="width: 150px">
            <div class="file-bubble-name">
                {{message.media.name}}
            </div>
            <div class="file-bubble-url" v-if="message.media.url">
                <span class="text-silver">{{message.media.size}} byte</span> <a :download="message.media.name" style="text-decoration: none" :href="message.media.url">下载</a>
            </div>
            <div class="file-bubble-url text-danger" v-if="message.isError">
                上传失败
            </div>
            <el-progress  v-if="message.isSending" :percentage="message.progress"></el-progress>
        </div>

    </div>
</template>
<style type="text/scss" lang="scss">
    #file-bubble{
        margin: 3px 10px;
        border: 1px solid #A5E369;
        border-radius: 5px;
        width: 200px;
        padding: 10px;
        direction: ltr;
        display: flex;
        align-items: stretch;
        .file-bubble-icon{
             display: flex;
            align-items: center;
            justify-content: center;
            em{
                font-size: 40px;
                color: #99A9BF;
            }
        }
        .file-bubble-name{
            white-space: nowrap;text-overflow:ellipsis; overflow:hidden;word-break: break-all;
            margin-bottom: 10px;
        }
        .file-bubble-url{
            font-size: 12px;
        }
    }
</style>
<script>
    export default {
        name: 'file-bubble',
        props:['message'],
        data () {
            return {
            }
        },
        methods:{},
        created(){}
    }
</script>