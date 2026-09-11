import Image from 'next/image';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import { whatsappUrl } from '../data/site';
export function Photo({src,alt,className='',priority=false,sizes='(max-width: 768px) 100vw, 60vw'}) { return <div className={'photo '+className}><Image src={src} alt={alt} fill sizes={sizes} priority={priority}/></div>; }
export function Arrow() {return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3"/></svg>;}
export function ReservationLink({children='Reservar agora',message,className='button'}) {return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">{children}<Arrow/></a>;}
export function PageIntro({eyebrow,title,description}) {return <header className="page-intro wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="intro-copy">{description}</p>}</header>;}
export function PageShell({children}) {return <><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></>;}
export function FinalCTA() {return <section className="final-cta wrap"><p className="eyebrow">Seu próximo encontro</p><h2>O resto do mundo<br/>pode esperar.</h2><ReservationLink/><Link className="text-link" href="/reservas">Planeje sua reserva <Arrow/></Link></section>;}
