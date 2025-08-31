import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, PomodoroStats } from '../../services/api';

interface CalendarDay {
  date: Date;
  stats?: PomodoroStats;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  pomodoroStats: PomodoroStats[] = [];
  selectedDay: CalendarDay | null = null;

  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadPomodoroStats();
    this.generateCalendar();
  }

  loadPomodoroStats() {
    this.apiService.getDailyStats().subscribe(
      stats => {
        this.pomodoroStats = stats;
        this.generateCalendar();
      },
      error => console.error('Erro ao carregar estatísticas:', error)
    );
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Primeiro dia da semana a ser mostrado (pode ser do mês anterior)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Último dia da semana a ser mostrado (pode ser do próximo mês)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    this.calendarDays = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = this.formatDateForAPI(currentDate);
      // Verificação de segurança para evitar erro quando pomodoroStats é null
      const stats = this.pomodoroStats?.find(s => s.data === dateStr);
      
      this.calendarDays.push({
        date: new Date(currentDate),
        stats: stats,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay = day;
  }

  closeDetails() {
    this.selectedDay = null;
  }

  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getPomodoroIntensity(stats?: PomodoroStats): string {
    if (!stats || stats.total_pomodoros === 0) return 'none';
    if (stats.total_pomodoros <= 2) return 'low';
    if (stats.total_pomodoros <= 4) return 'medium';
    if (stats.total_pomodoros <= 6) return 'high';
    return 'very-high';
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }

  getCurrentMonthYear(): string {
    return `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  getTotalPomodorosThisMonth(): number {
    if (!this.calendarDays || this.calendarDays.length === 0) return 0;
    return this.calendarDays
      .filter(day => day.isCurrentMonth && day.stats)
      .reduce((total, day) => total + (day.stats?.total_pomodoros || 0), 0);
  }

  getTotalWorkTimeThisMonth(): number {
    if (!this.calendarDays || this.calendarDays.length === 0) return 0;
    return this.calendarDays
      .filter(day => day.isCurrentMonth && day.stats)
      .reduce((total, day) => total + (day.stats?.tempo_total_trabalho || 0), 0);
  }

  getDotsArray(count: number): number[] {
    return Array(Math.min(count, 8)).fill(0);
  }
}
