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
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
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
    redirect: '/article/post',
    name: 'article',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'article',
      icon: 'article',
      roles: ['administrator', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'post',
      component: () => import('@/views/article/post'),
      name: 'article-post',
      meta: {
        title: 'articleList',
        icon: 'list',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'new',
      component: () => import('@/views/article/new'),
      name: 'article-new',
      meta: {
        title: 'articleAdd',
        icon: 'add',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'edit/:id',
      component: () => import('@/views/article/edit'),
      name: 'article-edit',
      hidden: true,
      meta: {
        title: 'articleEdit',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'category',
      component: () => import('@/views/article/category'),
      name: 'article-category',
      meta: {
        title: 'category',
        icon: 'category',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'tag',
      component: () => import('@/views/article/tag'),
      name: 'article-tag',
      meta: {
        title: 'tags',
        icon: 'tag',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/manage',
    name: 'subject',
    alwaysShow: true,
    meta: {
      title: 'subject',
      icon: 'subject',
      roles: ['administrator']
    },
    children: [{
      path: 'manage',
      component: () => import('@/views/subject/manage'),
      name: 'subject-manage',
      meta: {
        title: 'subjectManager',
        icon: 'manage',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/subject/new'),
      name: 'subject-new',
      meta: {
        title: 'subjectAdd',
        icon: 'add',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/media',
    component: Layout,
    redirect: '/media/library',
    name: 'media',
    alwaysShow: true,
    meta: {
      title: 'media',
      icon: 'media',
      roles: ['administrator']
    },
    children: [{
      path: 'library',
      component: () => import('@/views/media/library'),
      name: 'media-library',
      meta: {
        title: 'mediaManager',
        icon: 'media-list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/media/new'),
      name: 'media-new',
      meta: {
        title: 'mediaAdd',
        icon: 'add',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/link',
    component: Layout,
    redirect: '/link/index',
    name: 'link',
    alwaysShow: true,
    meta: {
      title: 'link',
      icon: 'link',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/link/list'),
      name: 'link-library',
      meta: {
        title: 'linkList',
        icon: 'list',
        roles: ['administrator']
      }
    }, {
      path: 'new',
      component: () => import('@/views/link/new'),
      name: 'link-new',
      meta: {
        title: 'linkAdd',
        icon: 'add',
        roles: ['administrator']
      }
    }, {
      path: 'linkCategory',
      component: () => import('@/views/link/linkCategory'),
      name: 'link-linkCategory',
      meta: {
        title: 'linkCategory',
        icon: 'category',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/page',
    component: Layout,
    redirect: '/page/list',
    name: 'page',
    alwaysShow: true,
    meta: {
      title: 'page',
      icon: 'page',
      roles: ['administrator', 'editor']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/page/list'),
      name: 'page-list',
      meta: {
        title: 'pageList',
        icon: 'pages',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'new',
      component: () => import('@/views/page/new'),
      name: 'page-new',
      meta: {
        title: 'pageAdd',
        icon: 'add',
        roles: ['administrator', 'editor']
      }
    }, {
      path: 'edit/:id',
      component: () => import('@/views/page/edit'),
      name: 'page-edit',
      hidden: true,
      meta: {
        title: 'pageEdit',
        roles: ['administrator', 'editor']
      }
    }]
  },

  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    name: 'comment',
    alwaysShow: true,
    meta: {
      title: 'comment',
      icon: 'comment',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/comment/list'),
      name: 'comment-list',
      meta: {
        title: 'commentList',
        icon: 'comments',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    alwaysShow: true,
    meta: {
      title: 'user',
      icon: 'user',
      roles: ['administrator']
    },
    children: [{
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'user-list',
      meta: {
        title: 'userList',
        icon: 'users',
        roles: ['administrator']
      }
    }, {
      path: 'profile',
      component: () => import('@/views/user/profile'),
      name: 'user-profile',
      meta: {
        title: 'myProfile',
        icon: 'profile',
        roles: ['administrator']
      }
    }]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    name: 'setting',
    alwaysShow: true,
    meta: {
      title: 'setting',
      icon: 'setting',
      roles: ['administrator']
    },
    children: [
      {
        path: 'site',
        component: () => import('@/views/setting/site/index'), // Parent router-view
        name: 'site',
        redirect: 'noredirect',
        alwaysShow: true,
        meta: { title: 'siteSetting', icon: 'website' },
        children: [
          {
            path: 'general',
            component: () => import('@/views/setting/site/general/index'),
            name: 'general',
            meta: { title: 'siteSettingGeneral' }
          },
          {
            path: 'property',
            component: () => import('@/views/setting/site/property/index'),
            name: 'property',
            meta: { title: 'siteSettingProperty' }
          }
        ]
      },
      {
        path: 'content',
        component: () => import('@/views/setting/content/index'),
        name: 'content',
        redirect: 'noredirect',
        alwaysShow: true,
        meta: { title: 'contentSetting', icon: 'content' },
        children: [
          {
            path: 'writing',
            component: () => import('@/views/setting/content/writing/index'),
            name: 'content-writing',
            meta: { title: 'contentSettingWritting' }
          },
          {
            path: 'reading',
            component: () => import('@/views/setting/content/reading/index'),
            name: 'content-reading',
            meta: { title: 'contentSettingReading' }
          },
          {
            path: 'media',
            component: () => import('@/views/setting/content/media/index'),
            name: 'content-media',
            meta: { title: 'contentSettingMedia' }
          },
          {
            path: 'discuss',
            component: () => import('@/views/setting/content/discuss/index'),
            name: 'content-discuss',
            meta: { title: 'contentSettingDiscuss' }
          }
        ]
      },
      {
        path: 'others',
        component: () => import('@/views/setting/others/index'),
        name: 'others',
        redirect: 'noredirect',
        alwaysShow: true,
        meta: { title: 'otherSetting', icon: 'others' },
        children: [
          {
            path: 'github',
            component: () => import('@/views/setting/others/github/index'),
            name: 'github',
            meta: { title: 'otherSettingGithub', icon: 'github' }
          }, {
            path: 'public-account',
            component: () => import('@/views/setting/others/public-account/index'),
            name: 'public-account',
            meta: { title: 'otherSettingGeneralAccount', icon: 'wechat' }
          }
        ]
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
