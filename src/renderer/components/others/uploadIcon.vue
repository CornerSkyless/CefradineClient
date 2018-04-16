<template>
  <div id="upload-icon">
      <form id="file-form"><input @change="upload" type="file" name="file" ><em class="fa fa-file-o"></em></form>
  </div>
</template>

<style type="text/scss" lang="scss">
  #upload-icon{
    cursor: pointer;
      position: relative;
      input {
        position: absolute;
        cursor: pointer;

        opacity: 0;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;

      }

  }
</style>

<script>
  export default {
    name: 'upload-icon',
    props:[],
    data () {
      return {
      }
    },
    methods:{
      upload(){
        let formData = new FormData(document.getElementById('file-form'));
        
        this.$emit('upload',formData);
      },
    },
    created(){}
  }
</script>
