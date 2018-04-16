<template>
    <div id="contact-selector">
        <el-dialog title="选择联系人群聊" v-model="isShow" size="large">
            <div class="mb-md" style="width: 100%;display: flex;justify-content: space-between;text-space: 0">
                <div style="width: 50%;padding: 20px;max-height: 250px;overflow-y: auto">
                    <div v-for="department in contactList" v-if="department.userList.length>0">
                        <div style="font-size: 12px;color: #888888">{{department.name}}</div>
                        <div v-for="user in department.userList"  @click="user.checked = !user.checked" style="display: flex;align-items: center;justify-content: space-between;margin: 10px 0;cursor: pointer">
                            <div style="display: flex;align-items: center" >
                                <avatar :name="user.legalName+user.id" radius="4px" style="width: 30px;margin-right: 10px;"></avatar>
                                <span style="font-size: 14px">{{user.legalName}}</span>
                            </div>
                            <el-checkbox v-model="user.checked"  style="justify-self: flex-end"></el-checkbox>
                        </div>
                    </div>
                </div>
                <div style="width: 50%;text-align: center;max-height: 250px;overflow-y: auto">
                    <div style="margin: 10px 0;font-size: 12px">已选择联系人</div>
                    <div v-for="user in selectedList" style="text-align: center;margin: 5px;display: inline-block" @click="user.checked = false">

                        <avatar :name="user.legalName+user.id" radius="4px" style="width: 40px;"></avatar>
                        <div style="font-size: 12px;text-align: center;">{{user.legalName}}</div>
                    </div>
                </div>
            </div>
            <div >
                <el-button size="small" @click="isShow=false" style="width: 80px">取消</el-button>
                <el-button type="primary" size="small" style="width: 80px" @click="submit" :disabled="selectedList.length==0">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'contact-selector',
        props:['value','disabledList'],
        data () {
            return {
                contactList:[],
                isShow:this.value
            }
        },
        watch:{
            isShow(val){
                this.$emit('input',val);
            },
            value(val){
                this.isShow = val;
            },
            disabledList(){
                this.contactList = JSON.parse(JSON.stringify(this.$store.state.contactList)).map(department=>{
                    let userList = [];
                    department.userList.forEach(user=>{
                        user.checked = false;
                        if(this.disabledList){
                            if(this.disabledList.indexOf(user.id)<0)  userList.push(user);
                        }else{
                            userList.push(user);
                        }
                    });
                    department.userList = userList;
                    return department;
                });
            }

        },
        computed:{
            selectedList(){
                let list = [];
                this.contactList.forEach(group=>{
                    group.userList.forEach(contact=>{
                        if(contact.checked) list.push(contact);
                    })
                });
                return list;
            }
        },
        methods:{

            submit(){
                this.isShow = false;
                this.$emit('submit',this.selectedList);
            }

        },
        created(){
            this.contactList = JSON.parse(JSON.stringify(this.$store.state.contactList)).map(department=>{
                let userList = [];
                 department.userList.forEach(user=>{
                    user.checked = false;
                    if(this.disabledList){
                        if(this.disabledList.indexOf(user.id)<0)  userList.push(user);
                    }else{
                        userList.push(user);
                    }
                });
                department.userList = userList;
                return department;
            });
        }
    }

</script>