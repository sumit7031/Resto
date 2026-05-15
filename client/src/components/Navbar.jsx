import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const navItems = [
    { path: '/',        icon: '🍽️', label: 'Menu',    hindi: 'मेनू'    },
    { path: '/cart',    icon: '🛒', label: 'Cart',    hindi: 'कार्ट'   },
    { path: '/kitchen', icon: '👨‍🍳', label: 'Kitchen', hindi: 'किचन'   },
  ];

  return (
    <nav style={styles.nav}>
      {navItems.map(item => {
        const active = location.pathname === item.path;
        return (
          <Link to={item.path} key={item.path} style={styles.link}>
            <div style={{
              ...styles.navItem,
              background: active ? 'var(--primary-light)' : 'transparent',
              borderRadius: '12px',
              padding: '6px 18px',
            }}>
              <span style={{ fontSize: '22px', position: 'relative' }}>
                {item.icon}
                {item.path === '/cart' && totalItems > 0 && (
                  <span style={styles.badge}>{totalItems}</span>
                )}
              </span>
              <span style={{
                fontSize: '11px',
                color: active ? 'var(--primary)' : 'var(--gray-text)',
                fontWeight: active ? '600' : '400'
              }}>
                {item.label} / {item.hindi}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
    zIndex: 1000,
  },
  link: { textDecoration: 'none' },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '10px',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  }
};