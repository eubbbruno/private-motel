import AdminReservasContent from './AdminReservasContent';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Admin - Reservas | Private Motel 5 Estrelas',
  description: 'Painel de administração para gerenciar reservas no Private Motel 5 Estrelas.',
};

export default function AdminReservasPage() {
  return <AdminReservasContent />;
}