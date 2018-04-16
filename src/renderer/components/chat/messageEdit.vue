<template>
    <div id="message-edit">
        <div class="toolbar">

            <upload-icon @upload="upload"></upload-icon>
            <div @click="$emit('dialog-message-history')">
                <em  class="fa fa-clock-o"></em>
            </div>
            <div v-if="isGroup" @click="$emit('chat-invite-multi')">
                <em  class="fa fa-users"></em>
            </div>
            <div v-if="isGroup" @click="$emit('leave-chat')">
                <em  class="fa fa-sign-out"></em>
            </div>
        </div>
        <div class="edit">
            <textarea  @keyup.enter="submit" v-model="content"></textarea>
        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../../style";
    #message-edit{
        position: relative;
        height: 100%;
        width: 100%;
        .toolbar{
            position: absolute;
            left: 10px;
            right: 0;
            height: 35px;
            background: white;
            display: flex;
            align-items: center;
            em{
                margin:0 10px;
                font-size: 20px;
                color: darken($border-color,10);
                cursor: pointer;
            }
        }
        .edit{
            position: absolute;
            bottom: 10px;
            top: 36px;
            left: 15px;
            right: 15px;
            overflow-y: hidden;
            overflow-x: hidden;

            textarea{
                width: 100%;
                border: 0;
                height: 100%;
                overflow-y:auto;
                font-size: 16px;
                /*padding-right: 15px;*/
                overflow-x: hidden;
            }
        }

    }

</style>
<script>
    import uploadIcon from '../others/uploadIcon.vue'
    export default {
        name: 'message-edit',
        props:['isGroup'],
        data () {
            return {
                content:''
            }
        },
        methods:{
            submit(){
                this.content =  this.content.trim();
                if(this.content){
                    this.$emit('send-text-message',this.content);
                    this.scrollToBottom();
                    this.content = '';
                }

            },
            scrollToBottom:function () {
                setTimeout(function () {
                    if(document.getElementById('scroll-bottom')){
                        document.getElementById('scroll-bottom').scrollTop = document.getElementById('scroll-bottom').scrollHeight + 50000;
                    }
                },10);
            },
            upload(form){
                this.$emit('upload-file',form);
            }
        },
        created(){},
        components:{uploadIcon}
    }
</script>