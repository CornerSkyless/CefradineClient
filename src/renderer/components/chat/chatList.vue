<template>
    <div id="chat-list-component">
        <div class=" header search-header">
            <input type="text" v-model="keyword"   placeholder="搜索" style=" -webkit-app-region: no-drag;">
            <el-button icon="plus" @click="dialogNewChat"
                       style="-webkit-app-region: no-drag;height: 22px;font-size: 14px;padding: 0 10px;margin-right: 10px;color: #88898A">
            </el-button>
        </div>
        <div  id="chat-list" class="chat-list">
            <div v-for="chat in chatList" class="chat-title"
                 :class="{'chat-title-active':$store.getters.activeChat && $store.getters.activeChat.id===chat.id}"
                 @click="selectChat(chat)" :key="chat.id">
                <chat-avatar :user-list="chat.userList"  style="min-width: 45px;max-width:45px;height:45px;border-radius: 3px;"></chat-avatar>
                <div class="contact-title-right">
                    <div class="name">{{chat.name}} </div>
                    <div v-if="chat.messageList.length>0">
                        <div class="time">{{formatTime(chat.messageList[chat.messageList.length-1].builtTime)}}</div>
                        <div class="message">{{chat.messageList[chat.messageList.length-1].content}}</div>
                        <div class="unread" v-if="chat.unread>0">{{chat.unread}}</div>
                    </div>
                </div>
            </div>
        </div>
        <contact-selector v-model="isShow.dialogNewChat" @submit="newChat"></contact-selector>

    </div>
</template>

<style type="text/scss" lang="scss">
    @import "../../style";
    #chat-list-component{
        .chat-list{
            overflow-y: scroll;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 66px;
            .chat-title{
                padding: 15px 15px 15px 10px;
                display: flex;
                align-items: center;
                cursor: pointer;
                text-space: 0;
                justify-content: space-between;

                .contact-title-right{
                    width: 100%;
                    position: relative;
                    height: 45px;
                    margin-left: 10px;
                    overflow:hidden;
                    .name{
                        position: absolute;
                        font-size: 13px;
                        left: 0;
                        top: 0;
                        max-width: 100px;
                        white-space: nowrap;text-overflow:ellipsis; overflow:hidden;word-break: break-all;
                    }
                    .time{
                        position: absolute;
                        right: 0;
                        top: 0;
                        color: #B8B8B8;
                        font-size: 10px;
                    }
                    .message{
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        color: #B8B8B8;
                        font-size: 12px;
                        white-space: nowrap;text-overflow:ellipsis; overflow:hidden;word-break: break-all;

                    }
                    .unread{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        background: $danger;
                        color: white;
                        font-size: 10px;
                        min-width: 10px;
                        text-align: center;
                        padding: 2px 5px;
                        border-radius: 9px;
                    }


                }
            }
            .chat-title-active{
                background:#e5e5e5;
            }
        }

    }

</style>

<script>
    import moment from 'moment'
    import ChatAvatar from './chatAvatar.vue'
    import ContactSelector from '../contact/contactSelector.vue'

    export default {
        name: 'chat-list',
        data () {
            return {
                keyword:'',
                isShow:{
                    dialogNewChat:false
                }
            }
        },
        computed: {
            chatList(){
                if(document.getElementById('chat-list')){
                    document.getElementById('chat-list').scrollTop = document.getElementById('chat-list').scrollHeight - 50000;
                }
                let chatList = JSON.parse(JSON.stringify(this.$store.getters.chatList));
                if(this.keyword.trim()){
                    chatList = chatList.filter((chat)=>{
                        if(chat.name.indexOf(this.keyword.trim())>=0) return true;
                        for (let i=0;i<chat.userList.length;i++){
                            if(chat.userList[i].legalName.indexOf(this.keyword.trim())>=0) return true;
                        }
                        return false;

                    })
                }
                return chatList;
            }
        },
        methods:{
            selectChat(chat){
                this.$emit('select-chat',chat);
            },
            formatTime(date){
                return moment(date).calendar(null, {
                    sameDay: 'hh:mm A',
                    lastDay: '昨天 hh:mm',
                    sameElse: 'YYYY/MM/DD'
                });
            },
            dialogNewChat(){
                this.isShow.dialogNewChat = true;
            },
            newChat(list){
                try{
                    this.$store.dispatch('newChat',list.map(user=>{return user.id}));
                }catch (err){
                    console.log(err);
                }
            },


        },
        created(){},
        components:{ChatAvatar,ContactSelector}
    }

</script>