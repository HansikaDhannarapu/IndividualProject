import React from 'react';

const StatusMessage = ({ children, tone = '' }) => {
  if (!children) return null;

  return <p className={tone ? `status ${tone}` : 'status'}>{children}</p>;
};

export default StatusMessage;
