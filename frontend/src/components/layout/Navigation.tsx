import Link from 'next/link';
import styles from './Navigation.module.scss';

const links = [
  { href: '/quizzes', label: 'All Quizzes' },
  { href: '/create', label: 'Create Quiz' },
];

export function Navigation() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/quizzes" className={styles.brand}>
          Quiz Builder
        </Link>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
