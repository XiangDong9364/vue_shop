<template>
  <el-container>
    <!-- 走马灯 -->
    <el-carousel :interval="3000" type="card" height="300px" autoplay>
      <el-carousel-item v-for="img in imgItem" :key="img.imgId">
        <img :src="img.imgPath" :alt="img.imgName" :title="img.imgName" />
      </el-carousel-item>
    </el-carousel>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      imgItem: [
        {
          imgId: 1,
          imgName: '图片1',
          imgPath: require(`../assets/scania (1).png`)
        }, {
          imgId: 2,
          imgName: '图片2',
          imgPath: require(`../assets/scania (2).png`)
        }, {
          imgId: 3,
          imgName: '图片3',
          imgPath: require(`../assets/scania (3).png`)
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: lightslategray;
}

.el-carousel {
  width: 100%;
  margin: 30px;

  img {
    background-size: cover;
    width: 100%;
    height: 100%;
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
