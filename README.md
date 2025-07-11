# Weight Tracker App

Aplicação para rastreamento de peso e calorias com interface React e backend Node.js.

## 🐳 Deploy com Docker

### Estrutura do Projeto

```
weight-tracker/
├── Dockerfile              # Frontend (React + Nginx)
├── backend/Dockerfile      # Backend (Node.js + Express)
├── docker-compose.yml      # Orquestração (sem PostgreSQL)
├── nginx.conf             # Configuração Nginx
└── prisma/               # Schema do banco de dados
```

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **PostgreSQL** configurado no EasyPanel
- **Credenciais** do banco de dados

### Deploy Rápido

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd weight-tracker

# 2. Configure as variáveis de ambiente
cp env.example .env
# Edite .env com suas credenciais do EasyPanel

# 3. Teste a conexão com o banco
docker-compose run --rm backend npx prisma migrate deploy

# 4. Deploy com Docker Compose
docker-compose up -d --build

# 5. Acesse a aplicação
# Frontend: http://localhost
# Backend: http://localhost:4000
```

### Variáveis de Ambiente

Criar arquivo `.env`:

```env
# Database (EasyPanel PostgreSQL)
DATABASE_URL=postgresql://username:password@your-easypanel-host:5432/database_name?schema=public

# Backend
NODE_ENV=production
PORT=4000

# Frontend (opcional)
VITE_API_URL=http://localhost:4000
```

## 🛠️ Desenvolvimento Local

### Com Docker

```bash
# Iniciar todos os serviços
docker-compose up

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Testar conexão com banco
docker-compose run --rm backend npx prisma db push
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

## 🏗️ Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL (EasyPanel)
- **Deploy**: Docker + Docker Compose + Nginx

## 🚀 URLs de Acesso

- **Frontend**: http://localhost
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 📚 Documentação

- [Guia de Deploy Docker](docker-deploy-guide.md)
- [Guia de Deploy Nixpacks](deploy-guide.md)
