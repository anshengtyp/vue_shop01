<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <!-- 当点击首页跳转到home -->
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
</style>
