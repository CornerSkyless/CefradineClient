<template>
  <div id="index">
    <router-view></router-view>
    <div class="windows-top">
      <div class="windows-top-gray" @click="windowSend('window-min')"><em class="fa fa-minus"></em></div>
      <div class="windows-top-gray" @click="windowSend('window-max')"><em style="font-size: 14px;" class="fa fa-window-maximize"></em></div>
      <div class="windows-top-red" @click="windowSend('window-close')"><em class="fa  fa-close"></em></div>
    </div>
  </div>
</template>

<script>
    const {ipcRenderer} = require('electron');

    export default {
    name: 'cefradine-client',
      methods:{
          windowSend(api){
              ipcRenderer.send(api);
          }

      }
  }
</script>

<style lang="scss" type="text/scss">
  @import "~element-ui/lib/theme-default/index.css";
  @import "~font-awesome/css/font-awesome.css";
  #index {
    .windows-top {
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      display: flex;
      justify-content: space-around;
      color: #b5b5b5;
      z-index: 999;
      -webkit-app-region: no-drag;
      div {
        width: 33.3%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .windows-top-gray {
        &:hover {
          background: linear-gradient(to top, rgba(51,102,204,0) 0%, rgba(51,102,204, 0.3) 75%, rgba(51,102,204, 0.4) 100%);
          color:white;
        }
      }
      .windows-top-red {
        &:hover {
          background: linear-gradient(to top, rgba(204,0,51,0) 0%, rgba(204,0,51,0.3) 75%, rgba(204,0,51,0.4) 100%);
          color:white;
        }
      }
    }
  }
</style>
