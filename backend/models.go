package main

import (
	"time"
)

// Task representa uma tarefa no sistema
type Task struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Titulo      string    `json:"titulo" gorm:"not null"`
	Descricao   string    `json:"descricao"`
	Concluida   bool      `json:"concluida" gorm:"default:false"`
	DataCriacao time.Time `json:"data_criacao" gorm:"autoCreateTime"`
}

// Pomodoro representa um ciclo de pomodoro
type Pomodoro struct {
	ID               string    `json:"id" gorm:"primaryKey"`
	TarefaID         string    `json:"tarefa_id" gorm:"not null"`
	DuracaoTrabalho  int       `json:"duracao_trabalho" gorm:"default:25"` // em minutos
	DuracaoDescanso  int       `json:"duracao_descanso" gorm:"default:5"`  // em minutos
	DataInicio       time.Time `json:"data_inicio" gorm:"not null"`
	DataFim          time.Time `json:"data_fim" gorm:"not null"`
	Tarefa           Task      `json:"tarefa" gorm:"foreignKey:TarefaID"`
}

// PomodoroStats representa as estatísticas diárias de pomodoros
type PomodoroStats struct {
	Data                string `json:"data"`
	TotalPomodoros      int    `json:"total_pomodoros"`
	TempoTotalTrabalho  int    `json:"tempo_total_trabalho"`  // em minutos
	TempoTotalDescanso  int    `json:"tempo_total_descanso"`  // em minutos
}

