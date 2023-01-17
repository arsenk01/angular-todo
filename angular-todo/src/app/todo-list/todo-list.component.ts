import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { TodoCategory } from './todo-category';
import { TodoFilterType } from './todo-filter-type';
import { TodoItem } from './todo-item/todo-item';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  public todos$: TodoItem[]; // async list of Todo items
  public todoCategories: TodoCategory[]; // todo item categories 
  public selectedFilterType: string; // the current filter type (like 'by label) which used to fitler todo by
  public newTodo: TodoItem = new TodoItem(0, '', '', null, false); // just an empty todo for add modal
  public filterValue: string;

  public readonly filterTypes: TodoFilterType[] = [ // TODO: update the database to contain categories independently and get them
    { name: 'By Default', isHidden: true }, { name: 'Label', }, { name: 'Description', }, { name: 'Category', }];

  public openAddEditModal: Subject<TodoItem> = new Subject(); // the caller for add/edit modal
  public onAddEditComplete: Subject<void> = new Subject(); // the ajax complete result callback

  public get todos(): Readonly<TodoItem[]> {
    return this._todoList;
  }

  private _todoList: TodoItem[] = [];  // all todo items
  private _filterSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private readonly _filterDelayTime: number = 500; // user typing delay before call the filtering  

  private _filterBSDestroyed$: Subject<string> = new Subject();
  private _getTodoListDestroyed$: Subject<TodoItem[]> = new Subject();
  private _deleteTodoItemDestroyed$: Subject<any> = new Subject();
  private _addTodoItemDestroyed$: Subject<TodoItem> = new Subject();
  private _editTodoItemDestroyed$: Subject<TodoItem> = new Subject();

  constructor(private todoService: TodoService) { }


  public ngOnInit(): void {
    this.selectedFilterType = this.filterTypes[0].name; // set 'By Default' aka label filtering
    this.getTodoList(); // peform todos DB reading

    this._filterSubject.pipe(
      debounceTime(this._filterDelayTime),
      takeUntil(this._filterBSDestroyed$),
    ).subscribe(searchTextValue => {
      this._handleSearch(searchTextValue);
    });
  }

  public ngOnDestroy(): void {
    this._filterBSDestroyed$.complete();
    this._getTodoListDestroyed$.complete();
    this._addTodoItemDestroyed$.complete();
    this._editTodoItemDestroyed$.complete();
    this._deleteTodoItemDestroyed$.complete();
  }

  public getTodoList(): void {
    this.todoService.getTodoList()
      .pipe(takeUntil(this._getTodoListDestroyed$))
      .subscribe(todos => {
        this._todoList = todos;
        this.todoCategories = [... new Set(this._todoList.map(t => t.category))]; // making the taken categories unique
      });
  }

  public isCategorySelected(todoCategory: TodoCategory): boolean {
    return todoCategory && todoCategory === this.newTodo.category;
  }

  public chooseFilterType(name: string): void {
    this.filterTypes.forEach((ft: TodoFilterType) => {
      ft.isHidden = ft.name === name; // hiding the selected filter type from the dropdown
    });

    this.selectedFilterType = name;
    this._handleSearch(this._filterSubject.value); // trigger search to perform
  }

  public filterTodo($event: any): void {
    let searchValue = $event.target.value.toLocaleLowerCase(); // make search case-insensitive
    this._filterSubject.next(searchValue);
  }

  public resetFilter(): void {
    this.filterValue = '';
    this.filterTodo({ target: { value: this.filterValue } }); // call default filter behavior
  }

  public openAddModal(): void {
    this.newTodo.label = this.newTodo.description = ''; // reset the add modal data from the last opening values
    this.newTodo.category = null;
    this.openAddEditModal.next(this.newTodo);
  }

  public deleteTodoItem(todoId: number): void {
    this.todoService
      .deleteTodoItem(todoId)
      .pipe(takeUntil(this._deleteTodoItemDestroyed$))
      .subscribe(() => {
        const index = this._todoList.findIndex(t => t.id === todoId);

        if (index !== -1) {
          this._todoList.splice(index, 1); // hard remove the todo item
        }
      });
  }

  public addTodoItem(todoItem: TodoItem): void {
    const todoNewId = Math.max(...this._todoList.map(o => o.id)) + 1; // make sure not have duplicated index for new item
    todoItem.id = todoNewId;

    this.todoService.addTodoItem(todoItem)
      .pipe(takeUntil(this._addTodoItemDestroyed$))
      .subscribe(() => {
        this._todoList.push(new TodoItem(
          todoNewId,
          todoItem.label,
          todoItem.description,
          todoItem.category,
          todoItem.isCompleted,
          todoItem.completedOn));
      });
  }

  public editTodoItem(todoItem: TodoItem): void {
    this.todoService.editTodoItem(todoItem)
      .pipe(takeUntil(this._editTodoItemDestroyed$))
      .subscribe(() => { // TODO: read the last todo value from service call
        let updatedTodoItem = this._todoList.find(t => t.id === todoItem.id); // find the updated todo item

        if (updatedTodoItem) {
          updatedTodoItem.category = todoItem.category;
          updatedTodoItem.description = todoItem.description;
          updatedTodoItem.label = todoItem.label;
          updatedTodoItem.isCompleted = todoItem.isCompleted;
          updatedTodoItem.completedOn = todoItem.completedOn;
        }
      });
  }

  private _handleSearch(searchValue: string): void {
    let searchType = this.selectedFilterType != this.filterTypes[0].name
      ? this.selectedFilterType // get the selected fitler type
      : this.filterTypes[1].name; // or default

    searchType = searchType.toLocaleLowerCase();

    this._todoList.forEach((l: TodoItem) => {
      l.isHidden = l[searchType].toLocaleLowerCase().indexOf(searchValue) === -1; // search on todo property based on filter type
    });
  }
}
