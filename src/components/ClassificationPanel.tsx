import { useState, useEffect } from 'react';
import * as OBC from '@thatopen/components';
import * as OBF from '@thatopen/components-front';
import { exportFragmentModel } from '../utils/fragmentUtils';
import './ClassificationPanel.css';

interface ClassificationGroup {
  name: string;
  count: number;
  color: string;
  visible: boolean;
  highlighted: boolean;
}

interface ClassificationPanelProps {
  components: OBC.Components | null;
  isVisible: boolean;
  onClose?: () => void;
}

export function ClassificationPanel({ components, isVisible, onClose }: ClassificationPanelProps) {
  const [classifications, setClassifications] = useState<Map<string, ClassificationGroup>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['byCategory']));
  const [categoryElementsMap, setCategoryElementsMap] = useState<Map<string, OBC.ModelIdMap>>(new Map());

  const categoryColors: { [key: string]: string } = {
    'IFCWALL': '#FF6B6B',
    'IFCWALLSTANDARDCASE': '#FF6B6B',
    'IFCSLAB': '#4ECDC4',
    'IFCCOLUMN': '#45B7D1',
    'IFCBEAM': '#F7DC6F',
    'IFCDOOR': '#BB8FCE',
    'IFCWINDOW': '#85C1E9',
    'IFCSTAIR': '#F8C471',
    'IFCROOF': '#82E0AA',
    'IFCFURNISHINGELEMENT': '#F1948A',
    'IFCRAILING': '#D7DBDD',
    'IFCSPACE': '#A9DFBF',
    'IFCBUILDINGELEMENTPROXY': '#AED6F1',
  };

  const getCategoryColor = (category: string): string => {
    const upperCategory = category.toUpperCase();
    return categoryColors[upperCategory] || '#CCCCCC';
  };

  useEffect(() => {
    if (!components || !isVisible) return;

    const initializeClassifier = async () => {
      setIsLoading(true);
      try {
        const fragments = components.get(OBC.FragmentsManager);
        
        if (fragments.list.size === 0) {
          console.log('Nessun modello IFC caricato');
          setIsLoading(false);
          return;
        }

        const classificationMap = new Map<string, ClassificationGroup>();
        const elementsMap = new Map<string, OBC.ModelIdMap>();
        
        for (const [modelId, model] of fragments.list) {
          console.log(`🔍 Processando modello: ${modelId}`);
          
          const allIds = await model.getLocalIds();
          const itemsData = await model.getItemsData(allIds);
          
          console.log(`📊 Trovati ${itemsData.length} elementi nel modello ${modelId}`);
          
          const elementDataMap = new Map();
          for (let i = 0; i < itemsData.length; i++) {
            const itemData = itemsData[i];
            const expressID = allIds[i];
            elementDataMap.set(expressID, itemData);
          }
          
          for (const [expressID, itemData] of elementDataMap) {
            let category = 'UNKNOWN';
            
            if (itemData && (itemData as any)._category && (itemData as any)._category.value) {
              category = (itemData as any)._category.value;
            } else if (itemData && (itemData as any).type) {
              category = (itemData as any).type;
            }
            
            if (!classificationMap.has(category)) {
              classificationMap.set(category, {
                name: category,
                count: 0,
                color: getCategoryColor(category),
                visible: true,
                highlighted: false
              });
              elementsMap.set(category, {});
            }
            
            const categoryElements = elementsMap.get(category)!;
            if (!categoryElements[modelId]) {
              categoryElements[modelId] = new Set();
            }
            categoryElements[modelId].add(expressID);
            
            const classification = classificationMap.get(category)!;
            classification.count++;
          }
        }
        
        setCategoryElementsMap(elementsMap);
        
        setClassifications(classificationMap);
        console.log('✅ Classificazioni caricate:', classificationMap);
      } catch (error) {
        console.error('❌ Errore nell\'inizializzazione del classificatore:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeClassifier();
  }, [components, isVisible]);

  const highlightCategory = async (categoryName: string) => {
    if (!components) return;

    try {
      const highlighter = components.get(OBF.Highlighter);
      
      const modelIdMap = categoryElementsMap.get(categoryName);
      if (!modelIdMap) {
        console.log(`❌ Nessun elemento trovato per la categoria ${categoryName}`);
        return;
      }
      
      await highlighter.clear('select');
      
      for (const [modelId, expressIDs] of Object.entries(modelIdMap)) {
        if (highlighter.selection.select instanceof Map) {
          highlighter.selection.select.set(modelId, expressIDs);
        }
      }
      
      const updatedClassifications = new Map(classifications);
      for (const [key, value] of updatedClassifications) {
        value.highlighted = key === categoryName;
      }
      setClassifications(updatedClassifications);
      
      console.log(`✅ Categoria ${categoryName} evidenziata con ${Object.keys(modelIdMap).length} modelli`);
    } catch (error) {
      console.error('❌ Errore nell\'evidenziare la categoria:', error);
    }
  };

  const isolateCategory = async (categoryName: string) => {
    if (!components) return;

    try {
      const hider = components.get(OBC.Hider);
      
      const modelIdMap = categoryElementsMap.get(categoryName);
      if (!modelIdMap) {
        console.log(`❌ Nessun elemento trovato per la categoria ${categoryName}`);
        return;
      }
      
      await hider.isolate(modelIdMap);
      
      console.log(`✅ Categoria ${categoryName} isolata`);
    } catch (error) {
      console.error('❌ Errore nell\'isolare la categoria:', error);
    }
  };

  const toggleCategoryVisibility = async (categoryName: string) => {
    if (!components) return;

    try {
      const hider = components.get(OBC.Hider);
      
      const modelIdMap = categoryElementsMap.get(categoryName);
      if (!modelIdMap) {
        console.log(`❌ Nessun elemento trovato per la categoria ${categoryName}`);
        return;
      }
      
      const classification = classifications.get(categoryName);
      if (!classification) return;
      
      await hider.set(!classification.visible, modelIdMap);
      
      const updatedClassifications = new Map(classifications);
      classification.visible = !classification.visible;
      setClassifications(updatedClassifications);
      
      console.log(`✅ Visibilità categoria ${categoryName}: ${classification.visible}`);
    } catch (error) {
      console.error('❌ Errore nel toggleVisibilità:', error);
    }
  };

  const resetVisibility = async () => {
    if (!components) return;

    try {
      const hider = components.get(OBC.Hider);
      const highlighter = components.get(OBF.Highlighter);
      
      await hider.set(true);
      
      await highlighter.clear('select');
      
      const updatedClassifications = new Map(classifications);
      for (const [, value] of updatedClassifications) {
        value.visible = true;
        value.highlighted = false;
      }
      setClassifications(updatedClassifications);
      
      console.log('✅ Visibilità resettata');
    } catch (error) {
      console.error('❌ Errore nel reset visibilità:', error);
    }
  };

  const exportCategory = async (categoryName: string) => {
    if (!components) return;

    try {
      const fragments = components.get(OBC.FragmentsManager);
      
      const modelIdMap = categoryElementsMap.get(categoryName);
      if (!modelIdMap) {
        console.log(`❌ Nessun elemento trovato per la categoria ${categoryName}`);
        return;
      }

      const exportData = {
        category: categoryName,
        timestamp: new Date().toISOString(),
        totalElements: classifications.get(categoryName)?.count || 0,
        models: {} as any
      };

      for (const [modelId, expressIDs] of Object.entries(modelIdMap)) {
        const model = fragments.list.get(modelId);
        if (!model) continue;

        const idsArray = Array.from(expressIDs);
        const elementsData = await model.getItemsData(idsArray);

        exportData.models[modelId] = {
          modelId,
          elementCount: idsArray.length,
          elements: elementsData.map((elementData, index) => ({
            expressID: idsArray[index],
            data: elementData
          }))
        };
      }

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${categoryName}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);

      console.log(`✅ Categoria ${categoryName} esportata con successo`);
    } catch (error) {
      console.error('❌ Errore nell\'esportazione della categoria:', error);
    }
  };

  const exportCategoryAsFrag = async (categoryName: string) => {
    if (!components) return;

    try {
      const fragments = components.get(OBC.FragmentsManager);
      
      const modelIdMap = categoryElementsMap.get(categoryName);
      if (!modelIdMap) {
        console.log(`❌ Nessun elemento trovato per la categoria ${categoryName}`);
        return;
      }

      for (const [modelId] of Object.entries(modelIdMap)) {
        const model = fragments.list.get(modelId);
        if (!model) continue;

        const filename = `${categoryName}_${modelId}`;
        await exportFragmentModel(model, filename);
      }

      console.log(`✅ Categoria ${categoryName} esportata in formato .frag`);
    } catch (error) {
      console.error('❌ Errore nell\'esportazione .frag della categoria:', error);
    }
  };

  const exportAllCategories = async () => {
    if (!components) return;

    try {
      const fragments = components.get(OBC.FragmentsManager);

      const exportData = {
        projectName: 'IFC_Classification_Export',
        timestamp: new Date().toISOString().split('T')[0],
        totalCategories: classifications.size,
        categories: {} as any
      };

      for (const [categoryName, categoryData] of classifications) {
        const modelIdMap = categoryElementsMap.get(categoryName);
        if (!modelIdMap) continue;

        exportData.categories[categoryName] = {
          name: categoryName,
          count: categoryData.count,
          color: categoryData.color,
          models: {} as any
        };

        for (const [modelId, expressIDs] of Object.entries(modelIdMap)) {
          const model = fragments.list.get(modelId);
          if (!model) continue;

          const idsArray = Array.from(expressIDs);
          const elementsData = await model.getItemsData(idsArray);

          exportData.categories[categoryName].models[modelId] = {
            modelId,
            elementCount: idsArray.length,
            elements: elementsData.map((elementData, index) => ({
              expressID: idsArray[index],
              data: elementData
            }))
          };
        }
      }

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `IFC_All_Categories_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);

      console.log(`✅ Tutte le categorie esportate con successo`);
    } catch (error) {
      console.error('❌ Errore nell\'esportazione di tutte le categorie:', error);
    }
  };

  const exportAllCategoriesAsFrag = async () => {
    if (!components) return;

    try {
      const fragments = components.get(OBC.FragmentsManager);

      for (const [categoryName] of classifications) {
        const modelIdMap = categoryElementsMap.get(categoryName);
        if (!modelIdMap) continue;

        for (const [modelId] of Object.entries(modelIdMap)) {
          const model = fragments.list.get(modelId);
          if (!model) continue;

          const filename = `${categoryName}_${modelId}`;
          await exportFragmentModel(model, filename);
        }
      }

      console.log(`✅ Tutte le categorie esportate in formato .frag`);
    } catch (error) {
      console.error('❌ Errore nell\'esportazione .frag di tutte le categorie:', error);
    }
  };

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`classification-panel ${isVisible ? 'visible' : ''}`}>
      <div className="classification-panel-header">
        <h3>Classificazione Elementi</h3>
        {onClose && (
          <button 
            className="classification-panel-close"
            onClick={onClose}
            title="Chiudi pannello"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="classification-panel-content">
        <div className="classification-controls">
          <button 
            className="control-button-small"
            onClick={resetVisibility}
            title="Reset visibilità"
          >
            <span className="material-symbols-outlined">visibility</span>
            Reset
          </button>
          <button 
            className="control-button-small export-button"
            onClick={exportAllCategories}
            title="Esporta tutte le categorie in JSON"
          >
            <span className="material-symbols-outlined">download</span>
            Esporta JSON
          </button>
          <button 
            className="control-button-small export-button"
            onClick={exportAllCategoriesAsFrag}
            title="Esporta tutte le categorie in formato .frag"
          >
            <span className="material-symbols-outlined">file_download</span>
            Esporta .frag
          </button>
        </div>

        <div className="classification-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('byCategory')}
          >
            <span className="expand-icon">
              {expandedSections.has('byCategory') ? '▼' : '►'}
            </span>
            Categorie IFC
          </button>
          
          {expandedSections.has('byCategory') && (
            <div className="section-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner-small"></div>
                  <span>Caricamento classificazioni...</span>
                </div>
              ) : classifications.size === 0 ? (
                <div className="empty-state">
                  <span>Nessuna categoria trovata</span>
                </div>
              ) : (
                <div className="category-list">
                  {Array.from(classifications.entries()).map(([categoryName, category]) => (
                    <div 
                      key={categoryName} 
                      className={`category-item ${category.highlighted ? 'highlighted' : ''}`}
                    >
                      <div className="category-info" onClick={() => highlightCategory(categoryName)}>
                        <div 
                          className="category-color-indicator" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="category-name">{categoryName}</span>
                        <span className="category-count">{category.count}</span>
                      </div>
                      <div className="category-actions">
                        <button
                          className={`action-button ${!category.visible ? 'inactive' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryVisibility(categoryName);
                          }}
                          title={category.visible ? 'Nascondi' : 'Mostra'}
                        >
                          <span className="material-symbols-outlined">
                            {category.visible ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            isolateCategory(categoryName);
                          }}
                          title="Isola categoria"
                        >
                          <span className="material-symbols-outlined">filter_center_focus</span>
                        </button>
                        <button
                          className="action-button export-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportCategory(categoryName);
                          }}
                          title="Esporta categoria in JSON"
                        >
                          <span className="material-symbols-outlined">download</span>
                        </button>
                        <button
                          className="action-button export-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportCategoryAsFrag(categoryName);
                          }}
                          title="Esporta categoria in formato .frag"
                        >
                          <span className="material-symbols-outlined">file_download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 