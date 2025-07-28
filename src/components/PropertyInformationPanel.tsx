import { useState } from 'react';
import './PropertyInformationPanel.css';

interface PropertyValue {
  name: string;
  value: any;
  type?: string;
}

interface PropertySet {
  name: string;
  properties: PropertyValue[];
}

interface IFCItemData {
  id: number;
  name: any;
  type: any;
  globalId: any;
  objectType?: any;
  tag?: any;
  predefinedType?: any;
  propertySets?: PropertySet[];
  materials?: any[];
  spatialContainer?: any;
}

interface PropertyInformationPanelProps {
  selectedItems: IFCItemData[];
  isVisible: boolean;
  onClose?: () => void;
}

export function PropertyInformationPanel({ selectedItems, isVisible, onClose }: PropertyInformationPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['attributes', 'propertySets']));

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const toggleSubSection = (sectionName: string, subSectionName: string) => {
    const key = `${sectionName}-${subSectionName}`;
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.join(', ');
    return JSON.stringify(value);
  };

  const getItemDisplayName = (item: IFCItemData): string => {
    console.log('🔍 getItemDisplayName - item:', item);
    console.log('🔍 getItemDisplayName - item.name:', item.name);
    console.log('🔍 getItemDisplayName - item.type:', item.type);
    console.log('🔍 getItemDisplayName - item.id:', item.id);
    
    // Extract value from IFC property structure
    const extractValue = (prop: any): string => {
      if (prop && typeof prop === 'object' && 'value' in prop) {
        return prop.value;
      }
      return prop;
    };
    
    const name = extractValue(item.name);
    const type = extractValue(item.type);
    
    if (name && name !== 'Unnamed Element' && name !== 'N/A') {
      return name;
    }
    if (type && type !== 'Unknown' && item.id) {
      return `${type}:${item.id}`;
    }
    if (item.id) {
      return `Element ${item.id}`;
    }
    return 'Elemento senza nome';
  };

  if (!isVisible || selectedItems.length === 0) {
    return null;
  }

  const primaryItem = selectedItems[0]; // Mostra il primo elemento selezionato
  
  // Debug log per verificare i dati
  console.log('🎯 PropertyPanel - Primary item:', primaryItem);
  console.log('🎯 PropertyPanel - Item name:', primaryItem.name);
  console.log('🎯 PropertyPanel - Item type:', primaryItem.type);

  return (
    <div className={`property-information-panel ${isVisible ? 'visible' : ''}`}>
      <div className="property-panel-header">
        <h3>Property Information</h3>
        {onClose && (
          <button 
            className="property-panel-close"
            onClick={onClose}
            title="Close panel"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="property-panel-content">
        {/* Header con nome dell'elemento */}
        <div className="element-header">
          <h4>{getItemDisplayName(primaryItem)}</h4>
        </div>

        {/* Sezione Attributes */}
        <div className="property-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('attributes')}
          >
            <span className="expand-icon">
              {expandedSections.has('attributes') ? '▼' : '►'}
            </span>
            Attributes
          </button>
          
          {expandedSections.has('attributes') && (
            <div className="section-content">
              <div className="property-item">
                <span className="property-label">Class:</span>
                <span className="property-value">{formatValue(primaryItem.type?.value || primaryItem.type)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">GlobalId:</span>
                <span className="property-value">{formatValue(primaryItem.globalId?.value || primaryItem.globalId)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">Name:</span>
                <span className="property-value">{formatValue(primaryItem.name?.value || primaryItem.name)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">ObjectType:</span>
                <span className="property-value">{formatValue(primaryItem.objectType?.value || primaryItem.objectType)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">Tag:</span>
                <span className="property-value">{formatValue(primaryItem.tag?.value || primaryItem.tag)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">PredefinedType:</span>
                <span className="property-value">{formatValue(primaryItem.predefinedType?.value || primaryItem.predefinedType)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">ID:</span>
                <span className="property-value">{formatValue(primaryItem.id)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sezione PropertySets */}
        <div className="property-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('propertySets')}
          >
            <span className="expand-icon">
              {expandedSections.has('propertySets') ? '▼' : '►'}
            </span>
            PropertySets
          </button>
          
          {expandedSections.has('propertySets') && (
            <div className="section-content">
              {primaryItem.propertySets && primaryItem.propertySets.length > 0 ? (
                primaryItem.propertySets.map((propertySet: PropertySet, index: number) => (
                  <div key={index} className="property-subsection">
                    <button 
                      className="subsection-header"
                      onClick={() => toggleSubSection('propertySets', propertySet.name)}
                    >
                      <span className="expand-icon">
                        {expandedSections.has(`propertySets-${propertySet.name}`) ? '▼' : '►'}
                      </span>
                      {propertySet.name}
                    </button>
                    
                    {expandedSections.has(`propertySets-${propertySet.name}`) && (
                      <div className="subsection-content">
                        {propertySet.properties.map((property: PropertyValue, propIndex: number) => (
                          <div key={propIndex} className="property-item">
                            <span className="property-label">{property.name}:</span>
                            <span className="property-value">{formatValue(property.value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="property-item">
                  <span className="property-value">No property sets defined</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sezione Materials */}
        <div className="property-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('materials')}
          >
            <span className="expand-icon">
              {expandedSections.has('materials') ? '▼' : '►'}
            </span>
            Materials
          </button>
          
          {expandedSections.has('materials') && (
            <div className="section-content">
              {primaryItem.materials && primaryItem.materials.length > 0 ? (
                primaryItem.materials.map((material: any, index: number) => (
                  <div key={index} className="property-item">
                    <span className="property-label">Material {index + 1}:</span>
                    <span className="property-value">{formatValue(material)}</span>
                  </div>
                ))
              ) : (
                <div className="property-item">
                  <span className="property-value">No materials defined</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sezione SpatialContainer */}
        <div className="property-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('spatialContainer')}
          >
            <span className="expand-icon">
              {expandedSections.has('spatialContainer') ? '▼' : '►'}
            </span>
            SpatialContainer
          </button>
          
          {expandedSections.has('spatialContainer') && (
            <div className="section-content">
              {primaryItem.spatialContainer ? (
                <div className="property-item">
                  <span className="property-label">Container:</span>
                  <span className="property-value">{formatValue(primaryItem.spatialContainer)}</span>
                </div>
              ) : (
                <div className="property-item">
                  <span className="property-value">No spatial container defined</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sezione Debug (temporanea) */}
        <div className="property-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('debug')}
          >
            <span className="expand-icon">
              {expandedSections.has('debug') ? '▼' : '►'}
            </span>
            Debug Info
          </button>
          
          {expandedSections.has('debug') && (
            <div className="section-content">
              <div className="property-item">
                <span className="property-label">Raw Name:</span>
                <span className="property-value">{JSON.stringify(primaryItem.name)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">Raw Type:</span>
                <span className="property-value">{JSON.stringify(primaryItem.type)}</span>
              </div>
              <div className="property-item">
                <span className="property-label">Raw ID:</span>
                <span className="property-value">{JSON.stringify(primaryItem.id)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 