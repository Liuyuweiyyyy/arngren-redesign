import React from 'react';
import { ArrowUpRight, Instagram, Youtube } from 'lucide-react';
export default function Footer({ navigate }) {
  return <footer className="footer">
    <div className="footer-main">
      <div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark"><span /></span><span className="brand-type">ARNGREN<small>RC · MODELS · TOYS</small></span></button><p>為每一份好奇心，找到值得探索的裝備。</p></div>
      <div className="footer-links"><strong>快速導覽</strong><button onClick={() => navigate('explore')}>探索所有商品 <ArrowUpRight size={14}/></button><button onClick={() => navigate('compare')}>商品比較 <ArrowUpRight size={14}/></button><button onClick={() => navigate('cart')}>購物車 <ArrowUpRight size={14}/></button></div>
      <div className="footer-links"><strong>探索 ARNGREN</strong><span>模型玩家的裝備基地</span><span>精選商品・清楚規格</span><div className="socials"><Instagram size={17}/><Youtube size={17}/></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 ARNGREN. ALL SYSTEMS GO.</span><span>DESIGNED FOR DISCOVERY.</span><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>BACK TO TOP ↑</button></div>
  </footer>;
}