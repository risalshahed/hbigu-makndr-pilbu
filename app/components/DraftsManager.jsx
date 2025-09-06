import { useContext } from 'react';
import DraftForm from './DraftForm';
import DraftList from './DraftList';
import { DraftsContext } from '../context';

export default function DraftsManager() {
  const {
    title,
    setTitle,
    body,
    setBody,
    editingId,
    drafts,
    handleAdd,
    handleEdit,
    handleDelete,
    loading,
    publishResults,
    handlePublishAll
  } = useContext(DraftsContext);

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">
        Write a draft
      </h2>      
      {/* Modified: Use DraftForm and pass editing draft */}
      <DraftForm
        onAdd={handleAdd}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
        initialValues={editingId ? drafts.find(d => d.id === editingId) : null}
      />
      
      {/* Use DraftList */}
      <div className="mt-6">
        <h3 className="font-semibold">Drafts ({drafts.length})</h3>        
        <DraftList
          drafts={drafts} 
          onAdd={handleAdd} // Reuse handleAdd for updates
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

        
      {/* Publish All button */}
      <div className="mt-4">
        <button
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={handlePublishAll}
        >
          {loading ? 'Publishing...' : 'Publish All'}
        </button>
      </div>

      {console.log({publishResults})}

      {/* Added: Publish results feedback */}
      {publishResults && (
        <div className="mt-4 p-3 border rounded">
          <h3 className="font-semibold">Publish Results</h3>
          <ul className="mt-2 space-y-2">
            {publishResults.map((result, i) =>
              <li key={i} className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.file}: {result.success ? 'Published successfully' : `Failed - ${result.error}`}
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}