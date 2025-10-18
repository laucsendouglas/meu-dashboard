import React, { useState } from 'react';
import { DocumentData, DocumentStatus } from '../types';

interface StatusCellProps {
  doc?: DocumentData;
  docName: string;
  projectId: string;
  onUpdate: (projectId: string, docName: string, updatedData: Partial<DocumentData>) => void;
}

const getStatusClasses = (doc: DocumentData | undefined): string => {
  if (!doc) return "bg-slate-700/50 text-slate-400";

  if (doc.isBlocked) return "bg-red-600/40 text-red-200 border-red-500/60";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isDelayed = doc.plannedDate && !doc.emissionDate && doc.plannedDate < today && doc.status !== DocumentStatus.Enviado;

  if (isDelayed) return "bg-rose-500/30 text-rose-300 border-rose-500/50";

  switch (doc.status) {
    case DocumentStatus.Enviado: return "bg-sky-500/30 text-sky-300 border-sky-500/50";
    case DocumentStatus.EmRevisao: return "bg-yellow-500/30 text-yellow-300 border-yellow-500/50";
    case DocumentStatus.EmVerificacao: return "bg-purple-500/30 text-purple-300 border-purple-500/50";
    case DocumentStatus.Pendente: return "bg-slate-500/30 text-slate-300 border-slate-500/50";
    default: return "bg-gray-700 text-gray-300";
  }
};

const StatusCell: React.FC<StatusCellProps> = ({ doc, docName, projectId, onUpdate }) => {
    const [isEditingDate, setIsEditingDate] = useState(false);

    const handleEmitToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isEmitted = e.target.checked;
        onUpdate(projectId, docName, {
            emissionDate: isEmitted ? new Date() : undefined,
            status: isEmitted ? DocumentStatus.Enviado : DocumentStatus.Pendente
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const [y, m, d] = e.target.value.split('-').map(Number);
            const newDate = new Date(Date.UTC(y, m - 1, d));
            onUpdate(projectId, docName, { plannedDate: newDate, status: doc?.status || DocumentStatus.Pendente });
        } else {
             onUpdate(projectId, docName, { plannedDate: undefined, status: doc?.status || DocumentStatus.Pendente });
        }
        setIsEditingDate(false);
    };

    if (!doc) {
        return (
          <div className="p-2 min-h-[50px] flex justify-center items-center">
            {isEditingDate ? (
              <input
                type="date"
                onBlur={handleDateChange}
                autoFocus
                className="bg-slate-900 border border-slate-600 rounded-md text-xs p-1 w-full"
              />
            ) : (
              <button
                onClick={() => setIsEditingDate(true)}
                className="text-sky-400 hover:text-sky-300 text-xs italic"
                title="Adicionar data planejada"
              >
                Adicionar data
              </button>
            )}
          </div>
        );
    }

    const statusText = doc.status === DocumentStatus.Enviado && doc.emissionDate 
      ? doc.emissionDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
      : doc.status;

    return (
        <div className={`p-2 rounded-md border text-xs min-h-[50px] flex flex-col justify-center items-center gap-1 ${getStatusClasses(doc)}`}>
            <div className="flex items-center justify-center gap-2 w-full">
                 <input
                    type="checkbox"
                    checked={!!doc.emissionDate}
                    onChange={handleEmitToggle}
                    className="form-checkbox h-4 w-4 rounded bg-slate-600 border-slate-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
                    title={doc.emissionDate ? "Desmarcar emissão" : "Marcar como emitido"}
                />
                <span className="font-semibold">{statusText}</span>
            </div>
            
            <div className="w-full text-center">
                {isEditingDate ? (
                    <input
                        type="date"
                        defaultValue={doc.plannedDate?.toISOString().split('T')[0] ?? ''}
                        onBlur={handleDateChange}
                        autoFocus
                        className="bg-slate-900 border border-slate-600 rounded-md text-xs p-1 w-full"
                    />
                ) : (
                    <span 
                        onClick={() => setIsEditingDate(true)}
                        className="text-slate-400 hover:text-sky-300 cursor-pointer"
                        title="Clique para editar a data planejada"
                    >
                        {doc.plannedDate ? doc.plannedDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Definir data'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatusCell;
