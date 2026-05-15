import React from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function DishCard({ dish }) {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find(i => i._id === dish._id);

  const handleAdd = () => {
    addToCart(dish);
    toast.success(`${dish.name} added! / जोड़ा गया!`);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        {dish.image
          ? <img
              src={`http://resto-server-5tw2.onrender.com/uploads/${dish.image}`}
              alt={dish.name}
              style={styles.image}
            />
          : <div style={styles.noImage}>🍴</div>
        }
        {!dish.available && (
          <div style={styles.unavailableBadge}>Unavailable</div>
        )}
      </div>

      <div style={styles.info}>
        <div>
          <h3 style={styles.name}>{dish.name}</h3>
          {dish.description && (
            <p style={styles.desc}>{dish.description}</p>
          )}
          <span style={styles.category}>{dish.category}</span>
        </div>

        <div style={styles.bottom}>
          <span style={styles.price}>₹{dish.price}</span>
          <button
            onClick={handleAdd}
            disabled={!dish.available}
            style={{
              ...styles.addBtn,
              background: inCart ? 'var(--secondary)' : 'var(--primary)',
              opacity: dish.available ? 1 : 0.5,
            }}
          >
            {inCart ? `+${inCart.quantity}` : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '160px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    background: 'var(--gray)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
  },
  unavailableBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '20px',
  },
  info: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--secondary)',
    marginBottom: '4px',
  },
  desc: {
    fontSize: '12px',
    color: 'var(--gray-text)',
    lineHeight: '1.4',
    marginBottom: '4px',
  },
  category: {
    fontSize: '11px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '2px 8px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  addBtn: {
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  }
};