<template>
  <div class="calendar">
     <ul class="weeks">
        <li v-for="(item,index) in week" :key="index" class="week">{{item}}</li>
     </ul>
      <div class="month">
        <transition name="month" @leave="leave">
       <!-- v-show="isMonthShow" -->
      <swiper ref="mySwiper" :options="swiperOptions" v-show="isMonthShow" :style="{height: mCalendarHeight}">
       <swiper-slide v-for="index in 12" :key="index" ref="swiperitem">
         <!-- 月历页面 -->
           <CalendarPage
           :currentMonth="currentMonth"
           :month="index - 1"
           :currentDay="currentDay"
           @MonthPageClick="MonthPageClick"
           :currentSelectYear="currentSelectYear"
           :currentSelectMonth="currentSelectMonth"
           :currentSelectDay="currentSelectDay"
           :arrowRotate="arrowRotate"></CalendarPage>
      </swiper-slide>
     </swiper>
     </transition>
      </div>
      <div class="week">
         <transition name="week">
       <!-- v-show="isWeekShow" -->
     <swiper ref="myweekSwiper" :options="swiperWeekOptions" v-show="isWeekShow" class="weekcalendar">
       <swiper-slide ref="swiperweekitem" v-for="index in weekNum" :key="index">
         <!-- 周历页面 -->
           <CalendarWeekPage
           :index="index"
           @currentWeek="currentWeek"
           @WeekPageClick="WeekPageClick"
           :currentSelectYear="currentSelectYear"
           :currentSelectMonth="currentSelectMonth"
           :currentSelectDay="currentSelectDay"
           :arrowRotate="arrowRotate"></CalendarWeekPage>
       </swiper-slide>
     </swiper>
     </transition>
      </div>
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
import CalendarWeekPage from './calendarWeekPage'
export default {
  name: 'calendar',
  data () {
    return {
      mCalendarHeight: 0,
      // 当前选中的年份
      currentSelectYear: 0,
      // 当前选中的月份
      currentSelectMonth: 0,
      // 当前选中的日期
      currentSelectDay: 0,
      // 当前年份
      currentYear: 0,
      // 当前月份
      currentMonth: 0,
      // 当前日期
      currentDay: 0,
      // 箭头切换
      arrowRotate: false,
      // 月历是否显示
      isMonthShow: false,
      // 周历是否显示
      isWeekShow: true,
      // swiper配置
      swiperOptions: {
        autoHeight: true,
        touchRatio: 0.8,
        on: {
          // 轮播图滑动
          slideChange: () => {
            this.$nextTick(() => {
              let index = this.$refs.mySwiper.$swiper.activeIndex
              this.$refs.mySwiper.$swiper.updateAutoHeight(100)
              this.$refs.swiperitem[index].$children[0].initDay()
              this.currentSelectMonth = this.$refs.mySwiper.$swiper.activeIndex
              this.getWeeks()
              this.monthCalendarHeight()
              // if (this.currentSelectMonth !== this.currentMonth) {
              //   this.currentSelectDay = 1
              // }
            })
          },
          // 触控滑动松开之后
          touchEnd: () => {
            let Tr = this.$refs.mySwiper.$swiper.translate
            if (Tr < -4000) {
              this.currentSelectYear = this.currentSelectYear + 1
              this.$refs.mySwiper.$swiper.slideTo(0, 500)
              this.Bus.$emit('addYear')
            }
            if (Tr > 90) {
              this.currentSelectYear = this.currentSelectYear - 1
              this.$refs.mySwiper.$swiper.slideTo(11, 500)
              this.Bus.$emit('subYear')
            }
          }
        }
      },
      // 周历需要生成几个轮播图
      weekNum: 0,
      // 周历的当前月
      // currentWeekMonth: 0,
      // 目前周历处于第几周
      cweek: 1,
      // 周历配置
      swiperWeekOptions: {
        touchRatio: 0.8,
        on: {
          // 触控滑动松开之后
          touchEnd: () => {
            let Tr = this.$refs.myweekSwiper.$swiper.translate
            let TrRange = -(this.weekNum - 1) * this.$refs.myweekSwiper.$swiper.width - 100
            if (Tr < TrRange) {
              if (this.currentSelectMonth === 11) {
                this.currentSelectYear = this.currentSelectYear + 1
                this.currentSelectMonth = 0
                console.log('需要加载下一年')
              } else {
                this.currentSelectMonth = this.currentSelectMonth + 1
              }
              this.currentSelectDay = 1
              this.$refs.myweekSwiper.$swiper.slideTo(0, 500)
              this.Bus.$emit('addMonth')
            }
            if (Tr > 100) {
              if (this.currentSelectMonth === 0) {
                this.currentSelectYear = this.currentSelectYear - 1
                this.currentSelectMonth = 11
                console.log('需要加载上一年')
              } else {
                this.currentSelectMonth = this.currentSelectMonth - 1
              }
              this.currentSelectDay = 1
              this.$refs.myweekSwiper.$swiper.slideTo(0, 500)
              this.Bus.$emit('subMonth')
            }
          }
        }
      }
    }
  },
  watch: {
    cweek (week) {
      this.$refs.myweekSwiper.$swiper.slideTo(week - 1, 0)
    },
    currentSelectYear () {
      this.Bus.$emit('getSelectDay', this.currentSelectYear, this.currentSelectMonth, this.currentSelectDay)
    },
    currentSelectDay () {
      this.Bus.$emit('getSelectDay', this.currentSelectYear, this.currentSelectMonth, this.currentSelectDay)
    },
    currentSelectMonth () {
      this.getWeeks()
      this.Bus.$emit('getSelectDay', this.currentSelectYear, this.currentSelectMonth, this.currentSelectDay)
    }
  },
  components: {
    CalendarPage,
    CalendarWeekPage
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
      this.currentSelectYear = this.currentYear
      this.currentSelectMonth = this.currentMonth
      this.currentSelectDay = this.currentDay
    },
    // 周历月历切换
    arrowClick () {
      this.arrowRotate = !this.arrowRotate
      this.isMonthShow = !this.isMonthShow
      this.isWeekShow = false
      this.$nextTick(() => {
        this.Bus.$emit('arrowClick')
        this.$refs.mySwiper.$swiper.slideTo(this.currentSelectMonth, 500)
      })
    },
    leave () {
      setTimeout(() => {
        this.isWeekShow = !this.isWeekShow
      }, 900)
    },
    // 获取当前月份要有几周
    getWeeks () {
      let date = new Date()
      date.setFullYear(this.currentSelectYear, this.currentSelectMonth, 1)
      let currentWeek = date.getDay()
      if (currentWeek === 6 || currentWeek === 5) {
        // 如果第一天是周六/周五，那么就按6周来显示，如果不是就按照5周显示
        this.weekNum = 6
      } else {
        this.weekNum = 5
      };
      if (this.currentSelectMonth === 1) {
        this.weekNum = 5
      }
    },
    currentWeek (weekno) {
      console.log(weekno)
      this.cweek = weekno
    },
    // 月历点击事件
    MonthPageClick (Day, Month) {
      // console.log(Day, Month)
      this.currentSelectMonth = Month
      this.currentSelectDay = Day
    },
    // 周历点击事件
    WeekPageClick (wDay, wMonth) {
      this.currentSelectMonth = wMonth
      this.currentSelectDay = wDay
    },
    monthCalendarHeight () {
      this.mCalendarHeight = 51.43 * this.weekNum + 'px'
    }
  },
  computed: {
    showCalender: () => {
      return this.currentType[this.cIndex]
    }
  },
  created () {
    this.getdays()
    this.getWeeks()
    this.monthCalendarHeight()
    this.Bus.$emit('getSelectDay', this.currentSelectYear, this.currentSelectMonth, this.currentSelectDay)
  },
  mounted () {
    // 月历滚动到当前月
    this.$refs.mySwiper.$swiper.slideTo(this.currentMonth, 0)
    // 周历滚动到当前周
    console.log(`当前是${this.cweek}周`)
    this.$refs.myweekSwiper.$swiper.slideTo(this.cweek, 0)
    // 监听回到今天的点击
    this.Bus.$on('backToday', () => {
      this.$refs.mySwiper.$swiper.slideTo(this.currentMonth, 500)
      this.$refs.myweekSwiper.$swiper.slideTo(this.cweek - 1, 500)
      this.currentSelectYear = this.currentYear
      this.currentSelectMonth = this.currentMonth
      this.currentSelectDay = this.currentDay
    })
  }
}
</script>

<style lang="stylus" scoped>
.calendar
  border-bottom 1px solid #e4e4e4
  background-color #fff
  position relative
  .weeks
    display flex
    justify-content space-between
    list-style none
    padding 0 19px
    height 30px
    line-height 30px
    color #c5bcbc
    font-size 12px
  .month-enter,
  .month-leave-to
    max-height 0px
  .month-enter-to,
  .month-leave
    max-height 600px
  .month-enter-active, .month-leave-active
    transition: max-height 2s
  .week-enter,
  .week-leave-to
    opacity 0
  .week-enter-to,
  .week-leave
    opacity 1
  .week-enter-active
    transition opacity 2s
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
      transition: all 1s
    .top
      transform: rotateX(-180deg)
      -webkit-transform-origin left
      transition: all 1s
</style>
