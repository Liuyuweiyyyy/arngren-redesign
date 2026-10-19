import React from 'react';
import { Menu, X, Scale, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function Navbar({ page, navigate, compareCount, cartCount }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const link = (target, label, icon = null, count = null) => (
    <button className={`nav-link ${page === target ? 'active' : ''}`} onClick={() => { navigate(target); setMenuOpen(false); }}>
      {icon}{label}{count !== null && <span className={`nav-count ${target === 'compare' ? 'compare-count' : ''}`}>{count}</span>}
    </button>
  );
  return <header className="site-header">
    <div className="nav-inner">
      <button className="brand" onClick={() => navigate('home')} aria-label="ARNGREN 首頁">
        <span className="brand-mark"><span /></span><span className="brand-type">ARNGREN<small>RC · MODELS · TOYS</small></span>
      </button>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="切換選單">{menuOpen ? <X /> : <Menu />}</button>
      <nav className={`nav-left ${menuOpen ? 'menu-open' : ''}`}>
        {link('home', '首頁')}
        {link('explore', '探索商品', <ArrowUpRight size={15} />)}
      </nav>
      <nav className={`nav-right ${menuOpen ? 'menu-open' : ''}`}>
        {link('compare', '比較商品', <Scale size={17} />, compareCount)}
        {link('cart', '購物車', <ShoppingBag size={17} />, cartCount)}
      </nav>
    </div>
  </header>;
}