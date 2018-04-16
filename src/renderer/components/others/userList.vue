<template>
    <div id="user-list" style="overflow-y: auto;max-height: 300px">
        <div v-for="user in userList" class="mv-sm" style="display: flex;align-items: center">
            <avatar :name="user.legalName+user.id" class="avatar" radius="3px" ></avatar>
            <div class="ml-md">{{user.legalName}}</div>
        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    #user-list{
        .avatar{
            width: 35px;
        }
    }
</style>
<script>
    export default {
        name: 'user-list',
        props:['userList'],
        data () {
            return {
            }
        },
        methods:{},
        created(){}
    }
</script>