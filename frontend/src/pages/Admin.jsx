import React, { useEffect, useState } from 'react';
import { getAdminDashboard, removeProduct, setProductFlag, setUserBan } from '../services/adminService';
import { updateReport } from '../services/reportService';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('Loading admin dashboard...');

  useEffect(() => {
    getAdminDashboard()
      .then((data) => {
        setUsers(data.users);
        setProducts(data.products);
        setReports(data.reports || []);
        setStatus('');
      })
      .catch((err) => setStatus(err.message));
  }, []);

  const toggleBan = async (user) => {
    const updated = await setUserBan(user._id, !user.banned);
    setUsers((items) => items.map((item) => (item._id === updated._id ? updated : item)));
  };

  const resolveReport = async (report) => {
    const updated = await updateReport(report._id, { status: 'resolved', adminNote: 'Reviewed by admin' });
    setReports((items) => items.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));
  };

  const updateProduct = async (product, payload) => {
    const updated = await setProductFlag(product._id, payload);
    setProducts((items) => items.map((item) => (item._id === updated._id ? updated : item)));
  };

  const deleteProduct = async (productId) => {
    await removeProduct(productId);
    setProducts((items) => items.filter((item) => item._id !== productId));
  };

  return (
    <main>
      <div className="pageHeader">
        <h1>Admin</h1>
      </div>
      {status && <p className="status">{status}</p>}

      <section className="panel">
        <h2>Users</h2>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.banned ? 'Banned' : 'Active'}</td>
                  <td><button onClick={() => toggleBan(user)}>{user.banned ? 'Unban' : 'Ban'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Reports</h2>
        <div className="listStack">
          {reports.map((report) => (
            <article className="listItem" key={report._id}>
              <div>
                <p className="meta">{report.reason} | {report.status}</p>
                <h2>{report.product?.name || 'User report'}</h2>
                <p>Reporter: {report.reporter?.name || 'Student'} | {report.details || 'No extra details'}</p>
              </div>
              <button onClick={() => resolveReport(report)} disabled={report.status === 'resolved'}>Resolve</button>
            </article>
          ))}
          {!reports.length && <p className="status">No reports yet.</p>}
        </div>
      </section>

      <section className="panel">
        <h2>Listings</h2>
        <div className="listStack">
          {products.map((product) => (
            <article className="listItem" key={product._id}>
              <div>
                <p className="meta">{product.category} | {product.status} | {product.isScam ? 'Flagged' : 'Clear'}</p>
                <h2>{product.name}</h2>
                <p>Rs. {product.price} by {product.seller?.name || 'Unknown seller'}</p>
              </div>
              <div className="cardActions">
                <button onClick={() => updateProduct(product, { isScam: !product.isScam, status: product.status })}>
                  {product.isScam ? 'Clear flag' : 'Flag'}
                </button>
                <select
                  value={product.status}
                  onChange={(e) => updateProduct(product, { isScam: product.isScam, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
                <button onClick={() => deleteProduct(product._id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Admin;
