import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DishCard from '../components/DishCard';

const CATEGORIES = ['All', 'Starter', 'Main Course', 'Breads', 'Drinks', 'Dessert'];

export default function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://resto-server-5tw2.onrender.com/api/dishes')
      .then(res => { setDishes(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = dishes.filter(d => {
    const matchCat = activeCategory === 'All' || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Our Menu</h1>
          <p style={styles.subtitle}>हमारा मेनू</p>
        </div>
        <span style={{ fontSize: '32px' }}>🍽️</span>
      </div>

      {/* Search */}
      <div style={styles.searchWrapper}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search dish... / खाना खोजें..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Category Filter */}
      <div style={styles.categoryScroll}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.catBtn,
              background: activeCategory === cat ? 'var(--primary)' : '#fff',
              color: activeCategory === cat ? '#fff' : 'var(--gray-text)',
              border: activeCategory === cat ? 'none' : '1px solid #eee',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div style={styles.center}>
          <p style={{ color: 'var(--gray-text)' }}>Loading... / लोड हो रहा है...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.center}>
          <p style={{ fontSize: '40px' }}>🍴</p>
          <p style={{ color: 'var(--gray-text)', marginTop: '8px' }}>
            No dishes found / कोई डिश नहीं मिली
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(dish => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '16px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: { fontSize: '24px', fontWeight: '800', color: 'var(--secondary)' },
  subtitle: { fontSize: '13px', color: 'var(--gray-text)' },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '12px',
    padding: '10px 14px',
    boxShadow: 'var(--shadow)',
    marginBottom: '14px',
    gap: '8px',
  },
  searchIcon: { fontSize: '16px' },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: '14px',
    background: 'transparent',
  },
  categoryScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    marginBottom: '16px',
  },
  catBtn: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  center: {
    textAlign: 'center',
    padding: '60px 0',
  }
};