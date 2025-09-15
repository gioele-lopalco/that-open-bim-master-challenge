import * as OBC from '@thatopen/components';
import { TodoCreator } from './TodoCreator';
import { createTodoTable } from './TodoTable';
import * as BUI from '@thatopen/ui';

export interface TodoUIState {
  components: OBC.Components;
  projectId?: string;
}

/**
 * Creates a button to open Todo management
 */
export const todoTool = (state: TodoUIState) => {
  return BUI.Component.create(() => {
    return BUI.html`
      <bim-button
        @click=${() => openTodoManager(state)}
        icon="task"
        tooltip="Gestione To-Do"
      ></bim-button>
    `;
  });
};

/**
 * Creates a form to add/edit Todo
 */
export const createTodoForm = (state: TodoUIState, existingTodo?: any) => {
  const { components } = state;
  const todoCreator = components.get(TodoCreator);

  let formData = {
    title: existingTodo?.title || '',
    description: existingTodo?.description || '',
    status: existingTodo?.status || 'To Do',
    priority: existingTodo?.priority || 'Medium',
    assignedTo: existingTodo?.assignedTo || '',
    icon: existingTodo?.icon || 'task'
  };

  const form = BUI.Component.create(() => {
    return BUI.html`
      <bim-panel label="${existingTodo ? 'Modifica Todo' : 'Nuovo Todo'}" icon="${existingTodo ? 'edit' : 'add'}">
        <bim-panel-section label="Informazioni Generali" icon="info">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <bim-text-input 
              label="Titolo" 
              value="${formData.title}"
              @input=${(e: Event) => formData.title = (e.target as any).value}
              required
            ></bim-text-input>
            
            <bim-text-input 
              label="Descrizione" 
              value="${formData.description}"
              @input=${(e: Event) => formData.description = (e.target as any).value}
            ></bim-text-input>
            
            <bim-text-input 
              label="Assegnato a" 
              value="${formData.assignedTo}"
              @input=${(e: Event) => formData.assignedTo = (e.target as any).value}
            ></bim-text-input>
          </div>
        </bim-panel-section>
        
        <bim-panel-section label="Status e Priorità" icon="settings">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <bim-dropdown label="Status">
              <bim-option label="Da fare" value="To Do" ?checked=${formData.status === 'To Do'}></bim-option>
              <bim-option label="In corso" value="In Progress" ?checked=${formData.status === 'In Progress'}></bim-option>
              <bim-option label="Completato" value="Done" ?checked=${formData.status === 'Done'}></bim-option>
              <bim-option label="Annullato" value="Cancelled" ?checked=${formData.status === 'Cancelled'}></bim-option>
            </bim-dropdown>
            
            <bim-dropdown label="Priorità">
              <bim-option label="Bassa" value="Low" ?checked=${formData.priority === 'Low'}></bim-option>
              <bim-option label="Media" value="Medium" ?checked=${formData.priority === 'Medium'}></bim-option>
              <bim-option label="Alta" value="High" ?checked=${formData.priority === 'High'}></bim-option>
              <bim-option label="Urgente" value="Urgent" ?checked=${formData.priority === 'Urgent'}></bim-option>
            </bim-dropdown>
          </div>
        </bim-panel-section>
        
        <bim-panel-section label="Azioni" icon="done">
          <div style="display: flex; gap: 8px;">
            <bim-button 
              label="Salva" 
              icon="save"
              @click=${() => saveTodo()}
            ></bim-button>
            
            <bim-button 
              label="Annulla" 
              icon="close"
              @click=${() => closeForm()}
            ></bim-button>
          </div>
        </bim-panel-section>
      </bim-panel>
    `;
  });

  const saveTodo = async () => {
    try {
      if (!formData.title.trim()) {
        alert('Title is required');
        return;
      }

      if (existingTodo) {
        await todoCreator.updateTodo(existingTodo.id, formData);
        console.log('Todo updated successfully');
      } else {
        await todoCreator.createTodo(formData);
        console.log('Todo created successfully');
      }
      
      closeForm();
    } catch (error) {
      console.error('Error saving Todo:', error);
      alert('Error saving Todo');
    }
  };

  const closeForm = () => {
    // Here we should close the form
    console.log('Closing Todo form');
  };

  return form;
};

/**
 * Creates a modal for TodoManager
 */
export const createTodoModal = (state: TodoUIState) => {
  const { projectId } = state;
  
  if (!projectId) {
    console.warn('Project ID required for TodoManager');
    return null;
  }

  let isOpen = false;
  let modalElement: HTMLElement | null = null;

  const openModal = () => {
    if (isOpen) return;
    
    isOpen = true;
    modalElement = document.createElement('div');
    modalElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: var(--bim-ui_bg-contrast-20);
      border-radius: 8px;
      padding: 20px;
      max-width: 95vw;
      max-height: 95vh;
      overflow: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      position: relative;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.onclick = closeModal;

    const todoManager = createTodoManager(state);
    modalContent.innerHTML = todoManager.toString();
    modalContent.appendChild(closeButton);
    modalElement.appendChild(modalContent);
    
    modalElement.onclick = (e) => {
      if (e.target === modalElement) closeModal();
    };

    document.body.appendChild(modalElement);
  };

  const closeModal = () => {
    if (!isOpen || !modalElement) return;
    
    isOpen = false;
    document.body.removeChild(modalElement);
    modalElement = null;
  };

  return { openModal, closeModal };
};

/**
 * Opens the complete Todo manager
 */
export const openTodoManager = (state: TodoUIState) => {
  const modal = createTodoModal(state);
  if (modal) {
    modal.openModal();
  }
};

/**
 * Creates the complete Todo management interface
 */
export const createTodoManager = (state: TodoUIState) => {
  const { components, projectId } = state;
  
  if (!projectId) {
    return BUI.html`
      <bim-label icon="warning" style="--bim-icon--c: orange;">
        Project ID required for Todo management
      </bim-label>
    `;
  }

  const todoTable = createTodoTable({ components, projectId });

  return BUI.Component.create(() => {
    return BUI.html`
      <bim-panel label="Gestione Todo" icon="task">
        <bim-panel-section label="Lista Todo" icon="list">
          ${todoTable}
        </bim-panel-section>
      </bim-panel>
    `;
  });
};