import Image from 'next/image'
import Link from 'next/link';
import { useEffect } from 'react';
import { useABTests } from '../utils/useABTest';
import styles from './index.module.css'

export default function Home() {
  const abTests = useABTests();
  
  useEffect(() => {
    console.log(abTests)
  }, [abTests])
  
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Page 2
        </h1>


        <div className={styles.grid}>
        <Link href="/">Go to page 1</Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
