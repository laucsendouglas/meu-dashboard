import React, { useState } from 'react';

interface AddProjectFormProps {
  onSave: (projectName: string) => void;
  onCancel: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onSave, onCancel }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSave(projectName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="add-project-title">
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-1">
            Nome do Projeto
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md text-white px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
            autoFocus
            required
            aria-required="true"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors duration-200">
            Cancelar
          </button>
          <button type="submit" disabled={!projectName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200">
            Salvar Projeto
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProjectForm;
