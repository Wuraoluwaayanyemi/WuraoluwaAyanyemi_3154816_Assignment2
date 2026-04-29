'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from './delete.module.css';

export default function DeleteAppliancePage() {
  {/* Allows users to delete an appliance from inventory */}
  const [searchSerial, setSearchSerial] = useState('');
  const [searching, setSearching] = useState(false);
  const [applianceData, setApplianceData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSearchInputChange = (e) => {//Handles changes in the search input for the serial number
    setSearchSerial(e.target.value);
  };

  const searchAppliance = async () => {
    if (!searchSerial.trim()) {
      setError('Please enter a serial number to search');
      return;
    }

    setSearching(true);//Resetting state before search
    setError('');
    setInfo('');
    setMessage('');
    setApplianceData(null);

    try {
      // Search for the appliance using the search API
      const response = await fetch(`/api/search?serialNumber=${encodeURIComponent(searchSerial.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Search failed");
        return;
      }

      const results = data.results || [];

      if (results.length === 0) {
        setInfo('No appliance found with this serial number. Please check the serial number and try again.');
        return;
      }

      if (results.length > 1) {
        setError('Multiple appliances found with this serial number. Please contact support.');
        return;
      }

      const appliance = results[0];//Data is stored in a state variable to be displayed to the user for confirmation before deletion
      setApplianceData(appliance);

      setInfo('Appliance found! Please review the information below and confirm deletion.');

    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for appliance. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async () => {//Handles the deletion process when the user wants to delete the appliance
    if (!applianceData) {
      setError('Please search for an appliance first');
      return;
    }

    setDeleting(true);//Resetting state before deletion
    setMessage('');
    setError('');
    setInfo('');

    try {//Making a DELETE request to the delete API with the serial number of the appliance to be deleted
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SerialNumber: applianceData.SerialNumber
        })
      });

      const data = await response.json();

      if (response.ok) {//Sucess messages
        setMessage(data.message);
        // Clear the form and search
        setApplianceData(null);
        setSearchSerial('');
      } else {
        setError(data.error || 'Failed to delete appliance');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const clearForm = () => {//Clears the form and resets all state variables to their initial values
    setApplianceData(null);
    setSearchSerial('');
    setMessage('');
    setError('');
    setInfo('');
  };

  return (
    <div className={styles.page}>
      {/* The main structure of the page holding all sections, including the search form, appliance information display, and action buttons, as well as messages for the user */}
      <Navbar />
      <div className={styles.container}>
        {/* Container for the main content of the page */}
        <div className={styles.content}>
          <div className={styles.card}>
            <h1 className={styles.title}>
              Delete Appliance
            </h1>

            {/* Warning Card */}
            <div className={styles.warningCard}>
              <div className={styles.warningTitle}>⚠️ Warning</div>
              <div className={styles.warningText}>
                Deleting an appliance is permanent and cannot be undone. Please ensure you have the correct serial number before proceeding.
              </div>
            </div>

            {/* Search Section */}
            <div className={styles.searchSection}>
              <h2 className={styles.searchTitle}>Find Appliance to Delete</h2>
              <form className={styles.searchForm} onSubmit={(e) => { e.preventDefault(); searchAppliance(); }}>
                <input
                  type="text"
                  value={searchSerial}
                  onChange={handleSearchInputChange}
                  placeholder="Enter Serial Number"
                  className={styles.searchInput}
                  disabled={searching}
                />
                <button
                  type="submit"
                  disabled={searching}
                  className={styles.searchButton}
                >
                  {searching ? (
                    <>
                      <span className={styles.loading}></span>
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
            </div>

            {/* Appliance Information Display */}
            {applianceData && (
              <div className={styles.applianceInfo}>
                <h3 className={styles.infoTitle}>Appliance Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Serial Number</div>
                    <div className={styles.infoValue}>{applianceData.SerialNumber}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Appliance Type</div>
                    <div className={styles.infoValue}>{applianceData.ApplianceType}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Brand</div>
                    <div className={styles.infoValue}>{applianceData.Brand || 'N/A'}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Model Number</div>
                    <div className={styles.infoValue}>{applianceData.ModelNumber || 'N/A'}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Owner</div>
                    <div className={styles.infoValue}>
                      {applianceData.FirstName} {applianceData.LastName}
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Email</div>
                    <div className={styles.infoValue}>{applianceData.Email}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Purchase Date</div>
                    <div className={styles.infoValue}>
                      {applianceData.PurchaseDate
                        ? new Date(applianceData.PurchaseDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    {/* Cost is displayed in euros with a € symbol, and if cost is not available, it shows 'N/A' */}
                    <div className={styles.infoLabel}>Cost</div>
                    <div className={styles.infoValue}>
                      {applianceData.Cost ? `€${applianceData.Cost}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Only show when appliance is found */}
            {applianceData && (
              <div className={styles.buttonContainer}>
                {/* Container for the clear and delete buttons */}
                <button
                  type="button"
                  onClick={clearForm}
                  disabled={deleting}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={styles.deleteButton}
                >
                  {deleting ? 'Deleting...' : 'Delete Appliance'}
                </button>
              </div>
            )}
          </div>

          {/* Info Message */}
          {info && (//Section for displaying  messages to the user, such as search results or instructions
            <div className={`${styles.message} ${styles.infoMessage}`}>
              <div className={styles.infoTitle}>Information</div>
              <div className={styles.infoText}>{info}</div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className={`${styles.message} ${styles.successMessage}`}>
              <div className={styles.successTitle}>Success!</div>
              <div className={styles.successText}>{message}</div>
            </div>
          )}

          {/* Error Message */}
          {error && (//Section for displaying error messages to the user, such as validation errors or API errors
            <div className={`${styles.message} ${styles.errorMessage}`}>
              <div className={styles.errorTitle}>Error</div>
              <div className={styles.errorText}>{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}