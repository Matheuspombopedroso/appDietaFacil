# 🚀 Deploy Separado no EasyPanel

## 📋 Estrutura do Deploy

### Backend Service

- **Dockerfile:** `backend/Dockerfile`
- **Porta:** 4000
- **Banco:** PostgreSQL do EasyPanel

### Frontend Service

- **Dockerfile:** `Dockerfile.easypanel`
- **Porta:** 80
- **Proxy:** Para o backend via variável de ambiente

## 🔧 Configuração no EasyPanel

### 1. Backend Service

#### Criar novo projeto no EasyPanel:

1. **Nome:** `weight-tracker-backend`
2. **Dockerfile:** `backend/Dockerfile`
3. **Porta:** 4000

#### Variáveis de Ambiente:

```env
DATABASE_URL=postgresql://username:password@your-easypanel-host:5432/database_name?schema=public
NODE_ENV=production
PORT=4000
```

#### Configurações:

- **Build Context:** `/backend`
- **Expose Port:** 4000
- **Health Check:** `/health`

### 2. Frontend Service

#### Criar novo projeto no EasyPanel:

1. **Nome:** `weight-tracker-frontend`
2. **Dockerfile:** `Dockerfile.easypanel`
3. **Porta:** 80

#### Variáveis de Ambiente:

```env
BACKEND_URL=http://seu-backend-url:4000
# ou
BACKEND_URL=https://api.seu-dominio.com
```

#### Configurações:

- **Build Context:** `/` (raiz)
- **Expose Port:** 80
- **Domínio:** `seu-dominio.com`

## 🗄️ Banco de Dados

### PostgreSQL no EasyPanel:

1. **Criar banco PostgreSQL** no EasyPanel
2. **Anotar credenciais:**
   - Host/IP
   - Porta (5432)
   - Usuário
   - Senha
   - Nome do banco

### Migrations:

```bash
# No EasyPanel, executar no backend:
npx prisma migrate deploy
```

## 🔗 Conectando Frontend e Backend

### Opção 1: URL Externa

```env
# No frontend service
BACKEND_URL=https://api.seu-dominio.com
```

### Opção 2: IP Interno

```env
# No frontend service
BACKEND_URL=http://IP-DO-BACKEND:4000
```

## 📝 Passo a Passo

### 1. Configurar Banco

1. Criar PostgreSQL no EasyPanel
2. Anotar DATABASE_URL

### 2. Deploy Backend

1. Criar projeto `weight-tracker-backend`
2. Usar `backend/Dockerfile`
3. Configurar variáveis de ambiente
4. Deploy e aguardar estar online

### 3. Deploy Frontend

1. Criar projeto `weight-tracker-frontend`
2. Usar `Dockerfile.easypanel`
3. Configurar BACKEND_URL
4. Deploy

### 4. Testar

1. Acessar frontend: `https://seu-dominio.com`
2. Testar API: `https://api.seu-dominio.com/health`

## 🔍 Troubleshooting

### Backend não conecta ao banco:

```bash
# Verificar logs do backend
# Verificar DATABASE_URL
# Testar conexão manual
```

### Frontend não acessa API:

```bash
# Verificar BACKEND_URL
# Verificar se backend está rodando
# Testar health check
```

### Nginx erro "host not found":

- Verificar se BACKEND_URL está correto
- Verificar se backend está online
- Aguardar alguns minutos após deploy

## 🚀 URLs Finais

Após deploy:

- **Frontend:** `https://seu-dominio.com`
- **Backend:** `https://api.seu-dominio.com`
- **Health:** `https://api.seu-dominio.com/health`

## 📊 Monitoramento

### Logs do Backend:

- EasyPanel → Backend Service → Logs

### Logs do Frontend:

- EasyPanel → Frontend Service → Logs

### Health Checks:

- Backend: `https://api.seu-dominio.com/health`
- Frontend: `https://seu-dominio.com`

## 🔒 Segurança

### Produção:

1. **SSL/TLS** automático no EasyPanel
2. **Domínios customizados**
3. **Backup automático** do PostgreSQL
4. **Logs centralizados**

### Variáveis Sensíveis:

- Usar **secrets** do EasyPanel para DATABASE_URL
- Não commitar credenciais no código
