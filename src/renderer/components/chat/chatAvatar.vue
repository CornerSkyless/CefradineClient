<template>
    <div id="chat-avatar" :class="imgClass">
        <avatar v-for="name in imgList" v-if="name" class="avatar" :key="name" radius="1px" :name="name"></avatar>
    </div>
</template>
<style type="text/scss" lang="scss">
    #chat-avatar{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap-reverse;
        align-items: center;
        background: #DDDEE0;
        line-height: 0;
        text-space: 0;

    }
    .img-100{
        .avatar{
            width: 100%;
            border-radius: 3px;

        }
    }
    .img-50{
        .avatar{
            width: 45%;
            border-radius: 1px;
            font-size: smaller;

        }

    }
    .img-30{
        .avatar{
            width: 30%;
            border-radius: 1px;
            font-size: xx-small;

        }
    }


</style>
<script>
    export default {
        name: 'chat-avatar',
        props:['userList'],
        data () {
            return {
                imgList:[]
            }
        },
        methods:{},
        watch:{
            userList(){
                this.imgList = [];
                this.userList.forEach(user=>{
                    if(user.id!==this.$store.state.currentUser.id || this.userList.length!==2){
                        if(this.imgList.length<9) this.imgList.push(user.legalName+user.id)
                    }
                });
            }
        },
        computed:{
            imgClass(){
                return {
                    'img-100':this.imgList.length===1,
                    'img-50':this.imgList.length>=2 && this.imgList.length<=4,
                    'img-30':this.imgList.length>4
                }
            }
        },
        created(){
            this.userList.forEach(user=>{
                if(user.id!==this.$store.state.currentUser.id || this.userList.length!==2){
                    if(this.imgList.length<9) this.imgList.push(user.legalName+user.id)
                }
            })
        }
    }
</script>