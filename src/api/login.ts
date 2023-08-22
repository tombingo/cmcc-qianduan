import { csHttp } from "./utils";

/** 通过密码登录 */
export const loginByPassword = (data?: {
  userName: string;
  password: string;
}) => {
  return csHttp.request<{
    token: string;
  }>(
    "post",
    "/cs/login/loginByPwd",
    {
      data
    },
    { custom: { ignoreAuth: true } }
  );
};

/** 获取所有的三方app列表 */
export const refreshLoginByPwd = (data?: { password: string }) => {
  return csHttp.request<{
    token: string;
  }>("post", "/cs/login/refreshLoginByPwd", {
    data
  });
};

/** 获取登录用户的信息 */
export const getLoginUserInfo = () => {
  return csHttp.request<UserWithRoles>(
    "get",
    "/cs/login/auth/getLoginUserInfo"
  );
};
