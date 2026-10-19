import React from 'react';
import { Search, SlidersHorizontal, ArrowRight, ArrowLeft, Plus, Minus, Trash2, Scale, ShoppingBag, CheckCircle2, X, ChevronRight, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { products, categories } from './data';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryCard from './components/CategoryCard';
import ProductCard from './components/ProductCard';
// import Footer from './components/Footer';

const money = n => `NT$ ${n.toLocaleString('zh-TW')}`;

export default function App() {
  const [page, setPage] = React.useState('home');
  const [category, setCategory] = React.useState('全部商品');
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('featured');
  const [compare, setCompare] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [toast, setToast] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const navigate = target => {
    setPage(target);
    setSelected(null);
    if (target !== 'detail') window.history.replaceState({}, '', target === 'home' ? '/' : `/#${target}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  React.useEffect(() => {
    const onHash = () => {
      const target = window.location.hash.replace('#', '');
      if (['explore','compare','cart'].includes(target)) setPage(target);
      else setPage('home');
    };
    window.addEventListener('popstate', onHash);
    window.addEventListener('hashchange', onHash);
    if (window.location.hash) onHash();
    return () => { window.removeEventListener('popstate', onHash); window.removeEventListener('hashchange', onHash); };
  }, []);

  const notify = msg => { setToast(msg); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setToast(''), 2600); };
  const addCompare = id => {
    if (compare.includes(id)) { setCompare(compare.filter(x => x !== id)); notify('已從比較清單移除'); }
    else if (compare.length >= 3) notify('比較清單最多可放 3 件商品');
    else { setCompare([...compare, id]); notify('已加入比較清單'); }
  };
  const addCart = id => {
    setCart(prev => prev.some(x => x.id === id) ? prev.map(x => x.id === id ? {...x, qty:x.qty+1} : x) : [...prev, {id, qty:1}]);
    notify('商品已加入購物車');
  };
  const changeQty = (id, delta) => setCart(prev => prev.map(x => x.id === id ? {...x, qty:x.qty+delta} : x).filter(x => x.qty > 0));
  const removeCart = id => setCart(prev => prev.filter(x => x.id !== id));
  const openDetail = p => { setSelected(p); setPage('detail'); window.history.pushState({}, '', `/#product-${p.id}`); window.scrollTo(0,0); };
  const cartCount = cart.reduce((sum, x) => sum + x.qty, 0);
  const cartTotal = cart.reduce((sum, x) => sum + products.find(p => p.id === x.id).price * x.qty, 0);
  const filtered = products.filter(p => (category === '全部商品' || p.category === category) && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a,b) => sort === 'price-low' ? a.price-b.price : sort === 'price-high' ? b.price-a.price : sort === 'rating' ? b.rating-a.rating : products.indexOf(a)-products.indexOf(b));
  const compareProducts = compare.map(id => products.find(p => p.id === id)).filter(Boolean);

  const productGrid = (items, compact=false) => <div className={`product-grid ${compact ? 'compact-grid' : ''}`}>{items.map(p => <ProductCard key={p.id} product={p} compared={compare.includes(p.id)} onCompare={() => addCompare(p.id)} onAdd={() => addCart(p.id)} onDetail={() => openDetail(p)} />)}</div>;
  const pageTitle = (eyebrow, title, description) => <div className="page-heading"><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><span className="heading-mark">AR / 2026</span></div>;

  return <div className="app-shell">
    <Navbar page={page} navigate={navigate} compareCount={compare.length} cartCount={cartCount} />
    <main>
      {page === 'home' && <>
        <HeroSection onExplore={() => navigate('explore')} onHot={() => {setCategory('全部商品'); navigate('explore'); setSort('rating');}} />
        <section className="trust-strip"><div><PackageCheck/><span><strong>精選模型裝備</strong><small>為玩家挑選好物</small></span></div><div><ShieldCheck/><span><strong>規格清楚透明</strong><small>選購資訊一目瞭然</small></span></div><div><Truck/><span><strong>安心購物體驗</strong><small>訂單與購物車整合</small></span></div><div className="trust-note">GEAR UP. GO FURTHER.</div></section>
        <section className="section categories-section">
          <div className="section-heading"><div><span className="section-kicker">FIND YOUR FIELD</span><h2>探索你的興趣領域<span className="blue-period">.</span></h2><p>從地面到天空，下一次冒險由你決定。</p></div><button className="text-link" onClick={() => navigate('explore')}>所有分類 <ArrowRight size={16}/></button></div>
          <div className="category-grid">{categories.map(c => <CategoryCard key={c.name} category={c} onClick={() => {setCategory(c.name); navigate('explore');}} />)}</div>
        </section>
        <section className="section featured-section">
          <div className="section-heading"><div><span className="section-kicker">THE SELECTED LINEUP</span><h2>玩家熱門精選<span className="blue-period">.</span></h2><p>高人氣與高評價，讓你的下一個收藏更有方向。</p></div><button className="text-link" onClick={() => navigate('explore')}>探索全部商品 <ArrowRight size={16}/></button></div>
          {productGrid([...products].sort((a,b)=>b.rating-a.rating).slice(0,4))}
        </section>
        <section className="feature-banner"><div className="banner-content"><span className="section-kicker">MADE FOR THE MAKERS</span><h2>不只是玩具。<br/>是下一場冒險的開始。</h2><p>挑一件讓你想立刻動手、出發、探索的裝備。</p><button className="btn btn-primary" onClick={() => navigate('explore')}>找到你的下一款 <ArrowRight size={17}/></button></div><div className="banner-art"><span>01</span><div className="banner-circle" /><div className="banner-word">EXPLORE<br/>MORE.</div></div></section>
      </>}

      {page === 'explore' && <section className="page-wrap">
        {pageTitle('THE FULL COLLECTION', '探索商品', '依照你的興趣與需求，找到下一件值得入手的模型裝備。')}
        <div className="explore-toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜尋商品名稱或分類..." /><kbd>⌕</kbd></div><div className="toolbar-right"><SlidersHorizontal size={16}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="商品排序"><option value="featured">推薦排序</option><option value="rating">評價最高</option><option value="price-low">價格由低至高</option><option value="price-high">價格由高至低</option></select></div></div>
        <div className="filter-chips">{['全部商品',...categories.map(c=>c.name)].map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="results-line"><span>找到 <strong>{sorted.length}</strong> 件商品</span><span>SHOWING 01—{String(sorted.length).padStart(2,'0')}</span></div>
        {sorted.length ? productGrid(sorted) : <div className="empty-state"><Search size={30}/><h3>找不到符合的商品</h3><p>試試其他關鍵字或切換商品分類。</p><button className="btn btn-primary" onClick={()=>{setQuery('');setCategory('全部商品');}}>清除篩選</button></div>}
      </section>}

      {page === 'compare' && <section className="page-wrap">
        {pageTitle('SIDE BY SIDE', '商品比較', '把感興趣的商品放在一起，快速比較規格、價格與特色。')}
        {compareProducts.length ? <>
          <div className="compare-topline"><span>已選擇 {compareProducts.length} / 3 件商品</span><button className="text-link" onClick={()=>setCompare([])}>清空清單 <X size={14}/></button></div>
          <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>商品資訊</th>{compareProducts.map(p=><th key={p.id}><button className="remove-compare" onClick={()=>addCompare(p.id)} aria-label="移除比較"><X size={15}/></button><img src={p.image} alt={p.name}/><span>{p.category}</span><strong>{p.name}</strong><b>{money(p.price)}</b><button className="small-primary" onClick={()=>addCart(p.id)}>加入購物車</button></th>)}</tr></thead><tbody>{[['商品評價',p=>`★ ${p.rating} / 5 (${p.reviews} 則)`],['商品分類',p=>p.category],['供貨狀態',p=>p.stock],['商品特色',p=>p.description]].map(([label,fn])=><tr key={label}><th>{label}</th>{compareProducts.map(p=><td key={p.id}>{fn(p)}</td>)}</tr>)}</tbody></table></div>
          {compareProducts.length<3 && <button className="add-compare-slot" onClick={()=>navigate('explore')}><Plus size={18}/> 加入其他商品比較</button>}
        </> : <div className="empty-state"><Scale size={34}/><h3>比較清單還是空的</h3><p>在商品卡片按下「加入比較」，最多可同時比較 3 件商品。</p><button className="btn btn-primary" onClick={()=>navigate('explore')}>去探索商品 <ArrowRight size={16}/></button></div>}
      </section>}

      {page === 'cart' && <section className="page-wrap">
        {pageTitle('YOUR GEAR LIST', '購物車', '確認你的選擇，準備好迎接下一場冒險。')}
        {cart.length ? <div className="cart-layout"><div className="cart-items"><div className="cart-list-header"><span>商品清單 ({cartCount})</span><span>小計</span></div>{cart.map(item=>{const p=products.find(x=>x.id===item.id);return <div className="cart-row" key={item.id}><button className="cart-product-img" onClick={()=>openDetail(p)}><img src={p.image} alt={p.name}/></button><div className="cart-product-info"><span>{p.category}</span><button onClick={()=>openDetail(p)}>{p.name}</button><small>{p.stock}</small><div className="qty-control"><button onClick={()=>changeQty(p.id,-1)} aria-label="減少數量"><Minus size={14}/></button><span>{item.qty}</span><button onClick={()=>changeQty(p.id,1)} aria-label="增加數量"><Plus size={14}/></button></div></div><strong className="cart-subtotal">{money(p.price*item.qty)}</strong><button className="delete-cart" onClick={()=>removeCart(p.id)} aria-label="移除商品"><Trash2 size={17}/></button></div>})}<button className="back-to-shop" onClick={()=>navigate('explore')}><ArrowLeft size={16}/> 繼續探索商品</button></div><aside className="order-summary"><span className="section-kicker">ORDER SUMMARY</span><h3>訂單摘要</h3><div><span>商品總計</span><strong>{money(cartTotal)}</strong></div><div><span>運費</span><strong className="free-shipping">結帳時計算</strong></div><div className="summary-total"><span>總金額</span><strong>{money(cartTotal)}</strong></div><button className="btn btn-primary checkout-btn" onClick={()=>notify('示範網站：已進入結帳流程，尚未建立實際付款。')}>前往結帳 <ArrowRight size={17}/></button><p className="checkout-note"><ShieldCheck size={15}/> 安全結帳體驗 · 此為前端展示流程</p></aside></div> : <div className="empty-state"><ShoppingBag size={34}/><h3>你的購物車還沒有商品</h3><p>找到讓你心動的模型，加入購物車開始收藏吧。</p><button className="btn btn-primary" onClick={()=>navigate('explore')}>探索商品 <ArrowRight size={16}/></button></div>}
      </section>}

      {page === 'detail' && selected && <section className="page-wrap detail-wrap"><button className="back-to-shop" onClick={()=>navigate('explore')}><ArrowLeft size={16}/> 返回商品列表</button><div className="detail-layout"><div className="detail-image"><img src={selected.image} alt={selected.name}/>{selected.tag&&<span className="product-tag">{selected.tag}</span>}</div><div className="detail-copy"><span className="section-kicker">{selected.category} / ARNGREN SELECT</span><h1>{selected.name}</h1><div className="detail-rating">★ {selected.rating} <span>({selected.reviews} 則評價)</span></div><div className="detail-price">{money(selected.price)} {selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div><p>{selected.description}</p><div className="detail-stock"><span className="stock-dot"/>{selected.stock}</div><div className="detail-actions"><button className="btn btn-primary" onClick={()=>addCart(selected.id)}><ShoppingBag size={17}/> 加入購物車</button><button className={`btn btn-outline ${compare.includes(selected.id)?'is-compared':''}`} onClick={()=>addCompare(selected.id)}><Scale size={17}/>{compare.includes(selected.id)?'已加入比較':'加入比較'}</button></div><div className="detail-perks"><span><Truck size={17}/> 配送資訊於結帳確認</span><span><ShieldCheck size={17}/> 商品資訊清楚透明</span></div></div></div></section>}
    </main>
    
    {toast && <div className="toast" role="status"><CheckCircle2 size={19}/><span>{toast}</span><button onClick={()=>setToast('')} aria-label="關閉提示"><X size={15}/></button></div>}
  </div>;
}
// <Footer navigate={navigate}/> 原103行