// catalogo-api/routes/books.js
const axios = require('axios'); // axios é uma biblioteca JS para fazer requisições HTTP
// criei uma constante chamada axios e importei ela no projeto

async function bookRoutes (fastify, options) {
    fastify.get('/search', {
        schema: {
            description: 'Busca um livro pelo título ou ISBN usando a API da Open Library',
            querystring: {
                type: 'object',
                properties: {
                    isbn: { type: 'string', description: 'Código ISBN do Livro'},
                    title: { type: 'string', description: 'Título do Livro'},
                },
            oneOf: [
                { required: ['isbn']},
                { required: ['title']}
            ]
            },
        response: {
            200: {
                description: 'Livro encontrado',
                type: 'object',
                properties: {
                    book_id: {type: 'string'},
                    title: {type: 'string'},
                    author: {type: 'string'},
                    isbn: {type: 'string'}
                }
            },
            400: {
                description: 'Erro de validação',
                type: 'object',
                properties: {
                    error: {type: 'string'}
                }
            },
            404: {
                description: 'Livro não encontrado',
                type: 'object',
                properties: {
                    error: {type: 'string'}
                }
            },
            500: {
                description: 'Erro interno',
                type: 'object',
                properties: {
                    error: {type: 'string'},
                    detalhe: { type: 'string' },
                    stack: { type: 'string' }
                }
            }
        }
        }
    },
        
    async (request, reply) => {
        const { isbn, title } = request.query;

        try {
            let result = null;
            if (isbn) {
                const { data } = await
                axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
                let authorName = 'Autor desconhecido';
                const authorKey = data.authors?.[0]?.key

                if (authorKey) {
                    try {
                        const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
                        authorName = authorResponse.data.name;
                    } catch (err) {
                        console.warn('Erro ao buscar nome do author:', err.message);
                    }
                }
                result = {
                    book_id: data.key,
                    title: data.title,
                    author: authorName,
                    isbn,
                };
            } else if (title) {
                const { data } = await
                axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
                if (data.docs.length === 0) {
                    return reply.code(404).send({ error: 'Livro não encontrado' });
                }
                const book = data.docs[0];
                result = {
                    book_id: book.key,
                    title: book.title,
                    author: book.author_name?.[0] || 'Autor desconhecido',
                    isbn: book.isbn?.[0]
                };
            } else {
                return reply.code(400).send({ error: 'Forneça um título ou ISBN' });
            }
            
            return reply.send(result);
        } catch (err) {
            return reply.code(500).send({
            error: 'Erro ao buscar livro',
            detalhe: err.message,
            stack: err.stack // mostra o rastreio do erro
        });
        }
    });
}
module.exports = bookRoutes;
