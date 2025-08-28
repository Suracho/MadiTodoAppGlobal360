import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface TodoItem { id: number; title: string; isCompleted: boolean; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private http = inject(HttpClient);

  todos = signal<TodoItem[]>([]);
  newTitle = '';
  readonly api = 'https://localhost:5001/api/todos';

  ngOnInit() { this.load(); }

  load() {
    this.http.get<TodoItem[]>(this.api).subscribe(res => this.todos.set(res));
  }

  add() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.http.post<TodoItem>(this.api, { title }).subscribe(_ => {
      this.newTitle = '';
      this.load();
    });
  }

  remove(id: number) {
    this.http.delete(`${this.api}/${id}`).subscribe(_ => this.load());
  }
}
