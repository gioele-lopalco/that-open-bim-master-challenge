import * as BUI from '@thatopen/ui';
import * as OBC from '@thatopen/components';
import { SimpleQTO } from './SimpleQTO';
import type { ElementQuantity, QuantitySummary } from './SimpleQTO';

export interface SimpleQTOUIState {
  components: OBC.Components;
}

/**
 * Creates the user interface for SimpleQTO using only BIM UI Components
 */
export const createSimpleQTOUI = (state: SimpleQTOUIState) => {
  const { components } = state;
  const simpleQTO = components.get(SimpleQTO);

  let currentSummary: QuantitySummary | null = null;
  let selectedElements: ElementQuantity[] = [];

  // Main quantities panel
  const quantitiesPanel = BUI.Component.create(() => {
    return BUI.html`
      <bim-panel label="Quantity Take-Off" icon="calculate">
        <bim-panel-section collapsed label="Quantities Summary" icon="summarize">
          <div id="quantities-summary">
            ${createEmptyState()}
          </div>
        </bim-panel-section>
        
        <bim-panel-section collapsed label="By Element Type" icon="category">
          <div id="quantities-by-type">
            ${createEmptyState()}
          </div>
        </bim-panel-section>
        
        <bim-panel-section collapsed label="Selected Elements" icon="list">
          <div id="selected-elements">
            ${createEmptyState()}
          </div>
        </bim-panel-section>
        
        <bim-panel-section label="Actions" icon="settings">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <bim-button 
              label="Calculate Quantities" 
              icon="calculate"
              @click=${calculateFromSelection}
            ></bim-button>
            
            <bim-button 
              label="Export JSON" 
              icon="download"
              @click=${exportQuantities}
            ></bim-button>
            
            <bim-button 
              label="Clear Selection" 
              icon="clear"
              @click=${clearSelection}
            ></bim-button>
          </div>
        </bim-panel-section>
      </bim-panel>
    `;
  });

  // Empty state
  const createEmptyState = () => {
    return BUI.html`
      <div style="text-align: center; padding: 20px; color: #666;">
        <bim-label icon="info" style="--bim-icon--c: #666;">
          Select elements to see quantities
        </bim-label>
      </div>
    `;
  };

  // Creates the quantities summary
  const createQuantitiesSummary = (summary: QuantitySummary) => {
    const quantityRows = Object.entries(summary.quantities).map(([name, data]) => {
      return BUI.html`
        <div class="quantity-row" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
          <bim-label>${name}</bim-label>
          <div style="display: flex; gap: 16px;">
            <span><strong>${data.total.toFixed(2)} ${data.unit}</strong></span>
            <span style="color: #666;">Avg: ${data.average.toFixed(2)}</span>
          </div>
        </div>
      `;
    });

    return BUI.html`
      <div style="margin-bottom: 16px;">
        <bim-label icon="group" style="--bim-icon--c: #029AE0;">
          Total Elements: ${summary.totalElements}
        </bim-label>
      </div>
      <div class="quantities-list">
        ${quantityRows}
      </div>
    `;
  };

  // Creates the summary by type
  const createQuantitiesByType = (summary: QuantitySummary) => {
    const typeCards = Object.entries(summary.byType).map(([type, data]) => {
      const quantities = Object.entries(data.quantities).map(([name, qData]) => {
        return BUI.html`
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
            <span>${name}:</span>
            <span>${qData.total.toFixed(2)} ${qData.unit}</span>
          </div>
        `;
      });

      return BUI.html`
        <div style="margin-bottom: 12px; padding: 12px; background: #f5f5f5; border-radius: 6px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <bim-label icon="category" style="--bim-icon--c: #029AE0;">
              ${type}
            </bim-label>
            <span style="color: #666; font-size: 12px;">(${data.count} elements)</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${quantities}
          </div>
        </div>
      `;
    });

    return BUI.html`
      <div class="types-list">
        ${typeCards}
      </div>
    `;
  };

  // Creates the list of selected elements
  const createSelectedElementsList = (elements: ElementQuantity[]) => {
    const elementCards = elements.map(element => {
      const quantities = Object.entries(element.quantities).map(([name, data]) => {
        return BUI.html`
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span>${name}:</span>
            <span>${data.value.toFixed(2)} ${data.unit}</span>
          </div>
        `;
      });

      return BUI.html`
        <div style="margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px;">
          <div style="font-weight: 500; margin-bottom: 4px;">
            <bim-label icon="architecture">
              ${element.name} (${element.type})
            </bim-label>
          </div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
            ID: ${element.elementId}
          </div>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            ${quantities}
          </div>
        </div>
      `;
    });

    return BUI.html`
      <div class="elements-list" style="max-height: 300px; overflow-y: auto;">
        ${elementCards}
      </div>
    `;
  };

  // Updates the interface
  const updateUI = () => {
    const summaryContainer = quantitiesPanel.querySelector('#quantities-summary');
    const byTypeContainer = quantitiesPanel.querySelector('#quantities-by-type');
    const elementsContainer = quantitiesPanel.querySelector('#selected-elements');

    if (currentSummary && selectedElements.length > 0) {
      if (summaryContainer) {
        summaryContainer.innerHTML = createQuantitiesSummary(currentSummary).toString();
      }
      
      if (byTypeContainer) {
        byTypeContainer.innerHTML = createQuantitiesByType(currentSummary).toString();
      }
      
      if (elementsContainer) {
        elementsContainer.innerHTML = createSelectedElementsList(selectedElements).toString();
      }
    } else {
      if (summaryContainer) {
        summaryContainer.innerHTML = createEmptyState().toString();
      }
      
      if (byTypeContainer) {
        byTypeContainer.innerHTML = createEmptyState().toString();
      }
      
      if (elementsContainer) {
        elementsContainer.innerHTML = createEmptyState().toString();
      }
    }
  };

  // Calculate quantities from current selection (mock)
  const calculateFromSelection = () => {
    // Here we should get selected elements from the 3D world
    // For now we create sample data
    const mockElements = [
      {
        id: 'wall_1',
        globalId: 'GUID_001',
        type: 'IfcWall',
        name: 'External Wall',
        propertySets: [
          {
            properties: [
              { name: 'Volume', value: '15.5 m³' },
              { name: 'Area', value: '25.0 m²' },
              { name: 'Length', value: '5.0 m' }
            ]
          }
        ]
      },
      {
        id: 'slab_1',
        globalId: 'GUID_002',
        type: 'IfcSlab',
        name: 'Ground Floor Slab',
        propertySets: [
          {
            properties: [
              { name: 'Volume', value: '8.2 m³' },
              { name: 'Area', value: '40.0 m²' },
              { name: 'Thickness', value: '0.2 m' }
            ]
          }
        ]
      }
    ];

    try {
      currentSummary = simpleQTO.calculateQuantities(mockElements);
      selectedElements = simpleQTO.getSelectedElements();
      updateUI();
      
      // Show success notification
      console.log('Quantities calculated successfully!');
    } catch (error) {
      console.error('Error calculating quantities:', error);
    }
  };

  // Export quantities
  const exportQuantities = () => {
    try {
      simpleQTO.downloadQuantitiesJSON();
      console.log('Export completed successfully!');
    } catch (error) {
      console.error('Error in export:', error);
      alert('Error in export. Make sure you have calculated quantities before exporting.');
    }
  };

  // Clear selection
  const clearSelection = () => {
    simpleQTO.clearSelection();
    currentSummary = null;
    selectedElements = [];
    updateUI();
    console.log('Selection cleared');
  };

  // Event listeners
  simpleQTO.onQuantitiesCalculated.add((summary) => {
    currentSummary = summary;
    updateUI();
  });

  simpleQTO.onSelectionChanged.add((elements) => {
    selectedElements = elements;
    updateUI();
  });

  return quantitiesPanel;
};

/**
 * Creates a modal for SimpleQTO
 */
export const createSimpleQTOModal = (state: SimpleQTOUIState) => {
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
      max-width: 90vw;
      max-height: 90vh;
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

    const qtoUI = createSimpleQTOUI(state);
    modalContent.appendChild(qtoUI);
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
 * Creates a button to activate SimpleQTO
 */
export const simpleQTOTool = (state: SimpleQTOUIState) => {
  const { openModal } = createSimpleQTOModal(state);
  
  return BUI.Component.create(() => {
    return BUI.html`
      <bim-button
        icon="calculate"
        tooltip="Quantity Take-Off"
        @click=${openModal}
      ></bim-button>
    `;
  });
};
