<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card" shadow="always">
      <div>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList()"
              @keyup.enter.native="getUserList()"
            >
              <el-button slot="append" icon="el-icon-search" @click="queryContent()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userList" border stripe>
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="姓名" prop="username" align="center"></el-table-column>
          <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
          <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
          <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <!--  {{ scope.row}} 作用域插槽，可以获取这一行所有数据 -->
              <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserInfo(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          :close-on-click-modal="false"
          @close="addDialogClose"
        >
          <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="formRules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addFormRef')">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="updateDialogVisible"
          width="50%"
          :close-on-click-modal="false"
          @close="updateDialogClose"
        >
          <el-form ref="updateFormRef" :model="updateForm" label-width="80px" :rules="formRules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="updateForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="updateForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="updateForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateUserInfo">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (res, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (res, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/

      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false, // 添加用户对话框是否显示
      updateDialogVisible: false, // 修改对话框是否显示
      // 添加用户表单对象
      addForm: {
        username: '',
        password: '123456',
        email: '123456@qq.com',
        mobile: '18692541789'
      },
      // 修改用户表单对象
      updateForm: {},
      // 添加表单规则对象
      formRules: {
        username: [
          { required: true, message: '请输入您的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于六位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入您的邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入您的手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 添加用户对话框关闭事件
    addDialogClose () {
      this.$refs['addFormRef'].resetFields()
    },
    // 修改用户对话框关闭事件
    updateDialogClose () {
      this.$refs['updateFormRef'].resetFields()
    },
    // 对话框确定按钮添加用户
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('users', this.addForm)

        if (result.meta.status === 201) {
          this.$message.success(result.meta.msg + '~！')
          // 隐藏对话框
          this.addDialogVisible = false
          // 刷新用户列表数据
          this.getUserList()
        } else if (result.meta.status === 400) {
          this.$message.warning(result.meta.msg + '~！')
        } else {
          this.$message.error(result.meta.msg + '~！')
        }
      })
    },
    // 编辑用户信息
    async editUserInfo (rowData) {
      const { data: result } = await this.$http.get('users/' + rowData.id)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.updateForm = result.data
      this.updateDialogVisible = true
    },
    // 修改用户信息
    updateUserInfo () {
      this.$refs.updateFormRef.validate(async valid => {
        if (!valid) return

        const { data: result } = await this.$http.put('users/' + this.updateForm.id, {
          email: this.updateForm.email,
          mobile: this.updateForm.mobile
        })

        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }

        // 关闭弹窗
        this.updateDialogVisible = false
        // 刷新数据
        this.getUserList()

        this.$message.success('更新用户信息成功~！')
      })
    },
    deleteUser (userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + userId).then(result => {
          console.log(result)
          if (result.data.meta.status !== 200) {
            this.$message.error(result.meta.msg)
          }
          this.$message.success('删除成功~！')
          // 刷新数据
          this.getUserList()
        })
      }).catch(() => {
        this.$message.info('已取消删除~！')
      })
    },
    // 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表信息失败~！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    //  监听pageSize改变事件
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听pageNum改变事件
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 监听 switch 状态改变事件
    async userStatusChange (userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败~！')
      }
      this.$message.success('更新用户状态成功~！')
    },
    // 搜索按钮点击事件
    queryContent () {
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
