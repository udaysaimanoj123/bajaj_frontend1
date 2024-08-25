import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Handle input change
  const handleInputChange = (e) => {
    setJsonData(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData);
      const res = await axios.post('http://localhost:3000/bfhl', { data: parsedData.data });
      setResponse(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Invalid JSON or server error');
      setResponse(null);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);

    setSelectedOptions(prevSelected => {
      const updatedSelection = new Set(prevSelected);

      selectedValues.forEach(value => {
        if (updatedSelection.has(value)) {
          updatedSelection.delete(value); // Remove if already selected
        } else {
          updatedSelection.add(value); // Add if not selected
        }
      });

      return Array.from(updatedSelection);
    });
  };

  // Remove selected option
  const handleRemoveOption = (optionToRemove) => {
    setSelectedOptions(prevSelected => prevSelected.filter(option => option !== optionToRemove));
  };

  // Log selectedOptions whenever it changes
  useEffect(() => {
    console.log('Selected options updated:', selectedOptions);
  }, [selectedOptions]);

  // Filter response data based on selected options
  const filterResponse = () => {
    if (!response) return null;

    const filtered = {
      numbers: [],
      alphabets: [],
      highest_lowercase_alphabet: []
    };

    if (response.numbers && selectedOptions.includes('numbers')) {
      filtered.numbers = response.numbers.filter(item => !isNaN(item));
    }

    if (response.alphabets && selectedOptions.includes('alphabets')) {
      filtered.alphabets = response.alphabets.filter(item => isNaN(item));
    }

    if (response.highest_lowercase_alphabet && selectedOptions.includes('highest_lowercase_alphabet')) {
      filtered.highest_lowercase_alphabet = response.highest_lowercase_alphabet.filter(item => item.match(/[a-z]/));
    }

    return filtered;
  };

  // Set document title
  document.title = '21bce9371';

  const filteredResponse = filterResponse();

  return (
    <div className="App">
      <h1>API INPUT</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonData}
          onChange={handleInputChange}
          placeholder='Enter JSON data here'
          rows={5}
          cols={40}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {response && (
        <>
          <div className="multi-filter">
            <label htmlFor="data-options">Select Data to Display: </label>
            <select multiple={true} onChange={handleDropdownChange} id="data-options">
              <option value="alphabets">Alphabets</option>
              <option value="numbers">Numbers</option>
              <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
            </select>
          </div>

          <div className="selected-options">
            <h2>Selected Filters</h2>
            {selectedOptions.map(option => (
              <button
                key={option}
                className="filter-button"
                onClick={() => handleRemoveOption(option)}
              >
                {option}
                <span className="remove-icon">&times;</span>
              </button>
            ))}
          </div>
          
          <div className="filtered-response">
            <h2>Filtered Response</h2>
            {selectedOptions.includes('numbers') && filteredResponse?.numbers.length > 0 && (
              <div>
                <strong>Numbers:</strong> {filteredResponse.numbers.join(', ')}
              </div>
            )}

            {selectedOptions.includes('alphabets') && filteredResponse?.alphabets.length > 0 && (
              <div>
                <strong>Alphabets:</strong> {filteredResponse.alphabets.join(', ')}
              </div>
            )}

            {selectedOptions.includes('highest_lowercase_alphabet') && filteredResponse?.highest_lowercase_alphabet.length > 0 && (
              <div>
                <strong>Highest Lowercase Alphabet:</strong> {filteredResponse.highest_lowercase_alphabet.join(', ')}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
