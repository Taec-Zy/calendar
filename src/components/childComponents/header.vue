<template>
  <div class="header">
     <div class="left"></div>
     <div class="middle">
        <span>
           2020-04-14
        </span>
     </div>
     <div class="right">
        <span>
           今天
        </span>
     </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.header
  display flex
  height 53px
  width 100%vw
  background-color #333333
  .left
    width 70px
  .middle
    flex 1
    line-height 53px
    text-align center
    color #fff
  .right
    width 70px
    line-height 53px
    text-align center
    color #fff
</style>
