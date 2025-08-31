# Projeto Pomodoro App

Este projeto consiste em um aplicativo Pomodoro com gerenciamento de tarefas e acompanhamento de estatísticas, desenvolvido com Go (backend) e Angular (frontend).

## Modelo de Dados

### Tarefa
- `ID` (string): Identificador único da tarefa.
- `Titulo` (string): Título da tarefa.
- `Descricao` (string): Descrição detalhada da tarefa (opcional).
- `Concluida` (boolean): Indica se a tarefa foi concluída.
- `DataCriacao` (timestamp): Data e hora de criação da tarefa.

### Pomodoro
- `ID` (string): Identificador único do pomodoro.
- `TarefaID` (string): ID da tarefa associada a este pomodoro.
- `DuracaoTrabalho` (int): Duração do período de trabalho em minutos.
- `DuracaoDescanso` (int): Duração do período de descanso em minutos.
- `DataInicio` (timestamp): Data e hora de início do pomodoro.
- `DataFim` (timestamp): Data e hora de fim do pomodoro.

## APIs REST (Backend Go)

### Tarefas
- `GET /api/tasks`: Retorna todas as tarefas.
- `GET /api/tasks/{id}`: Retorna uma tarefa específica por ID.
- `POST /api/tasks`: Cria uma nova tarefa.
- `PUT /api/tasks/{id}`: Atualiza uma tarefa existente.
- `DELETE /api/tasks/{id}`: Exclui uma tarefa.

### Pomodoros
- `POST /api/pomodoros`: Registra um novo pomodoro.
- `GET /api/pomodoros/daily`: Retorna o número de pomodoros e tempo total de trabalho/descanso por dia.
- `GET /api/pomodoros/task/{taskId}`: Retorna todos os pomodoros associados a uma tarefa específica.


