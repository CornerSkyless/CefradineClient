<template>
    <div id="contact-list-component">
        <div class=" header search-header">
            <input v-model="keyword" type="text" placeholder="搜索"  style=" -webkit-app-region: no-drag;">
        </div>
        <div class="contact-list">
            <div v-for="department,i in contactList">
                <div class="department-title" @click="selectDepartment(i)" >
                    <div class="align-center">
                        <em v-if="i==activeDepartmentIndex" class="fa fa-angle-down"></em>
                        <em v-else class="fa fa-angle-right"></em>
                        <span>{{department.name}}</span>
                    </div>
                    <span class="number">{{department.userList.length}}</span>
                </div>
                <div v-if="i==activeDepartmentIndex" v-for="contact in department.userList"
                     @click="selectContact(contact)" class="pl-md contact-title"
                     :class="{'contact-title-active':selectedContact===contact}">
                    <avatar :name="contact.legalName+contact.id" class="avatar" radius="3px"></avatar>
                    <div class="contact-title-right">
                        <div class="name">{{contact.legalName}}</div>
                        <div class="position">{{contact.position.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style type="text/scss" lang="scss">
    #contact-list-component{
        .contact-list{
            overflow-y: scroll;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 66px;
            padding-top: 5px;
            .department-title{
                padding: 0 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 30px;
                font-size: 14px;
                cursor: pointer;
                user-select: none;
                em{
                    text-align: center;
                    width: 15px;
                    color: #CFCFCF;
                    font-size: 20px;
                    margin-right: 10px;
                }
                .number{
                    color:#CFCFCF ;
                }
            }
            .contact-title{
                padding: 5px 35px;
                display: flex;
                align-items: center;
                // margin: 8px 0;
                cursor: pointer;
                .avatar{
                    width: 35px;
                    border-radius: 3px;
                }
                .contact-title-right{
                    display: block;
                    margin-left: 7px;
                    white-space: nowrap;text-overflow:ellipsis; overflow:hidden;word-break: break-all;

                    .position{
                        font-size: 12px;
                        color: #787777;
                    }
                }


            }
            .contact-title-active{
                background:#D9D8D8;
            }
        }

    }
</style>

<script>
    export default {
        name: 'contact-list',
        data () {
            return {
                activeDepartmentIndex:0,
                selectedContact:null,
                keyword:''
            }
        },
        computed:{
            contactList(){

                let contactList = JSON.parse(JSON.stringify(this.$store.state.contactList));
                if(this.keyword.trim()){
                    contactList = contactList.map((department)=>{
                        department.userList = department.userList.filter(user=>{
                            return user.legalName.indexOf(this.keyword.trim())>=0
                        });
                        return department
                    });
                }

                return contactList;
            }
        },
        methods:{
            selectDepartment(index){
                if(index===this.activeDepartmentIndex){
                    this.activeDepartmentIndex = -1;
                }else this.activeDepartmentIndex = index;
            },
            selectContact(contact){
                if(this.selectedContact!==contact){
                    this.selectedContact = contact;
                    this.$emit('select-contact',contact);
                }

            }
        },
        created(){}
    }

</script>