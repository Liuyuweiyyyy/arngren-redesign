import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MagnifyingGlass, ArrowsLeftRight, ShoppingBag, ChatCircleText, List, ArrowUpRight, UserCircle, Heart } from '@phosphor-icons/react';
import './styles.css';
import './refinement.css';
import './reference-refresh.css';
import TankExperience from './components/TankExperience/TankExperience.jsx';
import MemberMenu from './components/Member/MemberMenu.jsx';
import MemberPages from './components/Member/MemberPages.jsx';

gsap.registerPlugin(useGSAP, ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const products = [
  {id:'tank',name:'Torro 金屬 RC 坦克',category:'遙控模型',tag:'資訊待補',price:null,status:'待上市／請詢問',desc:'原網站展示的新款遙控坦克；詳細規格與價格尚未公布。',spec:{'尺寸':'尚未公布','材質':'金屬（原頁描述）','電池':'尚未公布','操控方式':'遙控；細節待確認','配件':'尚未公布'}},
  {id:'rover',name:'越野遙控車',category:'遙控模型',tag:'熱門探索',price:1298,status:'示意商品',desc:'適合探索遙控模型的概念商品；資料僅供介面展示。',spec:{'尺寸':'約 32 × 19 × 16 cm（示意）','材質':'複合材質（示意）','電池':'可充電電池（示意）','操控方式':'2.4 GHz 遙控（示意）','配件':'遙控器、充電線（示意）'}},
  {id:'drone',name:'入門航拍無人機',category:'遙控模型',tag:'新手友善',price:1898,status:'示意商品',desc:'適合想體驗空拍的使用者；規格與價格為示意。',spec:{'尺寸':'約 24 × 24 cm（示意）','材質':'輕量塑膠（示意）','電池':'可拆式電池（示意）','操控方式':'2.4 GHz 遙控（示意）','配件':'保護罩、充電線（示意）'}},
  {id:'robot',name:'組裝機器人套件',category:'機器人',tag:'動手製作',price:998,status:'示意商品',desc:'透過組裝認識機械結構與感測器的概念商品。',spec:{'尺寸':'約 28 cm 高（示意）','材質':'塑膠、金屬（示意）','電池':'外接電源（示意）','操控方式':'有線控制（示意）','配件':'組裝零件、說明書（示意）'}},
  {id:'bike',name:'城市電動自行車',category:'電動載具',tag:'通勤選擇',price:7998,status:'示意商品',desc:'以日常移動為出發點的概念商品。',spec:{'尺寸':'依車架規格（示意）','材質':'鋁合金車架（示意）','電池':'可充電電池（示意）','操控方式':'踏板輔助（示意）','配件':'充電器（示意）'}},
  {id:'scope',name:'數位望遠鏡',category:'電子配件',tag:'戶外觀察',price:698,status:'示意商品',desc:'方便觀察遠方景物的概念商品。',spec:{'尺寸':'手持式（示意）','材質':'複合材質（示意）','電池':'可充電（示意）','操控方式':'按鍵操作（示意）','配件':'收納袋（示意）'}}
];
const categories = ['全部商品','遙控模型','機器人','電動載具','電子配件'];
const money = n => n == null ? '價格待確認' : 'kr ' + new Intl.NumberFormat('en-US').format(n);
const photo = p => 'assets/' + (p.id === 'tank' ? 'tank-model' : p.id) + '.png';
const byId = id => products.find(p => p.id === id);
const readSaved = () => { try { return JSON.parse(localStorage.getItem('arngren-demo') || '{}'); } catch { return {}; } };
const readRoute = () => location.hash.replace(/^#/, '') || 'home';
const navButton = (label, route, navigate, cls = 'btn btn-primary', extra = {}) => <button className={cls} data-route={route} onClick={() => navigate(route)} {...extra}>{label}</button>;

function ProductCard({p, compare, toggleCompare, add, navigate, user, toggleFavorite, compareList = [], activeCompare = [], onAddToCompareList}) {
  const isFavorite = (user?.favorites || []).includes(p.id);
  const isCompared = user? compareList.includes(p.id) : compare.includes(p.id);
  return <article className="product-card">
    <div className="product-visual" role="link" tabIndex={0} aria-label={'查看' + p.name + '詳情'} onClick={() => navigate('detail/' + p.id)} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('detail/' + p.id);
        }
      }} style={{cursor: 'pointer'}}>
      <span className={'product-badge ' + (p.price == null ? 'pending' : '')}> {p.tag} </span>
      <img src={photo(p)} alt={p.name + '商品概念圖片'} loading="lazy" />
      <span className="quick-view">查看詳情 <ArrowUpRight size={14} /></span>
    </div>

    <div className="card-body">
      <div className="card-meta">{p.category}</div>
      <h3 className="card-title" role="link" tabIndex={0} onClick={() => navigate('detail/' + p.id)} onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('detail/' + p.id);
          }
        }} style={{cursor: 'pointer'}}>
        {p.name}
      </h3>

      <p className="card-desc">{p.desc}</p>

      <div className="card-bottom">
        <div className="price">
          {money(p.price)} {p.price != null && <small>示意價格</small>}
        </div>
      </div>

      <div className="card-actions">
        <button
          className={
            'btn card-action-btn compare-button ' +
            (isCompared ? 'is-selected' : '')
          }
          data-compare-action={p.id}
          data-tooltip={isCompared ? '移出比較' : '加入比較'}
          aria-label={isCompared ? '移出比較' : '加入比較'}
          aria-pressed={isCompared}
          onClick={() => {
            if (user) {
              onAddToCompareList(p.id);
            } else {
              toggleCompare(p.id);
            }
          }}
        >
          <ArrowsLeftRight size={18} />
          <span className="action-label">
            {isCompared ? '移出比較' : '加入比較'}
          </span>
        </button>

        <button
          type="button"
          className={
            "btn card-action-btn icon-action-btn favorite-button " +
            (isFavorite ? "is-favorite" : "")
          }
          data-tooltip={isFavorite ? "取消收藏" : "加入收藏"}
          aria-label={isFavorite ? "取消收藏" : "加入收藏"}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(p.id)}
        >
          <Heart
            size={18}
            weight={isFavorite ? "fill" : "regular"}
          />
        </button>

        {p.price == null ? (
          <button
            className="btn btn-primary card-action-btn icon-action-btn"
            data-inquire={p.id}
            data-tooltip="詢問商品"
            aria-label="詢問商品"
            onClick={() => { if (!user) { navigate("login"); return;}  navigate('inquiry/' + p.id)}}
          >
            <ChatCircleText size={18} />
          </button>
        ) : (
          <button
            className="btn btn-primary card-action-btn icon-action-btn"
            data-add={p.id}
            data-tooltip="加入購物車"
            aria-label="加入購物車"
            onClick={() => add(p.id)}
          >
            <ShoppingBag size={18} />
          </button>
        )}
      </div>
    </div>
  </article>;
}


