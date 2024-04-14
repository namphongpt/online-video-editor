import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
//    let ignore = false;

    fetch('/api/Projects').then(response => {
      if (!response.ok) {
        throw new Error('Non-OK HTTP status');
      }
      return response.json();
    }).then(json => {
      console.log(json);
 //     if (!ignore) {
        setIsLoading(false);
        setResults(json)
  //    }
    }).catch(err => setError(err));

   // return () => {
   //   ignore = true;
   // }
  }, []);

  if (isLoading) {
    return <p>Loading...</p>
  } else if (error != null) {
    return <p>Error: {error}</p>
  } else {
    return (
      <ul>
        {results.map(result => (
          <li key={result['id']}>
            {result['title']}
          </li>
        ))}
      </ul>
    )
  }
}

export default App;
