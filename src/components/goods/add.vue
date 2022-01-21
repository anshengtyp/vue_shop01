<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
    <!-- 文字提示区域 -->
     <el-alert title="添加商品信息" :closable="false" type="info" center show-icon> </el-alert>
     <!-- 步骤条区域 -->
     <!-- :active="1"来显示正在操作的步骤 -->
     <el-steps align-center :space= "200" :active= "activeIndex - 0" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
     </el-steps>
     <!--表单区域，用表单包裹起来可以实现数据一起的验证,label-position="top"设置label在输入框上面  -->
     <el-form :model= "AddForm" :rules= "AddFormRules" ref="AddRuleForm" label-position="top">
     <!-- 左侧tab区域,:tab-position显示标签所在的位置 -->
     <!-- v-model="activeName"绑定激活的名字，对应下面的定义的name属性 -->
     <el-tabs @tab-click="tabClicked" :before-leave= 'beforeTabLeave' v-model= "activeIndex" :tab-position= "'left'">
     <el-tab-pane name="0" label="基本信息">
         <el-form-item label="商品名称" prop="goods_name">
            <!-- 将输入框的值双向绑定到表单对象的属性上 -->
             <el-input v-model= "AddForm.goods_name"></el-input>
         </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
        <!-- 将输入框的值双向绑定到表单对象的属性上 -->
            <el-input v-model= "AddForm.goods_price" type="number"></el-input>
         </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
            <!-- 将输入框的值双向绑定到表单对象的属性上 -->
            <el-input v-model= "AddForm.goods_weight" type="number"></el-input>
         </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <!-- 将输入框的值双向绑定到表单对象的属性上 -->
            <el-input v-model= "AddForm.goods_number" type="number"></el-input>
         </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <!-- 级联选择器 -->
          <el-cascader expandTrigger='hover' v-model= "AddForm.goods_cat" :options= "cateList" :props= "cateProps"
            @change= "handleChange"></el-cascader>
        </el-form-item>
     </el-tab-pane>
     <el-tab-pane name="1" label="商品参数">
       <!-- 渲染表单的item项 -->
       <el-form-item :label= "item.attr_name" :key="item.attr_id" v-for= " (item,index) in manyTabData">
         <!-- 多选框区域 -->
         <el-checkbox-group v-model= "item.attr_vals ">
         <el-checkbox border :label= "item" :key= "index" v-for= "(item,index) in item.attr_vals"></el-checkbox>
         </el-checkbox-group>
       </el-form-item>
     </el-tab-pane>
     <el-tab-pane name="2" label="商品属性">
       <el-form-item :label= "item.attr_name" :key="item.attr_id" v-for= "(item,index) in onlyTabData">
         <el-input v-model= "item.attr_vals"></el-input>
       </el-form-item>
     </el-tab-pane>
     <!-- 商品图片区域 -->
     <el-tab-pane name="3" label="商品图片">
       <!-- 图片上传，action上传的后台接口地址，-->
       <!-- on-preview预览事件 -->
       <!-- :on-remove，点击拆号的时候调用该函数 -->
       <!-- :file-list指定文件列表 -->
       <!-- list-type="picture"，渲染文件的显示效果为图片，也可以为文件 -->
       <!-- on-success图片上传成功事件 -->
      <el-upload  :on-success= "handleSuccess" :headers= "headerObj" :action= "uploadURL" :on-preview= "handlePreview"
        :on-remove= "handleRemove" list-type="picture">
       <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
     </el-tab-pane>
      <!-- 商品内容区域-->
     <el-tab-pane name="4" label="商品内容">
       <!-- 富文本编辑器区域 -->
       <!-- v-model= "AddForm.goods_introduce"实现双向数据绑定，可以获取用户输入的信息，自动保存下来 -->
       <quill-editor v-model= "AddForm.goods_introduce"></quill-editor>
       <el-button type="primary" @click= "addGoods">添加商品</el-button>
     </el-tab-pane>
     </el-tabs>
    </el-form>
    </el-card>
    <!--图片预览区域 -->
    <el-dialog  title="图片预览" :visible.sync="PiceDialogVisible" width="40%">
      <img :src= "previewPath" class="PreImg">
    </el-dialog>
  </div>
</template>

<script>
// 导入深拷贝组件
import _ from 'lodash'

