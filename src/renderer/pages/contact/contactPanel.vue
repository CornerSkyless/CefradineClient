<template>
    <div id="contact-panel">
        <div class="sidebar">
            <contact-list @select-contact="selectContact">

            </contact-list>
        </div>
        <div class="container">
            <div class="header" style="background: white"></div>
            <div v-if="selectedContact">
                <contact-detail :contact="selectedContact"></contact-detail>
                <div class="text-center mt-xl">
                    <el-button type="primary" @click="newChatGroup" style="width: 120px">发消息</el-button>
                </div>
            </div>

        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    @import "../../style";

    #contact-panel{
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
            .header{
                width: 100%;
                height: 65px;
                background: $lighter-gary;
                -webkit-app-region: drag;
            }
            height: 100%;
            background: white;
        }
    }

</style>
<script>
    import ContactList from '../../components/contact/contactList.vue'
    import ContactDetail from '../../components/contact/contactDetail.vue'
    export default {
        name: 'contact-page',
        data () {
            return {
                selectedContact:null
            }
        },
        methods:{
            selectContact(contact){
                this.selectedContact = contact;
            },
            newChatGroup(){
                try{
                    this.$store.dispatch('newChat',[this.selectedContact.id]);

                }catch (err){
                    console.log(err);
                }
            }

        },

        created(){
        },
        components:{ContactList,ContactDetail}
    }
</script>