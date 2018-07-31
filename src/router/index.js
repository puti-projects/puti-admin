import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '文章',
      icon: 'form',
      roles: ['administrator', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'post',
      component: () => import('@/views/article/post'),
      name: 'article-post',
      meta: {
        title: '文章列表',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/article/new'),
      name: 'article-new',
      meta: {
        title: '创建文章',
        icon: 'edit',
        roles: ['administrator']
      }
    }, {
      path: 'category',
      component: () => import('@/views/article/category'),
      name: 'article-category',
      meta: {
        title: '分类目录',
        icon: 'tab',
        roles: ['administrator']
      }
    }, {
      path: 'tag',
      component: () => import('@/views/article/tag'),
      name: 'article-tag',
      meta: {
        title: '标签',
        icon: 'star',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/index',
    alwaysShow: true,
    meta: {
      title: '专题',
      icon: 'form',
      roles: ['administrator']
    },
    children: [{
      path: 'manage',
      component: () => import('@/views/subject/manage'),
      name: 'subject-manage',
      meta: {
        title: '专题管理',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/subject/new'),
      name: 'subject-new',
      meta: {
        title: '添加专题',
        icon: 'edit',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/media',
    component: Layout,
    redirect: '/media/index',
    alwaysShow: true,
    meta: {
      title: '媒体',
      icon: 'media',
      roles: ['administrator']
    },
    children: [{
      path: 'library',
      component: () => import('@/views/media/library'),
      name: 'media-library',
      meta: {
        title: '媒体库',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/media/new'),
      name: 'media-new',
      meta: {
        title: '新增媒体',
        icon: 'edit',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/link',
    component: Layout,
    redirect: '/link/index',
    alwaysShow: true,
    meta: {
      title: '链接',
      icon: 'link',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/link/list'),
      name: 'link-library',
      meta: {
        title: '全部链接',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/link/new'),
      name: 'link-new',
      meta: {
        title: '添加链接',
        icon: 'edit',
        roles: ['administrator']
      }
    }, {
      path: 'linkCategory',
      component: () => import('@/views/link/linkCategory'),
      name: 'link-linkCategory',
      meta: {
        title: '链接分类目录',
        icon: 'edit',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/page',
    component: Layout,
    redirect: '/page/index',
    alwaysShow: true,
    meta: {
      title: '页面',
      icon: 'page',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/page/list'),
      name: 'page-list',
      meta: {
        title: '所有页面',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/page/new'),
      name: 'page-new',
      meta: {
        title: '添加页面',
        icon: 'edit',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    alwaysShow: true,
    meta: {
      title: '评论',
      icon: 'comment',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/comment/list'),
      name: 'comment-list',
      meta: {
        title: '评论列表',
        icon: 'list',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    alwaysShow: true,
    meta: {
      title: '用户',
      icon: 'user',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'user-list',
      meta: {
        title: '所有用户',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/user/new'),
      name: 'user-new',
      meta: {
        title: '添加用户',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'info',
      component: () => import('@/views/user/info'),
      name: 'user-info',
      meta: {
        title: '我的个人资料',
        icon: 'list',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    alwaysShow: true,
    meta: {
      title: '设置',
      icon: 'setting',
      roles: ['administrator']
    },
    children: [{
      path: 'general',
      component: () => import('@/views/setting/general'),
      name: 'setting-general',
      meta: {
        title: '常规设置',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'property',
      component: () => import('@/views/setting/property'),
      name: 'setting-property',
      meta: {
        title: '网站属性',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'writing',
      component: () => import('@/views/setting/writing'),
      name: 'setting-writing',
      meta: {
        title: '撰写',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'reading',
      component: () => import('@/views/setting/reading'),
      name: 'setting-reading',
      meta: {
        title: '阅读',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'discuss',
      component: () => import('@/views/setting/discuss'),
      name: 'setting-discuss',
      meta: {
        title: '讨论',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'media',
      component: () => import('@/views/setting/media'),
      name: 'setting-media',
      meta: {
        title: '媒体',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'project',
      component: () => import('@/views/setting/project'),
      name: 'setting-project',
      meta: {
        title: '作品',
        icon: 'list',
        roles: ['administrator']
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]
