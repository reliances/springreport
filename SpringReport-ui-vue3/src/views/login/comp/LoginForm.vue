<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="validateForm"
    class="login-form"
    label-position="top"
    label-width="100px"
    :validate-on-rule-change="false"
  >
    <el-form-item prop="merchantNo" label="商户号" v-if="merchantMode == 1">
      <el-select
        v-model="ruleForm.merchantNo"
        placeholder="请选择商户号"
        size="large"
        style="width: 100%"
        filterable
      >
        <el-option
          v-for="item in merchants"
          :key="item.merchantNo"
          :label="item.merchantName ? `${item.merchantName}（${item.merchantNo}）` : item.merchantNo"
          :value="item.merchantNo"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="username" label="账号">
      <el-input placeholder="账号" v-model="ruleForm.username" size="large"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input
        @keyup.enter="handleLogin"
        placeholder="密码"
        type="password"
        v-model="ruleForm.password"
        size="large"
      ></el-input>
    </el-form-item>
    <el-form-item style="margin-top: 56px">
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        class="login-btn"
        @click="handleLogin"
      >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
  import { reactive, toRefs, ref, unref, watch, onMounted, nextTick } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import commonUtil from '../../../components/common/common';
  import apis from '../../../components/common/api';
  import commonConstants from '../../../components/common/constants';
  import md5 from 'js-md5';
  export default {
    setup() {
      const router = useRouter();
      const validateForm = ref(null);
      const state = reactive({
        ruleForm: {
          merchantNo: '',
          username: '',
          password: '',
        },
        merchants: [],
        loading: false,
        checkedPwd: false,
        redirect: undefined,
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        },
        merchantMode: 2,
      });
      onMounted(() => {
        getMerchantMode();
        window.addEventListener('keydown', keyDown);
      });
      watch(
        () => router.currentRoute,
        ({ _value }) => {
          const route = _value;
          state.redirect = (route.query && route.query.redirect) || '/';
        },
        {
          immediate: true,
        }
      );
      const keyDown = async (e) => {
        if (e.keyCode == 13) {
          handleLogin();
        }
      };
      const getMerchantList = async () => {
        var object = {
          url: apis.login.getMerchantListApi,
          params: {},
          removeEmpty: false,
        };
        try {
          const response = await commonUtil.doPost(object);
          if (response && (response.code === '200' || response.code === 200)) {
            const list = response.responseData || [];
            state.merchants = Array.isArray(list) ? list : [];
            if (state.merchants.length > 0 && !state.ruleForm.merchantNo) {
              state.ruleForm.merchantNo = state.merchants[0].merchantNo;
            }
          }
        } catch (e) {
          console.error('加载商户列表失败', e);
        }
      };
      const getMerchantMode = async () => {
        var object = {
          url: apis.login.getMerchantModeApi,
          params: {},
          removeEmpty: false,
        };
        try {
          const response = await commonUtil.doPost(object);
          if (response && (response.code === '200' || response.code === 200)) {
            state.merchantMode = response.responseData;
            if (state.merchantMode == 1) {
              state.rules.merchantNo = [
                { required: true, message: '请选择商户号', trigger: 'change' },
              ];
              await getMerchantList();
              await nextTick();
              validateForm.value && validateForm.value.clearValidate();
            }
          }
        } catch (e) {
          console.error('获取商户模式失败', e);
        }
      };
      const handleLogin = async () => {
        const form = unref(validateForm);
        if (!form) return;
        await form.validate((valid) => {
          if (valid) {
            state.valid = true;
            // state.loading = true;
            var param = {
              merchantNo: state.ruleForm.merchantNo,
              userName: state.ruleForm.username,
              password: md5(state.ruleForm.password),
            };
            var object = {
              url: apis.login.loginApi,
              params: param,
              removeEmpty: false,
            };
            commonUtil.doPost(object).then((response) => {
              if (response.code == '200') {
                var responseData = response.responseData;
                localStorage.setItem(commonConstants.sessionItem.authorization, responseData.token);
                localStorage.setItem(commonConstants.sessionItem.userName, responseData.userName);
                localStorage.setItem(commonConstants.sessionItem.roleName, responseData.roleName);
                localStorage.setItem(commonConstants.sessionItem.userId, responseData.userId);
                localStorage.setItem(commonConstants.sessionItem.apiList, responseData.apis); //接口权限，用于判断页面按钮是否显示
                localStorage.setItem(
                  commonConstants.sessionItem.isSystemMerchant,
                  responseData.isSystemMerchant
                );
                localStorage.setItem(
                  commonConstants.sessionItem.merchantNo,
                  responseData.merchantNo
                );
                localStorage.setItem(commonConstants.sessionItem.isAdmin, responseData.isAdmin);
                const routerPath =
                  state.redirect === '/404' || state.redirect === '/401' ? '/' : state.redirect;
                router.push(routerPath).catch(() => {});
                state.loading = false;
              }
            });
          }
        });
      };
      return {
        ...toRefs(state),
        validateForm,
        handleLogin,
      };
    },
  };
</script>
<style lang="scss" scoped>
  .login-form {
    margin-top: 20px;
    :deep(.el-form-item) {
      margin-bottom: 8px;
    }
    :deep(.el-form-item__label) {
      &::before {
        content: unset !important;
      }
      &::after {
        content: '' !important;
      }
    }
    .login-btn {
      width: 100%;
      margin-top: 16px;
      background: $supx-header-gradient;
      border: none;
      &:hover,
      &:focus {
        background: linear-gradient(90deg, $supx-color-primary-hover 0%, $supx-color-primary-end 100%);
      }
    }
  }
</style>
