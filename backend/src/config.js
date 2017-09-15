module.exports = {
  server: {
    host: 'localhost',
    port: process.env.PORT || 4000
  },
  auth: {
    secret: process.env.AUTH_SECRET || 'ce6338773e217172333e4e620019a62e',
    expiresIn: 86400 // expira em 24 horas
  }
};
