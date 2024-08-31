import React from 'react';
import UploadForm from './components/UploadForm';
import MeasureList from './components/MeasureList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Carregar Medida</h1>
      <UploadForm />
      <h2>Lista de Medida</h2>
      <MeasureList />
    </div>
  );
};

export default App;
