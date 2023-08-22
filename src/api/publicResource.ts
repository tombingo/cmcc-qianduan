import { csHttp } from "./utils";

/** 获取所有的三方app列表 */
export const getTpAppList = (params?: object) => {
  return csHttp.request<TpApp[]>(
    "get",
    "/cs/publicResource/getTpAppList",
    {
      params
    },
    { custom: { ignoreAuth: true } }
  );
};
