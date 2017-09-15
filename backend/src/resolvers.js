const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),  
  Query: {
    async users(root, args, cxt) {
      return cxt.Users.getAll();
    },
    getAllAlunos: (root, args, cxt) => {
      const errors = [];
      
      return cxt.Users.isAuthenticated(cxt.token)
        .then(user => {
          return cxt.Alunos.getAll()
            .then(alunos => ({alunos}))
            .catch((err) => {
              throw new Error(err);
            })

        })
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { alunos: null, errors };
          }
          throw new Error(err);
        });         
    },
    alunosPage: (root, {page = 0, size, filtersInput}, cxt) => {
      const errors = [];
      return cxt.Users.isAuthenticated(cxt.token)
        .then(user => {
          return cxt.Alunos.getAlunosByPageAndFilters(page, size, filtersInput)
            .then((alunos) => {
              return Object.assign({}, {alunos, filtersInput, errors});
            })
            .catch((err) => {
              throw new Error(err);
            });
        })
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { alunos: null, errors };
          }
          throw new Error(err);
        });
    }
  },
  Mutation: {
    signIn(root, args, cxt) {
      const errors = [];

      return cxt.Users.signIn(args)
        .then(token => ({
          token,
          errors
        }))
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { token: null, errors };
          }

          throw new Error(err);
        });
    },
    createAluno(root, {input}, cxt) {
      const errors = [];

      return cxt.Users.isAuthenticated(cxt.token)
        .then(user => {
          return cxt.Alunos.create(input)
            .then(aluno => ({
              aluno,
              errors
            }))
            .catch((err) => {
              if (err.code && err.message) {
                errors.push({
                  key: err.code,
                  value: err.message
                });

                return { aluno: null, errors };
              }

              throw new Error(err);
            });
        })
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { aluno: null, errors };
          }
          throw new Error(err);
        });            
    },
    updateAluno(root, args, cxt) {
      const errors = [];

      return cxt.Users.isAuthenticated(cxt.token)
        .then(user => {
          
          return cxt.Alunos.update(args)
            .then(aluno => ({
              aluno,
              errors
            }))
            .catch((err) => {
              if (err.code && err.message) {
                errors.push({
                  key: err.code,
                  value: err.message
                });

                return { aluno: null, errors };
              }

              throw new Error(err);
            });
        })
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { aluno: null, errors };
          }
          throw new Error(err);
        });
    },
    deleteAluno(root, args, cxt) {
      const errors = [];

      return cxt.Users.isAuthenticated(cxt.token)
        .then(user => {
          
          return cxt.Alunos.delete(args.id)
            .then(aluno => ({
              aluno,
              errors
            }))
            .catch((err) => {
              if (err.code && err.message) {
                errors.push({
                  key: err.code,
                  value: err.message
                });

                return { aluno: null, errors };
              }

              throw new Error(err);
            });
        })
        .catch((err) => {
          if (err.code && err.message) {
            errors.push({
              key: err.code,
              value: err.message
            });

            return { aluno: null, errors };
          }
          throw new Error(err);
        });
    }  
  },
  AlunosPage: {
    totalItems: async ({filtersInput, errors}, args, cxt) => {
      
      if (errors && errors.length > 0){
        return 0;
      }

      var result = await cxt.Alunos.countAlunosByFilters(filtersInput);

      return result[0].count;
    }
  }
};

module.exports = resolvers;
