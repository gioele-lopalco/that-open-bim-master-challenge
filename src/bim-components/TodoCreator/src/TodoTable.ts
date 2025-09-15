import * as BUI from '@thatopen/ui';
import * as OBC from '@thatopen/components';
import { TodoCreator } from './TodoCreator';
import type { Todo } from './TodoCreator';
import { TodoStatus, TodoPriority } from '../../../classes/Project';

export interface TodoTableState {
  components: OBC.Components;
  projectId: string;
}

/**
 * Crea una tabella completa per la gestione dei Todo usando BIM UI Components
 */
export const createTodoTable = (state: TodoTableState) => {
  const { components, projectId } = state;
  const todoCreator = components.get(TodoCreator);

  // Inizializza il progetto nel TodoCreator
  todoCreator.setProject(projectId);

  // Stato locale per la tabella
  let currentTodos: Todo[] = [];
  let filteredTodos: Todo[] = [];
  let statusFilter: TodoStatus | 'all' = 'all';
  let priorityFilter: TodoPriority | 'all' = 'all';
  let searchText = '';

  const updateFilteredTodos = () => {
    filteredTodos = currentTodos.filter(todo => {
      // Filtro per status
      if (statusFilter !== 'all' && todo.status !== statusFilter) {
        return false;
      }
      
      // Filtro per priorità
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) {
        return false;
      }
      
      // Filtro per testo
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return todo.title.toLowerCase().includes(searchLower) ||
               (todo.description && todo.description.toLowerCase().includes(searchLower)) ||
               (todo.assignedTo && todo.assignedTo.toLowerCase().includes(searchLower));
      }
      
      return true;
    });
    
    updateTable();
  };

  const updateTable = () => {
    const tableData = filteredTodos.map(todo => ({
      data: {
        todoId: todo.id, // Usiamo solo l'ID invece dei GUIDs nelle row data
        Titolo: todo.title,
        Descrizione: todo.description || '-',
        Status: todo.status,
        Priorità: todo.priority,
        Assegnato: todo.assignedTo || '-',
        Elementi: todo.elementsCount.toString(),
        'Data Creazione': todo.createdAt.toLocaleDateString('it-IT'),
        'Ultimo Aggiornamento': todo.updatedAt.toLocaleDateString('it-IT')
      }
    }));

    table.data = tableData;
  };

  // Configurazione della tabella
  const table = BUI.Component.create(() => {
    return BUI.html`
      <bim-table headersHidden>
        <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
          Nessun Todo trovato
        </bim-label>
      </bim-table>
    `;
  }) as any;

  // Configurazione delle colonne
  table.columns = [
    {
      name: 'Titolo',
      width: '200px'
    },
    {
      name: 'Descrizione',
      width: '250px'
    },
    {
      name: 'Status',
      width: '120px'
    },
    {
      name: 'Priorità',
      width: '100px'
    },
    {
      name: 'Assegnato',
      width: '120px'
    },
    {
      name: 'Elementi',
      width: '80px'
    },
    {
      name: 'Data Creazione',
      width: '120px'
    },
    {
      name: 'Ultimo Aggiornamento',
      width: '150px'
    }
  ];

  // Trasformazione dei dati per mostrare informazioni del Todo usando il TodoCreator
  table.dataTransform = {
    Titolo: (value: any, rowData: any) => {
      const todoId = rowData.todoId;
      const todo = todoCreator.getTodo(todoId);
      if (!todo) return value;
      
      return BUI.html`
        <div style="display: flex; align-items: center; gap: 8px;">
          <bim-label icon="${todo.icon}" style="--bim-icon--c: #029AE0;">
            ${todo.title}
          </bim-label>
        </div>
      `;
    },
    
    Status: (value: TodoStatus) => {
      const statusIcons = {
        [TodoStatus.TODO]: 'radio_button_unchecked',
        [TodoStatus.IN_PROGRESS]: 'schedule',
        [TodoStatus.DONE]: 'check_circle',
        [TodoStatus.CANCELLED]: 'cancel'
      };
      
      const statusColors = {
        [TodoStatus.TODO]: '#666666',
        [TodoStatus.IN_PROGRESS]: '#2196F3',
        [TodoStatus.DONE]: '#4CAF50',
        [TodoStatus.CANCELLED]: '#F44336'
      };
      
      return BUI.html`
        <bim-label icon="${statusIcons[value]}" style="--bim-icon--c: ${statusColors[value]};">
          ${value}
        </bim-label>
      `;
    },
    
    Priorità: (value: TodoPriority) => {
      const priorityColors = {
        [TodoPriority.LOW]: '#4CAF50',
        [TodoPriority.MEDIUM]: '#FF9800',
        [TodoPriority.HIGH]: '#FF5722',
        [TodoPriority.URGENT]: '#F44336'
      };
      
      return BUI.html`
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${priorityColors[value]};"></div>
          ${value}
        </div>
      `;
    },
    
    Elementi: (_value: string, rowData: any) => {
      const todoId = rowData.todoId;
      const todo = todoCreator.getTodo(todoId);
      if (!todo || todo.elementsCount === 0) {
        return BUI.html`<span style="color: #666;">0</span>`;
      }
      
      return BUI.html`
        <bim-button 
          style="--bim-button--bgc: transparent; --bim-label--c: #029AE0;"
          @click=${() => highlightTodoElements(todo)}
        >
          ${todo.elementsCount}
        </bim-button>
      `;
    }
  };

  // Funzione per evidenziare gli elementi di un Todo
  const highlightTodoElements = (todo: Todo) => {
    if (todo.elementsCount === 0) return;
    
    // Qui dovremmo implementare l'evidenziazione degli elementi
    // utilizzando il mondo 3D e l'highlighter
    console.log(`Evidenziando ${todo.elementsCount} elementi per il Todo: ${todo.title}`);
  };

  // Event listeners per aggiornamenti
  todoCreator.onTodosLoaded.add((todos) => {
    currentTodos = todos;
    updateFilteredTodos();
  });

  todoCreator.onTodoAdded.add((todo) => {
    currentTodos.push(todo);
    updateFilteredTodos();
  });

  todoCreator.onTodoUpdated.add((updatedTodo) => {
    const index = currentTodos.findIndex(t => t.id === updatedTodo.id);
    if (index !== -1) {
      currentTodos[index] = updatedTodo;
      updateFilteredTodos();
    }
  });

  todoCreator.onTodoDeleted.add((todoId) => {
    currentTodos = currentTodos.filter(t => t.id !== todoId);
    updateFilteredTodos();
  });

  // Controlli di filtro
  const createFilters = () => {
    return BUI.html`
      <div style="display: flex; gap: 12px; padding: 12px; background: var(--bim-ui_bg-contrast-20); border-radius: 6px; margin-bottom: 12px;">
        <bim-text-input 
          placeholder="Cerca todo..."
          @input=${(e: Event) => {
            searchText = (e.target as any).value;
            updateFilteredTodos();
          }}
        ></bim-text-input>
        
        <bim-dropdown>
          <bim-option label="Tutti gli status" value="all" checked></bim-option>
          <bim-option label="Da fare" value="${TodoStatus.TODO}"></bim-option>
          <bim-option label="In corso" value="${TodoStatus.IN_PROGRESS}"></bim-option>
          <bim-option label="Completato" value="${TodoStatus.DONE}"></bim-option>
          <bim-option label="Annullato" value="${TodoStatus.CANCELLED}"></bim-option>
        </bim-dropdown>
        
        <bim-dropdown>
          <bim-option label="Tutte le priorità" value="all" checked></bim-option>
          <bim-option label="Bassa" value="${TodoPriority.LOW}"></bim-option>
          <bim-option label="Media" value="${TodoPriority.MEDIUM}"></bim-option>
          <bim-option label="Alta" value="${TodoPriority.HIGH}"></bim-option>
          <bim-option label="Urgente" value="${TodoPriority.URGENT}"></bim-option>
        </bim-dropdown>
        
        <bim-button 
          label="Nuovo Todo" 
          icon="add"
          @click=${() => openTodoForm()}
        ></bim-button>
      </div>
    `;
  };

  const openTodoForm = () => {
    // Qui dovremmo aprire un form per creare un nuovo Todo
    console.log('Apertura form per nuovo Todo');
  };

  // Menu contestuale per azioni sui Todo
  table.addEventListener('rowcreated', (e: any) => {
    const row = e.detail.row;
    const rowData = e.detail.data;
    
    // Aggiungi menu contestuale
    row.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      
      const todoId = rowData.todoId;
      const todo = todoCreator.getTodo(todoId);
      if (!todo) return;
      
      // Crea menu contestuale
      const contextMenu = document.createElement('div');
      contextMenu.style.cssText = `
        position: fixed;
        top: ${event.clientY}px;
        left: ${event.clientX}px;
        background: var(--bim-ui_bg-contrast-20);
        border: 1px solid var(--bim-ui_bg-contrast-40);
        border-radius: 6px;
        padding: 8px;
        z-index: 10000;
        min-width: 120px;
      `;
      
      contextMenu.innerHTML = `
        <div style="padding: 8px 12px; cursor: pointer; border-radius: 4px;" data-action="edit">
          📝 Modifica
        </div>
        <div style="padding: 8px 12px; cursor: pointer; border-radius: 4px;" data-action="delete">
          🗑️ Elimina
        </div>
        <div style="padding: 8px 12px; cursor: pointer; border-radius: 4px;" data-action="highlight">
          🎯 Evidenzia elementi
        </div>
      `;
      
      // Gestione click sulle azioni
      contextMenu.addEventListener('click', async (clickEvent: MouseEvent) => {
        const action = (clickEvent.target as any).dataset.action;
        
        switch (action) {
          case 'edit':
            console.log('Modifica Todo:', todo.title);
            break;
          case 'delete':
            if (confirm(`Eliminare il Todo "${todo.title}"?`)) {
              await todoCreator.deleteTodo(todo.id);
            }
            break;
          case 'highlight':
            highlightTodoElements(todo);
            break;
        }
        
        document.body.removeChild(contextMenu);
      });
      
      // Rimuovi menu al click fuori
      const removeMenu = () => {
        if (document.body.contains(contextMenu)) {
          document.body.removeChild(contextMenu);
        }
        document.removeEventListener('click', removeMenu);
      };
      
      setTimeout(() => document.addEventListener('click', removeMenu), 10);
      document.body.appendChild(contextMenu);
    });
  });

  // Componente principale
  const component = BUI.Component.create(() => {
    return BUI.html`
      <div style="display: flex; flex-direction: column; height: 100%; gap: 12px;">
        ${createFilters()}
        <div style="flex: 1; overflow: auto;">
          ${table}
        </div>
      </div>
    `;
  });

  // Carica i dati iniziali
  todoCreator.loadTodosFromFirebase();

  return component;
};
