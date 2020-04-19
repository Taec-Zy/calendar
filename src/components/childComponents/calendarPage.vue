<template>
  <div>
   <ul class="days">
       <li class="day" v-for="(item,index) in currentMonthPage"
       :key='index'
       :class="[
       {'notMonth': !isCurrentMonth(item.date)},
       {'active': isActive(item.date)},
       {'hasCalendar': hasCalendar(item.date, index)}]"
       @click="dayClick(item.date)">
          {{item.day}}
       </li>
     </ul>
  </div>
</template>

<script>
import { getCalendar } from '../../network'
export default {
  name: 'calendarpage',
  data () {
    return {
      // 当前点击了日期
      selectDay: 0,
      // 当前月份设置数据
      currentMonthData: {
        SetUP: []
      },
      // 日期数组
      days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      // 开始日期和结束日期
      starttime: '',
      endtime: ''
    }
  },
  props: {
    currentYear: {
      type: Number
    },
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
    dayClick (date) {
      if (date.getMonth() === this.month) {
        this.selectDay = date.getDate()
      }
      // 向总线发送事件 传递选中的日期
      this.Bus.$emit('calendarDayClick', this.month, this.selectDay, this.currentYear)
      // 当前日期/当前周的还有几天过完(不算今天) 向上取整就是当前月份的周数
    },
    isCurrentMonth (date) {
      return this.month === date.getMonth()
    },
    initDay () {
      if (this.currentMonth === this.month) {
        this.selectDay = this.currentDay
      } else {
        this.selectDay = 1
      }
      this.Bus.$emit('calendarDayClick', this.month, this.selectDay, this.currentYear)
    },
    // 获取起始和结束时间
    getTimeRange () {
      this.starttime = `${this.currentYear}-${this.padLeftZero(this.month + 1)}-01`
      let endday = this.days[this.month]
      if ((this.currentYear % 4 === 0 && this.currentYear % 100 !== 0) || this.currentYear % 400 === 0) {
        if (this.month === 1) endday = 29
      }
      this.endtime = `${this.currentYear}-${this.padLeftZero(this.month + 1)}-${endday}`
    },
    // 给日期补0
    padLeftZero (str) {
      str = str + ''
      return ('00' + str).substr(str.length) // 用0补齐位数
    }
  },
  mounted () {
    this.initDay()
  },
  computed: {
    currentMonthPage () {
      // 当前月份数组
      let calendarDateArr = []
      // 采用42/35显示标注
      let monthDayNum
      const page = new Date()
      page.setFullYear(this.currentYear, this.month, 1)
      // 获取当前月的第一天
      let weekStarDay = page.getTime()
      // 获取当前页第一天是周几
      let weekDay = page.getDay() + 1
      if (weekDay === 0) weekDay = 7
      // 当前月第一天是周几就要往前面添加几天 往前添加每天的毫秒数
      let startTime = weekStarDay - (weekDay - 1) * 24 * 60 * 60 * 1000
      if (weekDay === 5 || weekDay === 6 || weekDay === 7) {
        // 如果第一天是周六/周日，那么就按7周来显示，如果不是就按照5周显示
        monthDayNum = 42
      } else {
        monthDayNum = 35
      };
      // 循环生成数组
      for (let i = 0; i < monthDayNum; i++) {
        calendarDateArr.push({
          date: new Date(startTime + i * 24 * 60 * 60 * 1000),
          year: this.currentYear,
          month: this.month + 1,
          day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
          index: i
        })
      }
      return calendarDateArr
    },
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
    hasCalendar (date, index) {
      return function (date, index) {
        let day = `${date.getFullYear()}-${this.padLeftZero(date.getMonth() + 1)}-${this.padLeftZero(date.getDate())}`
        console.log(this.currentMonthData.SetUP[index].date, day)
      }
    }
  },
  created () {
    this.getTimeRange()
    getCalendar(this.starttime, this.endtime, '创建').then(res => {
      this.currentMonthData.SetUP = res.data.days
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
</style>
