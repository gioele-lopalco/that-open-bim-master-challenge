import * as OBC from '@thatopen/components';

/**
 * Interface for element quantity data
 */
export interface ElementQuantity {
  elementId: string;
  globalId: string;
  type: string;
  name: string;
  quantities: {
    [propertyName: string]: {
      value: number;
      unit: string;
    };
  };
}

/**
 * Interface for total quantities summary
 */
export interface QuantitySummary {
  totalElements: number;
  quantities: {
    [propertyName: string]: {
      total: number;
      unit: string;
      average: number;
    };
  };
  byType: {
    [elementType: string]: {
      count: number;
      quantities: {
        [propertyName: string]: {
          total: number;
          unit: string;
          average: number;
        };
      };
    };
  };
}

/**
 * SimpleQTO component for quantity calculation
 */
export class SimpleQTO extends OBC.Component {
  static uuid = 'a8b4c2d1-3e4f-5a6b-7c8d-9e0f1a2b3c4d';
  enabled = true;

  private _selectedElements: ElementQuantity[] = [];
  private _currentSummary: QuantitySummary | null = null;

  // Events
  onQuantitiesCalculated = new OBC.Event<QuantitySummary>();
  onSelectionChanged = new OBC.Event<ElementQuantity[]>();

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(SimpleQTO.uuid, this);
  }

  /**
   * Calculates quantities of selected elements
   */
  calculateQuantities(selectedElements: any[]): QuantitySummary {
    this._selectedElements = this.extractQuantitiesFromElements(selectedElements);
    this._currentSummary = this.calculateSummary(this._selectedElements);
    
    this.onQuantitiesCalculated.trigger(this._currentSummary);
    this.onSelectionChanged.trigger(this._selectedElements);
    
    return this._currentSummary;
  }

  /**
   * Extracts quantities from IFC elements
   */
  private extractQuantitiesFromElements(elements: any[]): ElementQuantity[] {
    return elements.map(element => {
      const quantities: { [key: string]: { value: number; unit: string } } = {};
      
      // Extract common quantity properties
      if (element.propertySets) {
        for (const pset of element.propertySets) {
          for (const prop of pset.properties) {
            if (this.isQuantityProperty(prop.name)) {
              const numericValue = this.extractNumericValue(prop.value);
              if (numericValue !== null) {
                quantities[prop.name] = {
                  value: numericValue,
                  unit: this.extractUnit(prop.value) || 'm'
                };
              }
            }
          }
        }
      }

      // Add basic quantities if available
      if (element.Volume) {
        quantities['Volume'] = {
          value: this.extractNumericValue(element.Volume) || 0,
          unit: 'm³'
        };
      }

      if (element.Area) {
        quantities['Area'] = {
          value: this.extractNumericValue(element.Area) || 0,
          unit: 'm²'
        };
      }

      if (element.Length) {
        quantities['Lunghezza'] = {
          value: this.extractNumericValue(element.Length) || 0,
          unit: 'm'
        };
      }

      return {
        elementId: element.id,
        globalId: element.globalId || element.GlobalId || '',
        type: element.type || 'Unknown',
        name: element.name || 'Unnamed',
        quantities
      };
    });
  }

  /**
   * Checks if a property is related to quantities
   */
  private isQuantityProperty(propName: string): boolean {
    const quantityKeywords = [
      'volume', 'area', 'length', 'height', 'width', 'depth',
      'lunghezza', 'larghezza', 'altezza', 'profondità',
      'superficie', 'volume', 'peso', 'weight', 'mass', 'massa',
      'perimeter', 'perimetro', 'thickness', 'spessore'
    ];
    
    return quantityKeywords.some(keyword => 
      propName.toLowerCase().includes(keyword)
    );
  }

  /**
   * Extracts numeric value from a property
   */
  private extractNumericValue(value: any): number | null {
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      const matches = value.match(/(-?\d+\.?\d*)/);
      return matches ? parseFloat(matches[1]) : null;
    }
    
    if (value && typeof value === 'object' && 'value' in value) {
      return this.extractNumericValue(value.value);
    }
    
    return null;
  }

  /**
   * Extracts the unit of measure from a property
   */
  private extractUnit(value: any): string | null {
    if (typeof value === 'string') {
      const unitMatches = value.match(/[a-zA-Z²³]+$/);
      return unitMatches ? unitMatches[0] : null;
    }
    
    if (value && typeof value === 'object' && 'unit' in value) {
      return value.unit;
    }
    
    return null;
  }

  /**
   * Calculates the quantities summary
   */
  private calculateSummary(elements: ElementQuantity[]): QuantitySummary {
    const summary: QuantitySummary = {
      totalElements: elements.length,
      quantities: {},
      byType: {}
    };

    // Collect all quantity properties
    const allQuantityProps = new Set<string>();
    elements.forEach(el => {
      Object.keys(el.quantities).forEach(prop => allQuantityProps.add(prop));
    });

    // Calculate totals and averages for each property
    allQuantityProps.forEach(propName => {
      const values = elements
        .map(el => el.quantities[propName])
        .filter(q => q !== undefined);
      
      if (values.length > 0) {
        const total = values.reduce((sum, q) => sum + q.value, 0);
        summary.quantities[propName] = {
          total,
          unit: values[0].unit,
          average: total / values.length
        };
      }
    });

    // Calculate by element type
    const elementsByType = new Map<string, ElementQuantity[]>();
    elements.forEach(el => {
      if (!elementsByType.has(el.type)) {
        elementsByType.set(el.type, []);
      }
      elementsByType.get(el.type)!.push(el);
    });

    elementsByType.forEach((typeElements, type) => {
      summary.byType[type] = {
        count: typeElements.length,
        quantities: {}
      };

      allQuantityProps.forEach(propName => {
        const values = typeElements
          .map(el => el.quantities[propName])
          .filter(q => q !== undefined);
        
        if (values.length > 0) {
          const total = values.reduce((sum, q) => sum + q.value, 0);
          summary.byType[type].quantities[propName] = {
            total,
            unit: values[0].unit,
            average: total / values.length
          };
        }
      });
    });

    return summary;
  }

  /**
   * Exports current quantities in JSON format
   */
  exportToJSON(): string {
    if (!this._currentSummary) {
      throw new Error('No quantities calculated. Select elements before exporting.');
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      summary: this._currentSummary,
      elements: this._selectedElements,
      metadata: {
        totalElements: this._selectedElements.length,
        quantityTypes: Object.keys(this._currentSummary.quantities),
        elementTypes: Object.keys(this._currentSummary.byType)
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Downloads the quantities JSON file
   */
  downloadQuantitiesJSON(filename?: string): void {
    try {
      const jsonData = this.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `quantities_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Quantities file downloaded successfully');
    } catch (error) {
      console.error('Error downloading JSON file:', error);
      throw error;
    }
  }

  /**
   * Gets the current quantities summary
   */
  getCurrentSummary(): QuantitySummary | null {
    return this._currentSummary;
  }

  /**
   * Gets selected elements with their quantities
   */
  getSelectedElements(): ElementQuantity[] {
    return [...this._selectedElements];
  }

  /**
   * Clears the current selection
   */
  clearSelection(): void {
    this._selectedElements = [];
    this._currentSummary = null;
    this.onSelectionChanged.trigger([]);
  }
}
