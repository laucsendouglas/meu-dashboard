import React from 'react';
import { Project } from '../types';

interface GanttViewProps {
  projects: Project[];
}

const GanttView: React.FC<GanttViewProps> = ({ projects }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-slate-200 mb-6">Progresso de Emissão por Projeto</h2>
      <div className="space-y-6">
        {projects.map((project) => {
          const totalDocs = project.documents.length;
          // A project might be listed but have no documents assigned yet.
          if (totalDocs === 0) {
            return (
               <div key={project.id}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sky-400 text-sm">{project.name}</h3>
                  <span className="text-xs font-mono text-slate-400">0 / 0</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4">
                   <div className="bg-slate-500 h-4 rounded-full flex items-center justify-center text-xs text-white">
                      Nenhum documento
                   </div>
                </div>
              </div>
            )
          }
          
          const emittedDocs = project.documents.filter(d => !!d.emissionDate).length;
          const percentage = (emittedDocs / totalDocs) * 100;

          return (
            <div key={project.id}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sky-400 text-sm">{project.name}</h3>
                <span className="text-xs font-mono text-slate-400">{`${emittedDocs} / ${totalDocs}`}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4 relative overflow-hidden">
                <div
                  className="bg-sky-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                  style={{ width: `${percentage}%` }}
                >
                   <span className="text-white text-xs font-bold absolute left-1/2 -translate-x-1/2">
                     {`${Math.round(percentage)}%`}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttView;
