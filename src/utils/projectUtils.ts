const formatFirebaseDate = (timestamp: any): string => {
  if (!timestamp) {
    return '2024-12-01';
  }
  

  if (typeof timestamp === 'string') {
    return timestamp;
  }
  

  if (timestamp && typeof timestamp === 'object' && timestamp.toDate) {
    const date = timestamp.toDate();
    return date.toISOString().split('T')[0]
  }
  
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split('T')[0];
  }
  
  return '2024-12-01';
};

export const generateProjectAvatar = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'PR'; // Default fallback
  }

  const words = name.trim().split(/\s+/);
  
  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  } else {
    const singleWord = words[0];
    return singleWord.length >= 2 
      ? singleWord.substring(0, 2).toUpperCase()
      : singleWord.toUpperCase().padEnd(2, 'P');
  }
};

/**
 * Retrieves all projects from Firebase and converts them to Project format
 */
export const getProjectsFromFirebase = async () => {
  const { collection, getDocs } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    const projectsCollection = collection(firebaseDB, 'projects');
    const firebaseProjects = await getDocs(projectsCollection);
    const projectsList: any[] = [];
    
    for (const doc of firebaseProjects.docs) {
      const data = doc.data();
      
      const project = {
        id: doc.id,
        name: data.name || 'Progetto Senza Nome',
        description: data.description || 'Nessuna descrizione disponibile',
        status: data.status || 'Active',
        cost: data.cost || 0,
        userRole: data.userRole || 'Engineer',
        finishDate: formatFirebaseDate(data.finishDate),
        progress: data.progress || 0
      };
      
      projectsList.push(project);
    }
    
    return projectsList;
  } catch (error) {
    console.error('Error retrieving projects:', error);
    return [];
  }
};

/**
 * Retrieves a specific project from Firebase by ID
 */
export const getProjectByIdFromFirebase = async (projectId: string) => {
  const projects = await getProjectsFromFirebase();
  console.log('Searching for project with ID:', projectId);
  console.log('Available projects:', projects.map(p => ({ id: p.id, name: p.name })));
  
  const foundProject = projects.find(project => project.id === projectId);
  console.log('Project found:', foundProject);
  
  return foundProject || projects[0] || null;
};

/**
 * Creates a new project in Firebase
 */
export const createProjectInFirebase = async (projectData: Omit<any, 'id'>) => {
  const { collection, addDoc, Timestamp } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Creating new project:', projectData);

    // Convert finishDate string to Firebase Timestamp
    const dataToSave = {
      ...projectData,
      finishDate: projectData.finishDate 
        ? Timestamp.fromDate(new Date(projectData.finishDate))
        : Timestamp.fromDate(new Date('2024-12-01'))
    };

    const projectsCollection = collection(firebaseDB, 'projects');
    const docRef = await addDoc(projectsCollection, dataToSave);
    
    console.log('Project created with ID:', docRef.id);
    
    // Return the created project with the Firebase-generated ID
    return {
      id: docRef.id,
      ...projectData
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}; 

/**
 * Updates an existing project in Firebase
 */
export const updateProjectInFirebase = async (projectId: string, projectData: Partial<any>) => {
  const { doc, updateDoc, Timestamp } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Updating project:', projectId, projectData);

    const projectRef = doc(firebaseDB, 'projects', projectId);
    
    // Convert finishDate string to Firebase Timestamp if present
    const dataToUpdate = {
      ...projectData,
      finishDate: projectData.finishDate 
        ? Timestamp.fromDate(new Date(projectData.finishDate))
        : undefined
    };

    await updateDoc(projectRef, dataToUpdate);
    
    console.log('Project updated successfully');
    
    // Return the updated project data
    return {
      id: projectId,
      ...projectData
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Deletes a project from Firebase
 */
export const deleteProjectFromFirebase = async (projectId: string) => {
  const { doc, deleteDoc } = await import('firebase/firestore');
  const { firebaseDB } = await import('../firebase');

  try {
    console.log('Deleting project:', projectId);

    const projectRef = doc(firebaseDB, 'projects', projectId);
    await deleteDoc(projectRef);
    
    console.log('Project deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}; 