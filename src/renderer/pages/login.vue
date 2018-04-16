<template>
    <div id="login-page">
        <div class="header">
            <login-header></login-header>
            <span><em class="fa fa-comments mr-md"></em>CefradineIM</span>
        </div>
        <div class="body align-center">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width: 50%" >
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-button class="width-cross" type="primary" @click="login" :loading="isDoing.login" >登录</el-button>
            </el-form>
            <div class="options">
                <a class="option" download="CefradineLatest" :href="'http://'+$store.state.ipAddress+'/update'" >
                    <i class="fa fa-download"></i>
                </a>
                <div class="option" @click="isShowSettingIP=true">
                    <i class="el-icon-setting"></i>
                </div>
            </div>

        </div>
        <el-dialog title="设置IP地址" v-model="isShowSettingIP" size="middle">
            <el-input placeholder="请输入后端IP地址" v-model="IPAddress"></el-input>
            <div class="text-center"><el-button @click="setIP" class="mt-md" size="small" type="primary">确认</el-button></div>
        </el-dialog>
    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../style";
    #login-page{
        background: white;
        height: 100vh;
        width: 100vw;
        .header{
            width: 100%;
            height: 180px;
            background: black;
            -webkit-app-region: drag;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            div{
                position: absolute;
                top:0;
                height: 180px;
                left: 150px;
                right: 0;

            }
            span{
                z-index: 999;
                margin-left: 50px;
                em{
                    font-size: 50px;
                }
                color: white;
                font-size: 45px;
            }

        }
        .body{
            height: 220px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .options{
                position: absolute;
                right: 10px;
                bottom: 10px;
                display: flex;
                .option{
                    width: 30px;
                    height: 30px;
                    background: $lighter-silver;

                    border-radius: 15px;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 5px;
                    i{font-size: 15px};
                    cursor: pointer;
                    &:hover{
                        background: $light-silver;
                    }
                }
            }


        }
    }


</style>
<script>
    const {ipcRenderer} = require('electron');
    import loginHeader from '../components/others/loginHeader.vue'
    export default {
        name: 'login-page',
        data () {
            return {
                form:{
                    username:'',
                    password:''
                },
                rules:{
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
                isDoing:{
                    login:false
                },
                isShowSettingIP:false,
                IPAddress:this.$store.state.ipAddress
            }
        },
        methods:{
            async login(){
                try{
                    this.isDoing.login = true;
                    await this.$store.dispatch('login',this.form);
                    this.isDoing.login = false;
                    this.$router.push({name:'app'})

                }catch (err){
                    this.isDoing.login = false;

                }
            },
            setIP(){
                this.$store.commit('setIpAddress',this.IPAddress);
                this.isShowSettingIP = false
            }
        },
        mounted(){

        },
        created(){
            ipcRenderer.send('set-window-of-login');
        },
        components:{loginHeader}
    }
</script>