import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ModelElement } from '../classes/Project';

interface ModelSelectionContextType {
  selectedElements: ModelElement[];
  setSelectedElements: (elements: ModelElement[]) => void;
  highlightElements: (elements: ModelElement[]) => void;
  clearSelection: () => void;
  // Funzione che può essere impostata dal viewer per evidenziare elementi
  highlightCallback?: (elements: ModelElement[]) => Promise<void>;
  setHighlightCallback: (callback: (elements: ModelElement[]) => Promise<void>) => void;
}

const ModelSelectionContext = createContext<ModelSelectionContextType | undefined>(undefined);

export const useModelSelection = () => {
  const context = useContext(ModelSelectionContext);
  if (!context) {
    throw new Error('useModelSelection must be used within a ModelSelectionProvider');
  }
  return context;
};

interface ModelSelectionProviderProps {
  children: ReactNode;
}

export const ModelSelectionProvider: React.FC<ModelSelectionProviderProps> = ({ children }) => {
  const [selectedElements, setSelectedElements] = useState<ModelElement[]>([]);
  const [highlightCallback, setHighlightCallback] = useState<((elements: ModelElement[]) => Promise<void>) | undefined>();
  
  const highlightElements = async (elements: ModelElement[]) => {
    if (highlightCallback) {
      await highlightCallback(elements);
    } else {
      console.log('No highlight callback available, elements:', elements);
    }
    setSelectedElements(elements);
  };
  
  const clearSelection = () => {
    setSelectedElements([]);
  };
  
  const value: ModelSelectionContextType = {
    selectedElements,
    setSelectedElements,
    highlightElements,
    clearSelection,
    highlightCallback,
    setHighlightCallback: (callback) => setHighlightCallback(() => callback)
  };
  
  return (
    <ModelSelectionContext.Provider value={value}>
      {children}
    </ModelSelectionContext.Provider>
  );
};
