<script setup lang="ts">
import Motion from "./utils/motion";
import { loginRules } from "./utils/rule";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";

import { getTpAppList } from "@/api/publicResource";
import { loginByPassword } from "@/api/login";
defineOptions({
  name: "Login"
});
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();

const ruleForm = reactive({
  userName: "",
  password: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await loginByPassword({
          userName: ruleForm.userName,
          password: ruleForm.password
        });
        const newUrl = `${choosedApp.value.indexUrl}?accessToken=${res.token}`;
        window.location.replace(newUrl);
      } finally {
        loading.value = false;
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

const tpAppList = ref<TpApp[]>([]);
const choosedApp = ref<TpApp>(null);

function chooseApp(num: number) {
  choosedApp.value = tpAppList.value[num];
}
onMounted(async () => {
  window.document.addEventListener("keypress", onkeypress);
  /**
   * 加载所有的app列表
   */
  tpAppList.value = await getTpAppList();
  if (tpAppList.value.length > 0) {
    choosedApp.value = tpAppList.value[0];
  }
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">
              <el-dropdown @command="chooseApp">
                <el-button type="danger" size="large">
                  {{ choosedApp == null ? "" : choosedApp.appName }}
                  <div class="ml-2" />
                  <IconifyIconOnline icon="ep:arrow-down" />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, key) in tpAppList"
                      :key="item.appId"
                      :command="key"
                      >{{ item.appName }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="userName"
              >
                <el-input
                  clearable
                  v-model="ruleForm.userName"
                  placeholder="账号/手机号/邮箱"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
