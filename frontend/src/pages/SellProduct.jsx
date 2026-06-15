import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectScam, generateDescription, suggestPrice } from '../services/aiService';
import { createProduct } from '../services/productService';

const initialForm = {
  name: '',
  description: '',
  category: '',
  condition: '',
  price: '',
  originalPrice: '',
  age: '',
  pickupLocation: '',
  images: '',
  quickSell: false,
  bundleItems: '',
};

const MIN_ACTION_FEEDBACK_MS = 700;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SellProduct = () => {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [pendingAction, setPendingAction] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const [whole, ...decimalParts] = value.split('.');
    const nextValue = decimalParts.length ? `${whole}.${decimalParts.join('')}` : whole;
    setForm({ ...form, [e.target.name]: nextValue });
  };

  const handleSuggestPrice = async () => {
    const startedAt = Date.now();
    try {
      setPendingAction('price');
      const data = await suggestPrice(form);
      setForm((current) => ({ ...current, price: String(data.suggested) }));
      setMsg(`Suggested range: Rs. ${data.range.low} - Rs. ${data.range.high}. ${data.reasoning}`);
    } catch (err) {
      setMsg(err.message);
    } finally {
      await wait(Math.max(0, MIN_ACTION_FEEDBACK_MS - (Date.now() - startedAt)));
      setPendingAction('');
    }
  };

  const handleGenerateDescription = async () => {
    const startedAt = Date.now();
    try {
      setPendingAction('description');
      const data = await generateDescription(form);
      setForm((current) => ({ ...current, description: data.description }));
      setMsg('Description drafted from your listing details.');
    } catch (err) {
      setMsg(err.message);
    } finally {
      await wait(Math.max(0, MIN_ACTION_FEEDBACK_MS - (Date.now() - startedAt)));
      setPendingAction('');
    }
  };

  const handleScamCheck = async () => {
    const startedAt = Date.now();
    try {
      setPendingAction('risk');
      const data = await detectScam(form);
      const flags = data.flags.length ? ` Flags: ${data.flags.join(', ')}.` : '';
      setMsg(`Scam risk: ${data.risk} (${data.score}/100).${flags}`);
    } catch (err) {
      setMsg(err.message);
    } finally {
      await wait(Math.max(0, MIN_ACTION_FEEDBACK_MS - (Date.now() - startedAt)));
      setPendingAction('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') payload.append('imageUrls', value);
        else payload.append(key, value);
      });

      files.forEach((file) => payload.append('images', file));

      const product = await createProduct(payload);
      navigate(`/products/${product._id}`);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <main className="narrow">
      <h1>List an item</h1>
      <form className="form" onSubmit={handleSubmit} autoComplete="off">
        <label className="fieldLabel">
          <span>Item name <span className="requiredStar">*</span></span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Laptop desk, chemistry guide, cycle" autoComplete="off" required />
        </label>

        <label className="fieldLabel">
          <span>Description <span className="requiredStar">*</span></span>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mention condition, included accessories, and pickup details" autoComplete="off" required />
        </label>

        <div className="twoCol">
          <label className="fieldLabel">
            <span>Category <span className="requiredStar">*</span></span>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="" disabled>Select category</option>
              <option>Books</option>
              <option>Electronics</option>
              <option>Cycles</option>
              <option>Furniture</option>
              <option>Hostel Essentials</option>
              <option>Stationery</option>
              <option>Others</option>
            </select>
          </label>
          <label className="fieldLabel">
            <span>Condition <span className="requiredStar">*</span></span>
            <select name="condition" value={form.condition} onChange={handleChange} required>
              <option value="" disabled>Select condition</option>
              <option>New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </label>
        </div>

        <div className="twoCol">
          <label className="fieldLabel">
            <span>Selling price <span className="requiredStar">*</span></span>
            <input name="price" type="text" inputMode="decimal" value={form.price} onChange={handlePriceChange} placeholder="500" autoComplete="off" required />
            <button className="button secondary" type="button" onClick={handleSuggestPrice} disabled={Boolean(pendingAction)}>
              {pendingAction === 'price' ? 'Suggesting...' : 'Suggest selling price'}
            </button>
          </label>
          <label className="fieldLabel">
            Original price
            <input name="originalPrice" type="text" inputMode="decimal" value={form.originalPrice} onChange={handlePriceChange} placeholder="900" autoComplete="off" />
          </label>
        </div>

        <div className="twoCol">
          <label className="fieldLabel">
            Item age
            <input name="age" value={form.age} onChange={handleChange} placeholder="6 months, 1 year, barely used" autoComplete="off" />
          </label>
          <label className="fieldLabel">
            <span>Pickup location <span className="requiredStar">*</span></span>
            <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required>
              <option value="" disabled>Select pickup location</option>
              <option>Library Gate</option>
              <option>Main Block</option>
              <option>Hostel Block A</option>
              <option>Cafeteria</option>
              <option>Parking Area</option>
            </select>
          </label>
        </div>

        <label className="fieldLabel">
          Bundle items
          <input name="bundleItems" value={form.bundleItems} onChange={handleChange} placeholder="Mouse pad, cable organizer" autoComplete="off" />
        </label>

        <label className="fieldLabel">
          Image URLs
          <input name="images" value={form.images} onChange={handleChange} placeholder="Paste image links separated by commas" autoComplete="off" />
        </label>

        <label className="fieldLabel">
          Upload photos
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
        </label>

        <div className="cardActions">
          <button className="button secondary" type="button" onClick={handleGenerateDescription} disabled={Boolean(pendingAction)}>
            {pendingAction === 'description' ? 'Drafting...' : 'Draft description'}
          </button>
          <button className="button secondary" type="button" onClick={handleScamCheck} disabled={Boolean(pendingAction)}>
            {pendingAction === 'risk' ? 'Checking...' : 'Check risk'}
          </button>
        </div>

        <label className="checkRow">
          <input
            type="checkbox"
            checked={form.quickSell}
            onChange={(e) => setForm({ ...form, quickSell: e.target.checked })}
          />
          Boost with Quick Sell for 24 hours
        </label>

        <button className="button primary" type="submit">Publish listing</button>
      </form>
      {msg && <p className="status error">{msg}</p>}
    </main>
  );
};

export default SellProduct;
