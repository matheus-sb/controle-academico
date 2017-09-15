<template lang="pug">
div
  v-expansion-panel(class="mb-5")
    v-expansion-panel-content(class="grey lighten-3")
      div(slot="header", class="subheading") Filtros de aluno
      v-card
        v-card-text()
          v-form.row.jr(v-model='filters.model', :fields='filters.fields', @submit='doSearch', submitButtonText='procurar', submitButtonIcon='search', :submitButtonFlex='{x12: true, sm4: true}')
  v-card
    div
      v-btn(fab, absolute, top, right, dark, class="green", @click.native.stop="showModal()")
        v-icon add
    v-data-table(:headers='headers', :items='alunosPage.alunos',:total-items="alunosPage.totalItems",hide-actions, :pagination.sync="pagination", :loading="loading > 0", no-data-text="Não há dados para a opção selecionada.")
      template(slot='items', scope='props')
        tr
          td(:class="header.right ? 'text-xs-right': ''", v-for='header in headers') {{props.item[header.value]}}
          td(width=160)  
            v-btn(dark, fab, primary, small, @click.native.stop="showModal(props.item)")
              v-icon() edit
            v-btn(fab, small, @click="remove(props.item)")
              v-icon() delete
    div(class="text-xs-center")
      v-pagination.ma-3(v-model='pagination.page', :length='totalPages', circle)

  v-dialog(ref="modalAluno", v-model="isShowModal", persistent, width="70%", :fullscreen="$vuetify.breakpoint.xsOnly")
    v-card
      v-toolbar(dark, class="primary")
        v-toolbar-title Cadastro de aluno - {{form.model.id ? 'alteração' : 'novo'}}
      v-card-text
        v-form(v-model="form.model", v-bind="form", @submit="onSave", @cleanParentErrors="cleanParentErrors")
          template(slot='buttons')
      v-card-actions
        v-spacer
        v-btn(flat, primary, @click.native="isShowModal = false") Fechar
        v-btn(flat, primary, @click.native="onSave(form.model)") Salvar
</template>

<script>

import gql from 'graphql-tag'
import { conformToMask } from 'text-mask-core'

const newItem = {
  id: null,
  cpf: null,
  rg: null,
  nome: null,
  dataCadastro: new Date().toISOString().substr(0, 10),
  dataNascimento: null,
  nomeMae: null,
  nomePai: null,
  rua: null,
  numero: null,
  complemento: null,
  estado: null,
  municipio: null
}

