import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Login from '@/pages/Login'

function route (path, file, name, meta, children, redirect) {
  return {
    path,
    name,
    children,
    component: require(`@/pages/${file}.vue`),
    meta,
    redirect
  }
}

function beforeEnterLogin (to, from, next) {
  if (store.getters.isAuthenticated) {
    next({ path: '/' })
    store.dispatch('checkPageTitle', '/')
  } else {
    next()
  }
}

function beforeEnterLogout (to, from, next) {
  store.commit('setAuth', { })
  next({ path: '/login' })
}

Vue.use(Router)

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/login', component: Login, name: 'login', beforeEnter: beforeEnterLogin },
    { path: '/logout', beforeEnter: beforeEnterLogout },
    route('/error', 'Error', 'error'),
    route('/', 'Main', null, null, [
      route('/inicial', 'Home', 'home', { auth: true }),
      route('/cadastro/alunos', 'AlunosListagem', 'Cadastro de alunos', { auth: true })
    ], '/inicial'),
    { path: '*', redirect: '/error', query: {code: 404, message: 'Desculpe! Página não encontrada. :('} }
  ]
})

router.beforeEach((to, from, next) => {
  store.dispatch('checkPageTitle', to.path)

  if (to.meta.auth && !store.getters.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
