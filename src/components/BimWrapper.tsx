import { createElement, forwardRef } from 'react';
import type { ReactNode } from 'react';

interface BimElementProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}

export const BimLabel = forwardRef<HTMLElement, BimElementProps>((props, ref) => {
  return createElement('bim-label', { ...props, ref });
});

export const BimButton = forwardRef<HTMLElement, BimElementProps & {
  label?: string;
  icon?: string;
  onClick?: () => void;
}>((props, ref) => {
  return createElement('bim-button', { ...props, ref });
});

export const BimTextInput = forwardRef<HTMLElement, BimElementProps & {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
}>((props, ref) => {
  return createElement('bim-text-input', { ...props, ref });
});

export const BimGrid = forwardRef<HTMLElement, BimElementProps & {
  id?: string;
}>((props, ref) => {
  return createElement('bim-grid', { ...props, ref });
});

export const BimPanel = forwardRef<HTMLElement, BimElementProps & {
  label?: string;
}>((props, ref) => {
  return createElement('bim-panel', { ...props, ref });
});

export const BimToolbar = forwardRef<HTMLElement, BimElementProps & {
  label?: string;
  active?: boolean;
}>((props, ref) => {
  return createElement('bim-toolbar', { ...props, ref });
});

BimLabel.displayName = 'BimLabel';
BimButton.displayName = 'BimButton';
BimTextInput.displayName = 'BimTextInput';
BimGrid.displayName = 'BimGrid';
BimPanel.displayName = 'BimPanel';
BimToolbar.displayName = 'BimToolbar'; 