function EditorialCard({p,navigate}) {
  return <article className="editorial-card">
    <button className="editorial-image" aria-label={'查看'+p.name} onClick={()=>navigate('detail/'+p.id)}><img src={photo(p)} alt={p.name+'商品概念圖片'} loading="lazy" /></button>
    <div className="editorial-info"><span className="editorial-category">{p.category}</span><div className="editorial-title-row"><h3>{p.name}</h3><button aria-label={'查看'+p.name+'詳情'} onClick={()=>navigate('detail/'+p.id)}><ArrowUpRight size={20} weight="bold" /></button></div><p>{p.price==null?'價格與規格待確認':money(p.price)+' · 示意價格'}</p></div>
  </article>;
}

function Home({navigate, category, setCategory}) {
  const home = useRef(null);
  useGSAP(() => {
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.from('.featured-section .section-head > div > *', {opacity:0,y:22,duration:.8,stagger:.1,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:'.featured-section .section-head',start:'top 88%',once:true}});
      gsap.utils.toArray('.editorial-card').forEach(card=>{
        gsap.from(card,{opacity:0,y:45,duration:.95,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:card,start:'top 90%',once:true}});
      });
    });
    return()=>mm.revert();
  }, {scope:home});
  return <div className="home-page" ref={home}>
    <TankExperience navigate={navigate}/>
    <div className="category-strip"><div className="container category-inner"><span className="category-label">按興趣探索</span>{categories.map(c => <button key={c} className={'chip ' + (category===c?'selected':'')} data-category={c} onClick={() => {setCategory(c);navigate('catalog')}}>{c}</button>)}</div></div>
    <section className="section featured-section"><div className="container"><div className="section-head"><div><h2>探索更多</h2></div><button className="text-link" onClick={() => navigate('catalog')}>查看全部商品 <ArrowUpRight size={17} /></button></div>
      <div className="editorial-grid">{[products[0],products[1],products[2],products[3]].map(p => <EditorialCard key={p.id} p={p} navigate={navigate} />)}</div>
    </div></section>
  </div>;
}

function Crumbs({items,navigate}) { return <div className="breadcrumbs"><button onClick={() => navigate('home')}>首頁</button>{items.map((item,i) => <React.Fragment key={i}><span>/</span>{Array.isArray(item) ? <button onClick={() => navigate(item[1])}>{item[0]}</button> : item}</React.Fragment>)}</div>; }

