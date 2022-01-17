<template>
    <div>
        <el-button type="info" @click = "logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    logout () {
      // 清空token值实现退出功能
      window.sessionStorage.clear()
      // 通过编程式导航实现页面跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
