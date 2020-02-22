import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },

  {
    path: '/users',
    name: 'users',
    meta: {
      icon: 'md-body',
      title: '用户中心',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: '/user',
        name: 'user',
        meta: {
          icon: 'md-funnel',
          title: '用户管理'
        },
        component: () => import('@/view/usercenter/user/index.vue')
      },
      {
        path: '/group',
        name: '/group',
        meta: {
          icon: 'md-funnel',
          title: '组管理'
        },
        component: () => import('@/view/usercenter/group/index.vue')
      }
    ]
  },

  {
    path: '/release',
    name: 'release',
    meta: {
      icon: 'md-body',
      title: '项目管理',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: '/project',
        name: 'project',
        meta: {
          icon: 'md-funnel',
          title: '项目中心'
        },
        component: () => import('@/view/release/project/index.vue')
      },
      {
        path: '/web',
        name: 'web',
        meta: {
          icon: 'md-funnel',
          title: 'web中心'
        },
        component: () => import('@/view/release/web/index.vue')
      },
      {
        path: '/list',
        name: 'list',
        meta: {
          icon: 'md-funnel',
          title: '申请列表'
        },
        component: () => import('@/view/release/deploy/list.vue')
      },
      {
        path: '/history',
        name: 'history',
        meta: {
          icon: 'md-funnel',
          title: '申请历史'
        },
        component: () => import('@/view/release/deploy/history.vue')
      }
    ]
  },
  
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
