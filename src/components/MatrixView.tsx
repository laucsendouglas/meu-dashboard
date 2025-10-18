import React, { useState } from 'react';
import { Project, DocumentData } from '../types';
import ProjectTable from './ProjectTable';
import Modal from './Modal';
import AddProjectForm from './AddProjectForm';
import AddDocumentForm from './AddDocumentForm';

interface MatrixViewProps {
  projects: Project[];
  allDocumentNames: string[];
  onUpdateDocument: (projectId: string, docName: string, updatedData: Partial<DocumentData>) => void;
  onAddProject: (projectName: string) => void;
  onAddDocument: (docName: string) => void;
}

const MatrixView: React.FC<MatrixViewProps> = ({ projects, allDocumentNames, onUpdateDocument, onAddProject, onAddDocument }) => {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);

  const handleSaveNewProject = (projectName: string) => {
    onAddProject(projectName);
    setIsAddProjectModalOpen(false);
  };

  const handleSaveNewDocument = (docName: string) => {
    onAddDocument(docName);
    setIsAddDocModalOpen(false);
  };

  const buttonClasses = "px-3 py-2 text-xs font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-200";

  return (
    <>
      <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-slate-200">Matriz de Documentos por Projeto</h2>
          <div className="flex items-center gap-2">
              <button onClick={() => setIsAddProjectModalOpen(true)} className={buttonClasses}>
                Adicionar Projeto
              </button>
              <button onClick={() => setIsAddDocModalOpen(true)} className={buttonClasses}>
                Adicionar Documento
              </button>
          </div>
        </div>
        <ProjectTable projects={projects} allDocumentNames={allDocumentNames} onUpdateDocument={onUpdateDocument} />
      </div>

      <Modal isOpen={isAddProjectModalOpen} onClose={() => setIsAddProjectModalOpen(false)} title="Adicionar Novo Projeto">
        <AddProjectForm 
          onSave={handleSaveNewProject}
          onCancel={() => setIsAddProjectModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isAddDocModalOpen} onClose={() => setIsAddDocModalOpen(false)} title="Adicionar Novo Documento">
        <AddDocumentForm
          onSave={handleSaveNewDocument}
          onCancel={() => setIsAddDocModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default MatrixView;
