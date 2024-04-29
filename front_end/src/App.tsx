import { Suspense } from 'react';
import './global.css';
import Router from './Router'
import Layout from './components/Layout';
//import UserContextProvider from '@/contexts/UserContextProvider'

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Layout />}>
        <Router />
      </Suspense>
    </div>
  );
}

export default App;
