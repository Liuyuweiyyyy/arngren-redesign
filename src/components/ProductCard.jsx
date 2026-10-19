import React from 'react';
import { Heart, Scale, ShoppingBag, ArrowUpRight, Check } from 'lucide-react';
export default function ProductCard({ product, compared, onCompare, onAdd, onDetail }) {
  return <article className="product-card">
    <button className="product-image-wrap" onClick={onDetail} aria-label={`查看${product.name}詳情`}>
      <img src={product.image} alt={product.name} loading="lazy" />
      {product.tag && <span className="product-tag">{product.tag}</span>}
      <span className="quick-view">查看詳情 <ArrowUpRight size={14} /></span>
    </button>
    <div className="product-info">
      <div className="product-meta"><span>{product.category}</span><span className="rating">★ {product.rating} <i>({product.reviews})</i></span></div>
      <button className="product-name" onClick={onDetail}>{product.name}</button>
      <div className="product-price-row"><div><strong>NT$ {product.price.toLocaleString('zh-TW')}</strong>{product.oldPrice && <del>NT$ {product.oldPrice.toLocaleString('zh-TW')}</del>}</div><span className="stock-dot" title={product.stock} /></div>
      <div className="product-actions">
        <button className={`compare-action ${compared ? 'is-compared' : ''}`} onClick={onCompare}><Scale size={15} />{compared ? '已加入比較' : '加入比較'}{compared && <Check size={14} />}</button>
        <button className="add-cart" onClick={onAdd} aria-label="加入購物車"><ShoppingBag size={17} /></button>
      </div>
    </div>
  </article>;
}