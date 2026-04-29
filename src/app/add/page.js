'use client';//Frontend

import { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from './add.module.css';

export default function AddAppliancePage() {//Allows users to add new appliances to the inventory
  const [formData, setFormData] = useState({//A state to hold form data with it's initial empty values
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
//States for managing loading, success message, and error message
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {//Handles the changes in the form inputs and updates the formData state
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {//Handles the submission process
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {//Making a POST request to the Add API with the form data
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();//Parsing JSON response from the API

      if (response.ok) {
        setMessage(data.message);
        // Reset the form on success
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
      } else {//error handling
        setError(data.error || 'Failed to add Appliance');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (//The form is divided into sections with appropriate input fields and validation 
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        {/* Main container for the page content */}
        <div className={styles.content}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>
              Add New Appliance
            </h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Form submission is handled by the handleSubmit function */}
              {/* User Information Section */}
              <div className={styles.section}>
                {/* Section for user information inputs */}
                <h2 className={styles.sectionTitle}>User Information</h2>
                <div className={styles.grid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="FirstName" className={styles.label}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="FirstName"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="LastName" className={styles.label}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="LastName"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="Email" className={styles.label}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      required
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      placeholder="D01 AB12"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Appliance Information Section */}
              <div className={styles.section}>
                {/* Section for appliance information inputs */}
                <h2 className={styles.sectionTitle}>Appliance Information</h2>
                <div className={styles.grid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="ApplianceType" className={styles.label}>
                      Appliance Type *
                    </label>
                    <select
                      id="ApplianceType"
                      name="ApplianceType"
                      value={formData.ApplianceType}
                      onChange={handleInputChange}
                      required
                      className={styles.select}
                    >
                      <option value="">Select Type</option>
                      {/* dropdown menu for appliance type */}
                      <option value="Freezer">Freezer</option>
                      <option value="Fridge">Fridge</option>
                      <option value="Oven">Oven</option>
                      <option value="Dishwasher">Dishwasher</option>
                      <option value="Dryer">Dryer</option>
                      <option value="Microwave">Microwave</option>
                      <option value="TV">TV</option>
                      <option value="Computer">Computer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="Brand" className={styles.label}>
                      {/* It is not a required field, cause some appliances may not have an existing brand name */}
                      Brand
                    </label>
                    <input
                      type="text"
                      id="Brand"
                      name="Brand"
                      value={formData.Brand}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="SerialNumber" className={styles.label}>
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      id="SerialNumber"
                      name="SerialNumber"
                      value={formData.SerialNumber}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className={styles.buttonContainer}>
                {/* Submit button for the form, which is disabled while loading to prevent multiple submissions */}
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? 'Adding Appliance...' : 'Add Appliance'}
                </button>
              </div>
            </form>

            {/* Success Message */}
            {message && (
              <div className={`${styles.message} ${styles.successMessage}`}>
                <div className={styles.successTitle}>Success!</div>
                <div className={styles.successText}>{message}</div>
              </div>
            )}

            {/* Error Message */}
            {error && (//Error handling
              <div className={`${styles.message} ${styles.errorMessage}`}>
                <div className={styles.errorTitle}>Error</div>
                <div className={styles.errorText}>{error}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}