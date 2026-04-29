'use client';//Frontend
import { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from './update.module.css';

export default function UpdateAppliancePage() {//Allows theuser to search for an appliance and update its information
  const [searchSerial, setSearchSerial] = useState('');
  const [searching, setSearching] = useState(false);
  const [applianceData, setApplianceData] = useState(null);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Mobile: '',
    Eircode: '',
    ApplianceType: '',
    Brand: '',
    ModelNumber: '',
    SerialNumber: '',
    PurchaseDate: '',
    WarrantyDate: '',
    Cost: ''
  });

  const [updating, setUpdating] = useState(false);//States for tracking update process
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchSerial(e.target.value);
  };

  const handleFormInputChange = (e) => {//Handles the changes in the update form inputs
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchAppliance = async () => {//Handling the search process for the appliance to be updated
    if (!searchSerial.trim()) {
      setError('Please enter a serial number to search');
      return;
    }

    setSearching(true);//Resetting states before searching
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

      const appliance = results[0];//If the appliance is found, add it's data to the form 
      setApplianceData(appliance);

      // Populate form with current data
      setFormData({
        FirstName: appliance.FirstName || '',
        LastName: appliance.LastName || '',
        Email: appliance.Email || '',
        Mobile: appliance.Mobile || '',
        Eircode: appliance.Eircode || '',
        ApplianceType: appliance.ApplianceType || '',
        Brand: appliance.Brand || '',
        ModelNumber: appliance.ModelNumber || '',
        SerialNumber: appliance.SerialNumber || '',
        PurchaseDate: appliance.PurchaseDate ? appliance.PurchaseDate.split('T')[0] : '',
        WarrantyDate: appliance.WarrantyDate ? appliance.WarrantyDate.split('T')[0] : '',
        Cost: appliance.Cost || ''
      });

      setInfo('Appliance found! You can now update the information below.');

    } catch (err) {//Error handling for debugging
      console.error('Search error:', err);
      setError('Failed to search for appliance. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleUpdate = async (e) => {//Handling the update process when the user submits the form
    e.preventDefault();

    if (!applianceData) {
      setError('Please search for an appliance first');
      return;
    }

    setUpdating(true);
    setMessage('');
    setError('');
    setInfo('');

    try {
      // Prepare update data - only include fields that have changed
      const updateData = {
        SerialNumber: applianceData.SerialNumber, // Required for identification
        ...Object.fromEntries(
          Object.entries(formData).filter(([key, value]) =>
            value !== '' && value !== (applianceData[key] || '')
          )
        )
      };

      // Convert empty strings to null for optional fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '') {
          updateData[key] = null;
        }
      });

      const response = await fetch('/api/update', {//Making a PUT request to the update API with the updated data
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {//If the update is successful, display a success message and clear the form
        setMessage(data.message);
        // Clear the form and search
        setApplianceData(null);
        setFormData({
          FirstName: '',
          LastName: '',
          Email: '',
          Mobile: '',
          Eircode: '',
          ApplianceType: '',
          Brand: '',
          ModelNumber: '',
          SerialNumber: '',
          PurchaseDate: '',
          WarrantyDate: '',
          Cost: ''
        });
        setSearchSerial('');
      } else {
        setError(data.error || 'Failed to update appliance');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const clearForm = () => {
    setApplianceData(null);
    setFormData({
      FirstName: '',
      LastName: '',
      Email: '',
      Mobile: '',
      Eircode: '',
      ApplianceType: '',
      Brand: '',
      ModelNumber: '',
      SerialNumber: '',
      PurchaseDate: '',
      WarrantyDate: '',
      Cost: ''
    });
    setSearchSerial('');
    setMessage('');
    setError('');
    setInfo('');
  };

  return (//Page layout with a navbar and a form for updating appliance information
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <h1 className={styles.title}>
              Update Appliance
            </h1>

            {/* Search Section */}
            <div className={styles.searchSection}>
              {/* Section for searching the appliance to be updated */}
              <h2 className={styles.searchTitle}>Find Appliance to Update</h2>
              <form className={styles.searchForm} onSubmit={(e) => { e.preventDefault(); searchAppliance(); }}>
                {/* Form for searching the appliance by serial number */}
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
                  {searching ? (//Loading state for search button
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

            {/* Update Form - Only show when appliance is found */}
            {applianceData && (//Form for updating the appliance information, already with current data and allows the user to edit it */}
              <form onSubmit={handleUpdate} className={styles.form}>
                {/* User Information Section */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>User Information</h2>
                  <div className={styles.grid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="FirstName" className={styles.label}>
                        First Name
                      </label>
                      {/* First name is required and needs to be sanitized for empty values */}
                      <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="LastName" className={styles.label}>
                        Last Name
                      </label>
                      {/* Last name is required and needs to be sanitized for empty values */}
                      <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="Email" className={styles.label}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="Mobile" className={styles.label}>
                        Mobile
                      </label>
                      <input
                        type="tel"
                        id="Mobile"
                        name="Mobile"
                        value={formData.Mobile}
                        onChange={handleFormInputChange}
                        placeholder="0851234567"
                        className={styles.input}
                      />
                    </div>
                    <div className={`${styles.formGroup} ${styles.gridFull}`}>
                      <label htmlFor="Eircode" className={styles.label}>
                        Eircode
                      </label>
                      <input
                        type="text"
                        id="Eircode"
                        name="Eircode"
                        value={formData.Eircode}
                        onChange={handleFormInputChange}
                        placeholder="D01 AB12"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Appliance Information Section */}
                <div className={styles.section}>
                  {/* Section for displaying and updating the appliance information */}
                  <h2 className={styles.sectionTitle}>Appliance Information</h2>
                  <div className={styles.grid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="ApplianceType" className={styles.label}>
                        Appliance Type
                      </label>
                      <select
                        id="ApplianceType"
                        name="ApplianceType"
                        value={formData.ApplianceType}
                        onChange={handleFormInputChange}
                        className={styles.select}
                      >
                        <option value="">Select Type</option>
                        {/* Dropdown for selecting the appliance type */}
                        <option value="Washing Machine">Washing Machine</option>
                        <option value="Fridge">Fridge</option>
                        <option value="Pressure Cooker">Pressure Cooker</option>
                        <option value="Dishwasher">Dishwasher</option>
                        <option value="Boiler">Boiler</option>
                        <option value="Microwave">Microwave</option>
                        <option value="SmartTV">SmartTV</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      {/* Brand is optional but needs to be sanitized for empty values */}
                      <label htmlFor="Brand" className={styles.label}>
                        Brand
                      </label>
                      <input
                        type="text"
                        id="Brand"
                        name="Brand"
                        value={formData.Brand}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ModelNumber" className={styles.label}>
                        Model Number
                      </label>
                      <input
                        type="text"
                        id="ModelNumber"
                        name="ModelNumber"
                        value={formData.ModelNumber}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="SerialNumber" className={styles.label}>
                        Serial Number (Read-only)
                      </label>
                      <input
                        type="text"
                        id="SerialNumber"
                        name="SerialNumber"
                        value={formData.SerialNumber}
                        className={styles.input}
                        readOnly
                        style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="PurchaseDate" className={styles.label}>
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        id="PurchaseDate"
                        name="PurchaseDate"
                        value={formData.PurchaseDate}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="WarrantyDate" className={styles.label}>
                        Warranty Date
                      </label>
                      <input
                        type="date"
                        id="WarrantyDate"
                        name="WarrantyDate"
                        value={formData.WarrantyDate}
                        onChange={handleFormInputChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={`${styles.formGroup} ${styles.gridFull}`}>
                      <label htmlFor="Cost" className={styles.label}>
                        Cost (€)
                      </label>
                      <input
                        type="number"
                        id="Cost"
                        name="Cost"
                        value={formData.Cost}
                        onChange={handleFormInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className={styles.buttonContainer}>
                  {/* Container for the clear and update buttons */}
                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={updating}
                    className={styles.clearButton}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className={styles.updateButton}
                  >
                    {updating ? 'Updating...' : 'Update Appliance'}
                  </button>
                </div>
              </form>
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
          {error && (
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