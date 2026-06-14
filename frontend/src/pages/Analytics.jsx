import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getMarketplaceAnalytics } from '../services/analyticsService';

const Stat = ({ label, value }) => (
  <article className="statTile">
    <span>{value}</span>
    <p>{label}</p>
  </article>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('Loading analytics...');

  useEffect(() => {
    getMarketplaceAnalytics()
      .then((analytics) => {
        setData(analytics);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, []);

  if (status && !data) return <main><p className="status">{status}</p></main>;
  if (!data) return null;

  const categories = data.categories.map((item) => ({
    category: item._id,
    listings: item.count,
  }));

  return (
    <main>
      <div className="pageHeader">
        <h1>Analytics</h1>
      </div>

      <section className="statsGrid">
        <Stat label="Total listings" value={data.summary.totalListings} />
        <Stat label="Available now" value={data.summary.activeListings} />
        <Stat label="Sold listings" value={data.summary.soldListings} />
        <Stat label="Total views" value={data.summary.totalViews} />
        <Stat label="Average price" value={`Rs. ${data.summary.averagePrice}`} />
      </section>

      <section className="panel">
        <h2>Listings by category</h2>
        <div className="chartBox">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="listings" fill="#137c65" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h2>Campus pickup hot zones</h2>
        <div className="chartBox">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.pickupLocations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="listStack">
        <h2>Recent listings</h2>
        {data.recentProducts.map((product) => (
          <article className="listItem" key={product._id}>
            <div>
              <p className="meta">{product.category} | {product.status}</p>
              <h2>{product.name}</h2>
              <p>Rs. {product.price} by {product.seller?.name || 'Campus seller'}</p>
            </div>
            <strong>{product.views} views</strong>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Analytics;
