import MotionProvider from '../../src/components/MotionProvider';
export const metadata = { title: 'Confirmação', robots: { index: false, follow: false } };
export default function Layout({ children }) { return <MotionProvider>{children}</MotionProvider>; }
