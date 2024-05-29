import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Login.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      startSessionTimer(); // Start the timer when the component mounts if the token exists
    }
  }, []);

  const startSessionTimer = () => {
    const id = setTimeout(() => {
      localStorage.removeItem('token'); // Remove the token from local storage
      router.push('/login'); // Redirect to login page
    }, 900000); // 900000 milliseconds = 15 minutes
    setTimeoutId(id);
  };

  const handleLogin = async () => {
    const requestBody = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('token', data.token);
        startSessionTimer(); // Start the timer once logged in
        router.push('/adminPanel');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Image src="/logo.png" alt="Website Logo" width={150} height={150} />
      </div>
      <h2 className={styles.headingstyle}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="button" onClick={handleLogin} className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
