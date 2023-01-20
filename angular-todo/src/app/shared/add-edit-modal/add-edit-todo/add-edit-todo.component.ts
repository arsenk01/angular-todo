import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { TodoCategory } from 'src/app/todo-list/todo-category';
import { TodoItem } from 'src/app/todo-list/todo-item/todo-item';
import { UntypedFormGroup,  UntypedFormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-todo',
  templateUrl: './add-edit-todo.component.html',
  styleUrls: ['./add-edit-todo.component.scss']
})
export class AddEditTodoComponent implements OnInit {
  @Input() todoCategories: TodoCategory[];
  @Input() openModal: Subject<TodoItem> = new Subject();
  @Output() onCompleteAction: EventEmitter<TodoItem> = new EventEmitter();

  @Output() isCategorySelected: EventEmitter<TodoItem> = new EventEmitter();
  @ViewChild('editTodo') public editTodo: TemplateRef<any>;
  
  public addEditForm: UntypedFormGroup;  
  private subscriptions: Subscription = new Subscription();

  constructor(private _modalService: NgbModal, fb: UntypedFormBuilder) { 
    this.addEditForm = fb.group({
      label: ['', Validators.required ],
      description: ['', Validators.required ],
      category: ['', Validators.required]
   });
  }

  public ngOnInit(): void {        
    this.subscriptions.add(
      this.openModal // on modal open call
        .subscribe(v => {
          // opening the Add/Edit modal
          this._modalService.open(this.editTodo, { ariaLabelledBy: 'modal-basic-title' }).result.then( 
            (result) => { // on Submit action
              this.onCompleteAction.next(this.addEditForm.value);
            }
          );
        }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // removing the add/edit modal on component unload
  }
}


