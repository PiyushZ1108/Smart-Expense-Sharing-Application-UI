import React, { useState } from 'react';
import { api } from '../api';
import { IndianRupee, FileText, Type, Users, Save, CheckCircle } from 'lucide-react';

export default function ExpenseForm({ users, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalAmount: '',
    payer: '',
    splitType: 'EQUAL',
  });
  
  // Array of { userId, selected, share }
  const [participantsMap, setParticipantsMap] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleParticipantToggle = (userId) => {
    setParticipantsMap(prev => ({
      ...prev,
      [userId]: {
        selected: !prev[userId]?.selected,
        share: prev[userId]?.share || ''
      }
    }));
  };

  const handleShareChange = (userId, value) => {
    setParticipantsMap(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        share: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter selected participants
    const selectedUsers = Object.keys(participantsMap).filter(id => participantsMap[id].selected);
    
    if (selectedUsers.length === 0) {
      setError("Please select at least one participant.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount),
      participants: selectedUsers.map(id => {
        const p = { user: id };
        if (formData.splitType === 'UNEQUAL') {
          p.share = parseFloat(participantsMap[id].share || 0);
        }
        return p;
      })
    };

    try {
      await api.createExpense(payload);
      setFormData({ name: '', description: '', totalAmount: '', payer: '', splitType: 'EQUAL' });
      setParticipantsMap({});
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const selectAll = () => {
    const newMap = {};
    users.forEach(u => {
      newMap[u._id] = { selected: true, share: participantsMap[u._id]?.share || '' };
    });
    setParticipantsMap(newMap);
  };

  const expectedTotal = parseFloat(formData.totalAmount || 0);
  const enteredShares = Object.keys(participantsMap).reduce((acc, id) => {
      if(participantsMap[id]?.selected && formData.splitType === 'UNEQUAL') {
          return acc + parseFloat(participantsMap[id]?.share || 0);
      }
      return acc;
  }, 0);

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white' }}>
        <h2 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={24} /> New Expense Data
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(300px, 1fr)', gap: '2rem', padding: '2rem' }}>
        
        {/* Left Side: General Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && <div className="alert">{error}</div>}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Type size={16}/> Title</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Netflix Subscription" />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={16}/> Description</label>
            <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Monthly family plan" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><IndianRupee size={16}/> Amount</label>
              <input required type="number" min="1" step="0.01" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} placeholder="0.00" />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={16}/> Split Type</label>
              <select value={formData.splitType} onChange={e => setFormData({...formData, splitType: e.target.value})} style={{ cursor: 'pointer' }}>
                <option value="EQUAL">Equally</option>
                <option value="UNEQUAL">Custom (Unequal)</option>
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={16}/> Who Paid?</label>
            <select required value={formData.payer} onChange={e => setFormData({...formData, payer: e.target.value})} style={{ cursor: 'pointer' }}>
              <option value="" disabled>Select Payer</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        {/* Right Side: Participant Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: 600, margin: 0 }}>Select Participants</label>
            <button type="button" onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Select All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '300px', paddingRight: '0.5rem' }}>
            {users.map(u => {
              const isSelected = !!participantsMap[u._id]?.selected;
              return (
                <div 
                  key={u._id} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                    borderRadius: '0.75rem', border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'rgba(79, 70, 229, 0.03)' : 'white', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onClick={() => handleParticipantToggle(u._id)}
                >
                  <div style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                    <CheckCircle size={24} fill={isSelected ? "currentColor" : "none"} color={isSelected ? "white" : "currentColor"} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>{u.name}</div>
                  </div>

                  {formData.splitType === 'UNEQUAL' && isSelected && (
                    <div onClick={e => e.stopPropagation()}>
                      <input 
                        type="number" 
                        placeholder="₹ Share" 
                        required 
                        value={participantsMap[u._id]?.share || ''}
                        onChange={(e) => handleShareChange(u._id, e.target.value)}
                        style={{ width: '100px', padding: '0.5rem', background: 'white' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {formData.splitType === 'UNEQUAL' && (
            <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: '0.5rem', background: Math.abs(expectedTotal - enteredShares) < 0.01 && expectedTotal > 0 ? '#dcfce7' : '#fef9c3' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: Math.abs(expectedTotal - enteredShares) < 0.01 && expectedTotal > 0 ? '#166534' : '#854d0e' }}>
                Total Allocated: ₹{enteredShares.toFixed(2)} / ₹{expectedTotal.toFixed(2)}
              </div>
            </div>
          )}

          <div style={{ marginTop: formData.splitType === 'UNEQUAL' ? '0' : 'auto', paddingTop: '1rem' }}>
             <button className="btn" disabled={loading || users.length === 0} style={{ padding: '1rem', fontSize: '1rem', fontWeight: 600 }}>
              {loading ? 'Processing...' : 'Submit Expense'}
            </button>
          </div>

        </div>
      </form>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          form { grid-template-columns: 1fr !important; }
          form > div:nth-child(2) { border-left: none !important; padding-left: 0 !important; padding-top: 2rem !important; border-top: 1px solid var(--border); }
        }
      `}} />
    </div>
  );
}
