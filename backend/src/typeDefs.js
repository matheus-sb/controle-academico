const typeDefs = [/* GraphQL */`
  scalar Date

  # tipo erro.
  type Error {
    key: String
    value: String
  }

  # tipo authenticação.
  type Auth {
    token: String
    errors: [Error]
  }

  # tipo usuário.
  type User {
    id: Int!
    cpf: String!
    nome: String!
    # email: String!
  }

  # input para filtros do usuários
  input AlunoFiltersInput {
    id: Int
    nome: String
  }

  # input aluno
  input AlunoInput {
    cpf: String!
    rg: String!
    nome: String!
    dataNascimento: Date!
    nomeMae: String
    nomePai: String
    rua: String!
    numero: String
    complemento: String
    estado: String
    municipio: String    
  }

  # tipo aluno
  type Aluno {
    id: ID!
    cpf: String!
    rg: String!
    nome: String!
    dataCadastro: Date!
    dataNascimento: Date!
    nomeMae: String
    nomePai: String
    rua: String!
    numero: String
    complemento: String
    estado: String
    municipio: String
  }

  # tipo alunos com total de itens 
  type AlunosPage {
    alunos: [Aluno]
    totalItems: Int!
    errors: [Error]
  }

  type AlunoResult {
    aluno: Aluno,
    errors: [Error]
  }

  type AlunosResult {
    alunos: [Aluno]
    errors: [Error]
  }

  # tipo query.
  type Query {
    # Obtém a lista de usuários.
    users: [User]!

    # Obtém a lista de alunos.
    getAllAlunos: AlunosResult

    # Obtém a lista de alunos por página e filtros
    alunosPage(page: Int, size: Int, filtersInput: AlunoFiltersInput): AlunosPage
  }

  type Mutation {
    # cadastrar.
    # signUp(firstName: String!, lastName: String!, email: String!, password: String!): Auth

    # logar.
    signIn(cpf: String!, senha: String!): Auth

    # cadastrar aluno
    createAluno(input: AlunoInput): AlunoResult

    # atualizar aluno
    updateAluno(id: ID!, input: AlunoInput): AlunoResult

    # remover aluno
    deleteAluno(id: ID!): AlunoResult
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

module.exports = typeDefs;
