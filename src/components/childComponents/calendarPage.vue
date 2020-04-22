/* eslint-disable no-irregular-whitespace */
<template>
  <div>
   <div class="days">
        <div class="day" v-for="(item,index) in calendarDateArr"
        :key='index'
        :class="[
        {'notMonth': !isCurrentMonth(item.date)},
        {'active': isActive(item.date)}]"
        @click="dayClick(item.date)">
           {{item.day}}
        <i class="hascalendar" v-for="(calendatr, indey) in currentMonthData[showCalender]" :key="indey" v-show="index === indey? calendatr.hasmatter : false"></i>
        </div>
     </div>
  </div>
</template>

<script>
import { getCalendar } from '../../network'
export default {
  name: 'calendarpage',
  data () {
    return {
      // 当前日历年份
      currentYear: 0,
      // 当前页日历表
      calendarDateArr: [],
      // 当前点击了日期
      selectDay: 0,
      // 当前月份设置数据
      currentMonthData: {
        Remind: [],
        SetUP: [],
        Last: []
      },
      // 开始日期和结束日期
      starttime: '',
      endtime: '',
      // 当前需要展示的日历类型
      showCalender: 'Remind'
    }
  },
  props: {
    currentMonth: {
      type: Number
    },
    currentDay: {
      type: Number
    },
    month: {
      type: Number
    }
  },
  methods: {
    // 计算当前页的日历表
    currentMonthPage () {
      // 当前月份数组
      // 采用42/35显示标注
      let monthDayNum
      const page = new Date()
      page.setFullYear(this.currentYear, this.month, 1)
      // 获取当前月的第一天
      let weekStarDay = page.getTime()
      // 获取当前页第一天是周几
      let weekDay = page.getDay()
      console.log(this.month + 1, weekDay)
      // 当前月第一天是周几就要往前面添加几天 往前添加每天的毫秒数
      let startTime = weekStarDay - weekDay * 24 * 60 * 60 * 1000
      if (weekDay === 6 || weekDay === 7) {
        // 如果第一天是周六/周日，那么就按7周来显示，如果不是就按照5周显示
        monthDayNum = 42
      } else {
        monthDayNum = 35
      };
      if (this.month === 1) {
        monthDayNum = 35
      }
      // 循环生成数组
      this.calendarDateArr = []
      for (let i = 0; i < monthDayNum; i++) {
        this.calendarDateArr.push({
          date: new Date(startTime + i * 24 * 60 * 60 * 1000),
          year: this.currentYear,
          month: this.month + 1,
          day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
          index: i
        })
      }
    },
    // 日期点击事件
    dayClick (date) {
      if (date.getMonth() === this.month) {
        this.selectDay = date.getDate()
      }
      // 向总线发送事件 传递选中的日期
      this.Bus.$emit('calendarDayClick', this.month + 1, this.selectDay, this.currentYear)
      this.Bus.$emit('calendarDayClick2', this.month, this.selectDay, this.currentYear)
      // 当前日期/当前周的还有几天过完(不算今天) 向上取整就是当前月份的周数
    },
    isCurrentMonth (date) {
      return this.month === date.getMonth()
    },
    // 日期初始化
    initDay () {
      if (this.currentMonth === this.month) {
        this.selectDay = this.currentDay
      } else {
        this.selectDay = 1
      }
      this.Bus.$emit('calendarDayInit', this.month + 1, this.selectDay, this.currentYear)
      this.Bus.$emit('calendarDayInit2', this.month, this.selectDay, this.currentYear)
    },
    // 获取起始和结束时间
    getTimeRange () {
      let star = this.calendarDateArr[0].date
      let starMonth = star.getMonth() + 1
      let starDay = star.getDate()
      let starYear = star.getFullYear()
      let length = this.calendarDateArr.length
      let end = this.calendarDateArr[length - 1].date
      let endMonth = end.getMonth() + 1
      let endDay = end.getDate()
      let endYear = end.getFullYear()
      this.starttime = `${starYear}-${starMonth}-${starDay}`
      this.endtime = `${endYear}-${endMonth}-${endDay}`
    },
    // 给日期补0
    padLeftZero (str) {
      str = str + ''
      return ('00' + str).substr(str.length) // 用0补齐位数
    },
    // 获取所有数据
    getAllCalendar () {
      getCalendar(this.starttime, this.endtime, '创建').then(res => {
        this.currentMonthData.SetUP = res.data.days
      })
      getCalendar(this.starttime, this.endtime, '提醒').then(res => {
        this.currentMonthData.Remind = res.data.days
      })
      getCalendar(this.starttime, this.endtime, '最后').then(res => {
        this.currentMonthData.Last = res.data.days
      })
      this.Bus.$on('tabbarClick1', type => {
        this.showCalender = type
      })
    }
  },
  mounted () {
    this.initDay()
    this.Bus.$on('addYear', () => {
      console.log('add')
      this.currentYear = this.currentYear + 1
      this.currentMonthPage()
      this.getTimeRange()
      this.getAllCalendar()
    })
    this.Bus.$on('subYear', () => {
      console.log('sub')
      this.currentYear = this.currentYear - 1
      this.currentMonthPage()
      this.getTimeRange()
      this.getAllCalendar()
    })
  },
  computed: {
    isActive (date) {
      return function (date) {
        let active = false
        if (this.currentMonth === date.getMonth() && this.month === date.getMonth()) {
          active = this.selectDay === date.getDate()
        } else if (this.month === date.getMonth() && this.month === date.getMonth()) {
          active = this.selectDay === date.getDate()
        }
        return active
      }
    },
    hasCalendar (index) {
      return function (index) {
        if (typeof (this.currentMonthData['Remind'][index].hasmatter) !== 'undefined') {
          return this.currentMonthData['Remind'][index].hasmatter
        }
      }
    }
  },
  created () {
    let day = new Date()
    this.currentYear = day.getFullYear()
    this.currentMonthPage()
    this.getTimeRange()
    this.getAllCalendar()
    this.Bus.$on('backToday', () => {
      console.log('日历页监听')
      let date = new Date()
      this.currentYear = date.getFullYear()
    })
  }
}
</script>

<style lang='stylus' scoped>
.days
    display flex
    flex-wrap wrap
    list-style none
    .day
      position relative
      width 51.43px
      height 51.43px
      line-height 51.43px
      text-align center
    .notMonth
      color #cccccc
    .active
      border-radius 50%
      background-color #2a579a
      color #ffffff
    .hascalendar
      &:after
        content ""
        display block
        position absolute
        left 50%
        transform translateX(-50%)
        top 80%
        width 5px
        height 5px
        border-radius 50%
        background-color #ff9400
</style>
