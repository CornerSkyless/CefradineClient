<template>
    <div id="chat-page">
        <div class="sidebar">
            <chat-list @select-chat="selectChat">
            </chat-list>
        </div>
        <div class="container"  >
            <div v-if="$store.getters.activeChat">
                <div class="header">
                <span v-if="$store.getters.activeChat" class="contact-name">
                     <em style="-webkit-app-region: no-drag;" @click="isShow.dialogChangeChatName=true" v-if="$store.getters.activeChat.userList.length>2" class="fa fa-edit mr-sm"></em>
                    <span @click="showUserList" style="-webkit-app-region: no-drag;cursor: pointer">{{$store.getters.activeChat.name}}</span>
                    <span v-if="$store.getters.activeChat.userList.length>2">({{$store.getters.activeChat.userList.length}})</span>
                </span>

                </div>
                <div id="scroll-bottom" class="middle">
                    <message-panel @resend-message="resendMessage"  :message-list="$store.getters.activeChat.messageList"></message-panel>
                </div>
                <div class="bottom">
                    <message-edit @dialog-message-history="isShow.dialogMessageHistory=true"
                                  @send-text-message="sendTextMessage"
                                  @chat-invite-multi="isShow.chatInviteMulti=true"
                                  @upload-file="sendFileMessage"
                                  @leave-chat="leaveChat"
                                  :is-group="$store.getters.activeChat.userList.length>2"
                    >
                    </message-edit>
                </div>
                <message-history v-model="isShow.dialogMessageHistory" :chat-id="$store.getters.activeChat.id"></message-history>
                <el-dialog title="修改群聊名称" v-model="isShow.dialogChangeChatName">
                    <el-input v-model="form.name" placeholder="输入新名称"></el-input>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="isShow.dialogChangeChatName = false">取 消</el-button>
                        <el-button type="primary" :loading="isDoing.changeChatName" @click="changeChatName">确 定</el-button>
                    </div>
                </el-dialog>
                <contact-selector v-model="isShow.chatInviteMulti" @submit="chatInviteMulti" :disabled-list="disabledList" ></contact-selector>
                <el-dialog title="群组人员" v-model="isShow.userList">
                   <user-list :user-list="$store.getters.activeChat.userList"></user-list>
                </el-dialog>

            </div>

        </div>



    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../../style";

    #chat-page{
        display: flex;
        height: 100vh;
        .sidebar{
            top:0;
            bottom: 0;
            left: 0;
            width: 250px;
            position: relative;
            resize:both;
            border-right: solid 1px $border-color;
            background: $light-white;
            .header{
                height: 65px;
                -webkit-app-region: drag;
                border-right: solid 1px $border-color;

                border-bottom: solid 1px $border-color;

            }

        }
        .container{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 250px;
            right: 0;
            height: 100%;
            background: white;
            .header{
                width: 100%;
                height: 65px;
                background: $lighter-gary;
                -webkit-app-region: drag;
                background: white;
                border-bottom: solid 1px $border-color;
                display: flex;
                align-items: center;
                em{
                    cursor: pointer;
                }
                .contact-name{
                    margin-left: 20px;
                    white-space: nowrap;text-overflow:ellipsis; overflow:hidden;word-break: break-all;
                    margin-right: 150px;
                    position: relative;

                }


            }

        }
        .middle{
            position: absolute;
            top:66px;
            left: 0;
            border-bottom: solid 1px $border-color;
            bottom: 200px;
            right: 0;
            overflow-y: auto;
        }
        .bottom{
            position: absolute;
            height: 200px;
            left: 0;
            bottom: 0;
            right: 0;
            overflow-y: auto;
            //background: #58B7FF;
        }
    }



</style>
<script>
    import ChatList from '../../components/chat/chatList.vue'
    import MessageHistory from '../../components/dialogs/messageHistory.vue'
    import MessagePanel from '../../components/chat/messagePanel.vue'
    import MessageEdit from '../../components/chat/messageEdit.vue'
    import ContactSelector from '../../components/contact/contactSelector.vue'
    import UserList from '../../components/others/userList.vue'

    export default {
        name: 'chat-page',
        data () {
            return {
                isShow:{
                    dialogNewChat:false,
                    dialogChangeChatName:false,
                    dialogMessageHistory:false,
                    chatInviteMulti:false,
                    userList:false
                },
                isDoing:{
                    changeChatName:false
                },
                form:{
                    name:''
                }
            }
        },
        computed:{
            disabledList(){
                return this.$store.getters.activeChat.userList.map(user=>user.id)
            }
        },
        methods:{
            selectChat(chat){
                console.log(chat);
                this.$store.commit('setActiveChat',chat)
            },
            async sendTextMessage(content){
                this.$store.dispatch('sendTextMessage',{
                    content:content,
                    chatId:this.$store.getters.activeChat.id
                })
                    .catch(()=>{})
            },
            async resendMessage(message){
                if(message.type==='text'){
                    this.$store.dispatch('sendTextMessage',{
                        content:message.content,
                        isResend:true,
                        uuid:message.uuid,
                        chatId:this.$store.getters.activeChat.id
                    })
                        .catch(()=>{})
                }
                if(message.type==='file'){
                    let formData = message.formData;
                    formData.append('isResend',true);
                    this.$store.dispatch('sendFileMessage',formData).catch(()=>{})
                        .catch()
                }

            },
            async changeChatName(){
                try{
                    this.isDoing.changeChatName = true;
                    await this.$store.dispatch('changeChatName',{
                        chatId:this.$store.getters.activeChat.id,
                        name:this.form.name});
                    this.isShow.dialogChangeChatName = false;
                    this.isDoing.changeChatName = false;
                }catch (err){
                    this.isDoing.changeChatName = false;

                }
            },
            async sendFileMessage(formData){
                formData.append('chatId',this.$store.getters.activeChat.id);
                await this.$store.dispatch('sendFileMessage',formData).catch(()=>{})
            },
            async chatInviteMulti(list){
                try{
                    await  this.$store.dispatch('chatInviteMulti',{
                        userIdList:list.map(user=>user.id),
                        chatId:this.$store.getters.activeChat.id
                    })
                }catch (err){

                }
             },
            async leaveChat(){
                try{
                    await  this.$store.dispatch('leaveChat', this.$store.getters.activeChat.id);
                    this.$message({message:'退出成功',type:'info'})

                }catch (err){
                }
            },
            showUserList(){
                if(this.$store.getters.activeChat.userList.length>2) this.isShow.userList = true;
            }

        },
        created(){

        },
        components:{ChatList,MessagePanel,MessageEdit,MessageHistory,ContactSelector,UserList}
    }
</script>