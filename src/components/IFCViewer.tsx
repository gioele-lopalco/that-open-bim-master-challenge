import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import * as OBC from '@thatopen/components';
import * as OBF from '@thatopen/components-front';
import { PropertyInformationPanel } from './PropertyInformationPanel';
import { ClassificationPanel } from './ClassificationPanel';
import { useModelSelection } from '../contexts/ModelSelectionContext';
import type { ModelElement } from '../classes/Project';
import './IFCViewer.css';

export function IFCViewer() {
  const { setSelectedElements, setHighlightCallback } = useModelSelection();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingIFC, setIsLoadingIFC] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [hasModel, setHasModel] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isolatedItems, setIsolatedItems] = useState<Set<string>>(new Set());
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showClassificationPanel, setShowClassificationPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fragmentInputRef = useRef<HTMLInputElement>(null);
  const isInitialized = useRef(false);
  const componentsRef = useRef<OBC.Components | null>(null);
  const worldRef = useRef<any>(null);
  const highlighterRef = useRef<OBF.Highlighter | null>(null);

  const processIFCData = (rawData: any[]): any[] => {
    return rawData.map(item => {
      console.log('🔍 Processing IFC item:', item);
      
      const extractValue = (prop: any): any => {
        if (prop && typeof prop === 'object' && 'value' in prop) {
          return prop.value;
        }
        return prop;
      };
      
      const processedItem: any = {
        id: extractValue(item._localId) || extractValue(item.expressID) || extractValue(item.localId) || extractValue(item.id),
        name: extractValue(item.Name) || 'Unnamed Element',
        type: extractValue(item._category) || extractValue(item.type) || 'Unknown',
        globalId: extractValue(item._guid) || extractValue(item.GlobalId) || 'N/A',
        objectType: extractValue(item.ObjectType),
        tag: extractValue(item.Tag),
        predefinedType: extractValue(item.PredefinedType),
        propertySets: [],
        materials: [],
        spatialContainer: null
      };

      if (item.psets) {
        processedItem.propertySets = Object.entries(item.psets).map(([psetName, psetData]: [string, any]) => ({
          name: psetName,
          properties: Object.entries(psetData).map(([propName, propValue]: [string, any]) => ({
            name: propName,
            value: extractValue(propValue),
            type: propValue?.type || typeof propValue
          }))
        }));
      }

      if (item.materials) {
        processedItem.materials = Array.isArray(item.materials) ? item.materials : [item.materials];
      }

      if (item.containedInStructure) {
        processedItem.spatialContainer = item.containedInStructure;
      }

      console.log('✅ Processed item:', processedItem);
      return processedItem;
    });
  };

  const convertToModelElements = (modelIdMap: any, processedData: any[]): ModelElement[] => {
    const elements: ModelElement[] = [];
    
    for (const [modelId, localIds] of Object.entries(modelIdMap)) {
      const idsArray = Array.isArray(localIds) ? localIds : Array.from(localIds as Set<string>);
      
      idsArray.forEach((elementId: string) => {
        // Trova i dati dell'elemento processato
        const elementData = processedData.find(item => 
          item.id === elementId || String(item.id) === String(elementId)
        );
        
        const element: ModelElement = {
          modelId,
          elementId: String(elementId),
          elementName: elementData?.name || `Element ${elementId}`,
          elementType: elementData?.type || 'Unknown'
        };
        
        elements.push(element);
      });
    }
    
    return elements;
  };

  const highlightModelElements = async (elements: ModelElement[]) => {
    if (!highlighterRef.current || !componentsRef.current) return;
    
    try {
      const highlighter = highlighterRef.current;
      
      await highlighter.clear('select');
      
      // Raggruppa gli elementi per modelId
      const modelIdMap: { [modelId: string]: Set<string> } = {};
      elements.forEach(element => {
        if (!modelIdMap[element.modelId]) {
          modelIdMap[element.modelId] = new Set();
        }
        modelIdMap[element.modelId].add(element.elementId);
      });
      
      // Evidenzia gli elementi
      for (const [modelId, elementIds] of Object.entries(modelIdMap)) {
        if (highlighter.selection.select instanceof Map) {
          highlighter.selection.select.set(modelId, elementIds);
        }
      }
      
      console.log('🔗 Highlighted linked elements:', elements);
    } catch (error) {
      console.error('❌ Error highlighting linked elements:', error);
    }
  };

  const setViewer = async () => {
    if (isInitialized.current) {
      console.log('🔄 IFCViewer already initialized, skip');
      return;
    }

    try {
      console.log('🚀 Initializing IFCViewer...');
      setIsLoading(true);
      setError(null);
      isInitialized.current = true;

      const components = new OBC.Components()
      const worlds = components.get(OBC.Worlds)

      const world = worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBF.PostproductionRenderer
      >()

      const sceneComponent = new OBC.SimpleScene(components)
      world.scene = sceneComponent
      world.scene.setup()
      world.scene.three.background = new THREE.Color(0xf0f0f0)

      if (!containerRef.current) {
        throw new Error('Viewer container not found');
      }
      const viewerContainer = containerRef.current;

      const rendererComponent = new OBF.PostproductionRenderer(components, viewerContainer)
      world.renderer = rendererComponent

      const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
      world.camera = cameraComponent

      components.init()

      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      world.scene.three.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      world.scene.three.add(directionalLight);

      components.get(OBC.Grids).create(world);

      componentsRef.current = components;
      worldRef.current = world;

      console.log('🔧 Configuring IFC Loader...');
      const ifcLoader = components.get(OBC.IfcLoader);

      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: "https://unpkg.com/web-ifc@0.0.69/",
          absolute: true,
        },
      });

      console.log('🔧 Configuring Fragments Manager...');
      const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
      const fetchedUrl = await fetch(githubUrl);
      const workerBlob = await fetchedUrl.blob();
      const workerFile = new File([workerBlob], "worker.mjs", {
        type: "text/javascript",
      });
      const workerUrl = URL.createObjectURL(workerFile);

      const fragments = components.get(OBC.FragmentsManager);
      fragments.init(workerUrl);

      world.camera.controls.addEventListener("rest", () =>
        fragments.core.update(true),
      );

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world.camera.three);
        world.scene.three.add(model.object);
        fragments.core.update(true);
        console.log('✅ IFC model loaded in scene');
        setIsLoadingIFC(false);
        setHasModel(true);
        setShowFileModal(false);
        world.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);
      });

      world.onCameraChanged.add((camera) => {
        for (const [, model] of fragments.list) {
          model.useCamera(camera.three);
        }
        fragments.core.update(true);
      });

      console.log('🔧 Configuring Highlighter...');
      components.get(OBC.Raycasters).get(world);

      const highlighter = components.get(OBF.Highlighter);
      highlighter.setup({
        world,
        selectMaterialDefinition: {
          color: new THREE.Color("#029AE0"),
          opacity: 0.8,
          transparent: true,
          renderedFaces: 0,
        },
      });

      highlighter.events.select.onHighlight.add(async (modelIdMap) => {
        console.log('🎯 Element selected:', modelIdMap);

        const promises = [];
        for (const [modelId, localIds] of Object.entries(modelIdMap)) {
          const model = fragments.list.get(modelId);
          if (!model) continue;
          promises.push(model.getItemsData([...localIds]));
        }

        const rawData = (await Promise.all(promises)).flat();
        const processedData = processIFCData(rawData);
        setSelectedItems(processedData);
        setShowPropertyPanel(true);
        
        // Aggiorna il context con gli elementi selezionati
        const modelElements = convertToModelElements(modelIdMap, processedData);
        setSelectedElements(modelElements);
        
        console.log('📊 Selected elements data:', processedData);
        console.log('🔗 Model elements for todo linking:', modelElements);
      });

      highlighter.events.select.onClear.add(() => {
        console.log('🔄 Selection cleared');
        setSelectedItems([]);
        setShowPropertyPanel(false);
        setSelectedElements([]);
      });

      highlighterRef.current = highlighter;
      console.log('✅ Highlighter configured');

      console.log('✅ IFC Loader configured');

      await world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);
      world.camera.updateAspect();

      console.log('✅ IFCViewer initialized successfully');
      setIsLoading(false);

    } catch (err) {
      console.error('❌ Error initializing IFCViewer:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
      isInitialized.current = false;
    }
  }

  const loadIfc = async (file: File) => {
    if (!componentsRef.current) {
      throw new Error('Components not initialized');
    }

    const ifcLoader = componentsRef.current.get(OBC.IfcLoader);

    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);

    await ifcLoader.load(buffer, false, file.name, {
      processData: {
        progressCallback: (progress: number) => {
          console.log(`Loading IFC: ${Math.round(progress * 100)}%`);
          setLoadingProgress(Math.round(progress * 100));
        },
      },
    });
  }

  const loadFragment = async (file: File) => {
    if (!componentsRef.current) {
      throw new Error('Components not initialized');
    }

    try {
      console.log('🔧 Caricamento fragment:', file.name);
      
      const reader = new FileReader();
      
      return new Promise<void>((resolve, reject) => {
        reader.addEventListener('load', async () => {
          try {
            const binary = reader.result;
            if (!(binary instanceof ArrayBuffer)) {
              reject(new Error('Errore nella lettura del file'));
              return;
            }
            
            const fragmentBinary = new Uint8Array(binary);
            const fragmentsManager = componentsRef.current!.get(OBC.FragmentsManager);
            
            await fragmentsManager.core.load(fragmentBinary, { modelId: file.name });
            
            console.log('✅ Fragment caricato con successo:', file.name);
            setHasModel(true);
            resolve();
          } catch (error) {
            console.error('❌ Errore nel caricamento del fragment:', error);
            reject(error);
          }
        });
        
        reader.addEventListener('error', () => {
          reject(new Error('Errore nella lettura del file'));
        });
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('❌ Errore nel caricamento del fragment:', error);
      throw error;
    }
  }

  const handleFileSelect = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    if (!file.name.toLowerCase().endsWith('.ifc')) {
      setError('Please select a valid IFC file (.ifc)');
      return;
    }

    try {
      setIsLoadingIFC(true);
      setLoadingProgress(0);
      setError(null);

      if (hasModel && componentsRef.current && worldRef.current) {
        const fragments = componentsRef.current.get(OBC.FragmentsManager);
        const models = Array.from(fragments.list.values());
        models.forEach((model: any) => {
          worldRef.current.scene.three.remove(model.object);
        });
        fragments.list.clear();
        setHasModel(false);
      }

      await loadIfc(file);

      fileInput.value = '';

    } catch (err) {
      console.error('❌ Error loading IFC file:', err);
      setError(err instanceof Error ? err.message : 'Error loading IFC file');
      setIsLoadingIFC(false);
    }
  }

  const handleFragmentSelect = async () => {
    const fileInput = fragmentInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    if (!file.name.toLowerCase().endsWith('.frag')) {
      setError('Seleziona un file fragment valido (.frag)');
      return;
    }

    try {
      setIsLoadingIFC(true);
      setError(null);

      // Rimuovi modelli esistenti se presenti
      if (hasModel && componentsRef.current && worldRef.current) {
        const fragments = componentsRef.current.get(OBC.FragmentsManager);
        const models = Array.from(fragments.list.values());
        models.forEach((model: any) => {
          worldRef.current.scene.three.remove(model.object);
        });
        fragments.list.clear();
        setHasModel(false);
      }

      await loadFragment(file);

      fileInput.value = '';
      setIsLoadingIFC(false);

    } catch (err) {
      console.error('❌ Errore nel caricamento del file fragment:', err);
      setError(err instanceof Error ? err.message : 'Errore nel caricamento del file fragment');
      setIsLoadingIFC(false);
    }
  }

  const openFragmentImport = () => {
    if (fragmentInputRef.current) {
      fragmentInputRef.current.click();
    }
  }

  const openFileModal = () => {
    setShowFileModal(true);
    setError(null);
  }

  const closeFileModal = () => {
    setShowFileModal(false);
    setError(null);
  }

  const clearSelection = async () => {
    if (!highlighterRef.current) return;

    const highlighter = highlighterRef.current;
    await highlighter.clear('select');

    console.log('✅ Selection cleared');
  }

  const toggleVisibility = async () => {
    if (!highlighterRef.current || !componentsRef.current) return;

    const highlighter = highlighterRef.current;
    const fragments = componentsRef.current.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;

    if (Object.keys(selection).length === 0) return;

    for (const fragmentID in selection) {
      const model = fragments.list.get(fragmentID);
      if (!model) continue;

      const expressIDs = Array.from(selection[fragmentID]);

      await model.toggleVisible(expressIDs);
    }

    await fragments.core.update(true);

    console.log('🔄 Toggled visibility');
  }

  const toggleIsolation = async () => {
    if (!highlighterRef.current || !componentsRef.current) return;

    const highlighter = highlighterRef.current;
    const fragments = componentsRef.current.get(OBC.FragmentsManager);
    const selection = highlighter.selection.select;

    if (Object.keys(selection).length === 0) return;

    const isCurrentlyIsolated = isolatedItems.size > 0;

    if (isCurrentlyIsolated) {
      for (const [, model] of fragments.list) {
        const allItems = await model.getLocalIds();
        await model.setVisible(allItems, true);
      }
      setIsolatedItems(new Set());
      console.log('🔓 Isolation removed');
    } else {
      const newIsolatedItems = new Set<string>();

      for (const [, model] of fragments.list) {
        const allItems = await model.getLocalIds();
        await model.setVisible(allItems, false);
      }

      for (const fragmentID in selection) {
        const model = fragments.list.get(fragmentID);
        if (!model) continue;

        const expressIDs = Array.from(selection[fragmentID]);
        await model.setVisible(expressIDs, true);
        newIsolatedItems.add(fragmentID);
      }

      setIsolatedItems(newIsolatedItems);
      console.log('🔒 Elements isolated');
    }

    await fragments.core.update(true);
  }

  const showAll = async () => {
    if (!componentsRef.current) return;

    const fragments = componentsRef.current.get(OBC.FragmentsManager);

    setIsolatedItems(new Set());

    for (const [, model] of fragments.list) {
      const allItems = await model.getLocalIds();
      await model.setVisible(allItems, true);
    }

    await fragments.core.update(true);

    console.log('👁️ All elements shown');
  }

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;

    const initViewer = () => {
      if (containerRef.current) {
        setViewer();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(initViewer, 50);
      } else {
        console.error('❌ Timeout: Container not available after 1 second');
        setError('Container not available');
        setIsLoading(false);
      }
    };

    initViewer();

    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ Safety timeout: forcing loading end');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Registra la funzione di evidenziazione quando il viewer è pronto
  useEffect(() => {
    if (!isLoading && highlighterRef.current && componentsRef.current) {
      setHighlightCallback(highlightModelElements);
    }
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      className="three-viewer-container"
    >
      {error && (
        <div className="three-viewer-loading loading-overlay">
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--error)' }}>
            error
          </span>
          <p>Loading error</p>
          <small>{error}</small>
          {!isLoading && !isLoadingIFC && (
            <button
              className="retry-button"
              onClick={() => {
                setError(null);
                if (!hasModel) openFileModal();
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {isLoading && !error && (
        <div className="three-viewer-loading loading-overlay">
          <div className="spinner"></div>
          <p>Initializing 3D viewer...</p>
        </div>
      )}

      {isLoadingIFC && !error && (
        <div className="three-viewer-loading loading-overlay">
          <div className="spinner"></div>
          <p>Loading IFC model...</p>
          {loadingProgress > 0 && (
            <div style={{ width: '200px', marginTop: '10px' }}>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p style={{ fontSize: '12px', marginTop: '5px' }}>
                {loadingProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !isLoadingIFC && !hasModel && !error && (
        <div className="three-viewer-loading empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>
            upload_file
          </span>
          <p>No IFC model loaded</p>
          <button
            className="load-ifc-button"
            onClick={openFileModal}
          >
            Load IFC file
          </button>
          <button
            className="load-ifc-button"
            onClick={openFragmentImport}
            style={{ marginTop: '10px' }}
          >
            Carica Fragment
          </button>
        </div>
      )}

      {hasModel && !isLoading && !isLoadingIFC && !error && (
        <>
          <PropertyInformationPanel 
            selectedItems={selectedItems}
            isVisible={showPropertyPanel}
            onClose={() => setShowPropertyPanel(false)}
          />
          
          <ClassificationPanel 
            components={componentsRef.current}
            isVisible={showClassificationPanel}
            onClose={() => setShowClassificationPanel(false)}
          />
          
          <div className={`viewer-controls ${showPropertyPanel ? 'property-panel-visible' : ''}`}>
            <button
              className="control-button"
              onClick={() => {
                if (worldRef.current?.camera?.controls) {
                  worldRef.current.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);
                }
              }}
              title="Center view"
            >
              <span className="material-symbols-outlined">center_focus_weak</span>
            </button>
            <button
              className="control-button"
              onClick={openFileModal}
              title="Load new IFC file"
            >
              <span className="material-symbols-outlined">upload_file</span>
            </button>
            <button
              className="control-button"
              onClick={openFragmentImport}
              title="Carica file fragment (.frag)"
            >
              <span className="material-symbols-outlined">file_present</span>
            </button>

            <div className="highlight-separator"></div>
            <button
              className={`control-button ${showPropertyPanel ? 'active' : ''}`}
              onClick={() => setShowPropertyPanel(!showPropertyPanel)}
              title="Toggle property panel"
            >
              <span className="material-symbols-outlined">info</span>
            </button>
            
            <button
              className={`control-button ${showClassificationPanel ? 'active' : ''}`}
              onClick={() => setShowClassificationPanel(!showClassificationPanel)}
              title="Toggle classification panel"
            >
              <span className="material-symbols-outlined">category</span>
            </button>

            <div className="highlight-separator"></div>
            <button
              className="control-button highlight-clear"
              onClick={clearSelection}
              title="Clear selection"
            >
              <span className="material-symbols-outlined">clear</span>
            </button>

            {selectedItems.length > 0 && (
              <>
                <div className="highlight-separator"></div>
                <button
                  className="control-button fragment-visibility"
                  onClick={toggleVisibility}
                  title="Toggle visibility"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button
                  className="control-button fragment-isolate"
                  onClick={toggleIsolation}
                  title="Isolate selection"
                >
                  <span className="material-symbols-outlined">filter_center_focus</span>
                </button>
                <button
                  className="control-button fragment-show-all"
                  onClick={showAll}
                  title="Show all"
                >
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </>
            )}
          </div>

          <div className="viewer-status">
            <div className="status-indicator">
              <span className="material-symbols-outlined">check_circle</span>
              <span>IFC model loaded</span>
            </div>
            {selectedItems.length > 0 && (
              <div className="status-indicator selection-info">
                <span className="material-symbols-outlined">touch_app</span>
                <span>{selectedItems.length} element{selectedItems.length > 1 ? 's' : ''} selected</span>
              </div>
            )}
          </div>
        </>
      )}

      {showFileModal && (
        <div className="file-modal-overlay" onClick={closeFileModal}>
          <div className="file-modal" onClick={(e) => e.stopPropagation()}>
            <div className="file-modal-header">
              <h3>{hasModel ? 'Load new IFC file' : 'Select IFC file'}</h3>
              <button
                className="close-button"
                onClick={closeFileModal}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="file-modal-content">
              <p>
                {hasModel
                  ? 'Select a new IFC file to replace the current model.'
                  : 'Select an IFC file from your computer to view it in the 3D viewer.'
                }
              </p>
              {!hasModel && (
                <div className="highlight-info">
                  <h4>🎯 Selection Features</h4>
                  <p>Once the model is loaded you can:</p>
                  <ul>
                    <li><strong>Click</strong>: Select elements (blue color)</li>
                    <li><strong>Ctrl + Click</strong>: Multiple selection</li>
                    <li><strong>Clear</strong>: Remove current selection</li>
                    <li><strong>Empty click</strong>: Auto-deselect</li>
                  </ul>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".ifc"
                onChange={handleFileSelect}
                className="file-input"
              />
              <div className="file-modal-actions">
                <button
                  className="cancel-button"
                  onClick={closeFileModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden input for fragment files */}
      <input
        ref={fragmentInputRef}
        type="file"
        accept=".frag"
        onChange={handleFragmentSelect}
        style={{ display: 'none' }}
      />
    </div>
  )
}