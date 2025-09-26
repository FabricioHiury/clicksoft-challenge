# 🏫 Clicksoft Challenge - API de Alocação de Salas

Sistema de gerenciamento de alunos, professores e salas de aula desenvolvido com AdonisJS e PostgreSQL.

## 👨‍💻 Autor

**Fabricio Hiury**  
📧 fabricio.feo@outlook.com

## 📋 Sobre o Projeto

Esta API foi desenvolvida como parte do desafio técnico da Clicksoft, implementando um sistema completo de gerenciamento educacional que permite:

- Cadastro e gerenciamento de alunos
- Cadastro e gerenciamento de professores
- Criação e administração de salas de aula
- Alocação e desalocação de alunos em salas
- Consultas e relatórios detalhados

## 🚀 Tecnologias Utilizadas

- **[AdonisJS 5](https://adonisjs.com/)** - Framework Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Lucid ORM](https://lucid.adonisjs.com/)** - ORM para AdonisJS
- **[Docker](https://www.docker.com/)** - Containerização
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **[Luxon](https://moment.github.io/luxon/)** - Manipulação de datas

## 🏗️ Arquitetura do Projeto

```
clicksoft-challenge/
├── app/
│   ├── Controllers/Http/          # Controllers da aplicação
│   │   ├── StudentsController.ts  # Gerenciamento de alunos
│   │   ├── TeachersController.ts  # Gerenciamento de professores
│   │   └── RoomsController.ts     # Consultas de salas
│   ├── DTOs/                      # Data Transfer Objects
│   │   ├── StudentDTO.ts          # DTO para transferência de dados do aluno
│   │   ├── TeacherDTO.ts          # DTO para transferência de dados do professor
│   │   └── RoomDTO.ts             # DTO para transferência de dados da sala
│   ├── Models/                    # Modelos de dados
│   │   ├── Student.ts             # Modelo do aluno
│   │   ├── Teacher.ts             # Modelo do professor
│   │   └── Room.ts                # Modelo da sala
│   ├── Repositories/              # Camada de acesso a dados
│   │   ├── StudentRepository.ts   # Repositório de alunos
│   │   ├── TeacherRepository.ts   # Repositório de professores
│   │   └── RoomRepository.ts      # Repositório de salas
│   ├── Services/                  # Serviços de negócio
│   │   ├── AllocationService.ts   # Serviço de alocação de alunos
│   │   ├── ValidationService.ts   # Serviço de validação
│   │   └── DependencyContainer.ts # Container de dependências
│   ├── UseCases/                  # Casos de uso da aplicação
│   │   ├── Student/               # Casos de uso de alunos
│   │   ├── Teacher/               # Casos de uso de professores
│   │   └── Room/                  # Casos de uso de salas
│   ├── Utils/                     # Utilitários
│   │   └── PaginationHelper.ts    # Helper para paginação
│   ├── Validators/                # Validadores de entrada
│   │   ├── StudentValidator.ts    # Validação de dados do aluno
│   │   ├── TeacherValidator.ts    # Validação de dados do professor
│   │   └── RoomValidator.ts       # Validação de dados da sala
│   ├── Exceptions/                # Tratamento de exceções
│   │   ├── Custom/                # Exceções customizadas
│   │   └── Handler.ts             # Handler global de exceções
│   └── Middleware/                # Middlewares da aplicação
│       └── SwaggerMiddleware.ts   # Middleware para documentação Swagger
├── database/
│   ├── migrations/                # Migrações do banco de dados
│   └── factories/                 # Factories para testes
│       ├── StudentFactory.ts      # Factory de alunos
│       ├── TeacherFactory.ts      # Factory de professores
│       └── RoomFactory.ts         # Factory de salas
├── tests/                         # Testes da aplicação
│   ├── functional/                # Testes funcionais (E2E)
│   │   ├── students.spec.ts       # Testes de endpoints de alunos
│   │   ├── teachers.spec.ts       # Testes de endpoints de professores
│   │   └── rooms.spec.ts          # Testes de endpoints de salas
│   └── unit/                      # Testes unitários
│       ├── models/                # Testes dos modelos
│       │   ├── student.spec.ts    # Testes do modelo Student
│       │   ├── teacher.spec.ts    # Testes do modelo Teacher
│       │   └── room.spec.ts       # Testes do modelo Room
│       └── validators/            # Testes dos validadores
│           ├── student_validator.spec.ts  # Testes do StudentValidator
│           ├── teacher_validator.spec.ts  # Testes do TeacherValidator
│           └── room_validator.spec.ts     # Testes do RoomValidator
├── start/
│   ├── routes.ts                  # Definição das rotas
│   └── kernel.ts                  # Configuração de middlewares
├── config/                        # Configurações da aplicação
├── docker-compose.yml             # Configuração do Docker
└── .env                          # Variáveis de ambiente
```

## 📊 Modelo de Dados

### Entidades Principais

- **Students (Alunos)**
  - id, name, email, registration, birth_date
  - Relacionamento N:N com Rooms

- **Teachers (Professores)**
  - id, name, email, registration, birth_date
  - Relacionamento 1:N com Rooms

- **Rooms (Salas)**
  - id, room_number, capacity, is_available, teacher_id
  - Relacionamento N:1 com Teachers
  - Relacionamento N:N com Students

## 🛠️ Boas Práticas Implementadas

### 🏛️ Arquitetura
- **MVC Pattern**: Separação clara entre Models, Views e Controllers
- **Repository Pattern**: Abstração da camada de dados através de repositórios dedicados
- **Service Layer**: Lógica de negócio encapsulada em serviços especializados
- **Use Cases Pattern**: Casos de uso bem definidos para cada funcionalidade
- **DTO Pattern**: Data Transfer Objects para transferência segura de dados
- **Validation Layer**: Validadores dedicados para cada entidade
- **RESTful API**: Endpoints seguindo padrões REST

### 🔒 Segurança
- **Validação de Dados**: Validação rigorosa de entrada em todos os endpoints
- **Sanitização**: Limpeza automática de dados de entrada
- **Constraints de Banco**: Validações a nível de banco de dados
- **Tratamento de Erros**: Respostas padronizadas para diferentes tipos de erro

### 📝 Código
- **TypeScript**: Tipagem estática para maior segurança
- **Nomenclatura Consistente**: Padrões claros de nomenclatura
- **Comentários Descritivos**: Documentação inline dos requisitos funcionais
- **Estrutura Modular**: Organização lógica dos arquivos

### 🗄️ Banco de Dados
- **Migrations**: Controle de versão do schema do banco
- **Relacionamentos**: Uso adequado de chaves estrangeiras
- **Índices**: Otimização de consultas
- **Constraints**: Validações de integridade referencial

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 22 LTS ou superior)
- Docker e Docker Compose
- Git

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd clicksoft-challenge
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=your-app-key-here
DB_CONNECTION=pg

# Database
PG_HOST=127.0.0.1
PG_PORT=5433
PG_USER=clicksoft_user
PG_PASSWORD=clicksoft_password
PG_DB_NAME=clicksoft_db
```

### 4. Inicie o Banco de Dados

```bash
docker-compose up -d
```

### 5. Execute as Migrations

```bash
node ace migration:run
```

### 6. Inicie o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

A API estará disponível em: `http://localhost:3333`

## 📚 Documentação da API

### Endpoints Principais

#### 👨‍🎓 Alunos (`/api/students`)

- `POST /` - Cadastrar aluno
- `GET /:id` - Consultar dados do aluno
- `PUT /:id` - Atualizar dados do aluno
- `DELETE /:id` - Excluir aluno
- `GET /:id/rooms` - Listar salas do aluno

#### 👨‍🏫 Professores (`/api/teachers`)

- `POST /` - Cadastrar professor
- `GET /:id` - Consultar dados do professor
- `PUT /:id` - Atualizar dados do professor
- `DELETE /:id` - Excluir professor
- `GET /:id/rooms` - Listar salas do professor
- `POST /:id/rooms` - Criar sala
- `PUT /:id/rooms/:roomId` - Atualizar sala
- `DELETE /:id/rooms/:roomId` - Excluir sala
- `POST /:id/rooms/:roomId/students` - Alocar aluno na sala
- `DELETE /:id/rooms/:roomId/students` - Desalocar aluno da sala
- `GET /:id/rooms/:roomId/students` - Listar alunos da sala

#### 🏫 Salas (`/api/rooms`)

- `GET /` - Listar todas as salas disponíveis
- `GET /:id` - Consultar detalhes de uma sala

### Exemplos de Uso

#### Cadastrar um Aluno

```bash
curl -X POST http://localhost:3333/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "registration": "ALU001",
    "birthDate": "1995-05-15"
  }'
```

#### Criar uma Sala

```bash
curl -X POST http://localhost:3333/api/teachers/1/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "A101",
    "capacity": 30,
    "isAvailable": true
  }'
```

#### Alocar Aluno na Sala

```bash
curl -X POST http://localhost:3333/api/teachers/1/rooms/1/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1
  }'
```

## 🧪 Testes

O projeto possui uma suíte completa de testes que garante a qualidade e confiabilidade do código:

### Tipos de Testes

#### 🔧 Testes Unitários (`/tests/unit/`)
- **Modelos**: Testes para validar a lógica dos modelos de dados
  - `student.spec.ts` - Testes do modelo Student
  - `teacher.spec.ts` - Testes do modelo Teacher  
  - `room.spec.ts` - Testes do modelo Room
- **Validadores**: Testes para validar as regras de negócio
  - `student_validator.spec.ts` - Testes do StudentValidator
  - `teacher_validator.spec.ts` - Testes do TeacherValidator
  - `room_validator.spec.ts` - Testes do RoomValidator

#### 🌐 Testes Funcionais (`/tests/functional/`)
- **Endpoints**: Testes end-to-end dos endpoints da API
  - `students.spec.ts` - Testes dos endpoints de alunos
  - `teachers.spec.ts` - Testes dos endpoints de professores
  - `rooms.spec.ts` - Testes dos endpoints de salas

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Cobertura de Testes

Os testes cobrem:
- ✅ Criação, leitura, atualização e exclusão de entidades
- ✅ Validação de dados de entrada
- ✅ Relacionamentos entre modelos
- ✅ Regras de negócio específicas
- ✅ Tratamento de erros e exceções
- ✅ Endpoints da API com diferentes cenários

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor em modo produção
- `npm test` - Executa os testes

## 🐳 Docker

O projeto inclui configuração Docker para facilitar o desenvolvimento:

```yaml
# docker-compose.yml
services:
  postgres:    # Banco PostgreSQL na porta 5432
  adminer:     # Interface web para o banco na porta 8080
```

Acesse o Adminer em: `http://localhost:8080`

## 📋 Requisitos Funcionais Implementados

- ✅ **RF01**: Permitir que aluno se cadastre na aplicação
- ✅ **RF02**: Permitir que aluno edite seus dados de cadastro
- ✅ **RF03**: Permitir que aluno exclua seus dados de cadastro
- ✅ **RF04**: Permitir que aluno consulte seus dados de cadastro
- ✅ **RF05**: Permitir que professor se cadastre na aplicação
- ✅ **RF06**: Permitir que professor edite seus dados de cadastro
- ✅ **RF07**: Permitir que professor exclua seus dados de cadastro
- ✅ **RF08**: Permitir que professor consulte seus dados de cadastro
- ✅ **RF09**: Permitir que professor crie uma sala
- ✅ **RF10**: Permitir que professor edite uma sala
- ✅ **RF11**: Permitir que professor exclua uma sala
- ✅ **RF12**: Permitir que professor consulte todas as suas salas
- ✅ **RF13**: Permitir que professor aloque um aluno em uma sala
- ✅ **RF14**: Permitir que professor desaloque um aluno de uma sala
- ✅ **RF15**: Permitir que professor consulte todos os alunos de uma sala
- ✅ **RF16**: Permitir que aluno consulte todas as salas que deverá comparecer

## 📞 Contato

**Fabricio Hiury**  
📧 fabriciohiury@email.com  
🔗 [LinkedIn](https://linkedin.com/in/fabriciohiury)  
🐙 [GitHub](https://github.com/fabriciohiury)

---