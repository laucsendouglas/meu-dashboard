import React, { useMemo, useState } from 'react';
import { Project, DocumentStatus, DocumentData } from '../types';
import DashboardCard from './DashboardCard';
import Modal from './Modal';

interface DashboardViewProps {
  projects: Project[];
}

interface EnrichedDocument {
  doc: DocumentData;
  projectName: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({ projects }) => {
  const [modalContent, setModalContent] = useState<{ title: string; docs: EnrichedDocument[] } | null>(null);
  
  const documentsWithProject: EnrichedDocument[] = useMemo(() =>
    projects.flatMap(p => p.documents.map(d => ({ doc: d, projectName: p.name }))),
    [projects]
  );
  
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sentDocsList = documentsWithProject.filter(item => item.doc.status === DocumentStatus.Enviado);
    const reviewDocsList = documentsWithProject.filter(item => item.doc.status === DocumentStatus.EmRevisao);
    const verifyingDocsList = documentsWithProject.filter(item => item.doc.status === DocumentStatus.EmVerificacao);
    const delayedDocsList = documentsWithProject.filter(item => 
      item.doc.plannedDate && !item.doc.emissionDate && item.doc.plannedDate < today && item.doc.status !== DocumentStatus.Enviado
    );
    const docsToIssueList = documentsWithProject.filter(item => item.doc.status === DocumentStatus.Pendente && item.doc.plannedDate);

    return {
      totalProjects: projects.length,
      sentDocs: { count: sentDocsList.length, list: sentDocsList },
      reviewDocs: { count: reviewDocsList.length, list: reviewDocsList },
      verifyingDocs: { count: verifyingDocsList.length, list: verifyingDocsList },
      delayedDocs: { count: delayedDocsList.length, list: delayedDocsList },
      docsToIssue: { count: docsToIssueList.length, list: docsToIssueList },
    };
  }, [projects, documentsWithProject]);

  const handleCardClick = (title: string, docs: EnrichedDocument[]) => {
    if (docs.length > 0) {
      setModalContent({ title, docs });
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <DashboardCard title="Total de Projetos" value={metrics.totalProjects} color="bg-indigo-500" />
        <DashboardCard title="Docs Enviados (PAP)" value={metrics.sentDocs.count} color="bg-sky-500" onClick={() => handleCardClick('Documentos Enviados (PAP)', metrics.sentDocs.list)} />
        <DashboardCard title="Docs em Revisão (PR)" value={metrics.reviewDocs.count} color="bg-yellow-500" onClick={() => handleCardClick('Documentos em Revisão (PR)', metrics.reviewDocs.list)} />
        <DashboardCard title="Docs em Verificação" value={metrics.verifyingDocs.count} color="bg-purple-500" onClick={() => handleCardClick('Documentos em Verificação', metrics.verifyingDocs.list)} />
        <DashboardCard title="Documentos Atrasados" value={metrics.delayedDocs.count} color="bg-rose-500" onClick={() => handleCardClick('Documentos Atrasados', metrics.delayedDocs.list)} />
        <DashboardCard title="Documentos a Emitir" value={metrics.docsToIssue.count} color="bg-cyan-500" onClick={() => handleCardClick('Documentos a Emitir', metrics.docsToIssue.list)} />
      </div>

      <Modal
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
        title={modalContent?.title || ''}
      >
        {modalContent && modalContent.docs.length > 0 ? (
          <ul className="space-y-2">
            {modalContent.docs.map((item, index) => (
              <li key={index} className="p-2 bg-slate-700/50 rounded-md text-sm text-slate-300 flex justify-between items-center">
                <span>{item.doc.name}</span>
                <span className="text-xs font-semibold bg-slate-600 text-sky-300 px-2 py-1 rounded-full">{item.projectName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">Nenhum documento para exibir.</p>
        )}
      </Modal>
    </>
  );
};

export default DashboardView;
