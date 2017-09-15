
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('alunos', (table) => {
        table.increments();
        table.string('cpf').unique().notNullable();
        table.string('rg');
        table.string('nome').notNullable();
        table.date('data_cadastro').notNullable();
        table.date('data_nascimento').notNullable();
        table.string('nome_mae');
        table.string('nome_pai');
        table.string('rua').notNullable();
        table.string('numero');
        table.string('complemento');
        table.string('estado');
        table.string('municipio')
        table.boolean('ativo').defaultTo(true).notNullable;
        }),
    ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('alunos')
  ]);  
};
