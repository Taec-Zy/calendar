<template>
  <div class="container">
    <CalendarHeader></CalendarHeader>
    <Calendar :week="week"></Calendar>
    <CalendarTabbar></CalendarTabbar>
    <CalendarList></CalendarList>
  </div>
</template>

<script>
import CalendarHeader from './childComponents/calendarheader'
import Calendar from './childComponents/calendar'
import CalendarTabbar from './childComponents/calendarTabbar'
import CalendarList from './childComponents/calendarlist'
export default {
  name: 'home',
  data () {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  components: {
    CalendarHeader,
    Calendar,
    CalendarTabbar,
    CalendarList
  }
}
</script>

<style lang="stylus" scoped>
</style>
