<template>
  <div class="calendar">
     <ul class="weeks">
        <li v-for="(item,index) in week" :key="index" class="week">{{item}}</li>
     </ul>
     <ul class="days">
       <li class="day" v-for="(item,index) in days" :key='index' @click="dayClick(index)" :class="{'active' : isDayActive(index)}">
          {{item}}
         </li>
     </ul>
     <div class="arrow">
       <div class="container" @click="arrowClick" :class="[arrowRotate ? 'top' : 'bottom' ]">
           <i class="bottom_arrow"></i>
           <i class="bottom_arrow sec_arrow"></i>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  data () {
    return {
      // 日历生成数组
      days: [],
      // 当前年份
      currentYear: 0,
      // 当前月份
      currentMonth: 0,
      // 当前日期
      currentDay: 0,
      // 当前月开始日期是周几
      starDay: 0,
      // 添加日历数组空格完成标识符
      initDay: true,
      // 当前点击了日期
      selectDay: 0,
      // 箭头选择标志
      arrowRotate: false
    }
  },
  props: {
    week: {
      type: Array
    },
    month: {
      type: Array
    }
  },
  methods: {
    getdays () {
      const currentDate = new Date()
      const star = new Date()
      // 获取当前年月日
      this.currentYear = currentDate.getFullYear()
      this.currentMonth = currentDate.getMonth()
      this.currentDay = currentDate.getDate()
      this.selectDay = this.currentDay
      // 设置star Date实例的初始日期
      star.setFullYear(this.currentYear, this.currentMonth, 1)
      this.starDay = star.getDay()
      console.log(this.month[this.currentMonth])
      for (let i = 1; i <= this.month[this.currentMonth]; i++) {
        if (this.starDay !== 0 && this.initDay) {
          for (let j = 1; j <= this.starDay; j++) {
            this.days.push('')
          }
          this.initDay = false
        }
        this.days.push(i)
      }
    },
    dayClick (index) {
      this.selectDay = index - this.starDay + 1
      // 当前日期/当前周的还有几天过完(不算今天) 向上取整就是当前月份的周数
      console.log(this.selectDay)
    },
    arrowClick () {
      this.arrowRotate = !this.arrowRotate
      console.log(this.arrowRotate)
    }
  },
  computed: {
    isDayActive (index) {
      return function (index) {
        if (index < this.starDay) {
          return false
        } else if (this.selectDay === index - this.starDay + 1) {
          return true
        }
      }
    }
  },
  created () {
    this.getdays()
  }
}
</script>

<style lang="stylus" scoped>
.calendar
  border-bottom 1px solid #e4e4e4
  .weeks
    display flex
    justify-content space-between
    list-style none
    padding 0 19px
    height 30px
    line-height 30px
    color #c5bcbc
    font-size 12px
  .days
    display flex
    flex-wrap wrap
    list-style none
    .day
      width 51.43px
      height 51.43px
      line-height 51.43px
      text-align center
    .active
      border-radius 50%
      background-color #2a579a
      color #ffffff
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
