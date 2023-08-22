interface R<T> {
  requestId: string;
  code: number;
  msg: string;
  data: T;
}

interface TpApp {
  appId: string;
  appName: string;
  appSecret: string;
  createTime: Date;
  indexUrl: string;
  status: string;
}

interface User {
  createTime: Date;
  owner: boolean;
  status: string;
  superAdmin: boolean;
  userId: number;
  userTel: string;
  userZhName: string;
}

interface UserWithRoles extends User {
  roleList: Array<string>;
}

interface Dept {
  createTime: Date;
  deptId: number;
  deptName: string;
  parentDept: number;
  weight: number;
}
