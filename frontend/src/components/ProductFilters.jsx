import React from 'react';

const categories = ['All', 'Books', 'Electronics', 'Cycles', 'Furniture', 'Hostel Essentials', 'Stationery', 'Others'];

const ProductFilters = ({ filters, onChange }) => (
  <>
    <section className="toolbar">
      <div className="chips">
        {categories.map((category) => {
          const value = category === 'All' ? '' : category;
          return (
            <button
              className={filters.category === value ? 'chip active' : 'chip'}
              key={category}
              onClick={() => onChange((current) => ({ ...current, page: 1, category: value }))}
            >
              {category}
            </button>
          );
        })}
      </div>
      <select value={filters.sort} onChange={(e) => onChange((current) => ({ ...current, page: 1, sort: e.target.value }))}>
        <option value="newest">Newest</option>
        <option value="quickSell">Quick Sell first</option>
        <option value="cheapest">Cheapest</option>
        <option value="priciest">Priciest</option>
        <option value="highestRated">Highest rated seller</option>
      </select>
    </section>

    <section className="searchBar">
      <input
        value={filters.search}
        onChange={(e) => onChange((current) => ({ ...current, page: 1, search: e.target.value }))}
        placeholder="Search by product name"
      />
      <input
        value={filters.minPrice}
        onChange={(e) => onChange((current) => ({ ...current, page: 1, minPrice: e.target.value }))}
        placeholder="Min price"
        type="number"
        min="0"
      />
      <input
        value={filters.maxPrice}
        onChange={(e) => onChange((current) => ({ ...current, page: 1, maxPrice: e.target.value }))}
        placeholder="Max price"
        type="number"
        min="0"
      />
    </section>
  </>
);

export default ProductFilters;
