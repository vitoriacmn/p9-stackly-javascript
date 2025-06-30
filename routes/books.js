// catalogo-api/routes/books.js
const axios = require('axios'); // axios é uma biblioteca JS para fazer requisições HTTP
// criei uma constante chamada axios e importei ela no projeto

async function bookRoutes (fastify, options) {
    fastify.get('/books/search', async (request, reply) => {
        const { isbn, title } = request.query;

        try {
            let result = null;
            if (isbn) {
                const { data } = await
                axios.get('https://openlibrary.org/isbn/${isbn}.jason');
                result = {
                    book_id: data.key,
                    title: data.title,
                    author: data.authors?.[0]?.name || 'Autor desconhecido',
                    isbn,
                };
            } else if (title) {
                const { data } = await
                axios.get('https://openlibrary.org/search.json?title=${encodeURIComponent(title)}');
                if (data.docs.lengh === 0) {
                    return reply.code(404).send({ message: 'Livro não encontrado' });
                }
                const book = data.docs[0];
                result = {
                    book_id: book.key,
                    title: book.title,
                    author: book.author_name?.[0] || 'Autor desconhecido',
                    isbn: book.isbn?.[0],
                };
            } else {
                return reply.code(400).send({ error: 'Forneça um título ou ISBN' });
            }
            
            return reply.send(result);
        } catch (err) {
            return reply.code(500).send({ error: 'Erro ao buscar livro' });
        }
    });
}
module.exports = bookRoutes;
