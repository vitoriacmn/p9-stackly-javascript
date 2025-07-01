const Fastify = require('fastify');
const fastify = Fastify({
    logger: true,
    exposeHeadRoutes: false
});
// documentação com swagger
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');

fastify.register(fastifySwagger, {
    swagger: {
        info: {
            title: 'API Stackly',
            description: 'Busca de livros por ISBN ou título usando a Open Library',
            version: '1.0'
        },
        host: 'localhost:3001',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
    }

});

fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs', 
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    }
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