function Catalog({navigate, cardProps, category, setCategory, query, setQuery}) {
  const [maxPrice,setMaxPrice] = useState('all');
  const [sort,setSort] = useState('featured');
  const [filtersOpen,setFiltersOpen] = useState(false);
  let list = products.filter(p => (category==='全部商品'||p.category===category) && (!query||`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(query.toLowerCase())) && (maxPrice==='all'||(p.price!=null&&p.price<=Number(maxPrice))));
  if (sort==='price-asc') list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  if (sort==='price-desc') list.sort((a,b)=>(b.price??-1)-(a.price??-1));
  const clear = () => {setCategory('全部商品');setMaxPrice('all');setQuery('');setSort('featured');};
  return <div className="container catalog-page"><Crumbs items={['探索商品']} navigate={navigate} /><div className="section-head"><div><span className="eyebrow">ARNGREN / THE COLLECTION</span><h1 className="page-title">探索商品</h1><p>按興趣瀏覽，或直接搜尋想找的物件。</p></div><p className="demo-label">商品圖片、規格與價格為設計示意</p></div>
    <label className="catalog-search"><MagnifyingGlass size={20} aria-hidden="true"/><span className="sr-only">搜尋商品</span><input type="search" placeholder="搜尋名稱、類別或商品描述" value={query} onChange={e=>setQuery(e.target.value)} /></label>
    <button className="catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={()=>setFiltersOpen(v=>!v)}>篩選商品 <span>{category==='全部商品'&&maxPrice==='all'?'類型與價格':`${category}${maxPrice==='all'?'':' · kr '+new Intl.NumberFormat('en-US').format(Number(maxPrice))+' 以下'}`}</span></button>
    <div className="catalog-layout"><aside id="catalog-filters" className={'filters '+(filtersOpen?'open':'')} aria-label="商品篩選"><h3>篩選條件</h3><div className="filter-group"><strong>商品類型</strong>{categories.map(c => <label key={c}><input type="radio" name="category" data-category={c} checked={category===c} onChange={() => setCategory(c)} /> {c}</label>)}</div>
      <div className="filter-group"><label htmlFor="price-filter"><strong>價格上限</strong></label><select id="price-filter" className="select" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="all">不限價格</option><option value="1000">kr 1,000 以下</option><option value="2000">kr 2,000 以下</option><option value="8000">kr 8,000 以下</option></select><p className="demo-label">待詢價商品不會出現在價格篩選結果中。</p></div>
      <button className="btn btn-quiet btn-sm" onClick={clear}>清除條件</button></aside>
      <div><div className="toolbar"><span>{category}　·　{list.length} 項結果</span><label>排序　<select id="sort-filter" className="select" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">推薦順序</option><option value="price-asc">價格：低到高</option><option value="price-desc">價格：高到低</option></select></label></div>
        {list.length ? <div className="product-grid">{list.map(p => <ProductCard key={p.id} p={p} {...cardProps} />)}</div> : <div className="empty"><h2>沒有符合條件的商品</h2><p>試著放寬價格或改選其他類型。</p><button className="btn btn-primary" onClick={clear}>清除篩選</button></div>}</div>
    </div>
  </div>;
}

function Detail({p,navigate,compare,toggleCompare,add}) {
  return <div className="container detail-page"><Crumbs items={[[ '探索商品','catalog'],p.name]} navigate={navigate} />
    <div className="detail-layout"><div className="detail-visual"><img src={photo(p)} alt={p.name+'商品概念圖片'} /></div><div><span className={'status '+(p.price==null?'pending':'')}>{p.status}</span><h1 className="detail-title">{p.name}</h1><p className="detail-copy">{p.desc}</p><div className="detail-price">{money(p.price)}</div>
      <div className={'info-note '+(p.price==null?'warning':'')}>{p.price==null?'這款商品在原網站僅有新品預告。價格、供貨與部分規格尚未確認，可先詢問商品資訊。':'此頁的規格與價格為重新設計示意資料，請勿據此向原網站付款。'}</div>
      <div className="detail-actions">{p.price==null ? navButton('詢問商品資訊','inquiry/'+p.id,navigate,'btn btn-primary',{'data-inquire':p.id}) : <button className="btn btn-primary" data-add={p.id} onClick={() => add(p.id)}>加入購物車</button>}
        <button className="btn btn-outline" data-compare-action={p.id} onClick={() => toggleCompare(p.id)}>{compare.includes(p.id)?'移出比較':'加入比較'}</button></div>
      <p className="demo-label">商品類型：{p.category}　·　商品編號：{p.id.toUpperCase()}-DEMO</p></div></div>
    <section className="specs"><h2>商品規格</h2>{Object.entries(p.spec).map(([k,v]) => <div className="spec-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}</section>
  </div>;
}

function Compare({compare, navigate, add, toggleCompare, user,
  compareList = [], activeCompare = [], onAddActiveCompare, onCancelActiveCompare, onRemoveCompareList}) {
  const isLoggedIn = !!user;

  // 未登入使用舊的 compare；登入後使用 activeCompare
  const selectedIds = isLoggedIn ? activeCompare : compare;
  const ps = selectedIds.map(byId).filter(Boolean);

  // 登入後的完整比較清單
  const listProducts = compareList.map(byId).filter(Boolean);

  // 只有兩個商品時才產生比較規格
  const rows = ps.length >= 2
    ? [
        ['價格', p => money(p.price)],
        ['供應狀態', p => p.status],
        ...Object.keys(ps[0].spec).map(
          k => [k, p => p.spec[k] || '尚未公布']
        )
      ]
    : [];

  return (
    <div className="container compare-page">
      <Crumbs items={['商品比較']} navigate={navigate} />

      <div className="compare-toolbar">
        <div>
          <h1 className="page-title">商品比較</h1>
          <p className="lead">
            {isLoggedIn
              ? '管理已保存的商品，每次選擇兩項進行比較。'
              : '用相同欄位查看差異；未知資訊會保留為「尚未公布」。'}
          </p>
        </div>

        {navButton(
          '更換比較商品',
          'catalog',
          navigate,
          'btn btn-quiet btn-sm'
        )}
      </div>

      <div className={isLoggedIn ? 'member-compare-layout' : ''}>

        {/* 登入會員才顯示左側比較清單 */}
        {isLoggedIn && (
          <aside className="compare-list-panel">
            <h2>我的比較清單</h2>
            <p>已保存 {listProducts.length} 項商品</p>

            {listProducts.length === 0 ? (
              <p>目前沒有保存的商品。</p>
            ) : (
              listProducts.map(p => {
                const isActive = activeCompare.includes(p.id);
                return (
                  <div className="compare-list-item" key={p.id}>
                    <img src={photo(p)} alt={p.name} />
                    <div className="compare-list-info">
                      <strong>{p.name}</strong>
                      <span>{money(p.price)}</span>

                      {isActive ? (
                        <button
                          className="text-link"
                          onClick={() => onCancelActiveCompare(p.id)}
                        > 取消比較 </button>
                      ) : (
                        <button
                          className="text-link"
                          disabled={activeCompare.length >= 2}
                          onClick={() => onAddActiveCompare(p.id)}
                        > {activeCompare.length >= 2
                            ? '請先取消一項'
                            : '加入比較'}
                        </button>
                      )}

                      <button
                        className="compare-remove-btn"
                        onClick={() => onRemoveCompareList(p.id)}
                      > 移除清單 </button>
                    </div>
                  </div>
                );
              })
            )}
            <p className="compare-list-count"> 目前比較：{ps.length} / 2 </p>
          </aside>
        )}

        {/* 右側比較區 */}
        <section className="compare-main">
          {ps.length < 2 ? (
            <div className="empty" style={{ margin: '25px 0 70px' }}>
              <h2 className="page-title">並排比較，更容易選擇</h2>
              <p>
                {isLoggedIn
                  ? `請從左側清單選擇商品，目前已選 ${ps.length} 項。`
                  : `請先從商品卡片選擇兩項商品。現在已選 ${ps.length} 項。`}
              </p>
              {navButton('挑選商品', 'catalog', navigate)}
            </div>
          ) : (
            <>
              <div className="compare-grid">
                <div className="compare-cell label visual"> 比較項目 </div>
                {ps.map(p => (
                  <div className="compare-cell visual compare-product" key={p.id}>
                    <img src={photo(p)} alt={p.name + '商品概念圖片'} />
                    <h3>{p.name}</h3>
                    <div className="price">{money(p.price)}</div>

                    <button
                      className="text-link"
                      onClick={() => navigate('detail/' + p.id)}
                    > 查看詳情 </button>

                    <button
                      className="compare-remove-btn"
                      onClick={() => {
                        if (isLoggedIn) {
                          onCancelActiveCompare(p.id);
                        } else {
                          toggleCompare(p.id);
                        }
                      }}
                    > 取消比較 </button>
                  </div>
                ))}

                {rows.flatMap(([k, get]) => [
                  <div className="compare-cell label" key={k + 'label'}> {k} </div>,
                  ...ps.map(p => (
                    <div className="compare-cell" key={k + p.id}>
                      {get(p)}
                    </div>
                  ))
                ])}
              </div>

              <div className={
                  'info-note ' +
                  (ps.some(p => p.price == null) ? 'warning' : '')
                }
              >{ps.some(p => p.price == null)
                ? '其中一款商品的資訊尚未完整公布。請先詢問，不要依未確認資料做購買決定。'
                : '比較資料是設計示意，正式購買前請確認實際資訊。'}
              </div>

              <div className="detail-actions">
                {ps.map(p => p.price == null ? 
                  (
                    <button key={p.id} className="btn btn-primary" onClick={() => {
                        if (!user) {
                          navigate('login');
                          return;
                        }
                        navigate('inquiry/' + p.id);
                      }}
                    > 詢問商品 </button>
                  ) : (
                    <button key={p.id} className="btn btn-outline" onClick={() => add(p.id)}
                    > 加入購物車 </button>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function totals(cart) {
  const items=Object.entries(cart).map(([id,qty])=>({p:byId(id),qty:Number(qty)})).filter(x=>x.p&&x.qty>0&&x.p.price!=null);
  const subtotal=items.reduce((sum,x)=>sum+x.p.price*x.qty,0);
  const shipping=items.some(x=>x.p.price>=7000)?null:199;
  return {items,subtotal,shipping,total:shipping==null?null:subtotal+shipping};
}
function Summary({t,navigate,checkout=false}) {return <aside className="panel summary"><h2>費用摘要</h2><div className="summary-line"><span>商品金額</span><strong>{money(t.subtotal)}</strong></div><div className="summary-line"><span>運費</span><strong>{t.shipping==null?'待詢價':money(t.shipping)}</strong></div><div className="summary-total"><span>合計</span><span>{t.total==null?'待確認':money(t.total)}</span></div><p className="form-note">{t.shipping==null?'大型商品運費需先確認，本示意流程不會直接送出付款。':'運費計算為原型示意。實際運費應依商品與賣家確認。'}</p>{!checkout&&navButton(t.shipping==null?'詢問運費':'前往填寫資料',t.shipping==null?'shipping':'checkout',navigate)}</aside>}
function Cart({cart,setCart,navigate}) {
  const t=totals(cart);
  return <div className="container"><Crumbs items={['購物車']} navigate={navigate} /><h1 className="page-title">購物車</h1><p className="lead">先核對商品、數量與費用，再填寫訂購資料。</p>
    {t.items.length?<div className="cart-layout" style={{marginTop:24}}><div className="panel"><h2>商品清單</h2>{t.items.map(({p,qty})=><div className="cart-item" key={p.id}><div className="cart-thumb"><img src={photo(p)} alt="" /></div><div><h3>{p.name}</h3><p>商品編號：{p.id.toUpperCase()}-DEMO</p><button className="remove" data-remove={p.id} onClick={()=>setCart(v=>{const next={...v};delete next[p.id];return next})}>移除商品</button></div><div className="cart-controls"><label htmlFor={'qty-'+p.id}>數量</label><input className="qty" id={'qty-'+p.id} type="number" min="1" max="99" value={qty} data-qty={p.id} onChange={e=>setCart(v=>({...v,[p.id]:Math.max(1,Math.min(99,Number(e.target.value)||1))}))} /><strong>{money(p.price*qty)}</strong></div></div>)}</div><Summary t={t} navigate={navigate} /></div>:<div className="empty" style={{margin:'24px 0 65px'}}><h2>購物車目前是空的</h2><p>從探索商品開始，挑選你想了解的裝備。</p>{navButton('探索商品','catalog',navigate)}</div>}
  </div>;
}

function Checkout({cart,setCart,navigate,setLastOrder}) {
  const t=totals(cart);
  const [form,setForm]=useState({name:'',phone:'',email:'',address:''});
  const [confirm,setConfirm]=useState(false);
  const [errors,setErrors]=useState({});
  if(!t.items.length) return <Cart cart={cart} setCart={setCart} navigate={navigate} />;
  if(t.shipping==null) return <Shipping navigate={navigate} />;
  const submit=e=>{
    e.preventDefault();
    const next={};
    if(!form.name.trim())next.name='請填寫收件人姓名';
    if(!form.phone.trim())next.phone='請填寫聯絡電話';
    if(!/^\S+@\S+\.\S+$/.test(form.email))next.email='請填寫有效的電子郵件';
    if(!form.address.trim())next.address='請填寫收件地址';
    if(!confirm)next.confirm='請確認這是示意流程';
    setErrors(next);
    if(Object.keys(next).length){e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();return;}
    setLastOrder({kind:'order',name:form.name.trim(),total:t.total,code:'DEMO-'+Date.now().toString().slice(-6)});
    setCart({});
    navigate('confirmation');
  };
  return <div className="container"><Crumbs items={[[ '購物車','cart'],'填寫資料']} navigate={navigate} /><div className="steps"><div className="step"><span>1</span>核對購物車</div><div className="step-line"></div><div className="step active"><span>2</span>填寫資料</div><div className="step-line"></div><div className="step"><span>3</span>訂單確認</div></div><h1 className="page-title">填寫訂購資料</h1><p className="lead">請檢查收件資訊。送出後會顯示原型訂單確認結果，不會向原網站下單。</p>
    <div className="checkout-layout" style={{marginTop:24}}><form className="panel" id="checkout-form" noValidate onSubmit={submit}><h2>聯絡與收件資訊</h2><div className="field-grid">{[['name','full-name','收件人姓名 *','name'],['phone','phone','聯絡電話 *','tel'],['email','email','電子郵件 *','email'],['address','address','收件地址 *','street-address']].map(([key,id,label,auto])=><div className={'field '+(['email','address'].includes(key)?'full':'')} key={key}><label htmlFor={id}>{label}</label><input id={id} name={key} type={key==='email'?'email':'text'} autoComplete={auto} value={form[key]} aria-invalid={!!errors[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))} /><div className="field-error" data-error={key}>{errors[key]}</div></div>)}</div>
      <label className="compare-toggle" style={{margin:'3px 0 18px'}}><input type="checkbox" id="confirm-demo" checked={confirm} onChange={e=>setConfirm(e.target.checked)} /> 我了解這是課堂作業原型，不會產生真實訂單或付款。</label><div className="field-error" data-error="confirm">{errors.confirm}</div><div className="detail-actions"><button type="submit" className="btn btn-primary">確認並建立示意訂單</button>{navButton('返回購物車','cart',navigate,'btn btn-quiet',{type:'button'})}</div></form><Summary t={t} navigate={navigate} checkout /></div>
  </div>;
}

function Shipping({navigate}) {return <div className="container"><Crumbs items={[[ '購物車','cart'],'運費詢價']} navigate={navigate} /><div className="confirmation" style={{textAlign:'left'}}><span className="status pending">待確認</span><h1>這筆購物車需先確認運費</h1><p>大型商品的運費可能不同，原網站也要求先詢價。此原型不會顯示未確認的總額或要求付款。</p><div className="info-note warning">目前流程狀態：詢價中。請待賣家提供運費，再確認完整金額與後續訂購方式。</div><div className="detail-actions">{navButton('返回購物車','cart',navigate)}{navButton('繼續探索商品','catalog',navigate,'btn btn-outline')}</div></div></div>}

function Inquiry({p,navigate,setLastOrder}) {
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('想了解這款商品的價格、供應狀態與完整規格。');
  return <div className="container"><Crumbs items={[[ '探索商品','catalog'],[p.name,'detail/'+p.id],'詢問商品']} navigate={navigate} /><div className="checkout-layout" style={{marginTop:24}}><div className="panel ask-form"><span className="status pending">資訊待確認</span><h1 className="page-title">詢問 {p.name}</h1><p className="lead">描述你想知道的資訊；這是設計示意，不會寄出真實訊息。</p><form id="inquiry-form" style={{marginTop:22}} onSubmit={e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;setLastOrder({kind:'inquiry',code:'ASK-'+Date.now().toString().slice(-6)});navigate('confirmation')}}><div className="field"><label htmlFor="ask-email">電子郵件 *</label><input id="ask-email" name="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div><div className="field"><label htmlFor="ask-message">想詢問的內容 *</label><textarea id="ask-message" name="message" required value={message} onChange={e=>setMessage(e.target.value)} /></div><button className="btn btn-primary" type="submit">建立示意詢問</button></form></div><div className="panel"><h2>目前已知資訊</h2><div className="cart-thumb" style={{height:180,marginBottom:14}}><img src={photo(p)} alt="" /></div>{Object.entries(p.spec).map(([k,v])=><div className="summary-line" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></div></div>;
}

function Confirmation({lastOrder,navigate}) {const inquiry=lastOrder?.kind==='inquiry';return <div className="container"><div className="confirmation"><div className="checkmark" aria-hidden="true">✓</div><span className="eyebrow">示意流程完成</span><h1>{inquiry?'詢問已建立':'訂單資料已確認'}</h1><p>{inquiry?'此畫面展示詢問後的回饋狀態。沒有電子郵件實際送出。':'你已走完重新設計的訂購流程。沒有真實下單，也沒有付款。'}</p><div className="confirm-details"><div><span>示意編號</span><strong>{lastOrder?.code||'DEMO-0001'}</strong></div><div><span>狀態</span><strong>{inquiry?'等待商品資訊':'原型訂單已建立'}</strong></div>{lastOrder?.name&&<div><span>聯絡人</span><strong>{lastOrder.name}</strong></div>}{lastOrder?.total&&<div><span>示意合計</span><strong>{money(lastOrder.total)}</strong></div>}</div><div className="detail-actions" style={{justifyContent:'center'}}>{navButton('繼續探索商品','catalog',navigate)}<button className="btn btn-quiet" onClick={()=>window.print()}>列印此畫面</button></div></div></div>}

function App() {
  const saved=readSaved();
  const [route,setRoute]=useState(readRoute);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('arngren-member-demo') || 'null'
      );
    } catch {
      return null;
    }
  });
  const [cart,setCart]=useState(saved.cart||{});
  const [compare,setCompare]=useState(saved.compare||[]);
  const [compareList, setCompareList] = useState([]);
  const [activeCompare, setActiveCompare] = useState([]);
  const [category,setCategory]=useState('全部商品');
  const [query,setQuery]=useState('');
  const [search,setSearch]=useState('');
  const [lastOrder,setLastOrder]=useState(null);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [toast,setToast]=useState('');
  useEffect(()=>{const handler=()=>setRoute(readRoute());window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[]);
  useEffect(()=>{localStorage.setItem('arngren-demo',JSON.stringify({cart,compare}))},[cart,compare]);
  useEffect(()=>{if(user){localStorage.setItem('arngren-member-demo',JSON.stringify(user));}else{localStorage.removeItem('arngren-member-demo');}}, [user]);
  useEffect(()=>{window.scrollTo(0,0);setMobileOpen(false)},[route]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2700);return()=>clearTimeout(timer)},[toast]);
  const navigate=to=>{location.hash=to;setRoute(to)};
  const logout = () => {setUser(null);navigate('home');setToast('已登出');};
  const add = id => { if (!user) { navigate("login"); return;} setCart(v => { const currentQty = v[id] || 0; if (currentQty >= 99) { setToast('單一商品最多99個'); return v;} setToast('已加入購物車'); return {...v, [id]: currentQty + 1};});};
  const toggleCompare=id=>setCompare(v=>v.includes(id)?v.filter(x=>x!==id):v.length<2?[...v,id]:(setToast('最多比較兩項商品'),v));
  function handleAddActiveCompare(productId) {
    setActiveCompare(current => {
      if (current.includes(productId)) return current;

      if (current.length >= 2) {
        setToast('一次最多比較兩個商品');
        return current;
      }

      return [...current, productId];
    });
  }
  function handleToggleCompareList(productId) {
    setCompareList(current => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      }

      return [...current, productId];
    });

    // 從會員比較清單移除時，也取消目前的並排比較
    setActiveCompare(current =>
      current.filter(id => id !== productId)
    );
  }
  // 將商品從會員比較清單移除
  function handleRemoveCompareList(productId) {
    setCompareList(current =>
      current.filter(id => id !== productId)
    );
    // 若商品正在比較，也從目前比較區移除
    setActiveCompare(current =>
      current.filter(id => id !== productId)
    );
  }
  // 取消目前比較，但保留在比較清單
  function handleCancelActiveCompare(productId) {
    setActiveCompare(current =>
      current.filter(id => id !== productId)
    );
  }
  function handleRegister(form, setError) {
    const accounts = JSON.parse(
      localStorage.getItem("arngren_accounts") || "[]"
    );
    if (accounts.some((account) => account.email === form.email)) {
      setError("此 Email 已經註冊。");
      return;
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      displayName: form.displayName,
      email: form.email,
      favorites: [],
    };
    const updatedAccounts = [...accounts, newUser];
    localStorage.setItem(
      "arngren_accounts",
      JSON.stringify(updatedAccounts)
    );
    localStorage.setItem(
      "arngren_user",
      JSON.stringify(newUser)
    );
    setUser(newUser);
    navigate("profile");
  }

  function handleLogin(form, setError) {
    const accounts = JSON.parse(
      localStorage.getItem("arngren_accounts") || "[]"
    );
    const account = accounts.find((item) => item.email === form.email);

    if (!account) {
      setError("找不到此帳號，請先註冊。");
      return;
    }
    // 示範版目前只檢查 Email，尚未驗證密碼。
    const loggedInUser = {
      ...account,
      favorites: account.favorites || [],
    };

    localStorage.setItem(
      "arngren_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    navigate("profile");
  }

  function handleLogout() {
    localStorage.removeItem("arngren_user");
    setUser(null);
    navigate("home");
  }

  function handleToggleFavorite(productId) {
    if (!user) {
      navigate("login");
      return;
    }

    const favorites = user.favorites || [];
    const updatedUser = {
      ...user,
      favorites: favorites.includes(productId)
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId],
    };
    setUser(updatedUser);
    localStorage.setItem(
      "arngren_user",
      JSON.stringify(updatedUser)
    );
    const accounts = JSON.parse(
      localStorage.getItem("arngren_accounts") || "[]"
    );
    localStorage.setItem(
      "arngren_accounts",
      JSON.stringify(
        accounts.map((account) =>
          account.id === updatedUser.id
            ? updatedUser
            : account
        )
      )
    );
  }
  const [view,id]=route.split('/');
  const p=byId(id)||products[0];
  const cardProps={compare,toggleCompare,add,navigate, user, toggleFavorite: handleToggleFavorite, compareList, activeCompare, onAddToCompareList: handleToggleCompareList, };
  let page;
  if(view==='catalog')page=<Catalog navigate={navigate} cardProps={cardProps} category={category} setCategory={setCategory} query={query} setQuery={setQuery}/>;
  else if(view==='detail')page=<Detail p={p} navigate={navigate} compare={compare} toggleCompare={toggleCompare} add={add}/>;
  else if(view==='compare')page=<Compare compare={compare} navigate={navigate} add={add} toggleCompare={toggleCompare} user={user} compareList={compareList} activeCompare={activeCompare} onAddActiveCompare={handleAddActiveCompare} onCancelActiveCompare={handleCancelActiveCompare} onRemoveCompareList={handleRemoveCompareList}/>;
  else if(view==='cart')page=<Cart cart={cart} setCart={setCart} navigate={navigate}/>;
  else if(view==='checkout')page=<Checkout cart={cart} setCart={setCart} navigate={navigate} setLastOrder={setLastOrder}/>;
  else if(view==='shipping')page=<Shipping navigate={navigate}/>;
  else if(view==='inquiry')page=<Inquiry p={p} navigate={navigate} setLastOrder={setLastOrder}/>;
  else if(view==='confirmation')page=<Confirmation lastOrder={lastOrder} navigate={navigate}/>;
  else if(["login", "register", "profile", "orders", "inquiries", "favorites"].includes(view)){page = (<MemberPages page={view} user={user} products={products} onLogin={handleLogin} onRegister={handleRegister} onNavigate={navigate} onToggleFavorite={handleToggleFavorite} getProductImage={photo} formatPrice={money}/>);}
  else page=<Home navigate={navigate} category={category} setCategory={setCategory}/>;
  const searchSubmit=e=>{e.preventDefault();setQuery(search.trim());setCategory('全部商品');navigate('catalog')};
  const compareCount = user ? compareList.length : compare.length;
  const selectedCompare = user ? activeCompare : compare;
  return <>
    <a className="skip" href="#main">跳到主要內容</a>
    <div className="announcement">課堂作業原型 · 圖片與商品資料為設計示意</div>
    <header className="site-header"><div className="container head-inner"><a className="brand" href="#home" aria-label="ARNGREN 首頁"><span className="brand-mark">A</span>ARN<span>GREN</span></a><nav className="main-nav" aria-label="主要導覽">{[['首頁','home'],['探索商品','catalog'],['商品比較','compare']].map(([label,to])=><button key={to} className={'nav-link '+(view===to?'active':'')} data-route={to} onClick={()=>navigate(to)}>{label}</button>)}</nav>
      <div className="header-actions"><form className="header-search" onSubmit={searchSubmit}><MagnifyingGlass size={18} weight="bold" aria-hidden="true"/><input id="header-search" type="search" aria-label="搜尋商品" placeholder="搜尋商品或類型" value={search} onChange={e=>setSearch(e.target.value)} /></form>
        <button className="icon-action compare-action" data-route="compare" aria-label="查看商品比較" onClick={()=>navigate('compare')}><ArrowsLeftRight size={19} weight="regular" aria-hidden="true"/><span className="action-word">比較</span>{compareCount>0&&<span className="count">{compareCount}</span>}</button>
        <button className="icon-action" data-route="cart" aria-label="查看購物車" onClick={()=>navigate('cart')}><ShoppingBag size={19} weight="regular" aria-hidden="true"/><span className="action-word">購物車</span>{Object.values(cart).reduce((a,b)=>a+Number(b),0)>0&&<span className="count">{Object.values(cart).reduce((a,b)=>a+Number(b),0)}</span>}</button>
        <MemberMenu user={user} currentPage={route} onNavigate={navigate} onLogout={logout}/>
        <button className="icon-action menu-button" aria-label="開啟導覽選單" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(v=>!v)}><List size={22} weight="bold" /></button></div></div>
      <nav className={'mobile-nav '+(mobileOpen?'':'hidden')} aria-label="手機導覽"><form className="mobile-search" onSubmit={searchSubmit}><MagnifyingGlass size={18} aria-hidden="true"/><input type="search" aria-label="搜尋商品" placeholder="搜尋商品或類型" value={search} onChange={e=>setSearch(e.target.value)} /><button type="submit">搜尋</button></form><div className="mobile-links">{[['首頁','home'],['探索商品','catalog'],['商品比較','compare'],['購物車','cart']].map(([label,to])=><button key={to} className="nav-link" onClick={()=>navigate(to)}>{label}</button>)}</div></nav>
    </header>
    <main id="main">{page}</main>
    {compareCount>0&&['home','catalog','detail'].includes(view)&&<div className="comparison-bar"><p>{user ? `比較清單已有 ${compareList.length} 項商品` : `已選 ${compare.length}/2 項商品${compare.length<2?'，再選 1 項即可比較':''}`}</p><button className="btn btn-primary btn-sm" data-route="compare" disabled={!user && compare.length<2} onClick={()=>navigate('compare')}>查看比較</button><button className="btn btn-quiet btn-sm" onClick={()=>{if(user) { setCompareList([]); setActiveCompare([]);} else {setCompare([])}}}>清除</button></div>}
    {toast&&<div className="toast" role="status" aria-live="polite">{toast}</div>}
    <footer className="site-footer"><div className="container footer-inner"><div><div className="brand" style={{color:'white'}}><span className="brand-mark">A</span>ARN<span>GREN</span></div><p>本頁為 ARNGREN 使用者介面重新設計課堂作業。互動、商品描述與訂單結果皆為示意，不會向原網站送出訂單或付款。</p></div><div><p>設計重點：找得到商品、看得懂差異、清楚完成訂購。</p><a href="https://arngren.net/" target="_blank" rel="noopener" style={{fontSize:13}}>參考原網站</a></div></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);