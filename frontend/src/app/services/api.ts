import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  data_criacao?: Date;
}

export interface Pomodoro {
  id?: string;
  tarefa_id: string;
  duracao_trabalho: number;
  duracao_descanso: number;
  data_inicio: Date;
  data_fim: Date;
}

export interface PomodoroStats {
  data: string;
  total_pomodoros: number;
  tempo_total_trabalho: number;
  tempo_total_descanso: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

//  private baseUrl = 'https://8080-i4fwwiymu049aryt5q9in-be7b87fb.manus.computer/api';

  constructor(private http: HttpClient) { }

  // Métodos para tarefas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }

  // Métodos para pomodoros
  createPomodoro(pomodoro: Pomodoro): Observable<Pomodoro> {
    return this.http.post<Pomodoro>(`${this.baseUrl}/pomodoros`, pomodoro);
  }

  getDailyStats(): Observable<PomodoroStats[]> {
    return this.http.get<PomodoroStats[]>(`${this.baseUrl}/pomodoros/daily`);
  }

  getPomodorosByTask(taskId: string): Observable<Pomodoro[]> {
    return this.http.get<Pomodoro[]>(`${this.baseUrl}/pomodoros/task/${taskId}`);
  }
}
