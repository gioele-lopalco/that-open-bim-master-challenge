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
  const { db } = await import('../firebase');

  try {
    const projectsCollection = collection(db, 'projects');
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