'use client';//Frontend
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchForm from './SearchForm';
import styles from './search.module.css';

export default function SearchPage() {//Allows user to input search and displays the results
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchForm, setSearchForm] = useState({//Search parameters for the search form
    q: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    eircode: '',
    applianceType: '',
    brand: '',
    modelNumber: '',
    serialNumber: ''
  });

  // Load all appliances on page mount
  useEffect(() => {
    loadAllAppliances();
  }, []);

  const loadAllAppliances = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/search');
      if (!response.ok) {
        throw new Error(`Failed to load appliances: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
      } else {
        setError(data.error || 'Failed to load appliances');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {//Handles the changes in the search form inputs
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {//Handles the submission process by the user
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchResults([]);

    try {//Building query parameters based on the search form inputs
      const queryParams = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {  // Adding in non-empty search parameters
        if (value.trim()) {
          queryParams.append(key, value.trim());
        }
      });
      const response = await fetch(`/api/search?${queryParams.toString()}`);//Making a GET request to the search API with the query parameters
      if (!response.ok) {//Error handling 
        throw new Error(`Search failed, a result cannot be displayed: ${response.statusText}`);
      }

      const data = await response.json();//Parsing JSON response from the API

      if (data.success) {//Update state with search results if successful
        setSearchResults(data.results);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {//Error handling
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {//Clears up the search form and results
    setSearchForm({//Reset the search form to initial state
      q: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      eircode: '',
      applianceType: '',
      brand: '',
      modelNumber: '',
      serialNumber: ''
    });
    loadAllAppliances();//Reload all appliances
    setError('');
  };

  return (
    <>
      <Navbar />
      <SearchForm
        searchForm={searchForm}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        loading={loading}
        error={error}
        searchResults={searchResults}
        initialLoad={true}
      />
    </>
  );
}