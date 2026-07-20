<!--  -->
<template>
  <div class="template-header df-c-b">
    <div class="template-header-title"> 模版中心 </div>
    <div class="template-header-search">
      <el-input v-model="searchValue" placeholder="输入关键字搜索模板" clearable>
        <template #prefix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-input>
      <div class="search-btn" @click="searchTem()">立即搜索</div>
    </div>
    <div class="template-header-back" />
  </div>
</template>

<script>
  import { Calendar, Search } from '@element-plus/icons-vue';
  export default {
    data() {
      return {
        searchValue: '',
      };
    },

    methods: {
      searchTem() {
        this.$emit('search', this.searchValue);
      },
    },
    components: {
      Search,
    },
  };
</script>
<style lang="scss" scoped>
  .template-header {
    height: 64px;
    padding: 0 24px;
    background: $supx-header-gradient;
    box-shadow: 0px 2px 5px 0px rgba(35, 129, 255, 0.15);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;

    .template-header-title {
      color: #fff;
      text-align: center;
      font-family: 'PingFang SC';
      font-size: 20px;
      font-style: normal;
      font-weight: bold;
      line-height: 25.413px;
      letter-spacing: 0.2px;
    }

    .template-header-search {
      width: 580px;
      position: relative;

      :deep(.el-input__wrapper) {
        box-shadow: none;
        background: #fff;
        border-radius: 54px;
      }

      :deep(.el-input__inner) {
        height: 36px;
        line-height: 36px;
        border-radius: 54px;
        border: none;
        padding-left: 42px;
        padding-right: 100px;
      }

      :deep(.el-input__prefix) {
        position: absolute;
        left: 28px;
      }

      :deep(.el-input__suffix) {
        right: 100px;
      }

      :deep(.el-input__icon) {
        line-height: 36px;
      }

      .search-btn {
        position: absolute;
        right: 4px;
        top: 4px;
        width: 70px;
        text-align: center;
        height: 28px;
        line-height: 28px;
        border-radius: 299px;
        background: $supx-header-gradient;
        padding: 0 8px;
        color: #fff;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        cursor: pointer;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.85;
        }
      }
    }
  }
</style>
