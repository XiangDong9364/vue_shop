<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-tooltip effect="dark" :enterable="false" content="此功能还未开发完成，暂停使用~！" placement="bottom">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.id"
              clearable
              @clear="getRoleList()"
              @keyup.enter.native="queryContent()"
              disabled
            >
              <el-button disabled slot="append" icon="el-icon-search" @click="queryContent"></el-button>
            </el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[i1 === 0 ? 'borderTop' : '','borderBottom','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="tagClose(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限&&三级权限 -->
              <el-col :span="18">
                <!-- 二级权限 -->
                <el-row
                  :class="[i2 !== 0 ? 'borderTop' : '','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="tagClose(scope.row, item2.id)"
                    >{{ item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="tagClose(scope.row, item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scpoe">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRoleInfo(scpoe.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scpoe.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showRightsDialog(scpoe.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="addDialogClose"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="formRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改修改"
      :visible.sync="updateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="updateDialogClose"
    >
      <el-form ref="updateFormRef" :model="updateForm" label-width="80px" :rules="formRules">
        <el-form-item label="编号" prop="roleId">
          <el-input v-model="updateForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      // 添加角色表单
      addForm: {},
      // 修改角色表单
      updateForm: {},
      addDialogVisible: false,
      updateDialogVisible: false,
      // 分配权限对话框
      setRightsDialogVisible: false,
      // 验证规则
      formRules: {
        roleId: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 查询信息对象
      queryInfo: {
        id: ''
      },
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认已选择的权限ID
      defaultKeys: [],
      // 存储角色ID，分配权限时候使用
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色
    async getRoleList () {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) return this.$message.error('获取权限列表失败~！')

      this.roleList = result.data
    },
    // 显示权限对话框事件
    async showRightsDialog (role) {
      // 提取角色ID,分配权限时候使用
      this.roleId = role.id
      // 发起请求获取数据
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) return this.$message.error('获取权限数据失败~！')

      // 赋值权限
      this.rightsList = result.data

      // 清空之前选择保留的数据
      this.defaultKeys = []

      // 调用三级节点数据
      this.getLeafKeys(role, this.defaultKeys)

      // 显示对话框
      this.setRightsDialogVisible = true
    },
    // 获取三级节点数据
    getLeafKeys (node, arr) {
      // 如果没有子节点说明是三级节点，所以直接获取节点ID
      if (!node.children) return arr.push(node.id)

      // 如果有子节点，说明不是三级节点，就把当前节点的子节点做为下一个节点的对象继续判断（递归）
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限提交事件（对话框确认）
    async allotRights () {
      // 获取全选状态的数据（√）
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()

      // 获取半选状态的数据（-）
      const halfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()

      // 需要分配的权限
      const needAllotRight = [checkedKeys.join(',') + ',' + halfCheckedKeys.join(',')]

      // 分配权限提交事件
      const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: needAllotRight })

      if (result.meta.status !== 200) return this.$message.error('分配权限失败~！')

      this.$message.success('分配权限成功~！')

      this.getRoleList()

      this.setRightsDialogVisible = false
    },
    // 添加角色对话框关闭事件
    addDialogClose () {
      this.$refs['addFormRef'].resetFields()
    },
    // 修改角色对话框关闭事件
    updateDialogClose () {
      this.$refs['updateFormRef'].resetFields()
    },
    // 确认按钮提交事件
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('roles', this.addForm)

        if (result.meta.status === 201) {
          this.$message.success('添加成功~！')
          // 隐藏对话框
          this.addDialogVisible = false
          // 刷新用户列表数据
          this.getRoleList()
        } else if (result.meta.status === 400) {
          this.$message.warning('添加失败~！')
        } else {
          this.$message.error(result.meta.msg + '~！')
        }
      })
    },
    // 修改角色(点击按钮弹出对话框)
    async editRoleInfo (data) {
      const { data: result } = await this.$http.get('roles/' + data.id)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.updateForm = result.data
      this.updateDialogVisible = true
    },
    // 修改角色(提交)
    updateRole () {
      this.$refs.updateFormRef.validate(async valid => {
        if (!valid) return

        const { data: result } = await this.$http.put('roles/' + this.updateForm.roleId, {
          roleName: this.updateForm.roleName,
          roleDesc: this.updateForm.roleDesc
        })

        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }

        // 关闭弹窗
        this.updateDialogVisible = false
        // 刷新数据
        this.getRoleList()

        this.$message.success('更新角色信息成功~！')
      })
    },
    // 删除角色
    deleteRole (roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + roleId).then(result => {
          if (result.data.meta.status !== 200) {
            this.$message.error(result.meta.msg)
          }
          this.$message.success('删除成功~！')
          // 刷新数据
          this.getRoleList()
        })
      }).catch(() => {
        this.$message.info('已取消删除~！')
      })
    },
    // 根据 ID 查询角色
    queryContent () {
      this.$http.get('users/' + this.queryInfo.id).then(result => {
        console.log(result)
      })
    },
    // Tag标签关闭事件
    tagClose (role, rightId) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除权限流程
        this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(result => {
          if (result.data.meta.status !== 200) {
            return this.$message.error('删除权限失败~！')
          }
          // 重新赋值给该元素,避免页面刷新导致关闭
          role.children = result.data.data
        })
      }).catch(() => {
        this.$message.info('已取消删除~！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.borderTop {
  border-top: 1px solid #eee;
}

.borderBottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  // 纵向居中
  display: flex;
  align-items: center;
}
</style>
