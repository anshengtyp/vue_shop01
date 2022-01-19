<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 下面卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 15px">
        <!-- 使用lay布局实现 :span为占据的宽度-->
        <el-row>
          <el-col :span="7">
              <!--clear绑定清理数据函数 v-model="queryInfo.query"为输入框绑定data的数据关键字，clearable清空文本框 -->
            <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
                <!-- 点击搜索按钮，绑定点击事件，调用用户显示列表函数 -->
              <el-button @click="getUserList"
                slot="append"
                icon="el-icon-search"
              ></el-button></el-input
          ></el-col>
          <!-- @click='addDialogVisible = true' 为添加按钮绑定打开对话框事件 -->
          <el-col :span="4"
            ><el-button type="primary" @click='addDialogVisible = true'>添加用户</el-button></el-col
          >
        </el-row>
        <!-- 用户列表区域,:data = 'userList'指定表格数据源 -->
        <el-table border stripe :data = 'userList'>
            <!-- prop = "username"指定数据源，type="index"实现前面的序号-->
            <el-table-column label = "#" type="index"></el-table-column>
            <el-table-column label = "姓名" prop = "username"></el-table-column>
            <el-table-column label = "邮箱" prop = "email"></el-table-column>
            <el-table-column label = "电话" prop = "mobile"></el-table-column>
            <el-table-column label = "角色" prop = "role_name"></el-table-column>
            <el-table-column label = "状态">
                <!--使用作用域插槽拿到本行的数据 scope为本行的数据 -->
                 <template slot-scope = "scope">
                     <!-- 开关组件，绑定v-model到一个Boolean类型的变量。change监听开关的改变事件，可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
                     <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
                 </template>
            </el-table-column>
            <el-table-column label = "操作" width="170px">
                <!--也是使用作用域插槽来拿到本行的数据 -->
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip content="修改用户" placement="top" effect="light">
                        <!--提示文字组件  -->
                        <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
                    </el-tooltip>
                    <!-- 删除按钮 -->
                    <el-tooltip content="删除用户" placement="top" effect="light" :enterable='false'>
                        <el-button @click="removeUser(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
                    </el-tooltip>
                    <!-- 分配角色按钮 -->
                    <el-tooltip  content="分配角色" placement="top" effect="light">
                        <el-button @click="showRoles(scope.row)" type="warning" icon="el-icon-setting" circle></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- 分页区域 :page-size每页显示的数据,:total总共的数据，layout用来要显示在页面的结构-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  <!-- 添加用户对话框 -->
  <!-- @close='addClose'绑定关闭事件  -->
  <el-dialog @close='addClose' title="添加用户" :visible.sync="addDialogVisible"
    width="50%">
    <!-- 内容主题区域 -->
    <!-- 添加用户表单区域 prop="username"验证规则的属性 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
     <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
     </el-form-item>
     <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
     </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
     </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
     </el-form-item>
    </el-form>
  <!-- 底部区域 -->
    <span slot="footer" class= "dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='addUser'>确 定</el-button>
  </span>
  </el-dialog>
  <!-- 修改用户的对话框 -->
  <el-dialog title="修改用户信息" @close= 'editClose' :visible.sync= "editDialogVisible" width="50%">
  <el-form :model= "editForm" :rules= "editFormRules" ref= "editFormRef" label-width="70px">
   <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
   </el-form-item>
    <el-form-item label="邮箱" prop='email'>
      <!-- 绑定邮箱的校验规则 -->
    <el-input v-model="editForm.email"></el-input>
   </el-form-item>
   <!-- 绑定手机的校验规则 -->
    <el-form-item label="手机" prop='mobile'>
    <el-input v-model="editForm.mobile"></el-input>
   </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 分配角色对话框 -->
  <el-dialog @close='closeRoles'
  title="分配角色"
  :visible.sync="setRolesdialogVisible"
  width="45%">
  <div>
    <p>当前的用户:{{rowInfo.username}}</p>
    <p>当前的角色:{{rowInfo.role_name}}</p>
    <p>分配新角色:
      <!-- 下拉菜单 -->
    <el-select v-model="selectValue" placeholder="请选择">
    <el-option v-for="item in RolesList" :key="item.id" :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱的验证规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      // 对输入的邮箱进行验证,如果验证通过就调用回调函数
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱地址'))
    }
    // 自定义验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 保存分配角色数据列表
      RolesList: [],
      // 已经选中的角色id值
      selectValue: '',
      // 用来保存查询到的修改用户的数据
      editForm: {},
      // 控制分配角色对话框显示与隐藏
      setRolesdialogVisible: false,
      // 需要被分配角色的用户信息
      rowInfo: {},
      // 添加修改用户的验证规则
      // validator: checkEmail绑定自定义规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      // 添加用户表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加验证表单数据的对象
      addFormRules: {
        // 添加用户表单验证规则
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名的长度在3-12个字符之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码的长度在6-12个字符之间', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发送请求获得用户列表数据
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      // 把拿到的数据赋值给上面data里面定义的数据
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize的改变事件
    handleSizeChange(newSize) {
      // 将最新的页数显示多少条数据给data里面的数据
      this.queryInfo.pagesize = newSize
      // 再调用列表显示
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听用户状态的改变
    async userStatusChange(userinfo) {
      // 发送请求用来改变状态
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果更新失败让状态变回原来的值,不让其修改
        userinfo.mg_state = !userinfo.mg_state
        return this.$$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听用户对话框的关闭事件
    addClose() {
      // 重置表单的数据，通过拿到表单的引用对象，再调用resetFields即可
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加按钮，添加用户
    addUser() {
      // 对表单进行预校验，通过引用对象
      this.$refs.addFormRef.validate(async valid => {
        // valid返回的是一个布尔值，true表示表单验证通过
        if (!valid) return
        // 发起真正的添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据展示在页面上
        this.getUserList()
      })
    },
    // 展示用户修改界面
    async showEditDialog(id) {
      // 拿到用户id
      // 发送请求拿到对应的id数据
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // 将请求拿到的数据保存到定义的data数据里面
      this.editForm = res.data
      // 显示修改用户对话框
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser() {
      // 用户点击修改表单中的确定按钮之后，验证表单数据
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        // 发送请求完成修改用户的操作
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        // 判断如果修改失败，就做提示
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        // 修改成功的提示
        this.$message.success('修改用户成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 重新请求最新的数据
        this.getUserList()
      })
    },
    // 根据id删除用户操作
    async removeUser(id) {
      // 弹框提示
      const confirmResult = await this.$confirm('你确定要删除该用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)// 捕获用户取消的行为防止报错
      // 如果返回的是confirm字符串则说明点击的是确定按钮，去删除为cancl
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功')
      }
      // 发送请求删除点击的用户,通过
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      // 重新请求最新的数据显示在页面上
      this.getUserList()
    },
    // 显示分配角色对话框
    async showRoles(rowInfo) {
      this.rowInfo = rowInfo
      // 在展示对话框之前获取所有列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.RolesList = res.data
      // 拿到点击行的数据
      this.setRolesdialogVisible = true
    },
    // 点击确定按钮，实现分配角色
    async addRoles() {
      // 判断有没有选择新角色
      if (!this.selectValue) {
        return this.$message.error('请选择要分配的角色')
      }
      // 发起请求修改用户角色
      const { data: res } = await this.$http.put(`users/${this.rowInfo.id}/role`, { rid: this.selectValue })
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户角色失败')
      }
      this.$message.success('修改用户角色成功')
      this.getUserList()
      this.setRolesdialogVisible = false
    },
    // 对话框关闭重置下拉框数值
    closeRoles() {
      // 将绑定的值重置为空，方便再次点开的时候没有显示对应的角色
      this.selectValue = ''
      this.rowInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-col-4{
  float: right;
  text-align: center;
}
</style>
