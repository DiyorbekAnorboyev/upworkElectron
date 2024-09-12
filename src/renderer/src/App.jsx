import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleClick = async (e) => {
    fetch('https://upworknew.onrender.com/users/', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ email: inputValue }),
    })
      .then(() => console.log("Success"))
      .catch(err => {
        console.log(err)
      })
  };

  useEffect(async () => {
    try {
      const response = await fetch('https://upworknew.onrender.com/users');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data on button click:', error);
    }

  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleInputChange} />
      <p>Output: {data ? data.map(e => e.email) : "Loading..."}</p>
      <button type="button" onClick={handleClick}>
        String
      </button>
    </div>
  );
}

export default App;

