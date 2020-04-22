<template>
<div ref="calendarlist">
  <Scorll ref="scroll" :style="{height: cheight}">
    <div class="list">
     <div class="nocalender" v-show="!currentList.length" :style="{height: cheight, lineHeight: cheight}">
        今天没有此项日程
     </div>
     <div class="listitem" v-for="(item, index) in currentList" :key="index">
        <div class="info">
          <div class="title">{{item.title}}</div>
          <div class="subtitle">{{item.subtitle}}</div>
          <div class="role">我的角色：{{item.role}}</div>
        </div>
        <span class="time">{{item.reminddate.substring(11)}}</span>
        <span class="more">...</span>
     </div>
    </div>
  </Scorll>
</div>
</template>

<script>
import { getDayMatters } from '../../network'
import Scorll from '../scroll/scroll.vue'
export default {
  name: 'calendarlist',
  components: {
    Scorll
  },
  data () {
    return {
      // Type的中文数组
      type: ['提醒', '创建', '最后'],
      // 当前的选中的类型
      currentType: 0,
      // 处理当前时间
      currentTime: '',
      // 当前需要展示的数组
      currentList: [],
      // 当前列表栏的高度
      cheight: '0px'
    }
  },
  methods: {
    getDay (month, day, year) {
      this.currentTime = `${year}-${this.padLeftZero(month)}-${this.padLeftZero(day)}`
    },
    // 给日期补0
    padLeftZero (str) {
      str = str + ''
      return ('00' + str).substr(str.length) // 用0补齐位数
    }
  },
  created () {
    // 通过总线监听每个日历页的初始化
    this.Bus.$on('calendarDayInit', (month, day, year) => {
      this.getDay(month, day, year)
    })
    // 通过总线监听每个日历页的日期点击事件
    this.Bus.$on('calendarDayClick', (month, day, year) => {
      this.getDay(month, day, year)
      getDayMatters(this.currentTime, this.type[this.currentType]).then(res => {
        this.currentList = res.data.matters
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollTo(0, 0)
      })
    })
    // 通过总线监听tabbar栏的点击
    this.Bus.$on('tabbarClick2', index => {
      this.currentType = index
      getDayMatters(this.currentTime, this.type[this.currentType]).then(res => {
        this.currentList = res.data.matters
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollTo(0, 0)
      })
    })
    // 监听日历页切换事件
    this.Bus.$on('slideChange', () => {
      let h = 640 - this.$refs.scroll.$el.offsetTop + 'px'
      console.log(h)
      this.cheight = h
      getDayMatters(this.currentTime, this.type[this.currentType]).then(res => {
        this.currentList = res.data.matters
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollTo(0, 0)
      })
    })
  },
  mounted () {
    // 获取初始化的数据
    getDayMatters(this.currentTime, this.type[this.currentType]).then(res => {
      this.currentList = res.data.matters
      this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang='stylus' scoped>
.wrapper
  width 100%vw
  overflow hidden
  .list
    width 100%vw
    background-color #fff
    .nocalender
      text-align center
      width 100%vw
      font-size 25px
      color #f2f2f2
    .listitem
      position relative
      padding 11px 16px
      height 74px
      border-bottom 1px solid #f2f2f2
      .info
        .title
          font-size 18px
          font-weight 600
          color #343434
        .subtitle
          padding 7px 0
          font-size 12px
          color #999999
        .role
          font-size 12px
      .time
        position absolute
        top 10px
        right 5px
        font-size 15px
        color #999999
      .more
        position absolute
        bottom 10px
        right 5px
        font-size 34px
        color #999999
</style>
