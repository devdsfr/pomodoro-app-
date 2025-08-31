import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroTimerComponent } from './components/pomodoro-timer/pomodoro-timer';
import { TaskListComponent } from './components/task-list/task-list';
import { CalendarComponent } from './components/calendar/calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PomodoroTimerComponent,
    TaskListComponent,
    CalendarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  currentView: string = 'timer';

  setView(view: string) {
    this.currentView = view;
  }
}
