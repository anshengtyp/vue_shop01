<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- :gutter="20"可以设置列之间的间距 -->
      <el-row>
        <!-- 搜索框区域 -->
        <el-col :span="8">
          <!-- v-model= "query"将输入框和表格进行双向数据绑定 -->
          <el-input clearable @clear= "getOrderList" placeholder="请输入内容" v-model= "queryInfo.query">
            <!--点击搜索按钮，调用获取商品函数 -->
            <el-button @click= "getOrderList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data= "orderList" border stripe>
          <!-- 索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column  label="订单编号" prop="order_number"></el-table-column>
          <el-table-column  label="订单价格" prop="order_price"></el-table-column>
          <el-table-column  label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column  label="是否发货" prop="is_send"></el-table-column>
          <el-table-column  label="下单时间" prop="create_time">
              <!-- 通过作用域插槽的在通过dateFormat全局组件将时间转化 -->
              <template slot-scope=scope>{{scope.row.create_time | dateFormat }}</template>
          </el-table-column>
          <el-table-column  label="操作">
              <template slot-scope="scope">
                  <el-button @click= "showEditBox(scope.row.order_id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <el-button @click= "showProgress" type="success" icon="el-icon-location" size="mini"></el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change= "handleSizeChange" @current-change="handleCurrentChange" :current-page= "queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10, 20]" :page-size= "queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper" :total= "total"></el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog @close = 'closeEditForm' title="修改地址" :visible.sync="EidtDialogVisible" width="30%">
     <!-- 表单区域 -->
    <el-form :model= "EditForm" :rules="EditRrules" ref="EditFormRef" label-width="100px">
     <el-form-item label="省市区/县" prop="address1">
     <!--级联选择器区域 -->
     <el-cascader expandTrigger='hover' :options= "CityData" v-model= "EditForm.address1"></el-cascader>
     </el-form-item>
    <el-form-item label="详细地址" prop="address2">
     <el-input v-model= "EditForm.address2"></el-input>
     </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
    <el-button @click="EidtDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editOrderForm">确 定</el-button>
  </span>
   </el-dialog>

   <!-- 地址的对话框 -->
   <el-dialog title="物流进度" :visible.sync= "ProgressdialogVisible" width="50%">
     <!--时间线 -->
     <el-timeline>
    <el-timeline-item v-for= "(activity, index) in activities" :key= "index"
      :timestamp= "activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
   </el-dialog>
  </div>
</template>

<script>
// 导入省市区信息
import CityData from './citydata.js'
export default {
  data() {
    return {
      // 快递数据
      activities: [{
        content: '发货',
        timestamp: '2022-01-20'
      }, {
        content: '正在长沙进行分拣',
        timestamp: '2022-01-22'
      }, {
        content: '已收件',
        timestamp: '2022-01-23'
      }],
      // 保存订单数据
      editFormData: {},
      // 定义一个用于查询订单的对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总订单条数
      total: 0,
      // 用来保存获取到的订单数据
      orderList: [],
      ProgressdialogVisible: false,
      //   控制修改对话框的显示与隐藏
      EidtDialogVisible: false,
      EditForm: {
        address1: [],
        address2: ''
      },
      //  修改界面的表单验证规则
      EditRrules: {
        address1: [{ required: true, message: '请选择省市区', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      CityData,
      // 用来保存拿到的物流信息
      progressInfo: []
    }
  },
  created() {
    // 定义一个获取订单的列表
    this.getOrderList()
  },
  methods: {
    //   获取所有订单列表数据
    async getOrderList() {
    // 发送请求拿到所有订单数据
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // pagesiez发生改变就会执行该函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 显示修改页面
    async showEditBox(id) {
      const { data: res } = await this.$http.get('orders/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.editFormData = res.data
      this.EidtDialogVisible = true
    },
    // 监听关闭修改对话框的事件
    closeEditForm() {
      this.$refs.EditFormRef.resetFields()
    },
    async showProgress() {
      // // 发送请求获取物流数据
      // const { data: res } = await this.$http.get('/kuaidi?804909574412544580')
      // console.log(res)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败!')
      // }
      // this.$message.success('获取物流进度成功!')
      // this.progressInfo = res.data
      // console.log(res.data)
      // 显示对话框
      this.ProgressdialogVisible = true
    },
    // 实现编辑提交效果
    editOrderForm() {
      // 对表单进行预处理
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.put('orders/' + this.editFormData.order_id,
          { is_send: this.editFormData.is_send, order_pay: this.editFormData.order_pay, order_price: this.editFormData.order_price, order_numbe: this.editFormData.order_numbe, pay_status: this.editFormData.pay_status })
        if (res.meta.status !== 201) {
          return this.$message.error('修改订单失败')
        }
        this.$message.success('修改订单成功')
        this.getOrderList()
        this.EidtDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
    width: 100%;
}
</style>
