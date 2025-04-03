"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import styles from '../../../src/styles/AdminReservasPage.module.css';

export default function AdminReservasContent() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchReservations();
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchReservations = async () => {
    try {
      const q = query(collection(db, 'reservations'));
      const querySnapshot = await getDocs(q);
      const reservationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(reservationsData);
    } catch (err) {
      setError('Erro ao carregar reservas.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, {
        status: 'Cancelada',
        paymentStatus: 'Reembolsado',
      });
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: 'Cancelada', paymentStatus: 'Reembolsado' } : res))
      );
    } catch (err) {
      setError('Erro ao cancelar reserva.');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <section className={styles.section}>
            <h1 className={styles.sectionTitle}>Login de Administrador</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleLogin} className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Senha</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <button type="submit" className={styles.formButton}>Entrar</button>
            </form>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>Painel de Administração - Reservas</h1>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.reservationsList}>
            {reservations.length === 0 ? (
              <p className={styles.sectionText}>Nenhuma reserva encontrada.</p>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className={styles.reservationItem}>
                  <p><strong>Suíte:</strong> {reservation.suite}</p>
                  <p><strong>Data:</strong> {reservation.checkInDate}</p>
                  <p><strong>Horário:</strong> {reservation.checkInTime}</p>
                  <p><strong>Período:</strong> {reservation.period}</p>
                  <p><strong>Nome:</strong> {reservation.name}</p>
                  <p><strong>E-mail:</strong> {reservation.email}</p>
                  <p><strong>Telefone:</strong> {reservation.phone}</p>
                  <p><strong>Status:</strong> {reservation.status}</p>
                  <p><strong>Pagamento:</strong> {reservation.paymentStatus}</p>
                  {reservation.status !== 'Cancelada' && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className={styles.cancelButton}
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}