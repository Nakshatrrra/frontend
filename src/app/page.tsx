import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Add your website's logo */}
      <div className={styles.logoContainer}>
        <Image src="/logo.png" alt="Website Logo" width={150} height={150} />
      </div>

      <div className={styles.buttonContainer}>
        <Link href="/login" passHref>
          <button className={styles.loginButton}>Go to Login</button>
        </Link>
      </div>
    </main>
  );
}
