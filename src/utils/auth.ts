export interface TokenInfo {
  /** token */
  accessToken: string;
}

export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): TokenInfo | null {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  const value = localStorage.getItem(TokenKey);
  return value == null ? null : JSON.parse(value);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: TokenInfo) {
  localStorage.setItem(TokenKey, JSON.stringify(data));
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  localStorage.removeItem(TokenKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "" + token;
};
