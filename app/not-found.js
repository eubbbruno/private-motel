'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const NotFound = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      color: '#fff'
    }}>
      <div style={{ position: 'relative', width: '200px', height: '67px', marginBottom: '30px' }}>
        <Image
          src="/logo.png"
          alt="Private Motel Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      
      <h1 style={{ 
        fontSize: '3rem', 
        margin: '0 0 20px',
        color: '#d4a373',
        fontWeight: 700
      }}>
        Página não encontrada
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        maxWidth: '600px', 
        marginBottom: '30px',
        lineHeight: 1.6
      }}>
        Desculpe, não conseguimos encontrar a página que você está procurando.
      </p>
      
      <p style={{ 
        fontSize: '1rem', 
        marginBottom: '40px',
        opacity: 0.8
      }}>
        Você será redirecionado para a página inicial em {countdown} segundos...
      </p>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #d4a373, #e6b800)',
          color: '#1a1a1a',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(212, 163, 115, 0.4)',
          transition: 'all 0.3s ease'
        }}>
          <FaHome /> Ir para a Home
        </Link>
        
        <button onClick={() => router.back()} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'all 0.3s ease'
        }}>
          <FaArrowLeft /> Voltar
        </button>
      </div>
    </div>
  );
};

export default NotFound; 