import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HandleError, HttpErrorHandler } from "../shared/http-error-handler.service";
import { TodoItem } from "./todo-item/todo-item";
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private handleError: HandleError; // for general error handling (can be improved)
  private todoBaseUrl = `${environment.apiUrl}/tasks`;  // URL to todo api   

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TodoService');
  }

  
  public getTodoList(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.todoBaseUrl)
      .pipe(
        map((todos: any) => {
          let todoList: TodoItem[] = todos.map(this._transform); // map to UI format for todos (case data has inconsistency for 'done' property)
          return todoList;
        }),
        catchError(this.handleError('getTodoList', []))
      );
  }

  public addTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.http
      .post<TodoItem>(`${this.todoBaseUrl}`, {
        id: todoItem.id,
        label: todoItem.label,
        description: todoItem.description,
        category: todoItem.category,
        done: this._getDonePropertyResult(todoItem)
      })
      .pipe(
        catchError(this.handleError('addTodoItem', [])),
        map(this._transform));
  }

  public editTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.http
      .patch<TodoItem>(`${this.todoBaseUrl}/${todoItem.id}`, {
        id: todoItem.id,
        label: todoItem.label,
        description: todoItem.description,
        category: todoItem.category,
        done: this._getDonePropertyResult(todoItem)
      })
      .pipe(
        catchError(this.handleError('editTodoItem', [])),
        map(this._transform));
  }

  public deleteTodoItem(todoId: number): any {
    return this.http
      .delete<TodoItem>(`${this.todoBaseUrl}/${todoId}`)
      .pipe(catchError(this.handleError('deleteTodoItem', [])));
  }

  private _transform(dbTodoItem: any): TodoItem {
    let isCompleted = !(/false/i).test(dbTodoItem.done); // filter out done: false and done:'dd-mm-yyyy' case
    let parts = dbTodoItem.done.toString().split('-');
    let completedDate = isCompleted
      ? new Date(parts[2], parts[1] - 1, parts[0]) // formatting with our specified version
      : null;

    return new TodoItem(
      dbTodoItem.id,
      dbTodoItem.label,
      dbTodoItem.description,
      dbTodoItem.category,
      isCompleted,
      completedDate
    )
  }

  private _getDonePropertyResult(todoItem: TodoItem): string | boolean {
    let done: string | boolean;
    if (todoItem.isCompleted) {
      done = formatDate(todoItem.completedOn, 'dd-MM-yyy', 'en-US'); // set date format to our version // TODO: use current culture for date formating
    } else {
      done = false;
    }

    return done;
  }
}
