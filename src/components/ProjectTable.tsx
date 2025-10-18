import React from 'react';
import { Project, DocumentData } from '../types';
import StatusCell from './StatusCell';

interface ProjectTableProps {
  projects: Project[];
  allDocumentNames: string[];
  onUpdateDocument: (projectId: string, docName: string, updatedData: Partial<DocumentData>) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, allDocumentNames, onUpdateDocument }) => {

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left font-semibold text-slate-300 p-3 sticky left-0 bg-slate-800 z-10 w-64 min-w-64">Documento</th>
            {projects.map(project => (
              <th key={project.id} className="text-center font-semibold text-slate-300 p-3 w-48 min-w-48">{project.name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {allDocumentNames.map(docName => (
            <tr key={docName} className="hover:bg-slate-700/50">
              <td className="text-left text-slate-400 p-3 sticky left-0 bg-slate-800 z-10 w-64 min-w-64 font-medium align-top">{docName}</td>
              {projects.map(project => {
                const doc = project.documents.find(d => d.name === docName);
                return (
                  <td key={`${project.id}-${docName}`} className="text-center p-2 align-middle">
                    <StatusCell 
                      doc={doc}
                      docName={docName}
                      projectId={project.id}
                      onUpdate={onUpdateDocument}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
