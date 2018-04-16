<template>
    <div id="app">
        <div class="left">
            <div class="top">
                <avatar v-if="$store.state.currentUser"  class="avatar" radius="4px" :name="$store.state.currentUser.legalName+$store.state.currentUser.id"></avatar>
                <div v-if="$store.state.currentUser" class="text-center" style="color: white;font-size: 12px;margin-top: 5px;">
                    {{$store.state.currentUser.legalName}}</div>
                <div class="buttons">
                    <div class="btn" :class="{'btn-active':$store.state.activePanelIndex==0}" @click="selectPanel(0)"><el-badge :value="$store.getters.unreadMessageCount"><em class="fa fa-comment"></em></el-badge></div>
                    <div class="btn" :class="{'btn-active':$store.state.activePanelIndex==1}" @click="selectPanel(1)"><em class="fa fa-users"></em></div>
                    <!--<div class="btn" :class="{'btn-active':$store.state.activePanelIndex==2}" @click="selectPanel(2)"><em class="fa fa-th-large"></em></div>-->
                </div>
            </div>
            <div class="bottom">
                <div class="btn" v-if="$store.state.currentUser.position.isSuperuser"  @click="goToAdmin"><em class="fa fa-user"></em></div>
                <div class="btn"  @click="goToLogin"><em class="fa fa-sign-out"></em></div>

            </div>
        </div>
        <div class="right">
            <chat-panel v-if="$store.state.activePanelIndex==0"></chat-panel>
            <contact-panel v-if="$store.state.activePanelIndex==1"></contact-panel>
        </div>

    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../style";
    #app{
        height: 100vh;
        position: relative;
        $left-width:80px;
        $header-height:65px;
        .left{
            position: absolute;
            left: 0;
            top:0;
            bottom: 0;
            background: $dark-black;
            width:$left-width;
            -webkit-app-region: drag;
            display: flex;
            justify-content: center;
            .top{
                margin-top: 80px;
                .avatar{
                    width: 45px;
                    -webkit-app-region: no-drag;
                }
                .buttons{
                    text-align: center;
                    .btn{
                        font-size: 30px;
                        color: lighten($dark-black,10);
                        margin: 25px auto;
                        cursor: pointer;
                        -webkit-app-region: no-drag;

                        &:hover{
                            transition: all 0.2s ease-out;
                            color: lighten($dark-black,20);
                        }
                    }
                    .btn-active{
                        color: $green !important;
                    }
                    .el-badge__content{
                        top:5px !important;
                    }
                }

            }
            .bottom{
                position: absolute;
                left: 0;
                width:$left-width;
                bottom: 20px;
                text-align: center;

                .btn{
                    font-size: 30px;
                    color: lighten($dark-black,10);
                    margin: 25px auto;
                    cursor: pointer;
                    -webkit-app-region: no-drag;
                    &:hover{
                        transition: all 0.2s ease-out;
                        color: lighten($dark-black,20);
                    }
                }
            }

        }
        .right{
            position: relative;
            left: 0;
            margin-left: $left-width;
            top:0;
            bottom: 0;
            right: 0;
            height: 100vh;
        }


    }

</style>
<script>
    const {ipcRenderer} = require('electron');
    import router from '../router'
    import contactPanel from './contact/contactPanel.vue'
    import chatPanel from './chat/chatPanel.vue'
    export default {
        name: 'app',
        data () {
            return {
            }
        },
        methods:{
            selectPanel(index){
                this.$store.commit('setActivePanelIndex',index);
            },
            goToLogin(){
                this.$store.commit('logout');
                router.push({name:'login'});
            },
            goToAdmin(){
                let url = 'http://'+this.$store.state.ipAddress+'/admin/#login?token='+this.$store.state.currentUser.token.token;
                console.log(url);
                ipcRenderer.send('open-url',url);
            }
        },
        created(){
            if(!this.$store.state.currentUser) this.$router.push({name:'login'});
            ipcRenderer.send('set-window-of-app');
        },
        components:{
            contactPanel,chatPanel
        }
    }
</script>