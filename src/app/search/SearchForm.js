import styles from './search.module.css';

export default function SearchForm({//The search forms component that displays the form and it's results
  searchForm,
  handleInputChange,
  handleSearch,
  clearSearch,
  loading,
  error,
  searchResults,
  initialLoad
}) {
  const isSearchActive = Object.values(searchForm).some(val => val.trim() !== '');

  return (
    <div className={styles.searchContainer}>
      {/* Container for the search form and results */}
      <div className={styles.searchWrapper}>
        {/* Wrapper for centering the content */}
        <div className={styles.searchCard}>
          {/* Card for the search form and results */}
          <h1 className={styles.searchTitle}>
            {initialLoad && !isSearchActive ? 'Browse Appliance Inventory' : 'Search Appliance Inventory'}
          </h1>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            {/* Form for the search inputs and buttons */}
            {/* General Search */}
            <div className={styles.searchSection}>
              <h2 className={styles.searchSectionTitle}>General Search</h2>
              <div className={styles.searchField}>
                <label htmlFor="q" className={styles.searchLabel}>
                  Search All Fields
                </label>
                <input
                  type="text"
                  id="q"
                  name="q"
                  value={searchForm.q}
                  onChange={handleInputChange}
                  placeholder="Search across thenames, email, appliance details..."
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* Users Information */}
            <div className={styles.searchSection}>
              {/* Section for the user information search parameters */}
              <h2 className={styles.searchSectionTitle}>User Information</h2>
              <div className={styles.searchGrid}>
                <div className={styles.searchField}>
                  <label htmlFor="firstName" className={styles.searchLabel}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={searchForm.firstName}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="lastName" className={styles.searchLabel}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={searchForm.lastName}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="email" className={styles.searchLabel}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={searchForm.email}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="mobile" className={styles.searchLabel}>
                    Mobile
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={searchForm.mobile}
                    onChange={handleInputChange}
                    placeholder="0851234567"
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="eircode" className={styles.searchLabel}>
                    Eircode
                  </label>
                  <input
                    type="text"
                    id="eircode"
                    name="eircode"
                    value={searchForm.eircode}
                    onChange={handleInputChange}
                    placeholder="D01 AB12"
                    className={styles.searchInput}
                  />
                </div>
              </div>
            </div>

            {/* Appliance Information */}
            <div className={styles.searchSection}>
              {/* Section for the appliance information search parameters */}
              <h2 className={styles.searchSectionTitle}>Appliance Information</h2>
              <div className={styles.searchGrid}>
                <div className={styles.searchField}>
                  <label htmlFor="applianceType" className={styles.searchLabel}>
                    Appliance Type
                  </label>
                  <select
                    id="applianceType"
                    name="applianceType"
                    value={searchForm.applianceType}
                    onChange={handleInputChange}
                    className={styles.searchSelect}
                  >
                    <option value="">All Types</option>
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
                <div className={styles.searchField}>
                  <label htmlFor="brand" className={styles.searchLabel}>
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={searchForm.brand}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="modelNumber" className={styles.searchLabel}>
                    Model Number
                  </label>
                  <input
                    type="text"
                    id="modelNumber"
                    name="modelNumber"
                    value={searchForm.modelNumber}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
                <div className={styles.searchField}>
                  <label htmlFor="serialNumber" className={styles.searchLabel}>
                    Serial Number
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={searchForm.serialNumber}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
              {/* Group the search and clear buttons together */}
              <button
                type="submit"
                disabled={loading}
                className={styles.searchButton}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={clearSearch}
                className={styles.clearButton}
              >
                Clear
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (//Error handling
            <div className={styles.errorMessage}>
              <div className={styles.errorTitle}>Error</div>
              <div className={styles.errorText}>{error}</div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (//Displaying the search results
            <div className={styles.resultsSection}>
              <h2 className={styles.resultsTitle}>
                Search Results ({searchResults.length} users found)
              </h2>
              <div className={styles.resultsList}>
                {searchResults.map((user) => (
                  <div key={user.UserID} className={styles.userCard}>
                    <div className={styles.userInfoGrid}>
                      <div>
                        <h3 className={styles.userName}>
                          {user.FirstName} {user.LastName}
                        </h3>
                        <p className={styles.userEmail}>{user.Email}</p>
                      </div>
                      <div>
                        <p className={styles.userDetail}>Mobile: {user.Mobile}</p>
                        <p className={styles.userDetail}>Eircode: {user.Eircode}</p>
                      </div>
                      <div>
                        <p className={styles.userDetail}>Appliances: {user.appliances.length}</p>
                      </div>
                    </div>

                    {user.appliances.length > 0 && (
                      <div className={styles.appliancesSection}>
                        <h4 className={styles.appliancesTitle}>Appliances:</h4>
                        <div className={styles.appliancesGrid}>
                          {user.appliances.map((appliance) => (
                            <div key={appliance.ApplianceID} className={styles.applianceCard}>
                              <div className={styles.applianceHeader}>
                                <span className={styles.applianceType}>{appliance.ApplianceType}</span>
                                <span className={styles.applianceCost}>€{appliance.Cost}</span>
                              </div>
                              <div className={styles.applianceDetails}>
                                <p>Brand: {appliance.Brand}</p>
                                <p>Model: {appliance.ModelNumber}</p>
                                <p>Serial: {appliance.SerialNumber}</p>
                                <p>Purchase: {appliance.PurchaseDate}</p>
                                <p>Warranty: {appliance.WarrantyDate}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && !loading && !error && (
            <div className={styles.noResults}>
              No results found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}