
import './App.scss';
import { Route , Routes } from 'react-router-dom';
import Result from './components/results/results.component';
import Form from './components/form/form.component';
function App() {
  return (
    <Routes>
    <Route path="/*" element={<Form />} />
     <Route  path="result/:origin/:destination/:intermediate/:number/:date" element={<Result />} />
  
 
 </Routes>
  );
}

export default App;
