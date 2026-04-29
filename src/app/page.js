import Link from 'next/link';
import Navbar from './components/Navbar';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Appliance Inventory Management</h1>
            <p className={styles.description}>
              Efficiently manage and track your appliance inventory with our comprehensive web application.
              Add, search, update, and delete appliances with ease.
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>➕</div>
              <h3>Add Appliances</h3>
              <p>Register new appliances with user information and detailed specifications.</p>
              <Link href="/add" className={styles.featureLink}>Get Started →</Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Search & Filter</h3>
              <p>Search across user data and appliance details with advanced filtering options.</p>
              <Link href="/search" className={styles.featureLink}>Explore →</Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✏️</div>
              <h3>Update Records</h3>
              <p>Modify appliance information and user details with comprehensive validation.</p>
              <Link href="/update" className={styles.featureLink}>Update →</Link>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗑️</div>
              <h3>Remove Items</h3>
              <p>Safely delete appliances from your inventory with confirmation prompts.</p>
              <Link href="/delete" className={styles.featureLink}>Delete →</Link>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2>Ready to manage your inventory?</h2>
            <div className={styles.buttonGroup}>
              <Link href="/add" className={styles.primaryButton}>Start Adding</Link>
              <Link href="/search" className={styles.secondaryButton}>Browse Inventory</Link>
            </div>
          </div>
        </main>
      </div>
    </>
);}
