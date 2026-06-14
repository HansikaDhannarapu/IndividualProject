import React from 'react';
import { Link } from 'react-router-dom';

const MarketplaceHero = ({ totalListings, budgetFinds }) => (
  <section className="hero">
    <div>
      <p className="eyebrow">UniCycle marketplace</p>
      <h1>Buy and sell campus essentials without the endless group-chat scroll.</h1>
      <p className="lede">Find books, cycles, hostel gear, electronics, and furniture from verified university users.</p>
      <div className="heroActions">
        <Link className="button primary" to="/sell">List an item</Link>
        <Link className="button secondary" to="/my-listings">My listings</Link>
      </div>
    </div>
    <div className="heroPanel">
      <span>{totalListings}</span>
      <p>available listings</p>
      <small>{budgetFinds} budget finds on this page under Rs. 500</small>
    </div>
  </section>
);

export default MarketplaceHero;
