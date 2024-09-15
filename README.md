<br> <h2>🛠️ Como rodar o projeto</h2>
Clone o repositório: <code>git clone https://github.com/Yaguera/EcommercePrototypeAPI.git</code><br>

Entre no diretório do projeto: <code>cd EcommercePrototypeAPI</code>

1. Run `npm i` command
3. Run `docker-compose up -d` command
4. Run `npm run dev` command

   #### OBS: NECESSÁRIO DOCKER E NODEJS INSTALADO !

# Sobre o Projeto

Este projeto é uma API para gestão de pedidos e controle de estoque de produtos, o foco do projeto está na integração de sistemas por meio do RabbitMQ, uma ferramenta que ajuda a verificar a quantidade de produtos no estoque de maneira eficiente, antes de confirmar um pedido. A ideia principal foi garantir que, através da integração por mensageria, seja verificado a quantidade de produtos e garantir que sempre haja estoque disponível para os pedidos, sem sobrecarregar o sistema pois caso vários pedidos sejam feitos ao mesmo tempo, a fila de mensagens dará conta de processá-los assincronamente.

## Tecnologias Utilizadas

<ul>
   <li>Node.js (Framework Express)</li>
   <li>TypeScript</li>
   <li>TypeORM</li>
   <li>PostgreSQL</li>
   <li>RabbitMQ (Mensageria)</li>
   <li>JWT (Autenticação)</li>
   <li>Docker e Docker-Compose</li>
</ul>






<h2>🚀 Rotas da API</h2>

<h3>1. Rotas de Autenticação de Usuário</h3>

<table>
  <thead>
    <tr>
      <th>Método</th>
      <th>Rota</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/user/signup</td>
      <td>Cadastrar um novo usuário</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/user/login</td>
      <td>Login do usuário</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/user/profile</td>
      <td>Retorna dados do usuário</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/user/users</td>
      <td>Retornar todos os usuários</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/user/update/:id</td>
      <td>Atualizar dados do usuário</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/user/delete/:id</td>
      <td>Deletar usuário</td>
    </tr>
  </tbody>
</table>

<h3>2. Rotas de Pedidos</h3>

<table>
  <thead>
    <tr>
      <th>Método</th>
      <th>Rota</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/pedidos/create</td>
      <td>Criar um pedido</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/pedidos/all</td>
      <td>Mostrar todos os pedidos</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/pedidos/update/:id</td>
      <td>Atualizar um pedido</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/pedidos/delete/:id</td>
      <td>Deletar um pedido</td>
    </tr>
  </tbody>
</table>

<h3>3. Rotas de Produtos</h3>

<table>
  <thead>
    <tr>
      <th>Método</th>
      <th>Rota</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/produto/create</td>
      <td>Criar um produto</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/produto/all</td>
      <td>Mostrar todos os produtos</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/produto/update/:id</td>
      <td>Atualizar um produto</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/produto/delete/:id</td>
      <td>Deletar um produto</td>
    </tr>
  </tbody>
</table>

<h3>4. Rotas de Categorias</h3>

<table>
  <thead>
    <tr>
      <th>Método</th>
      <th>Rota</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/categoria/create</td>
      <td>Criar uma categoria</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/categoria/all</td>
      <td>Mostrar todas as categorias</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/categoria/update/:id</td>
      <td>Atualizar uma categoria</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/categoria/delete/:id</td>
      <td>Deletar uma categoria</td>
    </tr>
  </tbody>
</table>



