# 🚀 Deploy Separado no EasyPanel

## 📋 Estrutura do Deploy

### Backend Service

- **Dockerfile:** `backend/Dockerfile`
- **Porta:** 4000
- **Banco:** PostgreSQL do EasyPanel

### Frontend Service

- **Dockerfile:** `Dockerfile.frontend-only` (recomendado)
- **Porta:** 80
- **API:** Acessa backend via URL externa

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
2. **Dockerfile:** `Dockerfile.frontend-only` (sem proxy)
3. **Porta:** 80

#### Variáveis de Ambiente:

```env
VITE_API_URL=https://api.seu-dominio.com
# ou
VITE_API_URL=https://seu-backend-url:4000
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

### Frontend Acessa API Diretamente:

O frontend agora usa `VITE_API_URL` para acessar a API diretamente, sem proxy nginx.

```env
# No frontend service
VITE_API_URL=https://api.seu-dominio.com
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
5. Anotar URL do backend

### 3. Deploy Frontend

1. Criar projeto `weight-tracker-frontend`
2. Usar `Dockerfile.frontend-only`
3. Configurar `VITE_API_URL` com URL do backend
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
# Verificar VITE_API_URL
# Verificar se backend está rodando
# Testar health check
```

### Nginx erro "host not found":

**SOLUÇÃO:** Usar `Dockerfile.frontend-only` que não tem proxy nginx.

### Frontend mostra erro de CORS:

```bash
# Verificar se VITE_API_URL está correto
# Verificar se backend tem CORS configurado
```

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

## 🎯 Soluções para Erros Comuns

### Erro: "host not found in upstream"

**Causa:** Nginx tentando resolver nome de serviço que não existe
**Solução:** Usar `Dockerfile.frontend-only` sem proxy

### Erro: "CORS policy"

**Causa:** Frontend tentando acessar API de domínio diferente
**Solução:** Configurar `VITE_API_URL` corretamente

### Erro: "Database connection failed"

**Causa:** DATABASE_URL incorreta ou banco não acessível
**Solução:** Verificar credenciais e conectividade
