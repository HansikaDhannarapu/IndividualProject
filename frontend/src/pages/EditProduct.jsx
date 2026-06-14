import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [status, setStatus] = useState('Loading listing...');

  useEffect(() => {
    getProduct(id)
      .then((product) => {
        setForm({
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          condition: product.condition || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          age: product.age || '',
          pickupLocation: product.pickupLocation || '',
          images: product.images?.join(', ') || '',
          status: product.status || 'available',
          quickSell: Boolean(product.quickSell),
          bundleItems: product.bundleItems?.join(', ') || '',
        });
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, [id]);

  useEffect(() => {
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);

    return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
  }, [files]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((current) => ({ ...current, [e.target.name]: value }));
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

      const updated = await updateProduct(id, payload);
      navigate(`/products/${updated._id}`);
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (status && !form) return <main className="narrow"><p className="status">{status}</p></main>;
  if (!form) return null;

  const savedImageUrls = form.images.split(',').map((url) => url.trim()).filter(Boolean);

  return (
    <main className="narrow">
      <h1>Edit listing</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="fieldLabel">
          <span>Item name <span className="requiredStar">*</span></span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Laptop Desk" required />
        </label>

        <label className="fieldLabel">
          <span>Description <span className="requiredStar">*</span></span>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Condition, reason for selling, included accessories" required />
        </label>

        <div className="twoCol">
          <label className="fieldLabel">
            Category
            <select name="category" value={form.category} onChange={handleChange}>
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
            Condition
            <select name="condition" value={form.condition} onChange={handleChange}>
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
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="500" required />
          </label>
          <label className="fieldLabel">
            Original price
            <input name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} placeholder="900" />
          </label>
        </div>

        <div className="twoCol">
          <label className="fieldLabel">
            Item age
            <input name="age" value={form.age} onChange={handleChange} placeholder="6 months" />
          </label>
          <label className="fieldLabel">
            Pickup location
            <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange}>
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
          Availability
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>

        <label className="fieldLabel">
          Bundle items
          <input name="bundleItems" value={form.bundleItems} onChange={handleChange} placeholder="Mouse pad, cable organizer" />
        </label>

        <label className="fieldLabel">
          Image URLs
          <input name="images" value={form.images} onChange={handleChange} placeholder="Paste image links separated by commas" />
        </label>

        <label className="fieldLabel">
          Upload photos
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
        </label>

        {(savedImageUrls.length > 0 || filePreviews.length > 0) && (
          <div className="imagePreviewGrid">
            {savedImageUrls.map((url) => (
              <img key={url} src={url} alt="Saved listing preview" />
            ))}
            {filePreviews.map((url) => (
              <img key={url} src={url} alt="Selected upload preview" />
            ))}
          </div>
        )}

        <label className="checkRow">
          <input name="quickSell" type="checkbox" checked={form.quickSell} onChange={handleChange} />
          Boost with Quick Sell
        </label>
        <button className="button primary" type="submit">Save changes</button>
      </form>
      {status && <p className="status error">{status}</p>}
    </main>
  );
};

export default EditProduct;
