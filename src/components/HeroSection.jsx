import React from 'react';
import { ArrowRight, Play, Crosshair } from 'lucide-react';

export default function HeroSection({ onExplore, onHot }) {
  return <section className="hero">
    <div className="hero-grid" />
    <div className="hero-copy">
      <div className="eyebrow"><span className="eyebrow-line" /> BUILT FOR THE CURIOUS <span className="eyebrow-no">01 / 04</span></div>
      <h1>探索你的<br /><em>下一款模型。</em></h1>
      <p>從遙控坦克、模型車到創意玩具，<br className="desktop-break" />找到你的下一個收藏。</p>
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onExplore}>探索商品 <ArrowRight size={17} /></button>
        <button className="btn btn-ghost" onClick={onHot}><Play size={15} /> 查看熱門商品</button>
      </div>
      <div className="hero-footnote"><span className="status-dot" /> CURATED GEAR. SERIOUS FUN.</div>
    </div>
    <div className="hero-visual">
      <div className="hero-image" role="img" aria-label="遙控模型與戶外裝備情境圖" />
      <div className="image-shade" />
      <div className="hero-stamp"><Crosshair size={17} /><span>FIELD<br />TESTED</span></div>
      <div className="hero-product-label"><span>FEATURED / 001</span><strong>READY FOR THE TERRAIN</strong><small>性能與細節，從不妥協。</small></div>
      <div className="hero-index">AR—01</div>
    </div>
    <div className="hero-bottom-line"><span>DESIGNED TO EXPLORE</span><span>SCROLL TO DISCOVER ↓</span><span>EST. FOR ENTHUSIASTS</span></div>
  </section>;
}