'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { navigation, site, whatsappUrl } from '../data/site';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const brand = useRef(null);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const menu = dialog.current;
    const brandLink = brand.current;
    const menuTrigger = trigger.current;
    const previousOverflow = document.body.style.overflow;
    // Match the desktop navigation breakpoint in globals.css.
    const desktop = window.matchMedia('(min-width: 1101px)');
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    menu.showModal();
    desktop.addEventListener('change', onResize);
    onResize();

    return () => {
      desktop.removeEventListener('change', onResize);
      menu.close();
      document.body.style.overflow = previousOverflow;
      const focusTarget = desktop.matches ? brandLink : menuTrigger;
      focusTarget?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);
  const headerClass = [
    'site-header',
    isHome ? 'home-header' : '',
    !isHome || scrolled ? 'solid' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <header className={headerClass}>
        <Link ref={brand} className="brand" href="/" aria-label="Private Motel — Home">
          <Image src="/images/logo.png" alt="Private Motel" width={174} height={62} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.slice(1).map(([label, href]) => (
            <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
              {label}
            </Link>
          ))}
          <a href={site.menuPdf} target="_blank" rel="noopener noreferrer">Cardápio</a>
        </nav>
        <a className="header-reserve" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Reservar</a>
        <button
          ref={trigger}
          type="button"
          className="menu-trigger"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <span /><span />
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-dialog"
        aria-label="Menu principal"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return;
          const items = event.currentTarget.querySelectorAll('a[href], button');
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="menu-top">
          <Link href="/" onClick={close}>
            <Image src="/images/logo.png" alt="Private Motel" width={155} height={55} />
          </Link>
          <button type="button" className="icon-button" onClick={close} aria-label="Fechar menu">
            <FaTimes aria-hidden="true" />
          </button>
        </div>
        <p className="menu-invitation">O seu próximo encontro começa aqui.</p>
        <nav aria-label="Navegação mobile">
          {navigation.map(([label, href], index) => (
            <Link key={href} href={href} onClick={close} aria-current={pathname === href ? 'page' : undefined}>
              <span className="menu-number" aria-hidden="true">0{index + 1}</span>{label}
            </Link>
          ))}
          <a href={site.menuPdf} target="_blank" rel="noopener noreferrer" onClick={close}>
            <span className="menu-number" aria-hidden="true">07</span>Cardápio
          </a>
          <Link href="/reservas" onClick={close} aria-current={pathname === '/reservas' ? 'page' : undefined}>
            <span className="menu-number" aria-hidden="true">08</span>Reservas
          </Link>
        </nav>
        <div className="menu-bottom">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" onClick={close}>Fale pelo WhatsApp</a>
          <a href={'tel:' + site.phone} onClick={close}>{site.phoneLabel}</a>
        </div>
      </dialog>
    </>
  );
}