export default {
  data() {
    return {
      // 处理图片显示与隐藏的
      PiceDialogVisible: false,
      // 图片上传地址
      uploadURL: 'http://120.78.12.66:8889/api/private/v1/upload',
      // 用来保存请求到的数据，用于商品分类
      cateList: [],
      // 控制显示在第几步骤,共用这个值可以steps和tabs实现联动效果
      activeIndex: '0',
      // 添加商品的表单数据对象
      AddForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类的数组
        goods_cat: [],
        // 用来保存图片的临时文件路径
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        // 保存动态参数和静态属性的值
        attrs: []
      },
      // manyTabData,用来接收拿到的动态参数数据
      manyTabData: [],
      // 静态属性列表数据
      onlyTabData: [],
      //  label指定看到的文字，value选定的值，children子节点
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 显示大图片的真实路径
      previewPath: '',
      // 图片上传组件请求头对象
      headerObj: {
        // 将图片上传功能的请求头默认的设置为我们自己定义的token
        Authorization: window.sessionStorage.getItem('token')
      },
      // 添加表单的验证规则
      AddFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  // 计算属性
  computed: {
    cateId() {
      // 定义一个三级分类的id
      if (this.AddForm.goods_cat.length === 3) {
        return this.AddForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    //   getCateList，获得所有的商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      // 将获取到的值保存在定义的数组中
      this.cateList = res.data
    },
    // 级联选择器变化会触发该函数
    handleChange() {
      // 判断用户是否选中三级商品，不是就直接清输入框
      if (this.AddForm.goods_cat.length !== 3) {
        this.AddForm.goods_cat = []
      }
    },
    // 监听标签页的切换，若返回 false，则阻止标签页切换。newActiveName新标签页面，oldActiveName老页面
    beforeTabLeave(newActiveName, oldActiveName) {
      // 判断是否有没有填写分类，没有就不让进入下一个标签页
      if (oldActiveName === '0' && this.AddForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 监听标签页的点击事件，发送请求
    async tabClicked() {
      // 如果点击的activeIndex为1就发送请求拿到动态参数数据
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        // 遍历数据，将goods_vals值拿出来
        res.data.forEach(item => {
          // 判断attr_vals是否为空，不为空就将分割好的数据给attr_vals
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTabData = res.data
      }
      // 如果点击的activeIndex为商品属性就发送请求拿到静态属性数据
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        this.onlyTabData = res.data
      }
    },
    // 处理图片预览效果的事件
    handlePreview(file) {
      // 拿到真实路径的图片
      this.previewPath = file.response.data.url
      this.PiceDialogVisible = true
    },

    // 处理移除图片的操作,file将要移除的图片信息，包括图片临时路径等信息
    handleRemove(file) {
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中找到要删除图片的索引,x为数组中的每一项
      const index = this.AddForm.pics.findIndex(x => x.pic === filePath)
      // 将图片的临时保存路径移除,调用splice方法通过索引值来移除对应的路径,1为删除的个数
      this.AddForm.pics.splice(index, 1)
    },

    // 监听图片上传成功事件,res服务器响应数据,包括服务器返回的图片临时路径
    handleSuccess(res) {
      // 拼接得到一个图片信息对象,res.data.tem_path拿到服务器响应的图片临时路径
      const picInfo = { pic: res.data.tmp_path }
      // 将对象push到数组中，用于后面添加商品的请求参数
      this.AddForm.pics.push(picInfo)
    },
    // 实现添加商品操作
    addGoods() {
      // 表单预验证
      this.$refs.AddRuleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // lodash cloneDeep(obj),用来执行深拷贝，将AddForm对象深拷贝一份出来，用于发送请求，发送请求要求goods_cat为字符串，这样就不会跟级联选择框的要求为数组冲突了
        const form = _.cloneDeep(this.AddForm)
        // 将数组转化为以冒号分割的字符串
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        // 循环动态参数，将所选的值拿出来
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          // 将拿到的动态参数中的分类id和值添加到定义的数组中，用于最后的发送添加请求
          this.AddForm.attrs.push(newInfo)
        })
        // 循环静态属性，将所需要的的值拿出来
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          // 将拿到的静态属性中的分类id和值添加到定义的数组中，用于最后的发送添加请求
          this.AddForm.attrs.push(newInfo)
        })
        // 将拿到是最新数据添加到深拷贝的form里面用于后续的添加请求
        form.attrs = this.AddForm.attrs
        // 将所有的数据都转化为需要的类型最后发送请求,添加数据
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 通过编程式导航将页面跳转到商品列表页面
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps{
    margin: 15px 0;
}
.el-checkbox{
  margin: 0 5px 0 0 !important;
}
.PreImg{
  width: 100%;
}
</style>
