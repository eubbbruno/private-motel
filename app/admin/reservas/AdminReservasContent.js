"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
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
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        fetchReservations();
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReservations(data || []);
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
      setError('Erro ao carregar reservas.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      setIsAuthenticated(true);
      fetchReservations();
    } catch (err) {
      console.error('Erro de autenticação:', err);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError('Erro ao fazer logout.');
    }
  };

  const updateReservationStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: newStatus,
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar a lista de reservas
      fetchReservations();
    } catch (err) {
      console.error('Erro ao atualizar reserva:', err);
      setError('Erro ao atualizar status da reserva.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {!isAuthenticated ? (
          <div className={styles.loginContainer}>
            <h1 className={styles.title}>Área Administrativa</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button type="submit" className={styles.loginButton}>Entrar</button>
            </form>
          </div>
        ) : (
          <div className={styles.adminPanel}>
            <div className={styles.adminHeader}>
              <h1 className={styles.title}>Gerenciamento de Reservas</h1>
              <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.reservationsContainer}>
              <h2 className={styles.subtitle}>Reservas</h2>
              {reservations.length === 0 ? (
                <p className={styles.noReservations}>Nenhuma reserva encontrada.</p>
              ) : (
                <div className={styles.reservationsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>ID</div>
                    <div className={styles.headerCell}>Nome</div>
                    <div className={styles.headerCell}>Suíte</div>
                    <div className={styles.headerCell}>Data</div>
                    <div className={styles.headerCell}>Horário</div>
                    <div className={styles.headerCell}>Status</div>
                    <div className={styles.headerCell}>Ações</div>
                  </div>
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className={styles.tableRow}>
                      <div className={styles.cell}>{reservation.id.substring(0, 8)}...</div>
                      <div className={styles.cell}>{reservation.name}</div>
                      <div className={styles.cell}>{reservation.suite}</div>
                      <div className={styles.cell}>
                        {new Date(reservation.check_in_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className={styles.cell}>{reservation.check_in_time}</div>
                      <div className={`${styles.cell} ${styles.statusCell} ${styles[`status_${reservation.status.toLowerCase()}`]}`}>
                        {reservation.status}
                      </div>
                      <div className={styles.cell}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'Confirmada')}
                            className={`${styles.actionButton} ${styles.confirmButton}`}
                            disabled={reservation.status === 'Confirmada'}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'Cancelada')}
                            className={`${styles.actionButton} ${styles.cancelButton}`}
                            disabled={reservation.status === 'Cancelada'}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}