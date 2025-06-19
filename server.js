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

fastify.listen ({ port:3001 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});