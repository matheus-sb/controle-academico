import Vue from 'vue'
import Vuex from 'vuex'
import menu from '../menu'
Vue.use(Vuex)

function getPageTitle (menu, path) {
  for (let k in menu) {
    var item = menu[k]
    if (item.items) {
      var pageTitle = getPageTitle(item.items, path)
      if (pageTitle) return pageTitle
    } else {
      if (item.href === path) return item.title
    }
  }
}

const store = new Vuex.Store({
  state: {
    pageTitle: 'Home',
    menu: menu,
    user: {},
    token: null,
    message: {
      show: false
    }
  },
  getters: {
    isAuthenticated: state => state.token != null
  },
  mutations: {

    setAuth (state, { token }) {
      state.token = token
      global.helper.ls.set('token', token)
    },
    setMenu (state, data) {
      state.menu = data
    },
    setPageTitle (state, data) {
      state.pageTitle = data
    },
    showMessage (state, data) {
      state.message = data
      window.scrollTo(0, 0)
    }
  },
  actions: {

    checkAuth ({ commit }) {
      let data = {
        token: global.helper.ls.get('token')
      }
      commit('setAuth', data)
    },
    checkPageTitle ({commit, state}, path) {
      var pageTitle = getPageTitle(state.menu, path)
      commit('setPageTitle', pageTitle)
    }
  }
})

export default store
