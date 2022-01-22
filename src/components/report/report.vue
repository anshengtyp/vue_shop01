<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 当点击首页跳转到home -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 2. -->
        <div id="main" style= "width:750px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts用于绘制图表
import * as echarts from 'echarts'
// 导入深拷贝，将俩个对象合并
import _ from 'lodash'
export default {
  data() {
    return {
    // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  // 在dom创建完成之后,页面被渲染完毕之后会调用该函数
  async mounted() {
    // 3.初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 发送请求拿到数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('请求数据失败')
    }
    // 指定图表的配置项和数据
    // var option = {
    //   title: {
    //     text: 'ECharts 入门示例'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['销量']
    //   },
    //   xAxis: {
    //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //     }
    //   ]
    // }
    // 使用刚指定的配置项和数据显示图表。
    const result = _.merge(res.data, this.options)
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
