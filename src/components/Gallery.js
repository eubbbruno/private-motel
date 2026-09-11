'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaExpand, FaTimes } from 'react-icons/fa';

export default function Gallery({ images, title, priority = false }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const modal = useRef(null);
  const opener = useRef(null);
  const start = useRef(null);
  const move = (direction) => setIndex((current) => (
    (current + direction + images.length) % images.length
  ));
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const dialog = modal.current;
    const trigger = opener.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      start.current = null;
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  function handleTouchStart(event) {
    const touch = event.touches[0];
    start.current = event.touches.length === 1
      ? { x: touch.clientX, y: touch.clientY, id: touch.identifier }
      : null;
  }

  function handleTouchEnd(event) {
    const origin = start.current;
    start.current = null;
    if (!origin || event.touches.length) return;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === origin.id);
    if (!touch) return;
    const deltaX = touch.clientX - origin.x;
    const deltaY = touch.clientY - origin.y;
    // Only deliberate horizontal swipes navigate; scrolling and pinching do not.
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      move(deltaX > 0 ? -1 : 1);
    }
  }

  return (
    <div className="gallery">
      <button type="button" ref={opener} className="gallery-image" onClick={() => setOpen(true)} aria-label={'Abrir galeria de ' + title} aria-haspopup="dialog">
        <Image src={images[index]} alt={title + ' — fotografia ' + (index + 1)} fill sizes="(max-width: 768px) 100vw, 65vw" priority={priority} />
        <span className="gallery-expand"><FaExpand aria-hidden="true" /> Ver galeria</span>
      </button>
      <div className="gallery-controls">
        <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} <span className="muted">/ {String(images.length).padStart(2, '0')}</span></span>
        <div>
          <button type="button" className="icon-button" onClick={() => move(-1)} aria-label={'Foto anterior de ' + title}><FaArrowLeft aria-hidden="true" /></button>
          <button type="button" className="icon-button" onClick={() => move(1)} aria-label={'Próxima foto de ' + title}><FaArrowRight aria-hidden="true" /></button>
        </div>
      </div>
      <dialog
        ref={modal}
        className="lightbox"
        aria-label={'Galeria ' + title}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            const buttons = event.currentTarget.querySelectorAll('button');
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <div className="lightbox-top">
          <span>{title}</span>
          <button type="button" autoFocus className="icon-button" onClick={close} aria-label="Fechar galeria"><FaTimes aria-hidden="true" /></button>
        </div>
        {open && (
          <div className="lightbox-photo" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { start.current = null; }}>
            <Image src={images[index]} alt={title + ' — fotografia ' + (index + 1)} fill sizes="95vw" />
          </div>
        )}
        <div className="lightbox-bottom">
          <button type="button" className="icon-button" onClick={() => move(-1)} aria-label="Foto anterior"><FaArrowLeft aria-hidden="true" /></button>
          <span aria-live="polite" aria-atomic="true">Foto {index + 1} de {images.length}</span>
          <button type="button" className="icon-button" onClick={() => move(1)} aria-label="Próxima foto"><FaArrowRight aria-hidden="true" /></button>
        </div>
      </dialog>
    </div>
  );
}
