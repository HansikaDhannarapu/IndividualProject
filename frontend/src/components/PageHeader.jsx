import React from 'react';

const PageHeader = ({ title, action }) => (
  <div className="pageHeader">
    <h1>{title}</h1>
    {action}
  </div>
);

export default PageHeader;
