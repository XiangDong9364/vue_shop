<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/panda_logo.jpg" alt="This is project logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="success" @click="logout()">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#2f444f"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-folder"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 底部区域 -->
    <el-footer>
      <span>Copyright @ 2019-2020 湘东 All Rights Reserved. 版权所有 Powered by XiangDong</span>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功~！')
    },
    // 获取所以菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单数据失败~！')
      this.menulist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 头部内容左右贴边对齐
  padding-left: 10px; // 头像左边距
  align-items: center; // 退出按钮 上下居中
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

.el-aside {
  background-color: #2f444f;

  // 去掉右边边框线，解决不对齐
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.el-footer {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconfont {
  margin-right: 8px;
}
</style>
