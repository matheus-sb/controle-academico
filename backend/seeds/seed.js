
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  Promise.all([
    knex('usuarios').del(),
    knex('alunos').del(),
  ])
    .then(() =>{
      return knex('usuarios').insert([
        {created_at: new Date(), updated_at: new Date(), cpf: '12345678901', nome: 'Matheus Barbosa', senha: '$2a$10$bAy1FlmvPF/Ndha3nfHf/ewVc4TIytlO3nQn9uTdlFbf9.b583Nxa', tipo_usuario: 'COLABORADOR'},
        {created_at: new Date(), updated_at: new Date(), cpf: '09876543210', nome: 'Juliet Barbosa', senha: '$2a$10$EGP5xefH5Ezad3V2wzvQkuARTJr9Ve7s77xH41CV.dcau92tWSjI2', tipo_usuario: 'COLABORADOR'}
      ]);
    })
    .then(() => {
      return knex('alunos').insert([
        {cpf: '90725126507', rg: '123456', nome: 'Douglas Barbosa Pinto', data_cadastro: new Date(), data_nascimento: new Date(2000, 11, 30), nome_mae: 'Maria Barbosa Pinto', nome_pai: 'João Barbosa Pinto', rua: 'Telegrafista João Oscar', numero: '677', estado: 'MG', municipio: 'Campo Belo', ativo: true},
        {cpf: '49926424546', rg: 'MG123456', nome: 'Lavinia Martins Ferreira', data_cadastro: new Date(), data_nascimento: new Date(1987, 5, 10), nome_mae: 'Maria Martins Ferreira', nome_pai: 'João Martins Ferreira', rua: 'Agostinho Rodrigues Marques', numero: '5678', estado: 'SP', municipio: 'São Paulo', ativo: true}
      ]);
    });
};
