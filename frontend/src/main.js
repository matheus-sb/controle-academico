import Vue from 'vue'
import helper from './helper'
global.helper = helper
import router from './router'
import store from './store/'
store.dispatch('checkAuth')

import Vuetify from 'vuetify'
Vue.use(Vuetify)

import 'vuetify/src/stylus/main.styl'
import '@/assets/styles/main.styl'

import { ApolloClient, createNetworkInterface } from 'apollo-client'

const networkInterface = createNetworkInterface({
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/graphql' : '/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    if (helper.store('token')) {
      req.options.headers.Authorization = helper.store('token')
    }
    next()
  }
}])

const apolloClient = new ApolloClient({
  networkInterface,
  connectToDevTools: true
})

import VueApollo from 'vue-apollo'
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  clients: {
    a: apolloClient
  },
  defaultClient: apolloClient,
  errorHandler (error) {
    console.log('Global error handler')
    console.error(error)
  }
})

import App from './App'

Vue.config.productionTip = false

import validator from 'Validator'
global.validator = validator

import VForm from './components/Form.vue'
import VField from './components/Field.vue'

Vue.component('v-form', VForm)
Vue.component('v-field', VField)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  apolloProvider,
  render: h => h(App),
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  created () {
    this.$store.dispatch('checkPageTitle', this.$route.path)
  }
})
