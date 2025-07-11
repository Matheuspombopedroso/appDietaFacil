# Weight Tracker App

Aplicação para rastreamento de peso e calorias com interface React e backend Node.js.

## 🚀 Deploy com Nixpacks

### Estrutura do Projeto

```
weight-tracker/
├── src/                 # Frontend React
├── backend/            # Backend Node.js + Express
├── prisma/            # Schema do banco de dados
├── nixpacks.toml      # Configuração Nixpacks (Frontend)
└── backend/nixpacks.toml  # Configuração Nixpacks (Backend)
```

### Deploy no Railway

#### 1. Backend

```bash
# 1. Conectar repositório ao Railway
# 2. Configurar variáveis de ambiente:
DATABASE_URL=postgresql://...
PORT=4000
NODE_ENV=production

# 3. Nixpacks detectará automaticamente:
# - Node.js project
# - Prisma migrations
# - TypeScript build
```

#### 2. Frontend

```bash
# 1. Conectar repositório ao Railway
# 2. Nixpacks detectará automaticamente:
# - React + Vite
# - Build process
# - Static files
```

### Variáveis de Ambiente

#### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=4000
NODE_ENV=production
```

#### Frontend

Configure a URL da API no arquivo de configuração do Vite.

## 🛠️ Desenvolvimento Local

### Backend

```bash
cd backend
pnpm install
pnpm run server
```

### Frontend

```bash
pnpm install
pnpm run dev
```

## 📊 Funcionalidades

- ✅ Registro de peso diário
- ✅ Controle de calorias
- ✅ Progresso semanal/mensal
- ✅ Interface responsiva
- ✅ API RESTful

## 🏗️ Tecnologias

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL
- **Deploy**: Railway + Nixpacks
