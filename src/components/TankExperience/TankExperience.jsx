import React, {useRef,useState,useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {ArrowUpRight,ArrowDown,ArrowCounterClockwise,Pause,Play} from '@phosphor-icons/react';
import {createTankScene} from './tank-scene.js';
import './tank-experience.css';

const chapters=[
  {label:'完整模型',at:0},
  {label:'拆解',at:.28},
  {label:'底盤',at:.47},
  {label:'車殼與砲塔',at:.77},
  {label:'組裝完成',at:1}
];

export default function TankExperience({navigate}) {
  const section=useRef(null),canvasHost=useRef(null),sceneRef=useRef(null),jumpRef=useRef(null);
  const [chapter,setChapter]=useState(0),[finish,setFinish]=useState('graphite'),[mode,setMode]=useState('loading');
  const [motionOff,setMotionOff]=useState(false);
  useGSAP(()=>{
    let model;
    try {model=createTankScene(canvasHost.current);sceneRef.current=model;} catch(error) {console.warn('3D preview unavailable:',error.message);setMode('fallback');return;}
    const mm=gsap.matchMedia();
    mm.add({reduced:'(prefers-reduced-motion: reduce)',motion:'(prefers-reduced-motion: no-preference)'},context=>{
      const reduced=context.conditions.reduced||motionOff;
      setMode(reduced?'reduced':'ready');
      let lenis=null,trigger=null,lastChapter=-1;
      const state={progress:0};
      const node=section.current;
      const intro=node.querySelector('.assembly-intro');
      const title=node.querySelector('.assembly-wordmark');
      const info=node.querySelector('.assembly-story');
      const update=()=>{
        const p=state.progress;model.update(p);
        node.style.setProperty('--assembly-progress',p);
        node.dataset.progress=p.toFixed(3);
        const next=p<.11?0:p<.35?1:p<.58?2:p<.87?3:4;
        if(next!==lastChapter){lastChapter=next;setChapter(next);}
        const fade=gsap.utils.clamp(0,1,(p-.025)/.08);
        gsap.set(intro,{autoAlpha:1-fade,y:-fade*24});
        gsap.set(title,{opacity:.40-fade*.28,y:-fade*30,scale:1-fade*.06});
        const storyFade=gsap.utils.clamp(0,1,(p-.12)/.06);
        gsap.set(info,{autoAlpha:storyFade,y:20*(1-storyFade)});
      };
      if(!reduced){
        lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false});
        gsap.ticker.lagSmoothing(0);
        lenis.on('scroll',ScrollTrigger.update);
        const tween=gsap.to(state,{progress:1,ease:'none',onUpdate:update,scrollTrigger:{
          trigger:node,pin:node.querySelector('.assembly-stage'),
          start:()=>`top top+=${document.querySelector('.site-header')?.offsetHeight||76}`,
          end:()=>`+=${window.innerHeight*(window.innerWidth<700?3.2:4)}`,
          scrub:.65,anticipatePin:1,invalidateOnRefresh:true
        }});
        trigger=tween.scrollTrigger;
        jumpRef.current=at=>{ScrollTrigger.refresh();lenis.resize();lenis.scrollTo(trigger.start+(trigger.end-trigger.start)*at,{duration:1.25});};
        update();
        gsap.from('.assembly-intro > *',{opacity:0,y:18,duration:.8,stagger:.1,ease:'power3.out',clearProps:'all'});
      }else{model.update(1);setChapter(4);gsap.set(info,{autoAlpha:0});}
      const tick=time=>{lenis?.raf(time*1000);model.render();};gsap.ticker.add(tick);
      const pointer=e=>{if(reduced)return;const r=canvasHost.current.getBoundingClientRect();model.pointer((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5);};
      const reset=()=>model.pointer(0,0);
      node.addEventListener('pointermove',pointer);node.addEventListener('pointerleave',reset);
      const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
      return()=>{cancelAnimationFrame(refresh);gsap.ticker.remove(tick);lenis?.destroy();if(lenis)gsap.ticker.lagSmoothing(500,33);jumpRef.current=null;node.removeEventListener('pointermove',pointer);node.removeEventListener('pointerleave',reset);};
    });
    return()=>{mm.revert();model.dispose();sceneRef.current=null;};
  },{scope:section,dependencies:[motionOff],revertOnUpdate:true});
  useEffect(()=>{sceneRef.current?.finish(finish);},[finish,motionOff]);
  const jump=at=>jumpRef.current?.(at);
  return <section className={'assembly-experience is-'+mode} ref={section} aria-label="遙控坦克概念模型組裝展示">
    <div className="assembly-stage">
      <div className="assembly-wordmark" aria-hidden="true">RC TANK</div>
      <div className="tank-canvas" ref={canvasHost}/>
      <div className="tank-fallback"><img src="assets/tank-model.png" alt="遙控坦克概念模型"/></div>
      <div className="assembly-topline"><button className="assembly-motion-toggle" aria-label={motionOff?'開啟組裝動畫':'靜態預覽'} title={motionOff?'開啟組裝動畫':'靜態預覽'} aria-pressed={motionOff} disabled={mode==='reduced'&&!motionOff} onClick={()=>{window.scrollTo(0,0);setMotionOff(v=>!v)}}>{motionOff?<Play size={18}/>:<Pause size={18}/>}</button></div>
      <div className="assembly-intro"><span className="assembly-kicker">遙控模型</span><h1>RC<span className="title-space"> </span><br/>TANK<span className="title-period">.</span></h1><button className="assembly-cta" onClick={()=>mode==='ready'?jump(.28):navigate('catalog')}>{mode==='ready'?'探索結構':'探索商品'} <ArrowDown size={18}/></button></div>
      <div className="assembly-story" aria-live="polite"><span className="assembly-kicker">{String(chapter).padStart(2,'0')} / 04</span><h2>{chapters[chapter].label}</h2>{chapter===4&&<button className="assembly-cta" onClick={()=>navigate('catalog')}>探索商品 <ArrowUpRight size={18}/></button>}</div>
      <div className="assembly-finishes" role="group" aria-label="模型配色"><button className={'finish-swatch graphite '+(finish==='graphite'?'selected':'')} title="石墨灰" aria-label="石墨灰" aria-pressed={finish==='graphite'} onClick={()=>setFinish('graphite')}/><button className={'finish-swatch sand '+(finish==='sand'?'selected':'')} title="沙岩色" aria-label="沙岩色" aria-pressed={finish==='sand'} onClick={()=>setFinish('sand')}/></div>
      <div className="assembly-bottom"><span className="assembly-scroll-hint">向下捲動 <ArrowDown size={12}/></span><nav className="assembly-chapters" aria-label="組裝展示段落">{chapters.map((item,i)=><button key={item.label} aria-label={item.label} title={item.label} onClick={()=>jump(item.at)} aria-current={chapter===i?'step':undefined}><span aria-hidden="true"/></button>)}</nav><button className="assembly-replay" aria-label="重新觀看組裝" onClick={()=>jump(0)}><ArrowCounterClockwise size={18}/></button></div>
      <div className="assembly-progress" aria-hidden="true"/>
      <span className="assembly-disclaimer">造型與組裝順序為視覺示意</span>
    </div>
  </section>;
}
