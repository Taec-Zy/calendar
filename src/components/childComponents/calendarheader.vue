<template>
  <div class="header">
     <div class="left"></div>
     <div class="middle">
        <span>
           {{year}}-{{month}}-{{day}}
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
const day = new Date()
export default {
  name: 'calendarheader',
  data () {
    return {
      year: day.getFullYear(),
      month: this.padLeftZero(day.getMonth() + 1),
      day: this.padLeftZero(day.getDate())
    }
  },
  methods: {
    todayClick () {
      console.log('today')
    },
    padLeftZero (str) {
      str = str + ''
      return ('00' + str).substr(str.length) // 用0补齐位数
    }
  },
  created () {
    this.Bus.$on('calendarDayClick', (mon, day, year) => {
      this.year = year
      this.month = this.padLeftZero(mon + 1)
      this.day = this.padLeftZero(day)
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
