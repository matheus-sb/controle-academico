
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('usuarios', (table) => {
        table.increments();
        table.timestamps();
        table.string('cpf').unique().notNullable();
        table.string('nome').notNullable();
        table.string('senha').notNullable();
        table.string('tipo_usuario').notNullable();
        }),
    ])  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('usuarios')
  ]);  
};
