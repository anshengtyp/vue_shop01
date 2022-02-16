<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- :gutter="20"设置列之间的间距 -->
      <el-row :gutter="20">
        <!-- 搜索框区域 -->
        <el-col :span="8">
          <!-- v-model= "query"将输入框和表格进行双向数据绑定 -->
          <el-input clearable @clear= 'getGoodsList' v-model= "queryInfo.query" placeholder="请输入内容">
            <!--点击搜索按钮，调用获取商品函数 -->
            <el-button @click= "getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮区域 -->
        <el-col :span="4">
          <el-button type="primary" @click= "goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data= "goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column  label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column  label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
        <el-table-column  label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column  label="创建时间" prop="add_time" width="155px">
          <!-- 通过作用域插槽的方式对事件进行过滤操作，调用注册的全局对象dateFormat将日期进行转化 -->
          <template slot-scope="scope">
           {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="130px">
          <!-- 创建作用域插槽，来接收本行的数据 -->
          <template slot-scope="scope">
            <el-button @click= "showEditGoods(scope.row.goods_id)" type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button @click="DelGoods(scope.row.goods_id)" type="danger" size="mini" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- handleSizeChange,pagesize发生变化就会调用该函数 -->
      <!-- handleCurrentChange，pagenum页码值发生变化就会触发该函数，就会拿到最新的pagenum -->
      <!-- :current-page为当前是第几页 -->
      <!-- :total为总数据条数 -->
      <el-pagination background @size-change= "handleSizeChange" @current-change= "handleCurrentChange"
      :current-page= "queryInfo.pagenum" :page-sizes="[2, 5, 10, 50,100]"
      :page-size= "queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total= "total"></el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog title="修改商品" :visible.sync="EditDialogVisible" width="50%">
     <!-- 表单区域 -->
    <el-form :model= "editData" :rules= "EditRules" ref="EditRormRef" label-width="100px">
     <el-form-item label="商品名称" prop="goods_name">
      <el-input v-model="editData.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
      <el-input v-model="editData.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
      <el-input v-model="editData.goods_number"></el-input>
      </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
      <el-input v-model="editData.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍" prop="goods_introduce">
      <el-input v-model="editData.goods_introduce"></el-input>
      </el-form-item>
    </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click= "EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click= "editGoods">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 验证修改表单的规则
      EditRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      EditDialogVisible: false,
      editData: {},
      // 查询参数对象,query为搜索关键字，pagesize为一页显示多少条数据
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      // 用来保存拿到的商品列表
      goodsList: [],
      // 总的数据条数，可以用来分页
      total: 0
    }
  },
  // 生命周期函数
  created() {
    // 获取所有的商品信息
    this.getGoodsList()
  },
  methods: {
    // 获取所有的商品信息
    async getGoodsList() {
      // 发送请求,服务器返回一个premise对象，通过async/awawit简化异步操作
      const { data: res } = await this.$http.get('goods/', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // 将请求到的数据赋值给定义的数据
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // pagesize发生变化就会触发该函数，就会拿到最新的pagesize
    handleSizeChange(newSize) {
      // 将最新的pagesize赋值给定义的pagesize
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // pagenum页码值发生变化就会触发该函数，就会拿到最新的pagenum
    handleCurrentChange(newNum) {
      // 将最新的页码值赋值给定义的pagenum
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 根据id删除对应的商品
    async DelGoods(id) {
      const confrimResult = await this.$confirm('你确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => err)
      if (confrimResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发送请求
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 显示添加商品的页面
    goAddGoods() {
      // 调用该方法实现路径跳转$router.push,参数为要跳转到的页面
      this.$router.push('/goods/add')
    },
    // 显示修改对话框
    async showEditGoods(id) {
      // 发送请求实现点击对应的商品拿到对应的数据
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.editData = res.data
      this.EditDialogVisible = true
      console.log(this.editData)
    },
    // 实现修改操作
    editGoods() {
      // 对表单进行预校验
      this.$refs.EditRormRef.validate(async valid => {
        if (!valid) return
        // 发送请求修改数据
        const { data: res } = await this.$http.put('goods/' + this.editData.goods_id,
          { goods_name: this.editData.goods_name, goods_price: this.editData.goods_price, goods_number: this.editData.goods_number, goods_weight: this.editData.goods_weight, goods_cat: this.editData.goods_cat })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品失败')
        }
        this.$message.success('修改商品成功')
        this.getGoodsList()
        this.EditDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
