import * as OBC from '@thatopen/components';
import * as Firestore from "firebase/firestore";
import { Todo } from './Todo';
import type { ITodoData } from './Todo';

// Re-export Todo for external use
export { Todo } from './Todo';
import { TodoStatus, TodoPriority } from '../../../classes/Project';
import { firebaseDB } from '../../../firebase';

/**
 * TodoCreator - Manager for Todo management
 * Follows the Single Responsibility Principle by managing only the collection and operations on Todos
 */
export class TodoCreator extends OBC.Component {
  static uuid = '0fab73ec-6991-4995-aa0f-a34f474f061d'
  enabled = true;

  private _todos: Map<string, Todo> = new Map();
  private _world: OBC.World | null = null;
  private _cameraControls: any = null;
  private _currentProjectId: string | null = null;

  // Events
  onTodoAdded = new OBC.Event<Todo>();
  onTodoUpdated = new OBC.Event<Todo>();
  onTodoDeleted = new OBC.Event<string>();
  onTodosLoaded = new OBC.Event<Todo[]>();

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  /**
   * Setter for the world that also includes camera controls
   */
  set world(world: OBC.World | null) {
    this._world = world;
    if (world?.camera?.controls) {
      this._cameraControls = world.camera.controls;
    }
  }

  get world(): OBC.World | null {
    return this._world;
  }

  get cameraControls(): any {
    return this._cameraControls;
  }

  /**
   * Sets the current project and loads todos from Firebase
   */
  async setProject(projectId: string): Promise<void> {
    this._currentProjectId = projectId;
    await this.loadTodosFromFirebase();
  }

  /**
   * Loads all todos for the current project from Firebase
   */
  async loadTodosFromFirebase(): Promise<void> {
    if (!this._currentProjectId) {
      console.warn('No project set to load todos');
      return;
    }

    try {
      const todosCollection = Firestore.collection(
        firebaseDB, 
        'projects', 
        this._currentProjectId, 
        'tasks'
      );
      
      const snapshot = await Firestore.getDocs(todosCollection);
      this._todos.clear();

      const loadedTodos: Todo[] = [];
      snapshot.forEach((doc) => {
        const todo = Todo.fromFirebaseData(doc.id, doc.data());
        this._todos.set(todo.id, todo);
        loadedTodos.push(todo);
      });

      console.log(`Loaded ${loadedTodos.length} todos for project ${this._currentProjectId}`);
      this.onTodosLoaded.trigger(loadedTodos);
    } catch (error) {
      console.error('Error loading todos from Firebase:', error);
      throw error;
    }
  }

  /**
   * Creates a new Todo
   */
  async createTodo(todoData: Omit<ITodoData, 'id' | 'projectId'>): Promise<Todo> {
    if (!this._currentProjectId) {
      throw new Error('No project set');
    }

    const todo = new Todo({
      ...todoData,
      projectId: this._currentProjectId
    });

    try {
      // Save to Firebase
      const todosCollection = Firestore.collection(
        firebaseDB, 
        'projects', 
        this._currentProjectId, 
        'tasks'
      );
      
      await Firestore.setDoc(
        Firestore.doc(todosCollection, todo.id), 
        todo.toFirebaseData()
      );

      // Add to local collection
      this._todos.set(todo.id, todo);
      
      console.log('Todo created successfully:', todo.id);
      this.onTodoAdded.trigger(todo);
      
      return todo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  /**
   * Updates an existing Todo
   */
  async updateTodo(todoId: string, updates: Partial<ITodoData>): Promise<Todo> {
    const todo = this._todos.get(todoId);
    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    try {
      // Update local todo
      todo.update(updates);

      // Update on Firebase
      const todoDoc = Firestore.doc(
        firebaseDB, 
        'projects', 
        todo.projectId, 
        'tasks', 
        todoId
      );
      
      await Firestore.updateDoc(todoDoc, todo.toFirebaseData());
      
      console.log('Todo updated successfully:', todoId);
      this.onTodoUpdated.trigger(todo);
      
      return todo;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  /**
   * Deletes a Todo
   */
  async deleteTodo(todoId: string): Promise<void> {
    const todo = this._todos.get(todoId);
    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    try {
      // Delete from Firebase
      const todoDoc = Firestore.doc(
        firebaseDB, 
        'projects', 
        todo.projectId, 
        'tasks', 
        todoId
      );
      
      await Firestore.deleteDoc(todoDoc);

      // Remove from local collection
      this._todos.delete(todoId);
      
      console.log('Todo deleted successfully:', todoId);
      this.onTodoDeleted.trigger(todoId);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  /**
   * Gets a Todo by ID
   */
  getTodo(todoId: string): Todo | undefined {
    return this._todos.get(todoId);
  }

  /**
   * Gets all todos
   */
  getAllTodos(): Todo[] {
    return Array.from(this._todos.values());
  }

  /**
   * Filters todos by status
   */
  getTodosByStatus(status: TodoStatus): Todo[] {
    return this.getAllTodos().filter(todo => todo.status === status);
  }

  /**
   * Filters todos by priority
   */
  getTodosByPriority(priority: TodoPriority): Todo[] {
    return this.getAllTodos().filter(todo => todo.priority === priority);
  }

  /**
   * Searches todos by text
   */
  searchTodos(searchText: string): Todo[] {
    const searchLower = searchText.toLowerCase();
    return this.getAllTodos().filter(todo => 
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower)) ||
      (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchLower))
    );
  }

  /**
   * Gets todo statistics
   */
  getTodoStats(): {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    cancelled: number;
  } {
    const todos = this.getAllTodos();
    return {
      total: todos.length,
      todo: todos.filter(t => t.status === TodoStatus.TODO).length,
      inProgress: todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length,
      done: todos.filter(t => t.status === TodoStatus.DONE).length,
      cancelled: todos.filter(t => t.status === TodoStatus.CANCELLED).length
    };
  }

  /**
   * Legacy method for compatibility
   */
  addTodo() {
    console.log('Use createTodo(todoData) method instead');
  }
}