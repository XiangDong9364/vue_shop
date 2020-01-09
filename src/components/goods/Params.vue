<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 警告文本 -->
        <el-col>
          <el-alert show-icon title="警告提注意：只允许为第三级分类设置相关参数~！" type="warning" :closable="false"></el-alert>
        </el-col>
        <!-- 选择商品分类区域 -->
        <el-col>
          选择商品分类：
          <el-cascader
            v-model="selectCategoryKeys"
            :options="categoryList"
            :props="{ expandTrigger: 'hover' ,value: 'cat_id',label: 'cat_name',children:'children'}"
            @change="handleChange"
          ></el-cascader>
        </el-col>
        <!-- tab页面 -->
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addParamsDialogVisible = true"
              >添加参数</el-button>
              <!-- 动态参数表格 -->
              <el-table :data="manyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染Tag标签 -->
                    <el-tag
                      closable
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      @close="handleClose(i, scope.row)"
                    >{{item}}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="showEditDialog(scope.row.attr_id)"
                    ></el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="removeParams(scope.row.attr_id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addParamsDialogVisible = true"
              >添加属性</el-button>
              <!-- 静态参数表格 -->
              <el-table :data="onlyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 循环渲染Tag标签 -->
                    <el-tag
                      closable
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      @close="handleClose(i,scope.row)"
                    >{{item}}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    ></el-input>
                    <!-- 添加按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="showEditDialog(scope.row.attr_id)"
                    ></el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="removeParams(scope.row.attr_id)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClose"
    >
      <el-form :model="addForm" :rules="paramsFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsDialogClose"
    >
      <el-form :model="editForm" :rules="paramsFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分类列表
      categoryList: [],
      // 选择的列表数据
      selectCategoryKeys: [],
      // Tabs激活的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 添加参数对话框
      addParamsDialogVisible: false,
      // 修改参数对话框
      editParamsDialogVisible: false,
      // 添加表单的数据对象
      addForm: {},
      // 修改表单的数据对象
      editForm: {},
      // 添加表单规则的验证对象
      paramsFormRules: {
        attr_name: [{
          required: true, message: '请输入参数名称', trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 获取参数列表数据
    async getCategoryList () {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) return this.$message.error('获取商品分类失败~！')

      this.categoryList = result.data
    },
    // 级联选择框选择改变事件
    handleChange () {
      this.getParamsData()
    },

    // 选项卡点击事件
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      // 不等于3 说明选中的不是三级
      if (this.selectCategoryKeys.length !== 3) {
        this.selectCategoryKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message.warning('请选择三级分类~！')
      }

      // 选中三级分类，根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (result.meta.status !== 200) return this.$message.error('获取分类参数失败~！')

      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = result.data
      } else {
        this.onlyTableData = result.data
      }
    },
    // 添加参数对话框关闭事件
    addParamsDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    editParamsDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数事件
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if (result.meta.status !== 201) return this.$message.error('添加参数失败~！')

        this.$message.success('添加参数成功~！')
        this.addParamsDialogVisible = false
        this.getParamsData()
      })
    },
    // 修改参数事件
    async showEditDialog (attrId) {
      // 查询当前参数的信息
      const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })
      if (result.meta.status !== 200) return this.$message.error('添加参数信息失败~！')

      this.editForm = result.data
      this.editParamsDialogVisible = true
    },
    // 修改参数提交事件
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name, attr_sel: this.activeName
        })

        if (result.meta.status !== 200) return this.$message.error('修改参数失败~！')

        this.$message.success('修改参数成功~！')
        this.getParamsData()
        this.editParamsDialogVisible = false
      })
    },
    // 删除参数
    removeParams (attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`).then(result => {
          if (result.data.meta.status !== 200) {
            this.$message.error('删除参数失败~!')
          }
          this.$message.success('删除参数成功~！')
          // 刷新数据
          this.getParamsData()
        })
      }).catch(() => {
        this.$message.info('已取消删除~！')
      })
    },
    async saveAttrVals (row) {
      const { data: result } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })

      if (result.meta.status !== 200) {
        return this.$message.error('修改参数失败~!')
      }

      return this.$message.success('修改参数成功~!')
    },
    // 文本框失去焦点和回车键触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 点击按钮，展示文本
    showInput (row) {
      row.inputVisible = true

      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true
    isBtnDisabled () {
      if (this.selectCategoryKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectCategoryKeys.length === 3) return this.selectCategoryKeys[2]
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 100px;
}
</style>
