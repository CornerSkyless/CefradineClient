<template>
    <div class="avatar-icon">
        <div class="placeholder" :style="style"></div>
        <div class="text">{{name[0]}}</div>

    </div>

</template>
<style type="text/scss" lang="scss">
    .avatar-icon{
        position: relative;
        .placeholder {
            width: 100%;
            overflow: hidden;
            background-size: cover;

        }
        .placeholder:after {
            content: '';
            display: block;
            margin-top: 100%; /* margin 百分比相对父元素宽度计算 */
        }
        .text{
            position: absolute;
            top:0;
            z-index: 20;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color:white;
        }
    }
</style>
<script>
    import md5 from 'md5'
    export default {
        name: 'avatar',
        props:['radius','name'],
        data () {
            return {
                style:{}

            }
        },
        computed:{
            radiusStyle(){
                return {
                    'border-radius':this.radius ? this.radius : '0'

                }
            }

        },

        methods:{},
        created(){
            let colors = ['#057748','#044d96','#00a270','#009c2e','#0283b7','#008bf2','#5e5edd', '#00ba7c',
                '#4b4b8b','#0aa344'];
            let str = md5(this.name);let m = 0;
            for (let i=0;i<str.length;i++){
                if(!isNaN(str[i])){
                    m+=Number(str[i])
                }
            }
            this.style = {
                'background':colors[m%colors.length],
                'border-radius':this.radius ? this.radius : '0'
            };
        }
    }
</script>