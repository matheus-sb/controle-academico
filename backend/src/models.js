const knex = require('./connector');

const {
  createToken,
  verifyToken,
  encryptPassword,
  comparePassword
} = require('./utils/auth');

exports.Users = class Users {
  signIn(args) {
    return new Promise((resolve, reject) => {
      
      // validar dados
      if (!args.cpf) {
        return reject({
          code: 'cpf.vazio',
          message: 'O cpf está vazio.'
        });
      }

      if (!args.senha) {
        return reject({
          code: 'senha.vazia',
          message: 'A senha está vazia.'
        });
      }

      // Achando o usuário
      return knex('usuarios').where({cpf: args.cpf})
        .then(([usuario]) => {
          
          if (!usuario) {
            return reject({
              code: 'usuario.nao_encontrado',
              message: 'Falha na autenticação. Usuário não encontrado.'
            });
          }

          return comparePassword(usuario.senha, args.senha, (err, isMatch) => {
            
            if (err) { return reject(err); }
            if (!isMatch) {
              return reject({
                code: 'senha.invalida',
                message: 'Senha inválida.'
              });
            }

            return resolve(createToken({ id: usuario.id, cpf: usuario.cpf }));
          });
        })
        .catch(err => reject(err));
    });
  }
  isAuthenticated(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject({
          code: 'token.empty',
          message: 'The user token is empty.'
        });
      }

      return verifyToken(token, (err, decoded) => {
        if (err) {
          return reject({
            code: 'user.unauthenticated',
            message: 'You must be authenticated.'
          });
        }

        return resolve(decoded);
      });
    });
  }
  getAll() {              
    const query = knex('usuarios');        
    return query.then(rows => (rows || []));
  }    
};

const fields = [
  'id', 'cpf', 'rg', 'nome', 'data_cadastro as dataCadastro',
  'data_nascimento as dataNascimento', 'nome_mae as nomeMae',
  'nome_pai as nomePai', 'rua', 'numero', 'complemento', 
  'estado','municipio'
];

function getQueryAlunosByFilters(filters) {
  const query = knex('alunos');
  
  query.where('ativo', true);

  if (filters.id) {
    query.where('id', filters.id);
  }

  if (filters.nome) {
    query.andWhere('nome', 'ilike', `%${filters.nome}%`);
  }

  return query;
}

exports.Alunos = class Alunos {

  getAll() {              
    const query = knex('alunos').select(fields);        
    return query.then(rows => (rows || []));
  }

  getAlunosByPageAndFilters(page, size, filters) {
    const query = getQueryAlunosByFilters(filters);
    query.select(...fields);
    query.orderBy('nome');

    var start = page > 0 ? (page - 1) * size : 0;

    query.limit(size || 'ALL').offset(start);

    return query.then(rows => (rows || []));
  }

  countAlunosByFilters(filters) {
    const query = getQueryAlunosByFilters(filters);

    query.count('id');

    return query.then(rows => (rows || []));
  }

  create(newAluno) {
    return new Promise((resolve, reject) => {

      // Verificando se já foi adicionado aluno com este cpf
      return knex('alunos').count('id').where({cpf: newAluno.cpf})
        .then(([{ count }]) => {

          if (count > 0) {
            return reject({
              code: 'aluno.ja_cadastrado',
              message: 'Já existe aluno cadastrado com esse cpf'
            });
          }
          newAluno.dataCadastro = new Date();

          return knex('alunos').returning(fields).insert(newAluno)
            .then(([aluno]) => {
              return resolve(aluno);
            })
            .catch(err => reject(err));
          })
        .catch(err => reject(err));
    });
  }
  
  update({id, input}) {
    return new Promise((resolve, reject) => {
      
      // Verificando se já foi adicionado aluno com este cpf
      return knex('alunos').count('id').where({cpf: input.cpf}).andWhereNot({id: id})
        .then(([{ count }]) => {

          if (count > 0) {
            return reject({
              code: 'aluno.ja_cadastrado',
              message: 'Já existe aluno cadastrado com esse cpf'
            });
          }
          
          return knex('alunos').returning(fields).update(input).where('id', id)
            .then(([aluno]) => {
              return resolve(aluno);
            })
            .catch(err => reject(err));
          })
        .catch(err => reject(err));
    });
  }
  delete(id) {
    return new Promise((resolve, reject) => {
      
      knex('alunos').returning(fields).update('ativo', false).where('id', id)
        .then(([aluno]) => {
          return resolve(aluno);
        })
        .catch(err => reject(err));
    });
  }    
};
