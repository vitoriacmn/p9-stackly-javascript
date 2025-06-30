const Fastify = require('fastify');
const fastify = Fastify({
    logger: true
});

const pool = require('./db/connection');

fastify.get('/', async (request, reply) => {
  return { mensagem: 'Bem-vindo à API da biblioteca de livros!' };
});

fastify.get('/db-test', async (request, reply) => {
    try { 
        const result = await pool.query('SELECT NOW()');
        return { conectado: true, data: result.rows[0] };
    }   catch (err) {
        return reply.code(500).send({ conectado: false, erro: err.message });
    }        
});
// rotas externas da open library importadas do arquivo books.js
const bookRoutes = require('./routes/books');
fastify.register(bookRoutes, { prefix: '/books' });

// inicializa o servidor
fastify.listen ({ port:3001 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});