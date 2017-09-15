<template lang="pug">
div
  v-dialog(:value='true', persistent='')
    v-card(hover='', style='background:white')
        v-card-title.blue.darken-1
          span.headline.white--text Login
        v-card-text.pt-4      
          v-form(v-model='model', @submit='onSubmit', submitButtonText="Login", v-bind="props", @cleanParentErrors="cleanParentErrors")
            .flex.pb-2
              small * Campo obrigatório
            template(slot='buttons')
              v-btn.ma-0(primary, dark, :loading="isLoading", :disabled="isLoading", type='submit') Entrar
                v-icon(right, dark) send
                <span slot="loader" class="custom-loader">
                  <v-icon class="purple--text text--darken-2">cached</v-icon>
                </span>            
</template>

<style>
  body{
    background: #666 !important;
  }
</style>

<script>

import gql from 'graphql-tag'

export default {

  data () {
    return {
      loading: 0,
      model: {
        cpf: '',
        password: ''
      },
      props: {
        fields: {
          cpf: { label: 'CPF',
            required: 'required',
            teste: this.teste,
            mask: {
              mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
            }
          },
          password: { label: 'senha', type: 'password', required: 'required' }
        },
        rules: {cpf: 'required', password: 'required'},
        messages: {
          'cpf.required': 'O cpf é obrigatório',
          'password.required': 'A senha é obrigatória'
        },
        parentErrors: []
      }
    }
  },
  apollo: {
    $loadingKey: 'loading'
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.getters.isAuthenticated) {
        return false
      }
    })
  },
  computed: {
    isLoading: function () {
      return this.loading > 0
    }
  },
  methods: {
    cleanParentErrors () {
      this.props.parentErrors = []
    },
    loginError (errors) {
      if (errors && errors.length > 0) {
        this.props.parentErrors = global.helper.parseErrors(errors)
        return true
      }
      return false
    },
    onSubmit (data) {
      var vm = this
      this.loading = 1
      this.$apollo.mutate({
        mutation: gql`mutation ($cpf: String!, $senha: String!) {
          signIn(cpf: $cpf, senha: $senha) {
            token,
            errors {
              key
              value
            }
          }
        }`,
        variables: {
          cpf: this.model.cpf.replace(/\D+/g, ''),
          senha: this.model.password
        }
      }).then(({ data: {signIn} }) => {
        vm.loading = 0

        if (!vm.loginError(signIn.errors)) {
          vm.$store.commit('setAuth', signIn)
          vm.$router.replace(this.$route.query.redirect || '/')
        }
      }).catch(() => {
        vm.props.parentErrors = [{message: 'Ocorreu um erro ao logar no sistema. Procure o administrador do sistema.'}]
      })
    }
  },

  mounted () {
  }
}
</script>