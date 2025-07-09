import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase";
import type { IProject } from "./Project";
import { ProjectStatus, UserRole } from "./Project";

export class ProjectsManager {
  private projectsCollection: Firestore.CollectionReference<IProject>;
  
  // Callbacks for project events
  public onProjectCreated?: (project: IProject) => void;
  public onProjectDeleted?: (projectId: string) => void;
  public onProjectUpdated?: (project: IProject) => void;

  constructor() {
    this.projectsCollection = getCollection<IProject>("/projects");
  }

  get list(): Promise<IProject[]> {
    return this.getFirestoreProjects();
  }

  async newProject(projectData: Omit<IProject, 'id'>): Promise<IProject> {
    try {
      console.log('Creating new project:', projectData);

      // Convert finishDate to Firebase Timestamp if needed
      const dataToSave = {
        ...projectData,
        finishDate: projectData.finishDate instanceof Date 
          ? Firestore.Timestamp.fromDate(projectData.finishDate)
          : Firestore.Timestamp.fromDate(new Date(projectData.finishDate))
      };

      const docRef = await Firestore.addDoc(this.projectsCollection, dataToSave as any);
      
      console.log('Project created with ID:', docRef.id);
      
      const newProject: IProject = {
        id: docRef.id,
        ...projectData
      };

      // Trigger callback
      if (this.onProjectCreated) {
        this.onProjectCreated(newProject);
      }

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const docRef = Firestore.doc(this.projectsCollection, projectId);
      await Firestore.deleteDoc(docRef);
      
      console.log('Project deleted:', projectId);
      
      // Trigger callback
      if (this.onProjectDeleted) {
        this.onProjectDeleted(projectId);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, updates: Partial<Omit<IProject, 'id'>>): Promise<IProject> {
    try {
      const docRef = Firestore.doc(this.projectsCollection, projectId);
      
      // Convert dates to Timestamps if needed
      const dataToUpdate = { ...updates };
      if (dataToUpdate.finishDate) {
        dataToUpdate.finishDate = dataToUpdate.finishDate instanceof Date 
          ? Firestore.Timestamp.fromDate(dataToUpdate.finishDate) as any
          : Firestore.Timestamp.fromDate(new Date(dataToUpdate.finishDate)) as any;
      }
      
      await Firestore.updateDoc(docRef, dataToUpdate);
      
      console.log('Project updated:', projectId);
      
      // Get updated project
      const updatedProject = await this.getProjectById(projectId);
      
      // Trigger callback
      if (updatedProject && this.onProjectUpdated) {
        this.onProjectUpdated(updatedProject);
      }

      return updatedProject!;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async getProjectById(projectId: string): Promise<IProject | null> {
    try {
      const docRef = Firestore.doc(this.projectsCollection, projectId);
      const docSnap = await Firestore.getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return this.convertFirebaseToProject(docSnap.id, data);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  private async getFirestoreProjects(): Promise<IProject[]> {
    try {
      const firebaseProjects = await Firestore.getDocs(this.projectsCollection);
      const projectsList: IProject[] = [];
      
      for (const doc of firebaseProjects.docs) {
        const data = doc.data();
        const project = this.convertFirebaseToProject(doc.id, data);
        projectsList.push(project);
      }
      
      console.log('Projects loaded:', projectsList);
      return projectsList;
    } catch (error) {
      console.error('Error retrieving projects:', error);
      return [];
    }
  }

  private convertFirebaseToProject(id: string, data: any): IProject {
    return {
      id,
      name: data.name || 'Untitled Project',
      description: data.description || 'No description available',
      status: data.status as ProjectStatus || ProjectStatus.ACTIVE,
      cost: data.cost || 0,
      userRole: data.userRole as UserRole || UserRole.ENGINEER,
      finishDate: data.finishDate?.toDate ? data.finishDate.toDate() : new Date(data.finishDate || '2024-12-01'),
      progress: data.progress || 0
    };
  }
} 