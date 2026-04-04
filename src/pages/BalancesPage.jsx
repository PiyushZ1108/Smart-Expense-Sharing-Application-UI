import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, CheckSquare } from 'lucide-react';

export default function BalancesPage() {
  const { balances } = useOutletContext();

  const getInitials = (name) => {
    if (!name) return '?';
    const split = name.split(' ');
    if (split.length > 1) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRandomColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + ('00000'.substring(0, 6 - c.length) + c);
  };

  const parseBalance = (str) => {
    // Attempt to extract name and amount loosely.
    // E.g. "Alice owes Bob: ₹50" or "Alice: -50" or "Bob gets back 50"
    const owesMatch = str.match(/(.*?)\s+owes/i);
    const getsMatch = str.match(/(.*?)\s+gets/i);
    const amountMatch = str.match(/[\d.]+/);
    
    // We try to find the person's name at the start of the string
    let name = "Unknown";
    let type = "neutral";
    
    if (owesMatch) { name = owesMatch[1]; type = "owes"; }
    else if (getsMatch) { name = getsMatch[1]; type = "gets"; }
    else {
      const parts = str.split(':');
      if (parts.length > 0) name = parts[0].trim();
    }

    // Determine status from string
    const isOwes = str.toLowerCase().includes('owes') || str.includes('-');
    const isGets = str.toLowerCase().includes('gets') || str.toLowerCase().includes('receives') || (!isOwes && amountMatch);
    
    return {
      raw: str,
      name,
      amount: amountMatch ? amountMatch[0] : null,
      isOwes,
      isGets: isGets && !isOwes
    };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Wallet className="text-primary" size={32} /> Current Balances
        </h1>
        <p className="expense-meta" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>A high-level summary of everyone's financial standing in the group.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {balances.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ background: '#f3f4f6', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckSquare size={40} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No active balances</h3>
            <p className="expense-meta">Expenses will automatically update user balances here.</p>
          </div>
        ) : (
          balances.map((b, i) => {
            const parsed = parseBalance(b);
            const bgColor = parsed.isOwes ? '#fef2f2' : parsed.isGets ? '#f0fdf4' : 'white';
            const iconColor = parsed.isOwes ? '#ef4444' : parsed.isGets ? '#22c55e' : '#64748b';
            const Icon = parsed.isOwes ? TrendingDown : parsed.isGets ? TrendingUp : Wallet;

            return (
              <div key={i} className="card" style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem',
                borderTop: `4px solid ${iconColor}`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '42px', height: '42px', borderRadius: '50%', color: 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '1rem', fontWeight: 700, background: getRandomColor(parsed.name),
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {getInitials(parsed.name)}
                    </div>
                    <div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{parsed.name}</div>
                       <span style={{ fontSize: '0.8rem', fontWeight: 600, color: parsed.isOwes ? '#b91c1c' : parsed.isGets ? '#166534' : 'var(--text-muted)' }}>
                         {parsed.isOwes ? 'OWES' : parsed.isGets ? 'GETS BACK' : 'BALANCED'}
                       </span>
                    </div>
                  </div>
                  
                  <div style={{ background: bgColor, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={iconColor} />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                     {parsed.raw}
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
