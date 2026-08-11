'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, UploadCloud, Loader2 } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Hoodies', 'T-Shirts', 'Jackets', 'Bottoms'];

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const isEdit = !!productId;

  const [title, setTitle] = useState(initial?.title || '');
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [price, setPrice] = useState(initial?.price || '');
  const [compareAtPrice, setCompareAtPrice] = useState(initial?.compareAtPrice || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [images, setImages] = useState(initial?.images || []);
  const [sizes, setSizes] = useState(initial?.sizes || { S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [featured, setFeatured] = useState(initial?.featured || false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImages((prev) => [...prev, ...data.urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !price) {
      setError('Title and price are required');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one product image');
      return;
    }
    setSaving(true);
    try {
      const payload = { title, category, price: Number(price), compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null, description, images, sizes, featured };
      const res = await fetch(isEdit ? `/api/products/${productId}` : '/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 animate-fadeIn">
      <div>
        <label className="text-sm font-medium mb-2 block">Product Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Oversized Cotton Hoodie" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-brand-gold w-4 h-4" />
            Show in Featured Products
          </label>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Price (Rs.)</label>
          <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="2999" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Compare-at Price (optional)</label>
          <input type="number" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="input" placeholder="3999" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input" placeholder="Describe the product..." />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-28 rounded-xl overflow-hidden border border-black/10 group">
              <Image src={img} alt={`Product ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="w-24 h-28 rounded-xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-brand-gold transition-colors">
            {uploading ? <Loader2 size={20} className="animate-spin text-black/40" /> : <UploadCloud size={20} className="text-black/40" />}
            <span className="text-xs text-black/40">{uploading ? 'Uploading' : 'Add Photos'}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-black/40">Images are stored as embedded data in the JSON database — fine for a demo, but for many large images consider an image host like Cloudinary or Vercel Blob.</p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Stock by Size</label>
        <div className="grid grid-cols-5 gap-3">
          {SIZES.map((s) => (
            <div key={s}>
              <p className="text-xs text-black/50 mb-1 text-center">{s}</p>
              <input
                type="number"
                min="0"
                value={sizes[s] ?? 0}
                onChange={(e) => setSizes((prev) => ({ ...prev, [s]: Math.max(0, Number(e.target.value)) }))}
                className="input text-center py-2"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
