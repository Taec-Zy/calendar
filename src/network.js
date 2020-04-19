import axios from 'axios'

export function getCalendar (starttime, endtime, type) { // 这个函数需要传参
  return axios.post(
    'http://www.globletech.net/Test/DayRangeHasMatter',
    {
      starttime,
      endtime,
      type
    },
    {
      headers: {
        'Authorization': 13973940840,
        'Content-Type': 'application/json'
      }
    }
  )
}
