import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {//Defines the navigation bar component that is used across all pages for consistent navigation
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logo}>
              Appliance Inventory
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link
              href="/"
              className={styles.navLink}
            >
              Home
            </Link>
            <Link
              href="/add"
              className={styles.navLink}
            >
              Add Appliance
            </Link>
            <Link
              href="/search"
              className={styles.navLink}
            >
              Search
            </Link>
            <Link
              href="/update"
              className={styles.navLink}
            >
              Update
            </Link>
            <Link
              href="/delete"
              className={styles.navLink}
            >
              Delete
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}