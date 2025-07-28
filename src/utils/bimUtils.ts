import { createElement } from 'react';
import type { ReactNode } from 'react';

/**
 * Utility per creare componenti BIM con TypeScript support
 */
export const createBimElement = (
  tagName: string, 
  props?: Record<string, any>, 
  children?: ReactNode
) => {
  return createElement(tagName, props, children);
};

/**
 * Componenti BIM helper functions
 */
export const BimComponents = {
  Label: (props: { className?: string; children: ReactNode }) => 
    createBimElement('bim-label', props, props.children),
    
  Button: (props: { label?: string; icon?: string; onClick?: () => void; className?: string }) => 
    createBimElement('bim-button', props),
    
  TextInput: (props: { 
    label?: string; 
    placeholder?: string; 
    value?: string; 
    onChange?: (e: any) => void;
    className?: string;
  }) => createBimElement('bim-text-input', props),
    
  Grid: (props: { id?: string; className?: string; children?: ReactNode }) => 
    createBimElement('bim-grid', props, props.children),
    
  Panel: (props: { label?: string; className?: string; children?: ReactNode }) => 
    createBimElement('bim-panel', props, props.children),
    
  Toolbar: (props: { label?: string; active?: boolean; className?: string; children?: ReactNode }) => 
    createBimElement('bim-toolbar', props, props.children),
};

export default BimComponents; 