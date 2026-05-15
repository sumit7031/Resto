import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name / नाम डालें');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Cart is empty / कार्ट खाली है');
      return;
    }

    setPlacing(true);
    try {
      const items = cartItems.map(item => ({
        dish: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await axios.post('http://resto-server-5tw2.onrender.com/api/orders', {
        customerName,
        tableNumber: tableNumber || 'Takeaway',
        items,
        totalPrice,
        note,
      });

      toast.success('Order placed! / ऑर्डर दे दिया गया! 🎉');
      clearCart();
      setCustomerName('');
      setTableNumber('');
      setNote('');
    } catch {
      toast.error('Failed to place order / ऑर्डर नहीं हुआ');
    }
    setPlacing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ fontSize: '60px' }}>🛒</p>
        <h2 style={{ marginTop: '16px' }}>Cart is Empty</h2>
        <p style={{ color: 'var(--gray-text)', marginTop: '8px' }}>
          कार्ट खाली है — मेनू से कुछ जोड़ें
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Cart</h1>
        <p style={styles.subtitle}>आपका कार्ट</p>
      </div>

      {/* Cart Items */}
      <div style={styles.list}>
        {cartItems.map(item => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      {/* Order Form */}
      <div style={styles.form}>
        <h3 style={styles.formTitle}>Order Details / ऑर्डर जानकारी</h3>

        <input
          type="text"
          placeholder="Your Name / आपका नाम *"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Table No. / टेबल नंबर (optional)"
          value={tableNumber}
          onChange={e => setTableNumber(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Special note / विशेष नोट (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ ...styles.input, height: '70px', resize: 'none' }}
        />
      </div>

      {/* Total & Place Order */}
      <div style={styles.footer}>
        <div style={styles.totalRow}>
          <span style={{ color: 'var(--gray-text)' }}>Total / कुल</span>
          <span style={styles.total}>₹{totalPrice}</span>
        </div>
        <button
          onClick={handleOrder}
          disabled={placing}
          style={styles.orderBtn}
        >
          {placing ? 'Placing... / रुकें...' : '🍽️ Place Order / ऑर्डर करें'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '16px', paddingBottom: '120px' },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  header: { marginBottom: '16px' },
  title: { fontSize: '24px', fontWeight: '800' },
  subtitle: { fontSize: '13px', color: 'var(--gray-text)' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: 'var(--shadow)',
    marginBottom: '16px',
  },
  formTitle: { fontSize: '15px', fontWeight: '700', marginBottom: '12px' },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #eee',
    fontSize: '14px',
    marginBottom: '10px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  footer: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: 'var(--shadow)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
    fontSize: '16px',
  },
  total: { fontSize: '20px', fontWeight: '800', color: 'var(--primary)' },
  orderBtn: {
    width: '100%',
    padding: '15px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  }
};