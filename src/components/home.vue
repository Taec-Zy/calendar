<template>
  <div class="container">
    <Header></Header>
    <Calendar :week="week" :month="month"></Calendar>
  </div>
</template>

<script>
import Header from './childComponents/header'
import Calendar from './childComponents/calendar'
export default {
  name: 'home',
  data () {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    }
  },
  components: {
    Header,
    Calendar
  }
}
</script>

<style lang="stylus" scoped>

</style>
