import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/pages/login')
    },
      {
          path: '/app',
          name: 'app',
          component: require('@/pages/app')
      },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
