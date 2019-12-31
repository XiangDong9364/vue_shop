<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- slice分割（start,end(可选) 包前不包后，从0开始 -1:数组末尾） -->
      <el-table
        :data="rightsList.slice((currentPage-1) * pageSize, currentPage * pageSize)"
        border
        stripe
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rightsList.length"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: [],
      // 初始页
      currentPage: 1,
      // 每页的数据
      pageSize: 5
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取所有权限
    async getRightsList () {
      const { data: result } = await this.$http.get('rights/list')
      if (result.meta.status !== 200) return this.$message.error('获取权限列表失败~！')

      this.rightsList = result.data
    },
    // 页大小改变事件
    handleSizeChange (value) {
      this.pageSize = value
      // 重置当前页为首页
    },
    // 当前页改变事件
    handleCurrentChange (value) {
      this.currentPage = value
    }
  }
}
</script>

<style lang="less" scoped>
</style>
