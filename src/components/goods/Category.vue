<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card" shadow="always">
      <div>
        <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          </el-col>
        </el-row>

        <!-- 表格 -->
        <tree-table
          class="treeTable"
          :data="categoryList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template slot="isValid" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted ===false"
              style="color:lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <!-- 排序 -->
          <template slot="rank" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level===2" type="danger">三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="option" slot-scope>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </tree-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialog"
      width="50%"
      @close="addCategoryClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryFormRules"
        ref="addCategoryFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCagtegoryList"
            :props="{ expandTrigger: 'hover',value: 'cat_id',label: 'cat_name',children:'children',checkStrictly: true}"
            @change="selectChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类的数据列表
      categoryList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // categoryList 总数
      total: 0,
      // 控制添加分类对话框
      addCategoryDialog: false,
      // 添加分类的表单对象
      addCategoryForm: {
        cat_name: '',
        // 父级ID
        cat_pid: 0,
        // 分类等级
        cat_level: 0
      },
      // 选择的级别（级联选择器的值）
      selectKeys: [],
      // 添加分类表单的验证规则对象
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表数据
      parentCagtegoryList: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: 'center'
        }, {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isValid',
          align: 'center',
          headerAlign: 'center'
        }, {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'rank',
          align: 'center',
          headerAlign: 'center'
        }, {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'option',
          align: 'center',
          headerAlign: 'center'
        }
      ]
    }
  },
  created () {
    this.getCaregoryList()
  },
  methods: {
    // 获取商品分类数据
    async getCaregoryList () {
      const { data: result } = await this.$http.get('categories', { params: this.queryInfo })

      if (result.meta.status !== 200) return this.$message.error('获取商品分类失败~！')

      this.categoryList = result.data.result
      this.total = result.data.total
    },
    // 获取父级分类列表数据
    async getParentCagtegoryList () {
      const { data: result } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (result.meta.status !== 200) return this.$message.error('获取父级分类数据失败~！')

      this.parentCagtegoryList = result.data
    },
    // 页大小改变事件
    handleSizeChange (value) {
      this.queryInfo.pagesize = value
      this.getCaregoryList()
    },
    // 当前页改变事件
    handleCurrentChange (value) {
      this.queryInfo.pagenum = value
      this.getCaregoryList()
    },
    // 显示添加分类对话框
    showAddCateDialog () {
      // 获取父级分类的数据
      this.getParentCagtegoryList()
      // 展示对话框
      this.addCategoryDialog = true
    },
    // 级联选择改变事件
    selectChange () {
      console.log(this.selectKeys)
      // 如果 selectKyes 数组中的 length > 0,证明选中的父级分类
      // 反之，就说明没有选择
      if (this.selectKeys.length > 0) {
        // 获取父级分类（数组从0开始获取）
        this.addCategoryForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 获取当前分类的等级(0：一级 1：二级 2：三级)
        this.addCategoryForm.cat_level = this.selectKeys.length
      } else {
        // 获取父级分类（数组从0开始获取）
        this.addCategoryForm.cat_pid = 0
        // 获取当前分类的等级(0：一级 1：二级 2：三级)
        this.addCategoryForm.cat_level = 0
      }
    },
    // 添加分类
    addCategory () {
      this.$refs.addCategoryFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('categories', this.addCategoryForm)
        if (result.meta.status !== 201) return this.$message.error('添加分类失败~！')

        this.$message.success('添加分类成功~！')
        this.getCaregoryList()
        this.addCategoryDialog = false
      })
    },
    // 添加分类关闭对话框事件
    addCategoryClosed () {
      // 重置表单
      this.$refs.addCategoryFormRef.resetFields()
      this.selectKeys = []
      this.addCategoryForm.cat_level = 0
      this.addCategoryForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
