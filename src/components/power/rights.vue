<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- data绑定数据源 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="权限路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
            <!-- 作用域插槽 -->
          <template slot-scope="scope">
              <!-- 对权限等级进行判断，到底显示那个权限等级 -->
            <el-tag effect='dark' v-if="scope.row.level  === '0'" type="danger">一级权限</el-tag>
            <el-tag effect='dark' v-else-if="scope.row.level === '1'" type="">二级权限</el-tag>
            <el-tag effect='dark' v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    //   获取所有的权限
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 发送请求
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 将拿到的数据保存在rightsList数组中显示在页面上
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
