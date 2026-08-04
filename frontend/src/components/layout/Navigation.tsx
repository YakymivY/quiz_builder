'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';

const links = [
  { href: '/quizzes', label: 'All Quizzes' },
  { href: '/create', label: 'Create Quiz' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/quizzes" className={styles.brand}>
          Quiz Builder
        </Link>
        <nav className={styles.nav}>
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === '/quizzes' && pathname.startsWith('/quizzes/'));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
