import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = 'https://resto-server-5tw2.onrender.com';
const KITCHEN_PIN = '1234'; // 🔐 Change this to your PIN

const STATUS_COLORS = {
  Pending:   { bg: '#fff3e0', color: '#e65100' },
  Preparing: { bg: '#e3f2fd', color: '#1565c0' },
  Ready:     { bg: '#e8f5e9', color: '#2e7d32' },
  Delivered: { bg: '#f3e5f5', color: '#6a1b9a' },
};

const STATUS_HINDI = {
  Pending:   'पेंडिंग',
  Preparing: 'बन रहा है',
  Ready:     'तैयार है',
  Delivered: 'दे दिया',
};

export default function KitchenPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Pending');

  const handlePin = () => {
    if (pin === KITCHEN_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    axios.get('https://resto-server-5tw2.onrender.com/api/orders')
      .then(res => setOrders(res.data));

    const socket = io(SOCKET_URL);

    socket.on('new_order', (order) => {
      setOrders(prev => [order, ...prev]);
      toast('🆕 New Order! / नया ऑर्डर!', { icon: '🔔' });
    });

    socket.on('order_updated', (updated) => {
      setOrders(prev =>
        prev.map(o => o._id === updated._id ? updated : o)
      );
    });

    return () => socket.disconnect();
  }, [authenticated]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`https://resto-server-5tw2.onrender.com/api/orders/${id}`, { status });
      toast.success(`Status: ${status} / ${STATUS_HINDI[status]}`);
    } catch {
      toast.error('Update failed');
    }
  };

  // ─── PIN Screen ───────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={styles.pinPage}>
        <div style={styles.pinCard}>
          <p style={{ fontSize: '48px', marginBottom: '8px' }}>👨‍🍳</p>
          <h2 style={styles.pinTitle}>Kitchen Access</h2>
          <p style={styles.pinSubtitle}>किचन पहुँच</p>

          <div style={styles.pinDots}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                ...styles.dot,
                background: pin.length > i ? 'var(--primary)' : '#eee'
              }} />
            ))}
          </div>

          {pinError && (
            <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>
              Wrong PIN / गलत पिन ❌
            </p>
          )}

          <div style={styles.numpad}>
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((num, i) => (
              <button
                key={i}
                style={{
                  ...styles.numBtn,
                  visibility: num === '' ? 'hidden' : 'visible'
                }}
                onClick={() => {
                  if (num === '⌫') {
                    setPin(p => p.slice(0, -1));
                  } else if (pin.length < 4) {
                    const newPin = pin + num;
                    setPin(newPin);
                    if (newPin.length === 4) {
                      setTimeout(() => {
                        if (newPin === KITCHEN_PIN) {
                          setAuthenticated(true);
                        } else {
                          setPinError(true);
                          setPin('');
                        }
                      }, 200);
                    }
                  }
                }}
              >
                {num}
              </button>
            ))}
          </div>

          <button onClick={handlePin} style={styles.enterBtn}>
            Enter / दर्ज करें
          </button>
        </div>
      </div>
    );
  }

  // ─── Kitchen Dashboard ────────────────────────────────────
  const filtered = orders.filter(o => filter === 'All' || o.status === filter);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Kitchen</h1>
          <p style={styles.subtitle}>किचन डैशबोर्ड</p>
        </div>
        <span style={{ fontSize: '32px' }}>👨‍🍳</span>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {['Pending', 'Preparing', 'Ready', 'Delivered', 'All'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              ...styles.tab,
              background: filter === s ? 'var(--primary)' : '#fff',
              color: filter === s ? '#fff' : 'var(--gray-text)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '40px' }}>📋</p>
          <p style={{ color: 'var(--gray-text)', marginTop: '8px' }}>
            No orders / कोई ऑर्डर नहीं
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map(order => (
            <div key={order._id} style={styles.orderCard}>
              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.customerName}>👤 {order.customerName}</p>
                  <p style={styles.tableNo}>
                    🪑 Table: {order.tableNumber} &nbsp;|&nbsp;
                    ₹{order.totalPrice}
                  </p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  background: STATUS_COLORS[order.status]?.bg,
                  color: STATUS_COLORS[order.status]?.color,
                }}>
                  {order.status} / {STATUS_HINDI[order.status]}
                </span>
              </div>

              {/* Items */}
              <div style={styles.items}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <span>• {item.name}</span>
                    <span style={{ fontWeight: '700' }}>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.note && (
                <p style={styles.note}>📝 {order.note}</p>
              )}

              {/* Action Buttons */}
              <div style={styles.actions}>
                {['Pending', 'Preparing', 'Ready', 'Delivered'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order._id, s)}
                    style={{
                      ...styles.actionBtn,
                      background: order.status === s
                        ? STATUS_COLORS[s].color
                        : '#f0f0f0',
                      color: order.status === s ? '#fff' : '#555',
                    }}
                  >
                    {STATUS_HINDI[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  pinPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
    padding: '20px',
  },
  pinCard: {
    background: '#fff',
    borderRadius: '24px',
    padding: '32px 24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '320px',
  },
  pinTitle: { fontSize: '22px', fontWeight: '800' },
  pinSubtitle: { color: 'var(--gray-text)', marginBottom: '24px', fontSize: '13px' },
  pinDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  dot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  numpad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  numBtn: {
    padding: '16px',
    borderRadius: '12px',
    background: '#f5f5f5',
    fontSize: '20px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  enterBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  page: { padding: '16px', paddingBottom: '100px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: { fontSize: '24px', fontWeight: '800' },
  subtitle: { fontSize: '13px', color: 'var(--gray-text)' },
  tabs: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
    marginBottom: '16px',
  },
  tab: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    border: '1px solid #eee',
    cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: '60px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  orderCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '14px',
    boxShadow: 'var(--shadow)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  customerName: { fontSize: '15px', fontWeight: '700', marginBottom: '4px' },
  tableNo: { fontSize: '12px', color: 'var(--gray-text)' },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  items: {
    background: '#fafafa',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '8px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    paddingBottom: '4px',
  },
  note: {
    fontSize: '12px',
    color: 'var(--gray-text)',
    fontStyle: 'italic',
    marginBottom: '10px',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '10px',
  },
  actionBtn: {
    padding: '10px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  }
};