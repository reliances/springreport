<template>
  <div class="login-wrap">
    <!--    <h1 class="title">上海超星医疗集团医院</h1>-->
    <div style="width: 450px; padding: 60px 40px; background: #fff; border-radius: 10px;">
      <div class="df-c">
        <img src="@/assets/img/logoWithName.png" style="width: auto; height: 48px" />
        <el-divider style="height: 2em" direction="vertical" />
        <div class="welcome" style="font-size: 30px;font-weight: bold; color: #222222;">欢迎登录</div>
      </div>
      <LoginForm />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-wrap {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/login_bg.png') no-repeat center;
  background-size: cover;

  .title{
    position: absolute;
    top: 80px;
    left: 200px;
    font-size: 30px;
    color: #0a0000;
    font-weight: 600;
  }
}
</style>



<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import LoginForm from 'views/login/comp/LoginForm.vue';

const store = useStore();
const activeName = ref('first');
const isMobile = computed(() => {
  return store.getters['setting/isMobile'];
});

const handleClick = (val) => {};
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  position: relative;
  display: flex;
  &__left {
    min-width: 675px;
    flex: 0.8;
    height: 100%;
    background-size: 100% 100%;
    background-image: url('@/assets/img/loginLeftBg.png');
    background-repeat: no-repeat;
  }
  &__right {
    flex: 1;
    position: relative;
    .login-box {
      .welcome {
        height: 70px;
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 70px;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    .filing-information {
      position: absolute;
      bottom: 50px;
      width: 100%;
      a {
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        text-decoration: none;
      }
      .beian-icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
      }
    }
  }

  #bgd {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  h2 {
    color: #d3d7f7;
  }
}
</style>
