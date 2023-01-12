import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpErrorHandler } from '../shared/http-error-handler.service';
import { TodoService } from './todo.service';
import { TodoItem } from './todo-item/todo-item';
import { TodoCategory } from './todo-category';
import { of } from 'rxjs';

describe('TodoService', () => {
  let service: TodoService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    let httpErrorHandler = jasmine.createSpyObj('HttpErrorHandler', ['createHandleError']);

    httpErrorHandler.createHandleError.and.returnValue((text: string, arr: any[]) => {
      return
      <TodoItem>(operation?: string, result?: TodoItem) => { }
    });
    service = new TodoService(httpClientSpy, httpErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected todos and HttpClient called once', (done: DoneFn) => {
    const httpGetAllTodosResult: any[] =
      [{ id: 1, label: 'A', description: 'D', category: TodoCategory.house, done: false },
      { id: 2, label: 'A2', description: 'D2', category: TodoCategory.bureaucracy, done: '22-10-2019' }];

    const expectedTodos: TodoItem[] = [
      new TodoItem(1, "A", "D", TodoCategory.house, false, null),
      new TodoItem(2, "A2", "D2", TodoCategory.bureaucracy, true, new Date(2019, 9, 22))
    ]
    expect(true).toBeTruthy();
    httpClientSpy.get.and.returnValue(of(httpGetAllTodosResult));
    service.getTodoList().subscribe(
      (todos) => {
        expect(todos).toEqual(expectedTodos);
        expect(todos.length).toEqual(2);
        done();
      }, (error) => { });

    expect(httpClientSpy.get.calls.count())
      .withContext('one call')
      .toBe(1);
  });

  it('should add todo', (done: DoneFn) => {
    const httpAddTodoItem: any =
      { id: 1, label: 'A', description: 'D', category: TodoCategory.house, done: false };
    const expectedTodo: TodoItem = new TodoItem(1, "A", "D", TodoCategory.house, false, null);

    expect(true).toBeTruthy();
    httpClientSpy.post.and.returnValue(of(httpAddTodoItem));

    service.addTodoItem(httpAddTodoItem).subscribe(
      (todos) => {
        expect(todos).toEqual(expectedTodo);
        done();
      }, (error) => { });    
  });

  it('should edit todo', (done: DoneFn) => {
    const httpAddTodoItem: any =
      { id: 1, label: 'A', description: 'D', category: TodoCategory.house, done: false };
    const expectedTodo: TodoItem = new TodoItem(1, "A", "D", TodoCategory.house, false, null);

    expect(true).toBeTruthy();
    httpClientSpy.patch.and.returnValue(of(httpAddTodoItem));

    service.editTodoItem(httpAddTodoItem).subscribe(
      (todos) => {
        expect(todos).toEqual(expectedTodo);
        done();
      }, (error) => { });    
  });

  it('should delete todo', (done: DoneFn) => {
    const httpAddTodoItem: any =
      { id: 1, label: 'A', description: 'D', category: TodoCategory.house, done: false };    

    expect(true).toBeTruthy();
    httpClientSpy.delete.and.returnValue(of({}));

    service.deleteTodoItem(httpAddTodoItem).subscribe(
      (todos) => {
        expect(todos).toEqual({});
        done();
      }, (error) => { });    
  });
});

