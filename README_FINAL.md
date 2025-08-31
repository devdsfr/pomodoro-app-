# 🍅 Pomodoro App - Aplicação Completa

Uma aplicação completa de gerenciamento de Pomodoro desenvolvida com **Go** (backend) e **Angular** (frontend).

## 🚀 Funcionalidades

### ⏱️ Timer Pomodoro
- Timer configurável para trabalho e descanso
- Interface visual atrativa com círculo de progresso
- Controles de iniciar, pausar e resetar
- Configuração personalizada de tempos

### 📋 Gerenciamento de Tarefas
- Criar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Interface intuitiva para organização

### 📅 Calendário de Produtividade
- Visualização mensal dos pomodoros realizados
- Estatísticas diárias de tempo de trabalho e descanso
- Indicadores visuais de intensidade de produtividade
- Detalhes por dia com métricas completas

## 🛠️ Tecnologias Utilizadas

### Backend (Go)
- **Gin Framework** - Framework web rápido e minimalista
- **GORM** - ORM para Go
- **SQLite** - Banco de dados leve
- **CORS** - Suporte a requisições cross-origin

### Frontend (Angular)
- **Angular 18** - Framework frontend moderno
- **TypeScript** - Linguagem tipada
- **CSS3** - Estilização avançada com gradientes e animações
- **Responsive Design** - Interface adaptável para mobile e desktop

## 📁 Estrutura do Projeto

```
pomodoro-app/
├── backend/
│   ├── main.go              # Servidor principal e rotas
│   ├── models.go            # Modelos de dados
│   ├── go.mod               # Dependências Go
│   └── static/              # Arquivos do frontend compilado
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Componentes Angular
    │   │   ├── services/      # Serviços de API
    │   │   └── app.*          # Componente principal
    │   └── main.ts           # Bootstrap da aplicação
    ├── angular.json          # Configuração Angular
    └── package.json          # Dependências Node.js
```

## 🔧 Como Executar

### Pré-requisitos
- Go 1.21+
- Node.js 20+
- Angular CLI

### Backend
```bash
cd backend
go mod tidy
CGO_ENABLED=1 go run .
```

### Frontend (Desenvolvimento)
```bash
cd frontend
npm install
ng serve
```

### Build de Produção
```bash
cd frontend
ng build --configuration production
cp -r dist/pomodoro-frontend/* ../backend/static/
```

## 🌐 API Endpoints

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Obter tarefa específica
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa

### Pomodoros
- `POST /api/pomodoros` - Registrar pomodoro completado
- `GET /api/pomodoros/daily` - Estatísticas diárias
- `GET /api/pomodoros/task/:taskId` - Pomodoros por tarefa

## 🎨 Design e UX

### Características do Design
- **Gradientes modernos** - Visual atrativo com cores suaves
- **Animações fluidas** - Transições suaves entre estados
- **Responsivo** - Funciona perfeitamente em mobile e desktop
- **Acessibilidade** - Controles claros e navegação intuitiva

### Paleta de Cores
- **Primária**: Gradiente roxo-azul (#667eea → #764ba2)
- **Secundária**: Verde para ações positivas
- **Neutros**: Cinzas para textos e backgrounds
- **Indicadores**: Cores diferenciadas para níveis de produtividade

## 📊 Funcionalidades Avançadas

### Calendário Inteligente
- **Visualização por intensidade**: Cores diferentes baseadas no número de pomodoros
- **Estatísticas mensais**: Total de pomodoros e tempo trabalhado
- **Detalhes por dia**: Modal com informações completas
- **Navegação temporal**: Navegar entre meses

### Timer Avançado
- **Estados visuais**: Diferentes cores para trabalho e descanso
- **Progresso circular**: Indicador visual do tempo restante
- **Configuração flexível**: Tempos personalizáveis
- **Integração com tarefas**: Seleção de tarefa para o pomodoro

## 🔒 Segurança e Performance

- **CORS configurado** para requisições seguras
- **Validação de dados** no backend
- **Build otimizado** para produção
- **Lazy loading** de componentes
- **Compressão de assets**

## 🚀 Deploy

A aplicação está configurada para deploy fácil:
- Backend serve os arquivos estáticos do frontend
- Fallback para SPA (Single Page Application)
- Configuração de CORS para desenvolvimento e produção

## 📝 Próximas Melhorias

- [ ] Notificações push quando o timer termina
- [ ] Relatórios semanais e mensais
- [ ] Integração com calendários externos
- [ ] Temas personalizáveis
- [ ] Sincronização em nuvem
- [ ] Aplicativo mobile nativo

## 👨‍💻 Desenvolvimento

Desenvolvido com foco em:
- **Clean Code** - Código limpo e bem estruturado
- **Arquitetura modular** - Componentes reutilizáveis
- **Performance** - Otimizações para velocidade
- **Experiência do usuário** - Interface intuitiva e responsiva

---

**Aplicação disponível em**: https://8080-iebwaxm96jd6sqy2hxswa-484822a6.manus.computer

*Desenvolvido com ❤️ usando Go e Angular*

