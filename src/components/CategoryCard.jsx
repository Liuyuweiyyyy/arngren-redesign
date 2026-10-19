import React from 'react';
import { ArrowUpRight } from 'lucide-react';
export default function CategoryCard({ category, onClick }) {
  return <button className="category-card" onClick={onClick}>
    <img src={category.image} alt="" loading="lazy" />
    <span className="category-overlay" />
    <span className="category-symbol">{category.icon}</span>
    <span className="category-info"><small>{category.en}</small><strong>{category.name}</strong><span>{category.count}</span></span>
    <span className="category-arrow"><ArrowUpRight size={18} /></span>
  </button>;
}