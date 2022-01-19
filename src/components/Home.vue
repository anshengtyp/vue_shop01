<template>
<el-container class="home-container">
  <!-- 头部 -->
  <el-header>
    <div class="header-left">
      <img src="../assets/头像.jpg" alt="头像">
      <span>后台管理系统</span>
    </div>
    <el-button type="info" @click = "logout">退出</el-button>
  </el-header>
  <el-container>
    <!-- 侧边栏菜单 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 上面折叠按钮 -->
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!--unique-opened="true"可以实现只能同时打开一个一级菜单 collapse实现下单的折叠与展开,:collapse-transition='false'取消默认动画效果,router为整个侧边栏开启路由-->
      <!-- default-active="/users" 动态实现点击高亮效果 -->
      <el-menu :default-active="activePath" unique-opened :collapse="isCollapse" :collapse-transition='false' router
      background-color="#333744"
      text-color="white"
      active-text-color="#ffd04b">
      <!-- 一级菜单通过for循环拿到数据渲染到页面 :index="item.id + ''"为每一个菜单绑定唯一的标识同时转化为字符串类型的 -->
      <el-submenu :key = 'item.id' v-for = 'item in menulist' :index="item.id + ''">
        <!-- 一级菜单的模板 -->
        <template slot="title">
          <!-- 通过动态绑定实现不同的图标 -->
          <i :class='iconObj[item.id]'></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item @click="saveNvaStatus('/'+subItem.path + '')" :index="'/'+subItem.path + ''" :key = "subItem.id" v-for = "subItem in item.children">
          <!-- 二级菜单模板 -->
          <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
   </el-aside>
    <!-- 内容区 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
      </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  // 将拿到的数据存在这
  data() {
    return {
      // 商品左侧列表数据
      menulist: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 实现页面一加载就调用左侧菜单显示
  created() {
    // 左侧菜单数据
    this.getMenuList()
    // 将激活状态一上来就进行显示
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token值实现退出功能
      window.sessionStorage.clear()
      // 通过编程式导航实现页面跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 将拿到的数据交给data里面
      this.menulist = res.data
    },
    // 点击按钮实现左侧菜单的展开和折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNvaStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 将点击最新的值赋值给这个激活状态，用来切换高亮显示
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color:#373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
}
.el-aside{
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.home-container{
  height: 100%;
}
.header-left{
  height: 100%;
  display: flex;
  align-items: center;
}
.header-left img{
  border-radius: 50%;
  height: 100%;
}
.header-left span{
  margin-left: 15px;
  font-size: 20px;
  color: white;
}
.iconfont{
  padding-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  text-align: center;
  color: white;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  // 竖线之间的空隙
  letter-spacing: 0.2em;
}
</style>
