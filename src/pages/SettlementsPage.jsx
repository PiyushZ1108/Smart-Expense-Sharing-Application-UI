import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RefreshCw, CheckCircle2, ArrowRight, Check } from 'lucide-react';

export default function SettlementsPage() {
  const { settlements } = useOutletContext();
  const [settledRows, setSettledRows] = useState({}); // To mimic "Mark as settled" interaction

  const parseSettlement = (str) => {
    const match = str.match(/^(.*?)\s+owes\s+(.*?):\s*[\u20B9]?([\d.]+)/i);
    if (match) {
      return { from: match[1].trim(), to: match[2].replace(':', '').trim(), amount: parseFloat(match[3].trim()).toFixed(2) };
    }
    return { raw: str };
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const split = name.split(' ');
    if (split.length > 1) return (split[0][0] + split[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRandomColor = (name) => {
    // Generate a consistent pseudo-random color based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + ('00000'.substring(0, 6 - c.length) + c);
  };

  const handleSettle = (index) => {
    setSettledRows(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <RefreshCw className="text-primary" size={32} /> Optimized Settlements
          </h1>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
        {settlements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)' }}>
            <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle2 size={40} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>All Settled Up!</h3>
            <p className="expense-meta" style={{ fontSize: '1rem' }}>Your group has no pending balances. Everyone is square.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Sender</th>
                  <th style={{ padding: '1rem 1.5rem', width: '40px' }}></th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Receiver</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Amount</th>
                  {/* <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th> */}
                </tr>
              </thead>
              <tbody style={{ background: 'white' }}>
                {settlements.map((s, i) => {
                  const parsed = parseSettlement(s);
                  const isSettled = settledRows[i];
                  
                  if (parsed.raw) {
                    return (
                      <tr key={i} style={{ borderBottom: i === settlements.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                        <td colSpan="5" style={{ padding: '1.5rem', fontWeight: 500, color: '#475569' }}>{parsed.raw}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={i} style={{ 
                      borderBottom: i === settlements.length - 1 ? 'none' : '1px solid #f1f5f9', 
                      transition: 'all 0.3s ease',
                      opacity: isSettled ? 0.6 : 1,
                      background: isSettled ? '#f8fafc' : 'white'
                    }} className={isSettled ? '' : 'table-row-hover'}>
                      
                      {/* From Column */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '50%', color: 'white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '0.85rem', fontWeight: 700, background: getRandomColor(parsed.from),
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            {getInitials(parsed.from)}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem', textDecoration: isSettled ? 'line-through' : 'none' }}>{parsed.from}</span>
                        </div>
                      </td>
                      
                      {/* Arrow Column */}
                      <td style={{ padding: '1.25rem 0', textAlign: 'center', color: isSettled ? '#cbd5e1' : '#94a3b8' }}>
                         <ArrowRight size={18} strokeWidth={2.5} />
                      </td>
                      
                      {/* To Column */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '50%', color: 'white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '0.85rem', fontWeight: 700, background: getRandomColor(parsed.to),
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            {getInitials(parsed.to)}
                          </div>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{parsed.to}</span>
                        </div>
                      </td>
                      
                      {/* Amount Column */}
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: isSettled ? '#94a3b8' : '#0f172a', fontSize: '1.1rem' }}>
                        ₹{parsed.amount}
                      </td>
                      
                      {/* Action Column */}
                      {/* <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        {isSettled ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#166534', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Check size={14} strokeWidth={3} /> Paid
                          </span>
                        ) : (
                          <button onClick={() => handleSettle(i)} style={{ 
                            background: 'var(--primary)', color: 'white', border: 'none', padding: '0.4rem 1rem', 
                            borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)', transition: 'background 0.2s',
                          }} className="btn-hover">
                            Mark Paid
                          </button>
                        )}
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-hover:hover {
          background: #f8fafc !important;
        }
        .btn-hover:hover {
          background: var(--primary-hover) !important;
        }
      `}} />
    </div>
  );
}
