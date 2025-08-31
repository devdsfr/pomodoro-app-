import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Task, Pomodoro } from '../../services/api';

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pomodoro-timer.html',
  styleUrls: ['./pomodoro-timer.css']
})
export class PomodoroTimerComponent implements OnInit, OnDestroy {
  // Estado do timer
  timeLeft: number = 25 * 60; // 25 minutos em segundos
  isRunning: boolean = false;
  isWorkTime: boolean = true;
  workDuration: number = 25; // minutos
  breakDuration: number = 5; // minutos
  
  // Timer interval
  private interval: any;
  
  // Tarefa selecionada
  selectedTask: Task | null = null;
  tasks: Task[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  loadTasks() {
    this.apiService.getTasks().subscribe(
      tasks => this.tasks = tasks.filter(task => !task.concluida),
      error => console.error('Erro ao carregar tarefas:', error)
    );
  }

  selectTask(task: Task) {
    this.selectedTask = task;
  }

  startTimer() {
    console.log('startTimer() called');
    console.log('selectedTask:', this.selectedTask);
    if (!this.selectedTask) {
      alert('Selecione uma tarefa primeiro!');
      return;
    }

    this.isRunning = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      
      if (this.timeLeft <= 0) {
        this.completeSession();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.isWorkTime ? this.workDuration * 60 : this.breakDuration * 60;
  }

  completeSession() {
    this.pauseTimer();
    
    if (this.isWorkTime && this.selectedTask) {
      // Registrar pomodoro completado
      const pomodoro: Pomodoro = {
        tarefa_id: this.selectedTask.id!,
        duracao_trabalho: this.workDuration,
        duracao_descanso: this.breakDuration,
        data_inicio: new Date(Date.now() - this.workDuration * 60 * 1000),
        data_fim: new Date()
      };

      this.apiService.createPomodoro(pomodoro).subscribe(
        () => console.log('Pomodoro registrado com sucesso!'),
        error => console.error('Erro ao registrar pomodoro:', error)
      );
    }

    // Alternar entre trabalho e descanso
    this.isWorkTime = !this.isWorkTime;
    this.timeLeft = this.isWorkTime ? this.workDuration * 60 : this.breakDuration * 60;
    
    // Notificar usuário
    alert(this.isWorkTime ? 'Hora de trabalhar!' : 'Hora do descanso!');
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgressPercentage(): number {
    const totalTime = this.isWorkTime ? this.workDuration * 60 : this.breakDuration * 60;
    return ((totalTime - this.timeLeft) / totalTime) * 100;
  }
}
