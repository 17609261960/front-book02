import Vue from 'vue'

import Router from 'vue-router'
import Main from '../components/Main.vue'
import Book from '../components/Book.vue'
import Borrow from '../components/Borrow.vue'
import User from '../components/User.vue'
import Log from '../components/Log.vue'
import Category from '../components/Category.vue'
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'

Vue.use(Router)

let router = new Router({
  routes:[{ //定义多个路由
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path:'/main',
      component:Main,
      redirect : '/welcome',
      children:[{
        path:'/welcome',
        component:Welcome
      },
        {
        path:'/user',
        name:User,
        component:User
      },{
        path:'/log',
        name:Log,
        component:Log
      },{
        path:'/book',
        name:Book,
        component:Book
      },{
        path:'/categry',
        name:Category,
        component:Category
      },
      {
        path:'/borrow',
        name:Borrow,
        component:Borrow
      },{
        path:'/welcome',
        name:Welcome,
        component:Welcome
      }]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next(); //放行进入到我们的首页中去
  } else {
    if (sessionStorage.getItem("user") != null) {
      next(); //放行进入到我们的首页中去
    } else {
      alert('该用户还未登录，请登录')
      next({
        path: '/login'
      })
    }
  }
})
export default router
