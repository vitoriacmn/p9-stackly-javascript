# Stackly
Programa que serve como um catálogo de livros, uma estante virtual em que o usuário adiciona suas leituras, podendo adicionar em listas de 'favoritos, quero ler, lendo e lido'.
Multi-tenant: cada usuário pode criar suas próprias listas e interagir de forma independente e conjunta.

## Sobre
Este projeto está sendo desenvolvido através de uma API RESTful (com protocolo HTTP => GET, POST, PUT, DELETE), utilizando Fastify que conecta o banco de dados criado no PostegreSQL com a API pública da Open Library.

## Funcionalidades
- Cadastro de usuários (nome / email / senha / gênero favorito);
- Login (email / senha);
- Campo de busca do livro (por nome ou isbn) -> busca na API da Open Library e adiciona o livro ao banco de dados;
- Cards de visualização (listas de lidos, lendo, quero ler e favoritos);
- Usuário - acesso à lista de favoritos (filtros: Ordem Alfabetica, Ordem de Publicação, Mais relevantes, Pesquisa por nome / gênero);
- Permitir seguir outros usuários e ser seguido;
- Permitir comentar e curtir livros; 

## Tecnologias utilizadas
- Banco de dados => PostegreSQL
- Server e API => Node.JS com framework Fastify
- API Pública => Open Library
- Documentação API => Swagger
- Front End => React
