import React, { useState, useEffect } from 'react';
import { mockProjects } from './data/mockData';
import DashboardView from './components/DashboardView';
import MatrixView from './components/MatrixView';
import GanttView from './components/GanttView';
import { Project, DocumentData, DocumentStatus } from './types';

type View = 'dashboard' | 'matrix' | 'gantt';

const PROJECTS_STORAGE_KEY = 'engineeringDashboardProjects';
const DOC_NAMES_STORAGE_KEY = 'engineeringDashboardDocNames';

const reviveDates = (projects: Project[]): Project[] => {
  return projects.map(project => ({
    ...project,
    documents: project.documents.map(doc => ({
      ...doc,
      plannedDate: doc.plannedDate ? new Date(doc.plannedDate) : undefined,
      emissionDate: doc.emissionDate ? new Date(doc.emissionDate) : undefined,
    }))
  }));
};


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('matrix');
  
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        return reviveDates(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error);
    }
    return mockProjects;
  });

  const [allDocumentNames, setAllDocumentNames] = useState<string[]>(() => {
      try {
          const savedDocNames = localStorage.getItem(DOC_NAMES_STORAGE_KEY);
          if(savedDocNames) {
              return JSON.parse(savedDocNames);
          }
      } catch (error) {
          console.error("Failed to load document names from localStorage", error);
      }
      const docSet = new Set<string>();
      mockProjects.forEach(p => p.documents.forEach(d => docSet.add(d.name)));
      return Array.from(docSet).sort();
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(DOC_NAMES_STORAGE_KEY, JSON.stringify(allDocumentNames));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [projects, allDocumentNames]);


  const handleUpdateDocument = (projectId: string, docName: string, updatedData: Partial<DocumentData>) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const docExists = p.documents.some(d => d.name === docName);
          let updatedDocuments;

          if (docExists) {
             updatedDocuments = p.documents.map(d => {
                if (d.name === docName) {
                    return { ...d, ...updatedData };
                }
                return d;
            });
          } else {
            const newDoc = {
              name: docName,
              status: updatedData.status || DocumentStatus.Pendente, // Ensure default status
              ...updatedData
            } as DocumentData;
             updatedDocuments = [...p.documents, newDoc];
          }
          
          return { ...p, documents: updatedDocuments };
        }
        return p;
      })
    );
  };

  const handleAddProject = (projectName: string) => {
    if (!projectName.trim() || projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
        alert('O nome do projeto não pode estar vazio ou já existir.');
        return;
    }
    const newProject: Project = {
        id: `proj-${projectName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
        name: projectName,
        documents: []
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleAddDocument = (docName: string) => {
      if (!docName.trim() || allDocumentNames.some(d => d.toLowerCase() === docName.toLowerCase())) {
          alert('O nome do documento não pode estar vazio ou já existir.');
          return;
      }
      setAllDocumentNames(prev => [...prev, docName].sort());
  };


  const navButtonClasses = (view: View) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 ${
      activeView === view 
        ? 'bg-sky-500 text-white shadow-md' 
        : 'text-slate-300 hover:bg-slate-700'
    }`;

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-sky-400">Dashboard de Engenharia</h1>
          <p className="text-slate-400 mt-1">Visão geral do andamento dos projetos e documentação.</p>
        </header>

        <nav className="mb-8 p-1.5 bg-slate-800 rounded-lg flex items-center justify-start space-x-2">
          <button onClick={() => setActiveView('dashboard')} className={navButtonClasses('dashboard')}>
            Dashboard
          </button>
          <button onClick={() => setActiveView('matrix')} className={navButtonClasses('matrix')}>
            Matriz de Documentos
          </button>
          <button onClick={() => setActiveView('gantt')} className={navButtonClasses('gantt')}>
            Gráfico de Gantt
          </button>
        </nav>

        <main>
          {activeView === 'dashboard' && <DashboardView projects={projects} />}
          {activeView === 'matrix' && (
            <MatrixView 
              projects={projects} 
              allDocumentNames={allDocumentNames}
              onUpdateDocument={handleUpdateDocument} 
              onAddProject={handleAddProject}
              onAddDocument={handleAddDocument}
            />
          )}
          {activeView === 'gantt' && <GanttView projects={projects} />}
        </main>
      </div>
    </div>
  );
};

export default App;
