# Docker Setup for ClickSoft Challenge

Este projeto inclui configuração Docker otimizada para desenvolvimento e produção.

## Estrutura dos Arquivos Docker

- `Dockerfile` - Multi-stage build para produção
- `Dockerfile.dev` - Imagem para desenvolvimento com hot reload
- `docker-compose.yml` - Configuração para produção
- `docker-compose.dev.yml` - Configuração para desenvolvimento
- `.dockerignore` - Arquivos excluídos do contexto Docker

## Comandos Principais

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Parar ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f app
```

### Produção

```bash
# Iniciar ambiente de produção
docker-compose up --build -d

# Parar ambiente de produção
docker-compose down

# Ver logs
docker-compose logs -f app
```

## Serviços Incluídos

### Aplicação AdonisJS
- **Porta**: 3333
- **Health Check**: Verificação HTTP em `/health`
- **Usuário**: adonisjs (não-root para segurança)

### PostgreSQL
- **Porta**: 5432
- **Database**: clicksoft_db
- **Usuário**: clicksoft_user
- **Senha**: clicksoft_password

### Adminer (Interface Web para PostgreSQL)
- **Porta**: 8080
- **URL**: http://localhost:8080

## Otimizações Implementadas

### Multi-stage Build
- **Stage 1 (Builder)**: Instala dependências e compila TypeScript
- **Stage 2 (Production)**: Imagem final otimizada apenas com arquivos necessários

### Segurança
- Usuário não-root (adonisjs:nodejs)
- Uso do dumb-init para gerenciamento adequado de sinais
- Imagem Alpine Linux (menor superfície de ataque)

### Performance
- Cache de layers Docker otimizado
- Exclusão de arquivos desnecessários via .dockerignore
- Instalação apenas de dependências de produção na imagem final

### Monitoramento
- Health checks configurados para todos os serviços
- Logs estruturados
- Restart automático em caso de falha

## Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
DB_CONNECTION=pg
PG_HOST=postgres
PG_PORT=5432
PG_USER=clicksoft_user
PG_PASSWORD=clicksoft_password
PG_DB_NAME=clicksoft_db
```

## Volumes

- `postgres_data`: Dados persistentes do PostgreSQL (produção)
- `postgres_dev_data`: Dados persistentes do PostgreSQL (desenvolvimento)

## Rede

Todos os serviços estão conectados à rede `clicksoft_network` para comunicação interna.