import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { removeToken } from "@/utils/auth";
import { getLoginUserInfo } from "@/api/login";
const user = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    userZhName: null,
    // 页面级别权限
    roles: []
  }),
  actions: {
    /** 前端登出（不调用接口） */
    logOut() {
      this.userZhName = null;
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStore() {
  const userStore = user(store);
  if (userStore.userZhName == null) {
    //加载数据
    setUser();
  }
  async function setUser() {
    const user = await getLoginUserInfo();
    userStore.userZhName = user.userZhName;
    userStore.roles = user.roleList;
  }
  return userStore;
}
