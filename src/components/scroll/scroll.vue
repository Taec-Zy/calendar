<template>
  <div class="wrapper" ref="wrapper">
    <!-- 这里我们需要包装2层，1层是wrapper，另1层是bs里面必须是一个单独元素 -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  data () {
    return {
      scroll: null
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    eventPassthrough: {
      type: String,
      default: 'horizontal'
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // 创建对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 内部div是否可用滚动
      click: true,
      // 横轴方向初始化位置
      startX: 0,
      // 是否派发scroll事件，默认值是0不派发，一般需要传递2，在滚动的时候派发
      probeType: this.probeType,
      // 当设置为 true 的时候，可以开启横向滚动。 默认是false
      scrollX: this.scrollX,
      // 当设置为 true 的时候，可以开启纵向滚动。
      scrollY: this.scrollY,
      // 这个设置为horizontal scrollX配置无效，设置为vertical scrollY配置无效
      eventPassthrough: this.eventPassthrough,
      // 阻止冒泡事件
      stopPropagation: this.stopPropagation,
      // 是否上拉加载
      pullUpLoad: this.pullUpLoad
      // 这里的属性是我们可以自己传入来设定的，因为有的地方需要实时监听，有的地方不需要实时监听 实时监听会影响性能，不需要用的时候就是不要打开
    })
    // 这里用document.querySelector方法不能准确的拿到这个dom元素，我们需要绑定个ref
    // 这里拿到的就一定是添加了ref的元素

    // 监听滚动，和上面的probeType有关，配置后可以监听滚动位置
    this.scroll.on('scroll', position => {
      this.$emit('scroll', position)
    })
    // 监听上拉加载
    this.scroll.on('pullingUp', () => {
      this.$emit('pullingUp')
    })
  },
  methods: {
    scrollTo (x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time)
      // 我们这里会判断scroll实例是否创建了
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    finishPullUp () {
      this.scroll && this.scroll.finishPullUp()
    }
  }
}
</script>

<style>
</style>
