<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row><el-col><el-button @click="showAddClass" type="primary">添加分类</el-button></el-col></el-row>
      <!-- 表格:expand-type= 'false'取消展开行效果，:selection-type取消多选框-->
      <!-- show-index显示索引列,index-text='#'设置索引列的名称  -->
      <tree-table border show-index index-text='#' :expand-type= 'false' :selection-type='false' :data= 'ClassList' :columns= 'columns'>
          <!-- 自定义插槽，用来当做第三列的模板-->
          <template slot="isok" slot-scope="scope">
              <!-- 通过-判断本行的.cat_deleted字段来显示是否有效 -->
              <i style="color:lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
              <i style="color:red" class="el-icon-error" v-else></i>
          </template>
          <!-- 自定义插槽，用来当做第四列的模板 -->
          <template slot="order" slot-scope="scope">
              <!-- 通过-判断本行的cat_leve字段来按需显示对应的等级 -->
              <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
              <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
              <el-tag v-else type="warning" size="mini">三级</el-tag>
          </template>
        <!-- 自定义插槽，用来当做第五列的模板 -->
          <template slot="opt" slot-scope="scope">
              <el-button @click="showEditClass(scope.row.cat_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button @click="delClass(scope.row.cat_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog @close="closeAddClassForm" title="添加分类" :visible.sync="addClassdialogVisible" width="50%">
    <!-- 表单区域 -->
    <el-form :model="addClassForm" :rules="addClassRules" ref="addClassRef" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
       <el-input v-model="addClassForm.cat_name"></el-input>
     </el-form-item>
     <el-form-item label="父级分类">
        <!-- 级连选择器,change-on-select允许选择任意一级的选项,:options="parentClassList"数据源 :props，指定配置对象-->
       <el-cascader change-on-select clearable v-model= "selectedKeys" :options= "parentClassList" :props= "parentClass "
       @change= "parentChange">
       </el-cascader>
     </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click= "addClassdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click= "addClass">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 编辑提示kuan -->
    <el-dialog @close= 'closeEditClass' title="编辑商品分类" :visible.sync="editClassDialogVisible" width="30%">
    <!-- 编辑表单 -->
    <el-form :model= 'editClassForm' :rules= "editClassFormRules" ref= "editClassFormRef" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="editClassForm.cat_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editClassDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editClassOK">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
    // 查询条件,pagesize每一页的条数，pagenum页码
      queryInfo: {
        type: [3],
        pagenum: 1,
        pagesize: 5
      },
      // 控制添加分类对话框的显示与隐藏
      addClassdialogVisible: false,
      //   父级分类的数据列表
      parentClassList: [],
      // 指定级联选择器的配置对象,expandTrigger次级菜单的展开方式,label指定看到的名称，value指定选项的值为选项对象的某个属性值
      parentClass: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   选中父级分类和id数组
      selectedKeys: [],
      // 用来保存查询到的修改分类的数据
      editClassForm: {},
      // 控制编辑对话框的显示与隐藏
      editClassDialogVisible: false,
      //  添加分类的表单数据对象
      addClassForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级默认添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addClassRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //   修改分类名称的验证规则
      editClassFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 12, message: '名称长度在2-12字符之间', trigger: 'blur' }]
      },
      // 商品分类数据列表
      ClassList: [],
      // 定义列的数据,每一个对象都是列的定义对象
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // type表示将当前列定义为模板列，template模板名称
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        // type表示将当前列定义为模板列，template模板名称
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        // type表示将当前列定义为模板列，template模板名称
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 总的数据条数
      total: 0
    }
  },
  created() {
    this.getClassList()
  },
  methods: {
    // 发送请求拿到商品分类数据
    async getClassList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('查询数据失败')
      }
      // 把数据列表赋值给定义的数组
      this.ClassList = res.data.result
      // 为数据总条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newPagesize) {
      // 将最新的页面大小赋值
      this.queryInfo.pagesize = newPagesize
      this.getClassList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getClassList()
    },
    // 点击添加分类显示数据列表
    showAddClass() {
      // 调用查询父级分类数据函数
      this.getParentList()
      this.addClassdialogVisible = true
    },
    // 监听添加表单关闭事件,重置表单数据
    closeAddClassForm() {
      this.$refs.addClassRef.resetFields()
      //   重置级联选择器
      this.selectedKeys = ''
      this.addClassForm.cat_pid = 0
      this.addClassForm.cat_level = 0
    },
    // 获取父级分类和列表
    async getParentList() {
    // 发送请求拿到数据
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('查询数据失败')
      }
      // 将请求到的父级分类数据保存到定义的数组中
      this.parentClassList = res.data
    },
    // 级联选择器选择项发生变化调用该函数，触发该函数打印v-model的值
    parentChange() {
      // 判断有没有选择父级分离
      if (this.selectedKeys.length > 0) {
        //   父级分类的id
        this.addClassForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前的分类等级赋值
        this.addClassForm.cat_level = this.selectedKeys.length
      } else {
        //   说明是一级分类
        //   父级分类的id
        this.addClassForm.cat_id = 0
        // 为当前的分类等级赋值
        this.addClassForm.cat_level = 0
      }
    },
    // 添加分类
    addClass() {
      // 对表单进行预处理
      this.$refs.addClassRef.validate(async valid => {
        //   valid返回一个布尔值，如果为true发送请求
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.post('categories', this.addClassForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getClassList()
        this.addClassdialogVisible = false
      })
    },
    // 显示编辑对话框
    async showEditClass(id) {
      // 根据id查询出所点击的分类名称
      // 发送请求
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询数据失败')
      }
      //   请求成功将请求到的数据保存在定义的数组中
      this.editClassForm = res.data
      this.editClassDialogVisible = true
    },
    // 监听修改分类对话框的关闭事件
    closeEditClass() {
      this.$refs.editClassFormRef.resetFields()
    },
    // 确定修改分类名称
    editClassOK() {
      // 对表单进行预处理
      this.$refs.editClassFormRef.validate(async valid => {
        if (!valid) return
        // 发送修改的请求
        const { data: res } = await this.$http.put('categories/' + this.editClassForm.cat_id, { cat_name: this.editClassForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类名称失败')
        }
        this.$message.success('修改分类名称成功')
        this.getClassList()
        this.editClassDialogVisible = false
      })
    },
    // 实现删除分类操作
    async delClass(id) {
      const confirmResult = await this.$confirm('你确定删除该分类吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果返回的是confirm字符串则说明点击的是确定按钮，取消删除为cancl
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除成功')
      }
      //  否则发送请求实现删除操作，说明confirmResult为confirm，点击的是确定按钮
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      // 重新请求最新的数据显示在页面上
      this.getClassList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-col-24{
    margin-bottom: 15px;
}
.block{
    width: 100%;
    height: 200px;
}
</style>
