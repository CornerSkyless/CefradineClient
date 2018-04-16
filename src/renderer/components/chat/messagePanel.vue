<template>
    <div id="message-panel" class="message-panel">
        <div v-for="message,i in messageList">
            <div v-if="checkShowTime(i)" class="time-row">
                <div>{{formatTime(message.builtTime)}}</div>
            </div>
            <div class="message-system-row" v-if="message.type==='newChat'||message.type==='newUser'||message.type==='removeUser'||message.type==='chatNameChanged'">
                <div>{{message.content}}</div>
            </div>
            <div class="message-row" v-if="message.type==='text'||message.type==='file'"  :class="{'message-row-self':message.sender.id==$store.state.currentUser.id}">
                <avatar class="message-row-avatar" :name="message.sender.legalName+message.sender.id" radius="3px"></avatar>
                <div class="message-row-content" >
                    <div class="message-row-content-name">{{message.sender.legalName}}</div>
                    <div style="display: flex;align-items: center;">
                        <message-bubble v-if="message.type==='text'" :position="message.sender.id!==$store.state.currentUser.id?'left':'right'" :message="message" style="max-width: 200px"></message-bubble>
                        <file-bubble v-if="message.type==='file'" :message="message"></file-bubble>
                        <em v-if="message.isSending" class="fa fa-spin fa-circle-o-notch" style="color: #e5e5e5;margin: 0 8px"></em>
                        <em v-if="message.isError" @click="$emit('resend-message',message)" class="fa fa-exclamation-circle" style="color: #FF4949;margin: 0 8px"></em>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<style type="text/scss" lang="scss">
    @import "../../style";

    .message-panel{

        padding: 30px 0;
        overflow-x: hidden;
        .time-row{
            text-align: center;
            margin: 5px 0;
            div{
                /*background: #e5e5e5;*/
                font-size: 12px;
                color: #B1B1B1;
            }
        }
        .message-system-row{
            text-align: center;
            margin: 5px 0;
            div{
                /*background: #e5e5e5;*/
                font-size: 12px;
                color: #B1B1B1;
            }
        }
        .message-row{
            /*width: 100%;*/
            padding: 8px 15px;
            display: flex;
            align-items: flex-start;
            .message-row-avatar{
                width: 30px;
                border-radius: 3px;
                margin-left: 5px;
                margin-right: 5px;
                margin-top: 2px;

            }
            .message-row-content{
                .message-row-content-name{
                    color: #B1B1B1;
                    font-size: 10px;
                    margin: 0 10px;
                }
            }
        }
        .message-row-self{
            direction: rtl;
        }
    }

</style>

<script>
    import MessageBubble from './messageBubble.vue'
    import FileBubble from './fileBubble.vue'
    import moment from 'moment'
    export default {
        name: 'message-panel',
        props:['messageList'],
        data () {
            return {
            }
        },
        watch:{messageList(){
            this.scroll();
        }},
        methods:{
            checkShowTime(i){
                if(i===0) return true;
                return moment(this.messageList[i].builtTime).diff(moment(this.messageList[i-1].builtTime),'seconds')>=240;
            },
            formatTime(date){
                return moment(date).calendar();
            },
            scroll(){
                setTimeout(function () {
                    if(document.getElementById('scroll-bottom')){
                        document.getElementById('scroll-bottom').scrollTop = document.getElementById('scroll-bottom').scrollHeight + 50000;
                    }
                },10);
            }
        },
        created(){
            this.scroll();
        },
        components:{MessageBubble,FileBubble}
    }
</script>