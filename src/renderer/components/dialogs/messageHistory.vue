<template>
    <div id="message-history">
        <el-dialog title="聊天记录" v-model="isShow" >
            <el-input placeholder="搜索" @change="search" size="small" v-model="keyword"></el-input>
            <div class="mt-md" v-loading="isLoading" style="max-height: 300px;overflow-y: auto">
                <div v-for="message in messageList" class="bb mb-sm" v-if="message.type=='text'||message.type=='file'">
                    <span style="font-size: 12px" class="text-blue" :class="{'text-green':message.sender.id==$store.state.currentUser.id}">
                         <span class="text-silver">{{message.builtTime}}</span> {{message.sender.legalName}}
                    </span>
                    <p v-if="message.type=='text'" class="mb-sm" style="margin-top: 0">{{message.content}}</p>
                    <p v-if="message.type=='file'" class="mb-sm" style="margin-top: 0">
                        [文件] {{message.media.name}}
                        <a :download="message.media.name" :href="message.media.url">下载</a>
                    </p>
                </div>
            </div>
            <div class="text-center">
                <el-pagination class="mt-md"
                               @current-change="queryMessageList"
                               layout="prev, pager, next"
                               :total.sync="totalCount" :current-page.sync="page"></el-pagination>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'message-history',
        props:['value','chatId'],
        data () {
            return {
                isShow:this.value,
                isLoading:false,
                messageList:[],
                page: 1,
                pageSize: 10,
                totalPage: 1,
                totalCount:0,
                keyword:''
            }
        },
        watch:{
            isShow(val){
                this.$emit('input',val);
                if(val){
                    this.queryMessageList(10,0);
                }

            },
            value(val){
                this.isShow = val;
            }

        },
        methods:{
            async queryMessageList(){
                try{
                    this.isLoading = true;
                    let result = await this.$store.dispatch('request',{api:'message/index',form:{
                        pageSize:this.pageSize,page:this.page-1,chatId:this.chatId,keyword:this.keyword
                    }});
                    this.totalPage = result.totalPage;
                    this.totalCount = result.totalCount;
                    this.messageList = result.messageList;
                    this.isLoading = false;
                }catch (err){

                    this.isLoading = false;
                }
            },
            search(){
               this.page = 1;
               this.queryMessageList();
            }
        },
        created(){}
    }
</script>