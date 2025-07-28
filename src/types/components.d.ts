import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'bim-label': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-grid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-toolbar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-text-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-panel': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-panel-section': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-toolbars-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-toolbar-section': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-toolbar-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-number-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-dropdown': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'bim-option': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}