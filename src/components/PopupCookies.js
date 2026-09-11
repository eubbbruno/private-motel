'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
export default function PopupCookies(){const[open,setOpen]=useState(false);useEffect(()=>{try{setOpen(!localStorage.getItem('cookieConsent'));}catch{setOpen(true);}},[]);const accept=()=>{try{localStorage.setItem('cookieConsent','true');}catch{}setOpen(false);};if(!open)return null;return <aside className="cookie-toast" aria-label="Aviso de cookies"><p>Este site usa cookies para melhorar sua experiência. <Link href="/lgpd">Saiba mais</Link></p><button onClick={accept}>Entendi</button></aside>;}
