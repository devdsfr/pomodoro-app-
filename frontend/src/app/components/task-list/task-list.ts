import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Task } from '../../services/api';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { titulo: '', descricao: '', concluida: false };
  editingTask: Task | null = null;
  showAddForm: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.apiService.getTasks().subscribe(
      tasks => this.tasks = tasks,
      error => console.error('Erro ao carregar tarefas:', error)
    );
  }

  addTask() {
    if (this.newTask.titulo.trim()) {
      this.apiService.createTask(this.newTask).subscribe(
        task => {
          this.tasks.push(task);
          this.newTask = { titulo: '', descricao: '', concluida: false };
          this.showAddForm = false;
        },
        error => console.error('Erro ao criar tarefa:', error)
      );
    }
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
  }

  saveTask() {
    if (this.editingTask && this.editingTask.id) {
      this.apiService.updateTask(this.editingTask.id, this.editingTask).subscribe(
        updatedTask => {
          const index = this.tasks.findIndex(t => t.id === updatedTask.id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.editingTask = null;
        },
        error => console.error('Erro ao atualizar tarefa:', error)
      );
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }

  deleteTask(taskId: string) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.apiService.deleteTask(taskId).subscribe(
        () => {
          this.tasks = this.tasks.filter(t => t.id !== taskId);
        },
        error => console.error('Erro ao deletar tarefa:', error)
      );
    }
  }

  toggleTaskCompletion(task: Task) {
    if (task.id) {
      const updatedTask = { ...task, concluida: !task.concluida };
      this.apiService.updateTask(task.id, updatedTask).subscribe(
        updated => {
          const index = this.tasks.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tasks[index] = updated;
          }
        },
        error => console.error('Erro ao atualizar tarefa:', error)
      );
    }
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.concluida);
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter(task => !task.concluida);
  }
}
