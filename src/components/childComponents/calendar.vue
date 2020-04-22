<template>
  <div class="calendar">
     <ul class="weeks">
        <li v-for="(item,index) in week" :key="index" class="week">{{item}}</li>
     </ul>
     <swiper ref="mySwiper" :options="swiperOptions">
       <swiper-slide v-for="index in 12" :key="index" ref="swiperitem">
           <CalendarPage :currentMonth="currentMonth" :month="index - 1" :currentDay="currentDay"></CalendarPage>
       </swiper-slide>
     </swiper>
     <div class="arrow">
       <div class="container" @click="arrowClick" :class="[arrowRotate ? 'top' : 'bottom' ]">
           <i class="bottom_arrow"></i>
           <i class="bottom_arrow sec_arrow"></i>
       </div>
     </div>
  </div>
</template>

<script>
import CalendarPage from './calendarPage.vue'
export default {
  name: 'calendar',
  data () {
    return {
      // 当前年份
      currentYear: 0,
      // 当前月份
      currentMonth: 0,
      // 当前日期
      currentDay: 0,
      // 箭头选择标志
      arrowRotate: false,
      // 当前轮播图序号
      currentIndex: 0,
      // swiper配置
      swiperOptions: {
        autoHeight: true,
        touchRatio: 0.8,
        on: {
          slideChange: () => {
            this.$nextTick(() => {
              let index = this.$refs.mySwiper.$swiper.activeIndex
              this.$refs.mySwiper.$swiper.updateAutoHeight(900)
              this.s(index)
              this.$refs.swiperitem[index].$children[0].initDay()
            })
          },
          transitionEnd: () => {
            this.$nextTick(() => {
              this.Bus.$emit('slideChange')
            })
          },
          touchEnd: () => {
            let Tr = this.$refs.mySwiper.$swiper.translate
            console.log(Tr)
            if (Tr < -3700) {
              this.currentYear = this.currentYear + 1
              this.$refs.mySwiper.$swiper.slideTo(0, 0)
              this.Bus.$emit('addYear')
            }
            if (Tr > 60) {
              this.currentYear = this.currentYear - 1
              this.$refs.mySwiper.$swiper.slideTo(11, 0)
              this.Bus.$emit('subYear')
            }
          }
        }
      }
    }
  },
  components: {
    CalendarPage
  },
  props: {
    week: {
      type: Array
    }
  },
  methods: {
    getdays () {
      const currentDate = new Date()
      // 获取当前年月日
      this.currentYear = currentDate.getFullYear()
      this.currentMonth = currentDate.getMonth()
      this.currentDay = currentDate.getDate()
    },
    arrowClick () {
      this.arrowRotate = !this.arrowRotate
      console.log(this.arrowRotate)
    },
    s (index) {
      console.log(index, this.currentMonth)
    }
  },
  computed: {
    showCalender: () => {
      return this.currentType[this.cIndex]
    }
  },
  created () {
    this.getdays()
  },
  mounted () {
    this.$refs.mySwiper.$swiper.slideTo(this.currentMonth, 0)
  }
}
</script>

<style lang="stylus" scoped>
.calendar
  border-bottom 1px solid #e4e4e4
  background-color #fff
  .weeks
    display flex
    justify-content space-between
    list-style none
    padding 0 19px
    height 30px
    line-height 30px
    color #c5bcbc
    font-size 12px
  .arrow
    height 40px
    width 100%vw
    display flex
    justify-content center
    align-items center
    .container
      .bottom_arrow
        height: 20px
        width 20px
        line-height: 20px
        &:before
          content: ""
          display: block
          width 10px
          height 10px
          transform rotate(135deg)
          border-color #2a579a
          border-top 2px solid #cccccc
          border-right 2px solid #cccccc
      .sec_arrow
        &:before
          margin-top -5px
          border-color #849fc5
    .bottom
      transition: all 2s
    .top
      transform: rotateX(-180deg)
      -webkit-transform-origin left
      transition: all 2s
</style>
