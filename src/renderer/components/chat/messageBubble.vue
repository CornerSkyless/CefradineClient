<template>
    <div id="message-bubble" class="message-row-content-bubble " :class="{'message-row-content-bubble-self':position==='right','message-row-content-bubble-other':position==='left'}">
        <p>{{message.content}}</p>
        <div class="arrow"></div>

    </div>


</template>

<style type="text/scss" lang="scss">
    .message-row-content-bubble {
        position: relative;
        padding: 7px 10px;
        background: #F3F3F3;
        border-radius: 5px;
        /* 圆角 */
        margin-top: 3px;
        user-select: text;
        min-width: 20px;
        min-height: 16px;
        p {
            word-wrap: break-word;
            direction: ltr;
            max-width: 200px;
            flex-wrap: wrap;
            font-size: 14px;
            margin: 5px 0;
            /*line-height: 20px;*/
        }
        .arrow {
            position: absolute;
            top: 5px;
            right: -16px;
            /* 圆角的位置需要细心调试哦 */
            width: 0;
            height: 0;
            font-size: 0;
            border: solid 8px;
        }
    }

    .message-row-content-bubble-self {
        background: #A5E369;
        margin-right: 10px;

        .arrow {
            border-color: transparent transparent transparent #A5E369;
        }
    }

    .message-row-content-bubble-other {
        background: #F3F3F3;
        margin-left: 10px;
        .arrow {
            left: -16px;
            border-color: transparent #F3F3F3 transparent transparent;
        }
    }
</style>

<script>
    export default {
        name: 'message-bubble',
        props: ['position', 'message'],
        data() {
            return {
            }
        },
        methods: {},
        created() { }
    }
</script>