const Client = require('knex/lib/dialects/postgres');
const Formatter = require('knex/lib/formatter');
// Update with your config settings.
var parse = require('pg-connection-string').parse;

// sobrescreve função para converter camelCase em underline
Client.prototype.wrapIdentifier = (value) => {
  if (value === '*') return value;
  const matched = value.match(/(.*?)(\[[0-9]\])/);
  if (matched) return Client.prototype.wrapIdentifier.wrapIdentifier(matched[1]) + matched[2];
  return `"${value.replace(/([A-Z])/g, (_, s) => `_${s.toLowerCase()}`).replace(/"/g, '""')}"`;
};

// sobrescreve função para converter camelCase em underline
Formatter.prototype.wrapAsIdentifier = value => `"${(value || '').replace(/"/g, '""')}"`;

const DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/controle-academico'; //process.env.DATABASE_URL;

module.exports = {

  development: {
    client: Client,
    connection: Object.assign({}, parse(DATABASE_URL))
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
