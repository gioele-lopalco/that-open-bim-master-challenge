import { TodoStatus, TodoPriority } from '../../../classes/Project';
import type { ModelElement } from '../../../classes/Project';

/**
 * Interface for Todo data
 */
export interface ITodoData {
  id?: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignedTo?: string;
  projectId: string;
  icon?: string;
  linkedElements?: ModelElement[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Todo class - Represents a single task/todo
 * Follows the Single Responsibility Principle by managing only the data and logic of a single Todo
 */
export class Todo {
  private _id: string;
  private _title: string;
  private _description?: string;
  private _status: TodoStatus;
  private _priority: TodoPriority;
  private _assignedTo?: string;
  private _projectId: string;
  private _icon: string;
  private _linkedElements: ModelElement[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(data: ITodoData) {
    this._id = data.id || this.generateUniqueId();
    this._title = data.title;
    this._description = data.description;
    this._status = data.status;
    this._priority = data.priority;
    this._assignedTo = data.assignedTo;
    this._projectId = data.projectId;
    this._icon = data.icon || 'task';
    this._linkedElements = data.linkedElements || [];
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
  }

  /**
   * Generates a unique ID for the Todo (similar to Projects)
   */
  private generateUniqueId(): string {
    return 'todo_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  // Getters
  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string | undefined { return this._description; }
  get status(): TodoStatus { return this._status; }
  get priority(): TodoPriority { return this._priority; }
  get assignedTo(): string | undefined { return this._assignedTo; }
  get projectId(): string { return this._projectId; }
  get icon(): string { return this._icon; }
  get linkedElements(): ModelElement[] { return [...this._linkedElements]; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  /**
   * Number of elements linked to the Todo
   */
  get elementsCount(): number {
    return this._linkedElements.length;
  }

  // Setters with validation
  set title(value: string) {
    if (!value.trim()) {
      throw new Error('Todo title cannot be empty');
    }
    this._title = value.trim();
    this._updatedAt = new Date();
  }

  set description(value: string | undefined) {
    this._description = value?.trim() || undefined;
    this._updatedAt = new Date();
  }

  set status(value: TodoStatus) {
    this._status = value;
    this._updatedAt = new Date();
  }

  set priority(value: TodoPriority) {
    this._priority = value;
    this._updatedAt = new Date();
  }

  set assignedTo(value: string | undefined) {
    this._assignedTo = value?.trim() || undefined;
    this._updatedAt = new Date();
  }

  set icon(value: string) {
    this._icon = value || 'task';
    this._updatedAt = new Date();
  }

  /**
   * Adds linked elements to the Todo
   */
  addLinkedElements(elements: ModelElement[]): void {
    const newElements = elements.filter(newEl => 
      !this._linkedElements.some(existingEl => 
        existingEl.modelId === newEl.modelId && existingEl.elementId === newEl.elementId
      )
    );
    this._linkedElements.push(...newElements);
    this._updatedAt = new Date();
  }

  /**
   * Removes linked elements from the Todo
   */
  removeLinkedElements(elements: ModelElement[]): void {
    this._linkedElements = this._linkedElements.filter(existingEl =>
      !elements.some(removeEl =>
        removeEl.modelId === existingEl.modelId && removeEl.elementId === existingEl.elementId
      )
    );
    this._updatedAt = new Date();
  }

  /**
   * Clears all linked elements
   */
  clearLinkedElements(): void {
    this._linkedElements = [];
    this._updatedAt = new Date();
  }

  /**
   * Updates multiple properties at once
   */
  update(data: Partial<ITodoData>): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.status !== undefined) this.status = data.status;
    if (data.priority !== undefined) this.priority = data.priority;
    if (data.assignedTo !== undefined) this.assignedTo = data.assignedTo;
    if (data.icon !== undefined) this.icon = data.icon;
    if (data.linkedElements !== undefined) {
      this._linkedElements = [...data.linkedElements];
      this._updatedAt = new Date();
    }
  }

  /**
   * Converts the Todo to Firebase format
   */
  toFirebaseData(): any {
    return {
      title: this._title,
      description: this._description,
      status: this._status,
      priority: this._priority,
      assignedTo: this._assignedTo,
      projectId: this._projectId,
      icon: this._icon,
      linkedElements: this._linkedElements,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Creates a Todo from Firebase data
   */
  static fromFirebaseData(id: string, data: any): Todo {
    return new Todo({
      id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignedTo: data.assignedTo,
      projectId: data.projectId,
      icon: data.icon,
      linkedElements: data.linkedElements || [],
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
    });
  }

  /**
   * Clones the Todo
   */
  clone(): Todo {
    return new Todo({
      id: this._id,
      title: this._title,
      description: this._description,
      status: this._status,
      priority: this._priority,
      assignedTo: this._assignedTo,
      projectId: this._projectId,
      icon: this._icon,
      linkedElements: [...this._linkedElements],
      createdAt: new Date(this._createdAt),
      updatedAt: new Date(this._updatedAt)
    });
  }
}
