import { csHttp } from "./utils";

/** 获取所有的部门列表 */
export const getAllDept = () => {
  return csHttp.request<Dept[]>("get", "/cs/b/dept/getAllDept");
};

/** 添加部门 */
export const createDept = (data: { deptName: string; parentDept?: number }) => {
  return csHttp.request<Dept>("post", "/cs/b/dept/createDept", { data });
};
