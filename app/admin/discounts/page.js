'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Ban, CheckCircle2 } from 'lucide-react';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState('');
  const [type, setType] = useState('fixed');
  const [value, setValue] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/discounts')
      .then((r) => r.json())
      .then((data) => setDiscounts(data.discounts || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          value: Number(value),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create discount code');
      setCode('');
      setValue('');
      setExpiresAt('');
      setType('fixed');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (d) => {
    await fetch(`/api/discounts/${d.code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !d.active }),
    });
    load();
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete discount code "${code}"? This cannot be undone.`)) return;
    await fetch(`/api/discounts/${code}`, { method: 'DELETE' });
    load();
  };

  const isExpired = (d) => d.expiresAt && new Date(d.expiresAt).getTime() < Date.now();

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-semibold mb-8">Discount Codes</h1>

      <form onSubmit={handleCreate} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-8 max-w-2xl">
        <h2 className="font-semibold mb-4">Create New Code</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Code</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className="input uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              <option value="fixed">Fixed Amount (Rs.)</option>
              <option value="percent">Percentage (%)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Value {type === 'percent' ? '(%)' : '(Rs.)'}
            </label>
            <input
              required
              type="number"
              min="1"
              max={type === 'percent' ? 100 : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'percent' ? 'e.g. 10' : 'e.g. 500'}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Expires On (optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="input"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" disabled={creating} className="btn-primary">
          <Plus size={18} /> {creating ? 'Creating...' : 'Create Code'}
        </button>
      </form>

      <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">Loading...</td></tr>
            )}
            {!loading && discounts.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-white/40">No discount codes yet.</td></tr>
            )}
            {discounts.map((d) => {
              const expired = isExpired(d);
              const status = !d.active ? 'Inactive' : expired ? 'Expired' : 'Active';
              const statusColor =
                status === 'Active' ? 'text-green-400' : status === 'Expired' ? 'text-amber-400' : 'text-white/40';
              return (
                <tr key={d.code} className="border-t border-white/5">
                  <td className="px-4 py-3 font-mono font-medium">{d.code}</td>
                  <td className="px-4 py-3">{d.type === 'percent' ? `${d.value}%` : `Rs. ${d.value}`}</td>
                  <td className="px-4 py-3 text-white/50">
                    {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className={`px-4 py-3 font-medium ${statusColor}`}>{status}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleActive(d)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/60"
                        title={d.active ? 'Deactivate' : 'Activate'}
                      >
                        {d.active ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                      <button onClick={() => handleDelete(d.code)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
