# 🐳 Guia de Deploy com Docker

## 📋 Pré-requisitos

1. **Docker** instalado
2. **Docker Compose** instalado
3. **PostgreSQL externo** (EasyPanel ou outro)
4. **Git** para clonar o repositório

## 🏗️ Estrutura Docker

```
weight-tracker/
├── Dockerfile              # Frontend (React + Nginx)
├── backend/Dockerfile      # Backend (Node.js + Express)
├── docker-compose.yml      # Orquestração (sem PostgreSQL)
├── nginx.conf             # Configuração Nginx (Frontend)
├── nginx-proxy.conf       # Configuração Nginx (Produção)
└── .dockerignore          # Arquivos ignorados no build
```

## 🗄️ Configuração do PostgreSQL

### EasyPanel PostgreSQL

1. **Acesse o EasyPanel**
2. **Crie um banco PostgreSQL** ou use um existente
3. **Anote as credenciais:**
   - Host/IP
   - Porta (geralmente 5432)
   - Usuário
   - Senha
   - Nome do banco

### Configurar Variáveis de Ambiente

Criar arquivo `.env`:

```env
# Database (EasyPanel)
DATABASE_URL=postgresql://username:password@your-easypanel-host:5432/database_name?schema=public

# Backend
NODE_ENV=production
PORT=4000

# Frontend (opcional)
VITE_API_URL=http://localhost:4000
```

## 🚀 Deploy Local

### 1. Configurar Banco de Dados

```bash
# 1. Criar arquivo .env
cp env.example .env

# 2. Editar .env com suas credenciais do EasyPanel
nano .env
```

### 2. Testar Conexão

```bash
# Testar conexão com o banco
docker-compose run --rm backend npx prisma db push

# Ou executar migrations
docker-compose run --rm backend npx prisma migrate deploy
```

### 3. Deploy Completo

```bash
# Build e iniciar serviços
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 🏭 Deploy em Produção

### Opção 1: Docker Compose (Recomendado)

```bash
# 1. Clonar repositório no servidor
git clone <seu-repo>
cd weight-tracker

# 2. Configurar variáveis de ambiente
cp env.example .env
# Editar .env com credenciais do EasyPanel

# 3. Testar conexão com banco
docker-compose run --rm backend npx prisma migrate deploy

# 4. Deploy
docker-compose up -d --build

# 5. Verificar logs
docker-compose logs -f
```

### Opção 2: Docker Swarm

```bash
# 1. Inicializar swarm
docker swarm init

# 2. Deploy stack
docker stack deploy -c docker-compose.yml weight-tracker

# 3. Verificar serviços
docker service ls
```

## 🔧 Configurações

### Variáveis de Ambiente

```env
# Database (EasyPanel)
DATABASE_URL=postgresql://username:password@your-easypanel-host:5432/database_name?schema=public

# Backend
NODE_ENV=production
PORT=4000

# Frontend (opcional)
VITE_API_URL=http://localhost:4000
```

### Portas

- **80**: Frontend (Nginx)
- **4000**: Backend API
- **8080**: Nginx Proxy (produção)

## 🗄️ Banco de Dados (EasyPanel)

### Migrations Automáticas

```bash
# Executar migrations
docker-compose exec backend npx prisma migrate deploy

# Reset database (desenvolvimento)
docker-compose exec backend npx prisma migrate reset
```

### Backup

```bash
# Backup do banco (via EasyPanel ou direto)
pg_dump -h your-easypanel-host -U username -d database_name > backup.sql

# Restore
psql -h your-easypanel-host -U username -d database_name < backup.sql
```

## 🔍 Monitoramento

### Health Checks

```bash
# Verificar saúde dos containers
docker-compose ps

# Health check manual
curl http://localhost:4000/health
```

### Logs

```bash
# Todos os logs
docker-compose logs

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço
docker-compose logs -f backend
```

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Parar todos os serviços
docker-compose down

# Rebuild um serviço
docker-compose build backend

# Executar comando em container
docker-compose exec backend npm run prisma:generate

# Testar conexão com banco
docker-compose run --rm backend npx prisma db push
```

### Produção

```bash
# Deploy com restart
docker-compose up -d --build --force-recreate

# Verificar recursos
docker stats

# Limpar imagens não utilizadas
docker system prune -a
```

## 🔒 Segurança

### Produção

1. **Usar credenciais seguras** do EasyPanel
2. **Configurar SSL/TLS**
3. **Usar secrets do Docker**
4. **Configurar firewall**

### Secrets

```bash
# Criar secret para DATABASE_URL
echo "postgresql://user:pass@host:5432/db" | docker secret create db_url -

# Usar no docker-compose
secrets:
  db_url:
    external: true
```

## 📊 Performance

### Otimizações

- ✅ Multi-stage builds
- ✅ Alpine Linux (imagens menores)
- ✅ Gzip compression
- ✅ Cache de assets estáticos
- ✅ Health checks
- ✅ Rate limiting

### Monitoramento

```bash
# Ver uso de recursos
docker stats

# Ver logs de performance
docker-compose logs -f nginx-proxy
```

## 🆘 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Testar conexão manual
docker-compose run --rm backend npx prisma db push

# Verificar logs do backend
docker-compose logs backend
```

### Erro: "Build failed"

```bash
# Limpar cache
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache

# Verificar Dockerfile
docker-compose build backend
```

### Erro: "Port already in use"

```bash
# Verificar portas em uso
netstat -tulpn | grep :80

# Parar serviços conflitantes
sudo systemctl stop nginx
```

## 🚀 URLs de Acesso

### Local

- **Frontend**: http://localhost
- **Backend**: http://localhost:4000
- **Health**: http://localhost:4000/health

### Produção

- **Frontend**: https://seu-dominio.com
- **Backend**: https://api.seu-dominio.com
- **Health**: https://api.seu-dominio.com/health

## 📝 Checklist de Deploy

- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] PostgreSQL configurado no EasyPanel
- [ ] Variáveis de ambiente configuradas
- [ ] Conexão com banco testada
- [ ] Build bem-sucedido
- [ ] Containers rodando
- [ ] Migrations executadas
- [ ] Health checks passando
- [ ] Frontend acessível
- [ ] API respondendo
- [ ] Logs sem erros
