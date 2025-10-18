import React, { useState } from 'react';

interface AddDocumentFormProps {
  onSave: (docName: string) => void;
  onCancel: () => void;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onSave, onCancel }) => {
  const [docName, setDocName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docName.trim()) {
      onSave(docName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="add-document-title">
      <div className="space-y-4">
        <div>
          <label htmlFor="docName" className="block text-sm font-medium text-slate-300 mb-1">
            Nome do Documento
          </label>
          <input
            type="text"
            id="docName"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
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
          <button type="submit" disabled={!docName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200">
            Salvar Documento
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDocumentForm;
