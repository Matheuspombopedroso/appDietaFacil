# Weight Tracker App

Aplicação para rastreamento de peso e calorias com interface React e backend Node.js.

## 🐳 Deploy com Docker

### Estrutura do Projeto

```
weight-tracker/
├── Dockerfile              # Frontend (React + Nginx) - Local
├── Dockerfile.easypanel    # Frontend (React + Nginx) - EasyPanel
├── backend/Dockerfile      # Backend (Node.js + Express)
├── docker-compose.yml      # Orquestração (Local)
├── nginx.conf             # Configuração Nginx (Local)
├── nginx-easypanel.conf   # Configuração Nginx (EasyPanel)
└── prisma/               # Schema do banco de dados
```

### Deploy Local (Docker Compose)

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd weight-tracker

# 2. Configure as variáveis de ambiente
cp env.example .env
# Edite .env com suas credenciais

# 3. Deploy com Docker Compose
docker compose up -d --build

# 4. Acesse a aplicação
# Frontend: http://localhost
# Backend: http://localhost:4000
```

### Deploy EasyPanel (Separado)

#### 1. Backend Service

- **Dockerfile:** `backend/Dockerfile`
- **Porta:** 4000
- **Variáveis:** `DATABASE_URL`, `NODE_ENV`, `PORT`

#### 2. Frontend Service

- **Dockerfile:** `Dockerfile.easypanel`
- **Porta:** 80
- **Variáveis:** `BACKEND_URL`

#### 3. Banco de Dados

- **PostgreSQL** criado no EasyPanel
- **Migrations** executadas automaticamente

### Variáveis de Ambiente

#### Local (.env)

```env
# Database (Local)
DATABASE_URL=postgresql://postgres:password@postgres:5432/weight_tracker?schema=public

# Backend
NODE_ENV=production
PORT=4000
```

#### EasyPanel Backend

```env
DATABASE_URL=postgresql://username:password@your-easypanel-host:5432/database_name?schema=public
NODE_ENV=production
PORT=4000
```

#### EasyPanel Frontend

```env
BACKEND_URL=https://api.seu-dominio.com
```

## 🛠️ Desenvolvimento Local

### Com Docker

```bash
# Iniciar todos os serviços
docker compose up

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down

# Testar conexão com banco
docker compose run --rm backend npx prisma db push
```

### Sem Docker

```bash
# Backend
cd backend
pnpm install
pnpm run server

# Frontend
pnpm install
pnpm run dev
```

## 📊 Funcionalidades

- ✅ Registro de peso diário
- ✅ Controle de calorias
- ✅ Progresso semanal/mensal
- ✅ Interface responsiva
- ✅ API RESTful
- ✅ Deploy containerizado
- ✅ PostgreSQL externo (EasyPanel)
- ✅ Deploy separado (Frontend/Backend)

## 🏗️ Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL (EasyPanel)
- **Deploy**: Docker + Docker Compose + Nginx

## 🚀 URLs de Acesso

### Local

- **Frontend**: http://localhost
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### EasyPanel

- **Frontend**: https://seu-dominio.com
- **Backend**: https://api.seu-dominio.com
- **Health**: https://api.seu-dominio.com/health

## 📚 Documentação

- [Guia de Deploy Docker](docker-deploy-guide.md)
- [Guia de Deploy EasyPanel](easypanel-deploy-guide.md)
- [Guia de Deploy Nixpacks](deploy-guide.md)
