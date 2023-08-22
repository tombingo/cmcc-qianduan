export default {
  path: "/system",
  meta: {
    icon: "setting",
    title: "系统管理",
    rank: 12
  },
  children: [
    {
      path: "/system/user/index",
      component: () => import("@/views/system/user/index.vue"),
      name: "User",
      meta: {
        icon: "flUser",
        title: "用户管理"
      }
    },
    {
      path: "/system/role/index",
      component: () => import("@/views/system/role/index.vue"),
      name: "Role",
      meta: {
        icon: "role",
        title: "角色管理"
      }
    },
    {
      path: "/system/dept/index",
      component: () => import("@/views/system/dept/index.vue"),
      name: "Dept",
      meta: {
        icon: "dept",
        title: "部门管理"
      }
    }
  ]
};
