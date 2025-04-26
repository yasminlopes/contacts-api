
# Contacts API

Uma API simples para gerenciar contatos, construída com **Fastify** e **Prisma**.

## Sobre o Projeto

Este projeto permite que você crie, atualize, remova e pesquise contatos em um banco de dados. Ele utiliza o **Fastify** como servidor HTTP e **Prisma** como ORM para interagir com o banco de dados.

### Tecnologias Utilizadas

- **Fastify**: Framework rápido e eficiente para Node.js.
- **Prisma**: ORM para facilitar o acesso ao banco de dados e suas operações.
- **Joi**: Biblioteca para validação de dados de entrada.
- **EC2 da AWS**: Instância de servidor onde a API está hospedada.
- **RDS da AWS**: Banco de dados PostgreSQL hospedado na AWS.

## Rotas

### `/contact/search`

**Método**: `GET`

**Descrição**: Retorna uma lista de contatos com base no termo de busca, página e limite.

**Parâmetros de consulta**:

- `term`: (Opcional) Termo de busca para filtrar os contatos.
- `page`: (Opcional) Número da página (padrão: 1).
- `limit`: (Opcional) Número de contatos por página (padrão: 10).

**Exemplo de Requisição**:
```bash
GET /contact/search?term=Teste&page=1&limit=5
```

**Exemplo de resposta**:
```json
{
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "pages": 1
  },
  "data": [
    {
      "guid": "f0ba096f689844f2aa01549bfc93133e",
      "name": "Teste",
      "cpf": "16453285037",
      "email": "",
      "phone": "81988776655",
      "havephoto": false
    }
  ],
  "message": "Contato(s) encontrado(s)"
}
```

---

### `/contact/:guid`

**Método**: `GET`

**Descrição**: Retorna os dados de um contato específico.

**Parâmetros**:
- `guid`: ID único do contato.

**Exemplo de Requisição**:
```bash
GET /contact/f0ba096f689844f2aa01549bfc93133e
```

**Exemplo de resposta**:
```json
{
  "guid": "f0ba096f689844f2aa01549bfc93133e",
  "name": "Teste",
  "cpf": "16453285037",
  "email": "",
  "phone": "81988776655",
  "havephoto": false
}
```

---

### `/contact/:guid/photo`

**Método**: `GET`

**Descrição**: Retorna a foto base64 do contato (se disponível).

**Parâmetros**:
- `guid`: ID único do contato.

**Exemplo de Requisição**:
```bash
GET /contact/f0ba096f689844f2aa01549bfc93133e/photo
```

**Exemplo de resposta**:
```json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/..."
}
```

---

### `/contact/:guid/photo`

**Método**: `PATCH`

**Descrição**: Atualiza a foto do contato. Envia uma string base64 representando a foto.

**Exemplo de Requisição**:
```bash
PATCH /contact/f0ba096f689844f2aa01549bfc93133e/photo
Content-Type: application/json
{
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/..."
}
```

**Exemplo de resposta**:
```json
{
  "message": "Foto atualizada com sucesso."
}
```

---

### `/contact/:guid`

**Método**: `PATCH`

**Descrição**: Atualiza os dados de um contato.

**Parâmetros**:
- `guid`: ID único do contato.

**Exemplo de Requisição**:
```bash
PATCH /contact/f0ba096f689844f2aa01549bfc93133e
Content-Type: application/json
{
  "name": "Novo Nome",
  "email": "novoemail@example.com"
}
```

**Exemplo de resposta**:
```json
{
  "message": "Contato atualizado com sucesso."
}
```

---

### `/contact`

**Método**: `POST`

**Descrição**: Cria um novo contato.

**Exemplo de Requisição**:
```bash
POST /contact
Content-Type: application/json
{
  "name": "Novo Contato",
  "cpf": "12345678901",
  "email": "contato@exemplo.com",
  "phone": "11987654321"
}
```

**Exemplo de resposta**:
```json
{
  "data": {
    "guid": "f0ba096f689844f2aa01549bfc93133e",
    "name": "Novo Contato",
    "cpf": "12345678901",
    "email": "contato@exemplo.com",
    "phone": "11987654321",
    "havephoto": false
  },
  "message": "Contato criado com sucesso."
}
```

---

### `/contact/:guid`

**Método**: `DELETE`

**Descrição**: Exclui um contato.

**Parâmetros**:
- `guid`: ID único do contato.

**Exemplo de Requisição**:
```bash
DELETE /contact/f0ba096f689844f2aa01549bfc93133e
```

**Exemplo de resposta**:
```json
{
  "message": "Contato excluído com sucesso."
}
```

---

### `/contact/:guid/photo`

**Método**: `DELETE`

**Descrição**: Exclui a foto de um contato.

**Parâmetros**:
- `guid`: ID único do contato.

**Exemplo de Requisição**:
```bash
DELETE /contact/f0ba096f689844f2aa01549bfc93133e/photo
```

**Exemplo de resposta**:
```json
{
  "message": "Foto excluída com sucesso."
}
```

---

## Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
DOCUMENT_NUMBER="16453285037"  # Exemplo de número de documento (CPF)
```
`DOCUMENT_NUMBER`: Esta variável de ambiente armazena o número de documento (CPF) que será utilizado para autenticação através de um token base64. O middleware da aplicação vai verificar se o número decodificado do token corresponde a esse valor, garantindo a segurança da API.

### 2. Prisma

Execute as migrações para configurar o banco de dados:

```bash
npx prisma migrate dev
```

### 3. Iniciando o Servidor

Para iniciar o servidor, use o comando:

```bash
npm run dev
```

Isso iniciará o servidor localmente. As rotas estarão disponíveis em `http://0.0.0.0:3333`.