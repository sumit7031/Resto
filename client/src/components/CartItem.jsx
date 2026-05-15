import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <div style={styles.card}>
      {item.image
        ? <img
            src={`http://resto-server-5tw2.onrender.com/uploads/${item.image}`}
            alt={item.name}
            style={styles.image}
          />
        : <div style={styles.noImage}>🍴</div>
      }

      <div style={styles.info}>
        <p style={styles.name}>{item.name}</p>
        <p style={styles.price}>₹{item.price * item.quantity}</p>
      </div>

      <div style={styles.controls}>
        <button onClick={() => decreaseQty(item._id)} style={styles.btn}>−</button>
        <span style={styles.qty}>{item.quantity}</span>
        <button onClick={() => increaseQty(item._id)} style={styles.btn}>+</button>
        <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>🗑️</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '14px',
    padding: '10px',
    gap: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  noImage: {
    width: '60px',
    height: '60px',
    borderRadius: '10px',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  info: { flex: 1 },
  name: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' },
  price: { fontSize: '14px', color: 'var(--primary)', fontWeight: '700' },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--gray)',
    fontSize: '16px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },
  qty: { fontSize: '15px', fontWeight: '700', minWidth: '20px', textAlign: 'center' },
  removeBtn: {
    background: '#fff0f0',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
  }
};