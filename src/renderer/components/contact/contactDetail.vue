<template>
    <div id="contact-detail">
        <div class="contact-info">
            <div class="contact-info-top">
                <div style="">{{contact.legalName}}
                    <em class="fa fa-mars ml-md" v-if="contact.sex==='男'" style="font-size: 20px;color: #20A0FF"></em>
                    <em class="fa fa-venus ml-md" v-if="contact.sex==='女'"  style="font-size: 20px;color: #FF4949"></em>
                </div>
                <avatar class="avatar" :name="contact.legalName+contact.id" radius="5px"></avatar>
            </div>
            <div class="contact-info-bottom">
                <table>
                    <tr><td>姓名</td><td>{{contact.legalName}}</td></tr>
                    <tr><td>ID号</td><td>{{contact.id}}</td></tr>
                    <tr><td>部门</td><td>{{contact.department.name}}</td></tr>
                    <tr><td>职位</td><td>{{contact.position.name}}</td></tr>
                </table>
            </div>

        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../../style";

    .contact-info{
        margin: 0 auto;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        min-width: 250px;
        max-width: 300px;
        .contact-info-top{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 30px;
            border-bottom: solid 1px $border-color;
            div{
                font-size: 30px;
            }
            .avatar{
                width: 100px;border-radius: 5px;
            }
        }
        .contact-info-bottom{
            margin-top: 35px;
            width: 100%;
            justify-content: flex-start;
            tr{

                td{
                    padding-bottom: 5px;
                    font-size: 14px;

                }
                td:nth-child(1){
                    color: #88898A;
                    width: 70px;

                }

            }
        }

    }
</style>
<script>
    export default {
        name: 'contact-detail',
        props:['contact'],
        data () {
            return {
            }
        },
        methods:{},
        created(){}
    }
</script>