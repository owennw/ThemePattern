import React from 'react'

import styles from './Shell.css'

export default function Shell({ children }) {
  return (
    <div>
      <header className={styles.header}>Theme Pattern Example</header>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
