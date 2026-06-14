import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, getMyProducts, updateProduct } from '../services/productService';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('Loading your listings...');

  const load = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
      setStatus('');
    } catch (err) {
      setStatus(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await deleteProduct(id);
    setProducts((items) => items.filter((item) => item._id !== id));
  };

  const changeStatus = async (id, status) => {
    const updated = await updateProduct(id, { status });
    setProducts((items) => items.map((item) => (item._id === id ? updated : item)));
  };

  return (
    <main>
      <div className="pageHeader">
        <h1>My listings</h1>
        <Link className="button primary" to="/sell">Add item</Link>
      </div>
      {status && <p className="status">{status}</p>}
      <section className="grid">
        {products.map((product) => (
          <article className="productCard" key={product._id}>
            <div className="imageSlot">
              {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <span>{product.category}</span>}
            </div>
            <div>
              <p className="meta">{product.status}</p>
              <h2>{product.name}</h2>
              <strong>Rs. {product.price}</strong>
              <select value={product.status} onChange={(e) => changeStatus(product._id, e.target.value)}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
              <div className="cardActions">
                <Link to={`/products/${product._id}`}>View</Link>
                <Link to={`/products/${product._id}/edit`}>Edit</Link>
                <button onClick={() => remove(product._id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      {!status && products.length === 0 && <p className="status">You have not listed anything yet.</p>}
    </main>
  );
};

export default MyListings;