const getDefaultData = () => {
  return {
    form: {
      model: Object.assign({}, newItem),
      fields: {
        cpf: { label: 'CPF',
          required: 'required',
          flex: {xs12: true, sm6: true},
          mask: {mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
        },
        rg: { label: 'RG', required: 'required', flex: {xs12: true, sm6: true} },
        nome: { label: 'Nome', required: 'required', flex: {xs12: true} },
        dataCadastro: { label: 'Data de cadastro', required: 'required', disabled: true, type: 'date', flex: {xs12: true, sm6: true} },
        dataNascimento: { label: 'Data de nascimento', required: 'required', type: 'date', flex: {xs12: true, sm6: true} },
        nomeMae: { label: 'Nome da mãe', flex: {xs12: true} },
        nomePai: { label: 'Nome do pai', flex: {xs12: true} },
        rua: { label: 'Rua', required: 'required', flex: {xs12: true, sm10: true} },
        numero: { label: 'Número', flex: {xs12: true, sm2: true} },
        complemento: { label: 'Complemento', flex: {xs12: true, sm4: true} },
        estado: { label: 'UF', flex: {xs12: true, sm4: true} },
        municipio: { label: 'Município', flex: {xs12: true, sm4: true} }
      },
      rules: { cpf: 'required', rg: 'required', nome: 'required', dataNascimento: 'required', rua: 'required' },
      messages: {
        'cpf.required': 'O CPF é obrigatório',
        'rg.required': 'O RG é obrigatório',
        'nome.required': 'O nome é obrigatório',
        'dataNascimento.required': 'A data de nascimento é obrigatória',
        'rua.required': 'A rua é obrigatória'
      },
      parentErrors: []
    },
    filters: {
      model: {
        codigo: null,
        nome: ''
      },
      fields: {
        codigo: { label: 'código', type: 'number', flex: {xs12: true, sm4: true} },
        nome: { label: 'nome', flex: {xs12: true, sm4: true} }
      },
      searchedFields: {}
    },
    loading: 0,
    alunosPage: {},
    headers: [
      {
        text: 'Código',
        align: 'left',
        sortable: false,
        value: 'id'
      },
      {
        text: 'Nome',
        align: 'left',
        sortable: false,
        value: 'nome'
      }
    ],
    pagination: {
      page: 1,
      rowsPerPage: 10
    },
    isShowModal: false
  }
}
export default {

  data: getDefaultData,
  apollo: {
    $loadingKey: 'loading',
    alunosPage: {
      query: gql`query AlunosPage($page: Int, $size: Int, $filtersInput: AlunoFiltersInput){
        alunosPage(page:$page, size:$size, filtersInput:$filtersInput){
          alunos {
            id,
            cpf,
            rg,
            nome,
            dataCadastro,
            dataNascimento,
            nomeMae,
            nomePai,
            rua,
            numero,
            complemento,
            estado,
            municipio
          },
          totalItems,
          errors {
            key
            value
          }
        }
      }`,
      variables () {
        return {
          page: this.pagination.page,
          size: this.pagination.rowsPerPage,
          filtersInput: {
            id: !this.filters.searchedFields.codigo ? null : this.filters.searchedFields.codigo,
            nome: this.filters.searchedFields.nome
          }
        }
      },
      result ({ data, loader, networkStatus }) {
        const errors = _.get(data, 'alunosPage.errors', [])
        if (errors.length > 0 && errors[0].key === 'user.unauthenticated') {
          this.$router.push('/logout')
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    fetchForm (item) {
      this.$http.get(`${this.resource}/form`, {
        params: {id: item.id}
      }).then(({data}) => {
        this.form = data
      })
    },
    cleanParentErrors () {
      this.from.parentErrors = []
    },
    hasError (errors) {
      if (errors && errors.length > 0) {
        this.form.parentErrors = global.helper.parseErrors(errors)
        return true
      }
      return false
    },
    getInput () {
      return {
        cpf: this.form.model.cpf.replace(/\D+/g, ''),
        rg: this.form.model.rg,
        nome: this.form.model.nome,
        dataNascimento: new Date(this.form.model.dataNascimento).toUTCString(),
        nomeMae: this.form.model.nomeMae,
        nomePai: this.form.model.nomePai,
        rua: this.form.model.rua,
        numero: this.form.model.numero,
        complemento: this.form.model.complemento,
        estado: this.form.model.estado,
        municipio: this.form.model.municipio
      }
    },
    isValid (errors) {
      if (errors.length > 0 && errors[0].key === 'user.unauthenticated') {
        this.$router.push('/logout')
        return
      }

      return !this.hasError(errors)
    },
    update () {
      var vm = this
      this.loading = 1
      this.$apollo.mutate({
        mutation: gql`mutation UpdateAluno($id: ID!, $input: AlunoInput){
          updateAluno(id: $id, input:$input) {
            aluno {
              id,
              cpf,
              rg,
              nome,
              dataCadastro,
              dataNascimento,
              nomeMae,
              nomePai,
              rua,
              numero,
              complemento,
              estado,
              municipio
            },
            errors{
              key,
              value
            }
          }
        }`,
        variables: {
          id: this.form.model.id,
          input: this.getInput()
        },
        updateQueries: {
          AlunosPage: (previousResult, { mutationResult }) => {
            const updateAluno = mutationResult.data.updateAluno

            if (updateAluno.errors.length > 0) {
              return previousResult
            }
            const alunosPage = previousResult.alunosPage

            const alunos = _.map(alunosPage.alunos, aluno => {
              return aluno.id === updateAluno.aluno.id ? updateAluno.aluno : aluno
            })

            return {
              alunosPage: {
                __typename: alunosPage.__typename,
                alunos: alunos,
                errors: alunosPage.errors,
                totalItems: alunosPage.totalItems
              }
            }
          }
        }
      }).then(({ data: {updateAluno} }) => {
        vm.loading = 0
        const errors = _.get(updateAluno, 'errors', [])
        if (vm.isValid(errors)) {
          this.isShowModal = false
          this.$store.commit('showMessage', { show: true, success: true, body: 'Aluno atualizado com sucesso!' })
        } else {
          this.scrollTopModal()
        }
      }).catch(() => {
        vm.form.parentErrors = [{message: 'Ocorreu um erro ao atualizar o aluno no sistema. Procure o administrador do sistema.'}]
      })
    },
    create () {
      var vm = this
      this.loading = 1
      this.$apollo.mutate({
        mutation: gql`mutation CreateAluno($input: AlunoInput){
          createAluno(input:$input) {
            aluno {
              id,
              cpf,
              rg,
              nome,
              dataCadastro,
              dataNascimento,
              nomeMae,
              nomePai,
              rua,
              numero,
              complemento,
              estado,
              municipio
            },
            errors{
              key,
              value
            }
          }
        }`,
        variables: {
          input: this.getInput()
        },
        updateQueries: {
          AlunosPage: (previousResult, { mutationResult }) => {
            const createAluno = mutationResult.data.createAluno

            if (createAluno.errors.length > 0) {
              return previousResult
            }
            const alunosPage = previousResult.alunosPage

            return {
              alunosPage: {
                __typename: alunosPage.__typename,
                alunos: [
                  ...alunosPage.alunos,
                  createAluno.aluno
                ],
                errors: alunosPage.errors,
                totalItems: alunosPage.totalItems + 1
              }
            }
          }
        }
      }).then(({ data: {createAluno} }) => {
        vm.loading = 0
        const errors = _.get(createAluno, 'errors', [])
        if (vm.isValid(errors)) {
          this.isShowModal = false
          this.$store.commit('showMessage', { show: true, success: true, body: 'Aluno cadastrado com sucesso!' })
        } else {
          this.scrollTopModal()
        }
      }).catch(() => {
        vm.form.parentErrors = [{message: 'Ocorreu um erro ao cadastrar o aluno no sistema. Procure o administrador do sistema.'}]
      })
    },
    onSave (data) {
      const valid = global.validator.make(this.form.model, this.form.rules, this.form.messages)

      if (!valid.passes()) {
        const errors = valid.getErrors()
        this.form.parentErrors = global.helper.parseFormErrors(errors)
        this.scrollTopModal()
        return
      }

      if (data.id) {
        this.update()
      } else {
        this.create()
      }
    },
    scrollTopModal () {
      this.$refs.modalAluno.$refs.dialog.scrollTop = 0
    },
    showModal (item) {
      if (item) {
        Object.assign(this.form.model, item)
        this.parseFields(this.form.model)
      } else {
        Object.assign(this.form.model, newItem)
      }
      this.form.parentErrors = []
      this.isShowModal = true
      this.$nextTick(() => { this.$refs.modalAluno.$refs.dialog.scrollTop = 0 })
    },
    parseFields (item) {
      item.cpf = conformToMask(item.cpf, this.form.fields.cpf.mask.mask).conformedValue
      item.dataCadastro = new Date(item.dataCadastro).toISOString().substr(0, 10)
      item.dataNascimento = new Date(item.dataNascimento).toISOString().substr(0, 10)
    },
    doSearch () {
      this.filters.searchedFields = Object.assign({}, this.filters.model)
      this.pagination.page = 1
      this.fetchData()
    },
    fetchData () {
      this.$apollo.queries.alunosPage.refetch()
    },
    remove (item) {
      var vm = this
      this.loading = 1
      this.$apollo.mutate({
        mutation: gql`mutation DeleteAluno($id: ID!){
          deleteAluno(id: $id) {
            aluno {
              id
            },
            errors{
              key,
              value
            }
          }
        }`,
        variables: {
          id: item.id
        },
        updateQueries: {
          AlunosPage: (previousResult, { mutationResult }) => {
            const deleteAluno = mutationResult.data.deleteAluno

            if (deleteAluno.errors.length > 0) {
              return previousResult
            }

            const alunosPage = previousResult.alunosPage

            const alunos = _.reject(previousResult.alunosPage.alunos, aluno => aluno.id === deleteAluno.aluno.id)

            return {
              alunosPage: {
                __typename: alunosPage.__typename,
                alunos: alunos,
                errors: alunosPage.errors,
                totalItems: alunosPage.totalItems - 1
              }
            }
          }
        }
      }).then(({ data: {deleteAluno} }) => {
        vm.loading = 0
        const errors = _.get(deleteAluno, 'errors', [])
        if (vm.isValid(errors)) {
          if (this.alunosPage.alunos.length === 0 && this.alunosPage.totalItems > 0) {
            this.pagination.page = 1
          }
          this.isShowModal = false
          this.$store.commit('showMessage', { show: true, success: true, body: 'Aluno removido com sucesso!' })
        } else {
          this.scrollTopModal()
        }
      }).catch(() => {
        vm.loading = 0
        this.$store.commit('showMessage', { show: true, error: true, body: 'Ocorreu um erro ao remover o aluno do sistema. Procure o administrador do sistema.' })
      })
    }
  },
  computed: {
    totalPages () {
      return this.alunosPage.totalItems ? Math.ceil(this.alunosPage.totalItems / this.pagination.rowsPerPage) : 0
    }
  }
}
</script>
