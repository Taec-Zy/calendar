<template>
  <div class="week">
     <div class="days"
     v-for="(item, x) in calendarWeekDateArr"
     :key="x"
     :class="[
        {'notMonth': !isCurrentMonth(item.date)},
        {'active': isActive(item.date)}]"
     @click="dayClick(item.date)">
       {{item.day}}
       <i class="hasweekcalendar" v-for="(calendatr, y) in currentWeekhData[showCalender]" :key="y" v-show="x === y? calendatr.hasmatter : false"></i>
     </div>
  </div>
</template>

<script>
import { getCalendar } from '../../network'
export default {
  name: 'calendarweekpage',
  data () {
    return {
      // 当前时间对应年
      currentYear: 0,
      // 当前时间对应月
      currentMonth: 0,
      // 当前时间对应日
      currentDay: 0,
      // 当前页对应的日期数组
      calendarWeekDateArr: [],
      // 当前选中日期
      selectDay: 1,
      // 当前周数的数据
      currentWeekhData: {
        Remind: [],
        SetUP: [],
        Last: []
      },
      // 周历数据开始日期和结束日期
      starttime: '',
      endtime: '',
      // 当前需要展示的日历类型
      showCalender: 'Remind'
    }
  },
  props: {
    // 记录当前页面是第几周
    index: {
      type: Number
    },
    // 记录日历切换时候对应的年份
    currentSelectYear: {
      type: Number
    },
    // 记录日历切换时候对应的月份
    currentSelectMonth: {
      type: Number
    },
    // 记录日历切换时候对应的日期
    currentSelectDay: {
      type: Number
    },
    // 对应当前切换箭头
    arrowRotate: {
      type: Boolean
    }
  },
  watch: {
    currentSelectDay (val) {
      this.selectDay = val
    },
    currentSelectMonth (val) {
      this.currentMonth = val
    },
    arrowRotate (val) {
      // 监听展开箭头切换
      if (!val) {
        console.log(`周历列表显示了${val}`)
        this.currentWeekPage()
        this.getTimeRange()
        this.getAllCalendar()
        this.currentWeek(this.currentSelectYear, this.currentSelectMonth, this.currentSelectDay)
      }
    }
  },
  computed: {
    // 确认点击
    isActive (date) {
      return function (date) {
        if (this.currentMonth === date.getMonth()) {
          return this.selectDay === date.getDate()
        }
      }
    }
  },
  methods: {
    // 日期点击事件
    dayClick (date) {
      if (date.getMonth() === this.currentMonth) {
        this.selectDay = date.getDate()
      }
      this.$emit('WeekPageClick', this.selectDay, this.currentMonth)
    },
    // 确认是否是当前月
    isCurrentMonth (date) {
      return this.currentMonth === date.getMonth()
    },
    // 日期初始化
    initDay () {
      if (this.currentMonth === this.currentSelectMonth) {
        this.selectDay = this.currentDay
      } else {
        this.selectDay = 1
      }
    },
    // 获取当前周历的数据
    currentWeekPage () {
      // 当前月份数组
      const week = new Date()
      let month = this.currentMonth
      week.setFullYear(this.currentSelectYear, month, 1)
      // 获取当前月的第一天
      let weekStarDay = week.getTime()
      // 获取当前页第一天是周几
      let weekDay = week.getDay()
      // 当前月第一天是周几就要往前面添加几天 往前添加每天的毫秒数
      let startTime = weekStarDay - weekDay * 24 * 60 * 60 * 1000
      // 循环生成数组
      this.calendarWeekDateArr = []
      let num = this.index * 7
      for (let i = (this.index - 1) * 7; i < num; i++) {
        this.calendarWeekDateArr.push({
          date: new Date(startTime + i * 24 * 60 * 60 * 1000),
          year: this.currentSelectYear,
          month: this.currentMonth + 1,
          day: new Date(startTime + i * 24 * 60 * 60 * 1000).getDate(),
          index: i
        })
      }
    },
    // 获取起始和结束时间
    getTimeRange () {
      let star = this.calendarWeekDateArr[0].date
      let starMonth = star.getMonth() + 1
      let starDay = star.getDate()
      let starYear = star.getFullYear()
      let end = this.calendarWeekDateArr[6].date
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
        this.currentWeekhData.SetUP = res.data.days
      })
      getCalendar(this.starttime, this.endtime, '提醒').then(res => {
        this.currentWeekhData.Remind = res.data.days
      })
      getCalendar(this.starttime, this.endtime, '最后').then(res => {
        this.currentWeekhData.Last = res.data.days
      })
    },
    // 计算当前周是第几周
    // 当前日期/当前周的还有几天过完(不算今天) 向上取整就是当前月份的周数
    currentWeek (year, Month, Day) {
      let week = new Date(year, Month, Day)
      let weekday = week.getDay()
      let weekno = Math.ceil((Day + 6 - weekday) / 7)
      this.$emit('currentWeek', weekno)
    }
  },
  created () {
    let day = new Date(this.currentSelectYear, this.currentSelectMonth, 1)
    this.currentYear = day.getFullYear()
    this.currentMonth = day.getMonth()
    this.currentDay = this.currentSelectDay
    // 开始监听
    this.Bus.$on('tabbarWeekClick', type => {
      this.showCalender = type
    })
    // 获取周历数据
    this.currentWeekPage()
    // 获取每个周的时间范围
    this.getTimeRange()
    // 获取当前时间范围内的所有数据
    this.getAllCalendar()
    // 混动到当前页面
    this.currentWeek(this.currentYear, this.currentMonth, this.currentDay)
    // 初始化日期
    this.initDay()
  },
  mounted () {
    this.Bus.$on('addMonth', () => {
      console.log('add')
      this.currentMonth = this.currentMonth + 1
      this.currentWeekPage()
      this.getTimeRange()
      this.getAllCalendar()
    })
    this.Bus.$on('subMonth', () => {
      console.log('sub')
      this.currentMonth = this.currentMonth - 1
      this.currentWeekPage()
      this.getTimeRange()
      this.getAllCalendar()
    })
  }
}
</script>

<style lang='stylus' scoped>
.week
  display flex
  width 100%vw
  .days
    position relative
    width 51.43px
    height 51.43px
    line-height 51.43px
    text-align center
    .hasweekcalendar
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
  .notMonth
    color #cccccc
  .active
    border-radius 50%
    background-color #2a579a
    color #ffffff
</style>
