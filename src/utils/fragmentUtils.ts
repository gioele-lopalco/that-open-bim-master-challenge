import * as OBC from '@thatopen/components';

/**
 * Utility function to export a fragment model as a .frag file
 * @param model - The fragment model to export
 * @param filename - The name for the downloaded file (without extension)
 */
export const exportFragmentModel = async (model: any, filename: string): Promise<void> => {
  try {
    const fragmentBinary = await model.getBuffer(false);
    const blob = new Blob([fragmentBinary]);
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.frag`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log(`✅ Fragment ${filename} esportato con successo`);
  } catch (error) {
    console.error(`❌ Errore nell'esportazione del fragment ${filename}:`, error);
    throw error;
  }
};

/**
 * Utility function to export multiple fragment models
 * @param fragments - FragmentsManager instance
 * @param modelIds - Array of model IDs to export
 * @param filenamePrefix - Prefix for the filename
 */
export const exportMultipleFragments = async (
  fragments: OBC.FragmentsManager,
  modelIds: string[],
  filenamePrefix: string = 'fragment'
): Promise<void> => {
  try {
    const exportPromises = modelIds.map(async (modelId) => {
      const model = fragments.list.get(modelId);
      if (!model) {
        console.warn(`❌ Modello ${modelId} non trovato`);
        return;
      }
      
      const filename = `${filenamePrefix}_${modelId}`;
      await exportFragmentModel(model, filename);
    });
    
    await Promise.all(exportPromises);
    console.log(`✅ Tutti i fragment esportati con successo`);
  } catch (error) {
    console.error('❌ Errore nell\'esportazione multipla dei fragment:', error);
    throw error;
  }
};