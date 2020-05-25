<template>
  <div class="header">
     <div class="left"></div>
     <div class="middle">
        <span>
           {{ccyear}}-{{ccmonth}}-{{ccday}}
        </span>
     </div>
     <div class="right" @click="todayClick">
        <span>
           今天
        </span>
     </div>
  </div>
</template>

<script>
export default {
  name: 'calendarheader',
  data () {
    return {
      // year: day.getFullYear(),
      // month: this.padLeftZero(day.getMonth() + 1),
      // day: this.padLeftZero(day.getDate()),
      ccyear: 0,
      ccmonth: 0,
      ccday: 0
    }
  },
  methods: {
    todayClick () {
      this.Bus.$emit('backToday')
    },
    padLeftZero (str) {
      str = str + ''
      return ('00' + str).substr(str.length) // 用0补齐位数
    }
  },
  // mounted () {
  //   this.Bus.$on('calendarDayClick2', (mon, day, year) => {
  //     this.year = year
  //     this.month = this.padLeftZero(mon + 1)
  //     this.day = this.padLeftZero(day)
  //   })
  //   this.Bus.$on('calendarDayInit2', (mon, day, year) => {
  //     this.year = year
  //     this.month = this.padLeftZero(mon + 1)
  //     this.day = this.padLeftZero(day)
  //   })
  //   this.Bus.$on('calendarWeekDayInit', (mon, day, year) => {
  //     this.year = year
  //     this.month = this.padLeftZero(mon)
  //     this.day = this.padLeftZero(day)
  //   })
  //   this.Bus.$on('calendarWeekDay', (mon, day, year) => {
  //     this.year = year
  //     this.month = this.padLeftZero(mon)
  //     this.day = this.padLeftZero(day)
  //   })
  // },
  created () {
    this.Bus.$on('getSelectDay', (cyear, cmonth, cday) => {
      this.ccyear = cyear
      this.ccmonth = this.padLeftZero(cmonth + 1 + '')
      this.ccday = this.padLeftZero(cday + '')
    })
  }
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
