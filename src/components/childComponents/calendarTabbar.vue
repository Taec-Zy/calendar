<template>
  <div class="tabbar">
     <span @click="tabbarClick('0')" :class="[{'active': isActive('0')}, 'tabbaritem']">已设置提醒</span>
     <span @click="tabbarClick('1')" :class="[{'active': isActive('1')}, 'tabbaritem']">创建时间</span>
     <span @click="tabbarClick('2')" :class="[{'active': isActive('2')}, 'tabbaritem']">最后发言时间</span>
  </div>
</template>

<script>
export default {
  name: 'calendartabbar',
  data () {
    return {
      currentIndex: '0',
      // 当前需要获取的数据类型
      type: ['Remind', 'SetUP', 'Last']
    }
  },
  methods: {
    tabbarClick (index) {
      if (index !== 1) {
        this.currentIndex = index
      }
      this.Bus.$emit('tabbarClick1', this.type[this.currentIndex])
      this.Bus.$emit('tabbarClick2', this.currentIndex)
    }
  },
  computed: {
    isActive (index) {
      return function (index) {
        if (this.currentIndex === index) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
.tabbar
  display flex
  position relative
  padding 13px 26px 40px 26px
  width 100%vw
  background-color #f5f5f5
  z-index 2
  overflow hidden
  &:before
    content ''
    width 20px
    height 20px
    background-color #2a579a
    transform rotate(45deg)
    position absolute
    top 43px
  &:after
    background-color: #ffffff
    content ''
    width: 240%;
    height: 192px;
    position: absolute;
    left: -71%;
    top: -134px;
    z-index -1
    border-radius 0 0 50% 50%
    overflow hidden
  .tabbaritem
    flex 1
    display inline-block
    justify-content space-around
    text-align center
    font-size 14px
    color #707070
  .active
    color #2a579a
    font-weight 600
</style>
