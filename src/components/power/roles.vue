<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <el-row><el-button type="primary" @click="addRolesdialogVisible = true" round>添加角色</el-button></el-row>
      <!-- 角色列表区域 -->
      <!-- data绑定数据源 -->
      <el-table :data="rolesList" border stripe>
          <!-- 下拉列type="expand 实现展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽拿到本行数据，拿到对应的权限 -->
          <template slot-scope="scope">
            <!-- 页面渲染 -->
            <el-row :class="['acenter','bdbottom', i1 == 0 ? 'bdtop':'']" :key="item1.id" v-for = "(item1,i1) in scope.row.children">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='removeRight(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
                </el-col>
              <!-- 二和三级权限 -->
              <el-col :span="19">
                <el-row :class="['acenter',i2 == 0 ? 'bdtop':'']" :key="item2.id" v-for = "(item2,i2) in item1.children">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag closable @close='removeRight(scope.row,item2.id)' type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag @close='removeRight(scope.row,item3.id)' closable v-for= "(item3,i3) in item2.children" :key="item3.id" type="wraning">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!--也是使用作用域插槽来拿到本行的数据 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
              <el-button @click="EditRoles(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <!-- 删除按钮 -->
              <el-button @click="delRoles(scope.row.id)" size="mini" type="danger" icon="el-icon-setting" >删除</el-button>
            <!-- 分配角色按钮 -->
              <el-button @click="showSetRights(scope.row)" size="mini" type="warning" icon="el-icon-delete">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog @close='rolesClose'
     title="添加角色"
     :visible.sync="addRolesdialogVisible"
     width="30%">
     <span>
         <el-form :model= "addRoles" :rules= "addRolesFormRules" ref="addRolesFormRef" label-width="100px">
             <el-form-item label="角色名称" prop='roleName'>
                 <el-input v-model="addRoles.roleName"></el-input>
             </el-form-item>
            <el-form-item label="角色描述" prop='roleDesc'>
                 <el-input v-model="addRoles.roleDesc"></el-input>
             </el-form-item>
         </el-form>
     </span>
     <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRloesForm">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog @close= 'editClose' title="修改角色信息" width="30%" :visible.sync="EditRolesdialogFormVisible">
    <el-form :model= 'editRolesForm' :rules= "editRolesFormRules" ref= "editRolesFormRef" label-width="100px">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="editRolesForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="editRolesForm.roleDesc"></el-input>
    </el-form-item>
   </el-form>
    <div slot="footer" class="dialog-footer">
    <el-button @click="EditRolesdialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesInfo">确 定</el-button>
    </div>
   </el-dialog>
   <!-- 分配权限的对话框 -->
   <el-dialog @close='closeSetRights' title="分配权限" :visible.sync="ShowRightsdialogVisible" width="50%">
    <!--树形控件,default-expand-all默认展开，show-checkbox显示前面的选择框 -->
    <el-tree ref="treeRef" :default-checked-keys="defkeys" default-expand-all node-key="id" show-checkbox :data="rightList" :props="treeProps"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="ShowRightsdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click= "allCommitRights">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 定义一个角色列表用来保存请求到的数据
      rolesList: [],
      // 保存拿到的所有权限列表
      rightList: [],
      // 树形控件的绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 控制添加角色对话框的显示与隐藏
      addRolesdialogVisible: false,
      // 默认选中的节点id数据
      defkeys: [],
      //   控制修改角色对话框的显示与隐藏
      EditRolesdialogFormVisible: false,
      // 控制分配权限对话框的显示与隐藏
      ShowRightsdialogVisible: false,
      // 用作于发送修改权限请求，当前分配权限的id
      roleId: '',
      // 用来保存查询到的修改角色的数据
      editRolesForm: {},
      // 添加用户表单的数据
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 添加验证表单数据的对象
      addRolesFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '名称长度在2-12字符之间', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 200, message: '描述长度在0-100字符之间', trigger: 'blur' }]
      },
      // 添加修改用户的验证规则
      editRolesFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '名称长度在2-12字符之间', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 200, message: '描述长度在0-100字符之间', trigger: 'blur' }]
      }
    }
  },
  // 创建生命周期函数
  created() {
    //   获取所有的角色
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      // 发送请求拿到数据，{ data: res }解构赋值
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户角色列表失败')
      }
      // 将请求到的数据保存在rolesLis中
      this.rolesList = res.data
    },
    // 实现关闭对话框清除输入库数据
    rolesClose() {
    // 重置表单的数据，通过拿到表单的引用对象，再调用resetFields即可
      this.$refs.addRolesFormRef.resetFields()
    },
    // 点击添加按钮实现添加角色
    addRloesForm() {
      // 对表单进行预校验
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        // 发起请求添加数据
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 关闭对话框
        this.addRolesdialogVisible = false
        // 重新获取角色列表数据展示在页面上
        this.getRolesList()
      })
    },
    // 删除角色操作
    async delRoles(id) {
      const confirmResult = await this.$confirm('你确定要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)// 捕获用户取消的行为防止报错
      // 如果返回的是confirm字符串则说明点击的是确定按钮，去删除为cancl
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功')
      }
      // 发送请求删除删除用户
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      // 重新请求最新的数据显示在页面上
      this.getRolesList()
    },
    // 点击修改按钮,将拿到的数据显示在修改页面上
    async EditRoles(id) {
      // 拿到id
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      // 将查询到的数据给data中定义的数据
      this.editRolesForm = res.data
      // 显示修改用户对话框
      this.EditRolesdialogFormVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editClose() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 点击确定按钮实现修改
    editRolesInfo() {
      // 用户点击修改表单中的确定按钮之后，验证表单数据
      this.$refs.editRolesFormRef.validate(async valid => {
        // 返回一个布尔值，如果为true发送请求修改数据
        if (!valid) return this.$message.error('请填写完成的角色信息')
        // 发送请求
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId,
          { roleName: this.editRolesForm.roleName, roleDesc: this.editRolesForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        this.$message.success('修改角色信息成功')
        this.EditRolesdialogFormVisible = false
        this.getRolesList()
      })
    },
    // 根据id删除对应的权限
    async removeRight(role, rid) {
      // 弹框提示是否删除
      const comfirmResult = await this.$confirm('你确定删除该权限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (comfirmResult !== 'confirm') {
        return this.$message.info('取消删除成功')
      }
      // 发送请求删除对应的权限
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 将删除之后的权限重新赋值给角色
      role.children = res.data
    },
    // 展示分配权限的列表
    async showSetRights(roles) {
      // 拿到对应角色的id,用于后面发送请求
      this.roleId = roles.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 将拿到的数据保存在定义的数组中
      this.rightList = res.data
      // 递归获取三级节点的id
      this.getAllKeys(roles, this.defkeys)
      this.ShowRightsdialogVisible = true
    },
    // 递归函数,通过递归的方式获取角色下所有的三级权限id，并保存到定义的数组中
    getAllKeys(node, arr) {
      // 如果该节点不包括children属性就说明该节点是三级节点，就拿到id保存到数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归循环子节点
      node.children.forEach(item => this.getAllKeys(item, arr))
    },
    // 监听对话框关闭事件
    closeSetRights() {
      this.defkeys = []
    },
    // 点击确定按钮，实现赋权限,...为展开运算符
    async allCommitRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 将拿到的数据转化为，分割的字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights/`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功')
      this.getRolesList()
      this.ShowRightsdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 10px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.acenter{
  display: flex;
  // 实现纵向居中
  align-items: center;
}
.el-col-5,.el-col-6{
  text-align: center;
}
</style>
