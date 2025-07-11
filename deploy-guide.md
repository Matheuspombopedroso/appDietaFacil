# 🚀 Guia de Deploy com Nixpacks

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Repositório no GitHub
3. PostgreSQL (pode ser provisionado pelo Railway)

## 🎯 Estrutura Configurada

### Backend (`backend/`)

```
backend/
├── nixpacks.toml      # Configuração Nixpacks
├── package.json        # Dependências Node.js
├── tsconfig.json       # Configuração TypeScript
├── src/
│   └── server.ts       # Servidor Express
└── prisma/
    └── schema.prisma   # Schema do banco
```

### Frontend (raiz)

```
/
├── nixpacks.toml      # Configuração Nixpacks
├── package.json        # Dependências React
├── vite.config.ts      # Configuração Vite
└── src/               # Código React
```

## 🔧 Deploy no Railway

### Passo 1: Backend

1. **Conectar ao Railway:**

   ```bash
   # No Railway Dashboard:
   # 1. New Project → Deploy from GitHub repo
   # 2. Selecionar seu repositório
   # 3. Escolher pasta: backend/
   ```

2. **Configurar Variáveis de Ambiente:**

   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   PORT=4000
   NODE_ENV=production
   ```

3. **Nixpacks detectará automaticamente:**
   - ✅ Node.js project
   - ✅ TypeScript compilation
   - ✅ Prisma migrations
   - ✅ Dependências pnpm

### Passo 2: Frontend

1. **Conectar ao Railway:**

   ```bash
   # No Railway Dashboard:
   # 1. New Project → Deploy from GitHub repo
   # 2. Selecionar seu repositório
   # 3. Escolher pasta: / (raiz)
   ```

2. **Nixpacks detectará automaticamente:**
   - ✅ React + Vite
   - ✅ Build process
   - ✅ Static files

## 🔍 Configurações Nixpacks

### Backend (`backend/nixpacks.toml`)

```toml
[phases.setup]
nixPkgs = ["nodejs", "pnpm", "postgresql"]

[phases.install]
cmds = ["pnpm install"]

[phases.build]
cmds = [
  "npx prisma generate",
  "npx prisma migrate deploy"
]

[start]
cmd = "pnpm run start"
```

### Frontend (`nixpacks.toml`)

```toml
[phases.setup]
nixPkgs = ["nodejs", "pnpm"]

[phases.install]
cmds = ["pnpm install"]

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm run preview"
```

## 🗄️ Banco de Dados

### Opção 1: Railway PostgreSQL

1. **Criar banco no Railway:**

   ```bash
   # Railway Dashboard → New → Database → PostgreSQL
   ```

2. **Configurar variável:**
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

### Opção 2: Banco Externo

```env
DATABASE_URL=postgresql://user:password@external-host:5432/database
```

## 🔗 Conectando Frontend e Backend

### Configurar URL da API no Frontend

1. **Criar arquivo de configuração:**

   ```typescript
   // src/config/api.ts
   export const API_URL =
     import.meta.env.VITE_API_URL || "http://localhost:4000";
   ```

2. **Configurar variável no Railway:**
   ```env
   VITE_API_URL=https://seu-backend.railway.app
   ```

## 🧪 Testando o Deploy

### Backend Health Check

```bash
curl https://seu-backend.railway.app/health
# Resposta esperada: {"status":"ok","timestamp":"..."}
```

### Frontend

```bash
# Acessar a URL do Railway
# Deve mostrar a interface React
```

## 🐛 Debugging

### Logs do Railway

```bash
# Railway Dashboard → Seu projeto → Deployments → Logs
```

### Variáveis de Ambiente

```bash
# Railway Dashboard → Variables
# Verificar se DATABASE_URL está configurada
```

### Prisma Migrations

```bash
# Se houver erro de migrations:
# Railway Dashboard → Deployments → View Logs
# Procurar por erros de Prisma
```

## 🚀 URLs Finais

Após o deploy:

- **Backend**: `https://seu-backend.railway.app`
- **Frontend**: `https://seu-frontend.railway.app`
- **API Health**: `https://seu-backend.railway.app/health`

## 📝 Checklist de Deploy

- [ ] Repositório conectado ao Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados provisionado
- [ ] Backend deployado com sucesso
- [ ] Frontend deployado com sucesso
- [ ] API respondendo no endpoint `/health`
- [ ] Frontend conectado ao backend
- [ ] Testes funcionais realizados

## 🆘 Troubleshooting

### Erro: "Prisma Client not generated"

```bash
# Verificar se o comando foi executado:
npx prisma generate
```

### Erro: "Database connection failed"

```bash
# Verificar DATABASE_URL no Railway
# Testar conexão localmente
```

### Erro: "Build failed"

```bash
# Verificar logs do Railway
# Testar build localmente: pnpm run build
```
