import { getToken } from "@/utils/auth";
import { PureHttp } from "@/utils/http";
import { ElNotification } from "element-plus";
import { removeToken, setToken } from "@/utils/auth";
import { ElMessageBox } from "element-plus";
import { refreshLoginByPwd } from "./login";
let csHttpRefreshToken = false;
export const csHttp = new PureHttp({
  baseURL: " http://localhost:8080",
  async beforeRequestCallback(config) {
    /**添加token*/
    if (!config.custom || !config.custom.ignoreAuth) {
      const token = getToken();
      config.headers["Authorization"] = token.accessToken;
    }
    return config;
  },
  async beforeResponseCallback(response) {
    /**
     * 修改返回结果
     */
    const data = response.data as R<any>;
    if (data.code != 0) {
      ElNotification.error(data.msg);
      //token失效
      if (data.code == 110) {
        //输入密码再次鉴权
        removeToken();
        window.location.replace(import.meta.env.VITE_SSO_LOGIN);
      } else if (data.code == 120) {
        if (!csHttpRefreshToken) {
          csHttpRefreshToken = true;
          ElMessageBox.prompt("输入你的密码", "请重新登录！", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(async ({ value }) => {
              const res = await refreshLoginByPwd({ password: value });
              setToken({ accessToken: res.token });
            })
            .finally(() => {
              csHttpRefreshToken = false;
            });
        }
      }
      throw new Error(data.msg);
    } else {
      return data.data;
    }
  }
});
