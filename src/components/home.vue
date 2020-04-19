<template>
  <div class="container">
    <CalendarHeader></CalendarHeader>
    <Calendar :week="week"></Calendar>
  </div>
</template>

<script>
import CalendarHeader from './childComponents/calendarheader'
import Calendar from './childComponents/calendar'
export default {
  name: 'home',
  data () {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  components: {
    CalendarHeader,
    Calendar
  }
}
</script>

<style lang="stylus" scoped>

</style>
