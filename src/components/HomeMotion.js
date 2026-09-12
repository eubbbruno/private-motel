'use client';
import {useEffect,useRef} from 'react';
import {animate} from 'framer-motion';
export default function HomeMotion({children}) {
 const root=useRef(null);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(!preference.matches)animations.add(animate(entry.target,{opacity:[0,1],y:[24,0]},{duration:.9,delay:Number(entry.target.dataset.delay||0),ease:[.22,.61,.36,1]}));
  }),{threshold:.12});
  root.current.querySelectorAll('[data-reveal]').forEach(node=>observer.observe(node));
  const stop=()=>animations.forEach(animation=>animation.complete());
  preference.addEventListener('change',stop);
  return()=>{observer.disconnect();stop();preference.removeEventListener('change',stop)};
 },[]);
 return <div ref={root}>{children}</div>;
}
