<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部区域 -->
        <el-alert show-icon :closable="false" title="注意:只允许为第三级分类设置相关属性" type="warning"></el-alert>
        <!-- 选择商品区域  -->
        <el-row class="cat_top">
          <el-col>
            <span>选择商品分类:</span>
            <!-- 级联选择框 :options指定数据源-->
            <el-cascader expand-trigger='hover' v-model="selectCatekeys" :options="catelist"
             :props= "cateprops" @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
        <!-- tab页签区域v-model="activeName"双向数据绑定，通过和name进行绑定 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
       <el-tab-pane label="动态参数" name="many">
         <el-button type="primary" :disabled= 'isBtn' @click="ShowAddParams">添加参数</el-button>
         <!-- 动态参数表格 -->
         <el-table :data="maryTableData" border stripe>
           <!-- 展开行效果 -->
           <el-table-column type='expand'>
             <!-- 作用域插槽 -->
             <template slot-scope="scope">
               <el-tag @close= 'closeTag(index,scope.row)' closable v-for = "(item,index) in scope.row.attr_vals" :key='index'>{{item}}</el-tag>
               <!-- 输入文本框 -->
               <el-input class="input-new-tag" v-if= "scope.row.inputVisible" v-model= "scope.row.inputValue" ref="saveTagInput" size="small"
                 @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
               </el-input>
               <!-- 添加按钮 -->
              <el-button class="button-new-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <el-table-column type='index' label="#"></el-table-column>
           <el-table-column prop="attr_name" label="参数名称"></el-table-column>
           <el-table-column label="操作">
             <!-- 定义一个作用域插槽来接收数据 -->
            <template slot-scope="scope">
              <el-button @click="showEditParams(scope.row.attr_id)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" @click="DelParams(scope.row.attr_id)" icon="el-icon-delete">删除</el-button>
            </template>
           </el-table-column>
         </el-table>
       </el-tab-pane>
        <!-- 静态属性面板 -->
       <el-tab-pane label="静态属性" name="only">
         <el-button type="primary" :disabled= 'isBtn' @click="ShowAddParams">添加属性</el-button>
         <!-- 静态属性表格 -->
         <el-table :data="onlyTableData" border stripe>
           <!-- 展开行效果 -->
           <el-table-column type='expand'>
              <!-- 作用域插槽 -->
             <template slot-scope="scope">
               <el-tag @close= 'closeTag(index,scope.row)' closable v-for = "(item,index) in scope.row.attr_vals" :key='index'>{{item}}</el-tag>
               <!-- 输入文本框 -->
               <el-input class="input-new-tag" v-if= "scope.row.inputVisible" v-model= "scope.row.inputValue" ref="saveTagInput" size="small"
                 @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)">
               </el-input>
               <!-- 添加按钮 -->
              <el-button class="button-new-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <el-table-column type='index' label="#"></el-table-column>
           <el-table-column prop="attr_name" label="参数名称"></el-table-column>
           <el-table-column label="操作">
             <!-- 定义一个作用域插槽来接收数据 -->
            <template slot-scope="scope">
              <el-button type="primary" @click="showEditParams(scope.row.attr_id)" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" @click="DelParams(scope.row.attr_id)" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
           </el-table-column>
          </el-table>
       </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog @close= 'closeAdd' :title= "'添加'+titleText" :visible.sync="AddDialogVisible" width="30%">
    <!-- 表单区域 -->
   <el-form :model="AddParamsForm" :rules="AddParamsRules" ref="AddParamsRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="AddParamsForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="AddDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click= "addParams">确 定</el-button>
    </span>
  </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog @close= 'closeEdit' :title= "'修改'+titleText" :visible.sync="editDialogVisible" width="30%">
    <!-- 表单区域 -->
   <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editParamsForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click= "editParams">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改页面的表单数据对象
      editParamsForm: {},
      // 控制添加对话框的显示与隐藏
      AddDialogVisible: false,
      // 保存获取到的商品分类
      catelist: [],
      // 级联选择框的配置对象
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectCatekeys: [],
      // 页签区域双向绑定的名称，被激活的页签名称
      activeName: 'many',
      // 动态参数的数据
      maryTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 用来填写的数据
      AddParamsForm: {
        attr_name: ''
      },
      // 添加的验证规则
      AddParamsRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 100, message: '名称长度在2-100字符', trigger: 'blur' }]
      },
      // 修改的验证规则
      editParamsRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 100, message: '名称长度在2-100字符', trigger: 'blur' }]
      }
    }
  },
  // 生命周期函数
  created() {
    this.getCateList()
  },
  // 计算属性,用来控制按钮的启用和禁用
  computed: {
    // 如果按钮需要被禁用，则返回true，否则为false
    isBtn() {
      if (this.selectCatekeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateID() {
      if (this.selectCatekeys.length === 3) {
        // 拿到对应的id
        return this.selectCatekeys[2]
      }
      return null
    },
    // 动态计算标题的文字
    titleText() {
      // 根据打开的面板进行判断
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    // getCateLis获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    // 级联选择框变化会触发该函数
    handleChange() {
      // 触发该函数就直接调用获取参数的函数
      this.getParamsdata()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      // 触发该函数就直接调用获取参数的函数
      this.getParamsdata()
    },
    // 获取参数的列表数据
    async getParamsdata() {
      // 判断选中的长度是否为3,是否选中三级分类,如果不是三级分类那么就不显示下面的表格同时将输入框设置为空
      if (this.selectCatekeys.length !== 3) {
        this.selectCatekeys = []
        this.maryTableData = []
        this.onlyTableData = []
        return
      }
      // 如果选中的是三级参数,发送请求拿到参数，根据所选分类的id和当前所处的面板获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('查询参数数据失败')
      }
      // 遍历拿到的数据，拿到attr_vals参数项，将该参数以空格进行分割，组成数组
      res.data.forEach(item => {
        // 对拿到的数据进行循环，如果等于空就将数组等于空数组，否则就进行分割
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 添加布尔值，控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      // 对获取的数据进行分类判断
      if (this.activeName === 'many') {
        this.maryTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加参数
    ShowAddParams() {
      this.AddDialogVisible = true
    },
    // 监听表单关闭事件
    closeAdd() {
      this.$refs.AddParamsRef.resetFields()
    },
    // 实现添加操作
    addParams(id) {
      // 表单预校验
      this.$refs.AddParamsRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes/`,
          { attr_name: this.AddParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getParamsdata()
        this.AddDialogVisible = false
      })
    },
    // 修改页面的加载
    async showEditParams(id) {
      // 发送请求根据id拿到本行的数据,赋值给对话框
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 将查询到的数据给对话框
      this.editParamsForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改页面的关闭事件，重置修改的表单
    closeEdit() {
      this.$refs.editParamsRef.resetFields()
    },
    // 确定修改的按钮实现修改
    editParams() {
      // 进行表单预处理
      this.$refs.editParamsRef.validate(async valid => {
        // 对表单的数据进行预校验,valid返回一个布尔值,如果为返回为true说明表单的数据验证通过可以发送请求，否则不可以
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.editParamsForm.attr_id}`,
          { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getParamsdata()
        this.editDialogVisible = false
      })
    },
    // 实现删除操作,根据id删除对应的参数
    async DelParams(id) {
      const confirmResult = await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获错误消息，防止报错
      // 对返回的值进行判断，如果为confirm就发送请求进行删除操作，如果不是直接返回
      if (confirmResult !== 'confirm') return
      // 发送请求删除操作
      const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsdata()
    },
    // 文本框失去焦点和摁下enter键都会触发该函数
    async handleInputConfirm(row) {
      // 对输入框进判断有没有输入值
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        // 重置inputVisible为false，显示按钮
        row.inputVisible = false
        return
      }
      // 用户输入了内容，需要实现添加效果
      // 将用户输入的值添加到attr_vals字段中，最后渲染到页面上
      row.attr_vals.push(row.inputValue.trim())
      // 最后再将输入框重置为空
      row.inputValue = ''
      // 隐藏文本框
      row.inputVisible = false
      this.saveAttr(row)
    },
    // 将对attr_value的操作数据保存到数据库
    async saveAttr(row) {
      // 需要发起请求，将添加的数据保存到数据库中,attr_vals: row.attr_vals.join(',')将请求参数通过，来拼接
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') })
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
    },

    // 设置显示输入框
    showInput(row) {
      row.inputVisible = true
      // $nextTicku作用：当页面上的元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        // 通过调用事件对象的方法找到inputdom对象在使用dom对象的focus方法来实现获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听tag标签的关闭事件，实现删除标签操作
    closeTag(i, row) {
      // 根据索引删除对应的数据
      row.attr_vals.splice(i, 1)
      this.saveAttr(row)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_top{
  margin: 15px 0;
}
.el-tag{
  margin: 0 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
