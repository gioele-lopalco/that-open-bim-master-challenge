import type { TodoItem } from '../classes/Project';
import { TodoStatus, TodoPriority } from '../classes/Project';

const formatFirebaseDate = (timestamp: any): Date => {
  if (!timestamp) {
    return new Date();
  }

  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }

  if (timestamp && typeof timestamp === 'object' && timestamp.toDate) {
    return timestamp.toDate();
  }
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  return new Date();
};

/**
 * Retrieves all todos for a specific project from Firebase
 */
export const getTodosFromFirebase = async (projectId: string): Promise<TodoItem[]> => {
  const { collection, getDocs } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    const todosCollection = collection(firebaseDB, 'projects', projectId, 'tasks');
    const firebaseTodos = await getDocs(todosCollection);
    const todosList: TodoItem[] = [];
    
    for (const doc of firebaseTodos.docs) {
      const data = doc.data();
      
      const todo: TodoItem = {
        id: doc.id,
        title: data.title || 'Task senza titolo',
        description: data.description || undefined,
        status: data.status || TodoStatus.TODO,
        priority: data.priority || TodoPriority.MEDIUM,
        projectId,
        updatedAt: data.updatedAt ? formatFirebaseDate(data.updatedAt) : undefined,
        assignedTo: data.assignedTo || undefined,
        icon: data.icon || 'task',
        linkedElements: data.linkedElements || undefined
      };
      
      todosList.push(todo);
    }
    
    return todosList;
  } catch (error) {
    console.error('Error retrieving todos:', error);
    return [];
  }
};

/**
 * Creates a new todo in Firebase under a project's tasks sub-collection
 */
export const createTodoInFirebase = async (
  projectId: string, 
  todoData: Omit<TodoItem, 'id' | 'updatedAt'>
): Promise<TodoItem> => {
  const { collection, addDoc } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Creating new todo for project:', projectId, todoData);

    const dataToSave = {
      ...todoData,
      projectId
    };

    const todosCollection = collection(firebaseDB, 'projects', projectId, 'tasks');
    const docRef = await addDoc(todosCollection, dataToSave);
    
    console.log('Todo created with ID:', docRef.id);
    
    // Return the created todo with the Firebase-generated ID
    return {
      id: docRef.id,
      ...todoData,
      projectId
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

/**
 * Updates an existing todo in Firebase
 */
export const updateTodoInFirebase = async (
  projectId: string, 
  todoId: string, 
  todoData: Partial<Omit<TodoItem, 'id' | 'projectId'>>
): Promise<void> => {
  const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Updating todo:', todoId, todoData);

    const todoRef = doc(firebaseDB, 'projects', projectId, 'tasks', todoId);
    
    const dataToUpdate = {
      ...todoData,
      updatedAt: Timestamp.fromDate(new Date())
    };

    // Remove undefined values
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key as keyof typeof dataToUpdate] === undefined) {
        delete dataToUpdate[key as keyof typeof dataToUpdate];
      }
    });

    await updateDoc(todoRef, dataToUpdate);
    
    console.log('Todo updated successfully');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

/**
 * Deletes a todo from Firebase
 */
export const deleteTodoFromFirebase = async (projectId: string, todoId: string): Promise<void> => {
  const { doc, deleteDoc } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Deleting todo:', todoId, 'from project:', projectId);

    const todoRef = doc(firebaseDB, 'projects', projectId, 'tasks', todoId);
    await deleteDoc(todoRef);
    
    console.log('Todo deleted successfully');
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

/**
 * Updates only the status of a todo (useful for quick status toggles)
 */
export const updateTodoStatusInFirebase = async (
  projectId: string, 
  todoId: string, 
  newStatus: TodoStatus
): Promise<void> => {
  const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Updating todo status:', todoId, 'to:', newStatus);

    const todoRef = doc(firebaseDB, 'projects', projectId, 'tasks', todoId);
    
    await updateDoc(todoRef, {
      status: newStatus,
      updatedAt: Timestamp.fromDate(new Date())
    });
    
    console.log('Todo status updated successfully');
  } catch (error) {
    console.error('Error updating todo status:', error);
    throw error;
  }
};

/**
 * Gets todos count stats for a project
 */
export const getTodoStatsFromFirebase = async (projectId: string) => {
  const todos = await getTodosFromFirebase(projectId);
  
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.status === TodoStatus.DONE).length,
    inProgress: todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length,
    pending: todos.filter(t => t.status === TodoStatus.TODO).length,
    cancelled: todos.filter(t => t.status === TodoStatus.CANCELLED).length
  };

  return stats;
};

/**
 * Gets todos grouped by status for a project
 */
export const getTodosByStatusFromFirebase = async (projectId: string) => {
  const todos = await getTodosFromFirebase(projectId);
  
  return {
    [TodoStatus.TODO]: todos.filter(t => t.status === TodoStatus.TODO),
    [TodoStatus.IN_PROGRESS]: todos.filter(t => t.status === TodoStatus.IN_PROGRESS),
    [TodoStatus.DONE]: todos.filter(t => t.status === TodoStatus.DONE),
    [TodoStatus.CANCELLED]: todos.filter(t => t.status === TodoStatus.CANCELLED)
  };
};