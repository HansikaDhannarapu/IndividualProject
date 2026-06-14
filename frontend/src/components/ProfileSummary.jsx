import React from 'react';

const ProfileSummary = ({ user, onPasswordClick }) => {
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || 'U';

  return (
    <section className="profileSummary">
      <div className="profileAvatar">
        {user.profilePic ? <img src={user.profilePic} alt={user.name} /> : <span>{initial}</span>}
      </div>
      <div className="profileDetails">
        <div>
          <p className="meta">Name</p>
          <h2>{user.name}</h2>
        </div>
        <div className="profileInfoGrid">
          <div>
            <p className="meta">Email</p>
            <strong>{user.email}</strong>
          </div>
          <button className="profileInfoButton" onClick={onPasswordClick} type="button">
            <p className="meta">Password</p>
            <strong aria-label="Password hidden">********</strong>
          </button>
          <div>
            <p className="meta">Role</p>
            <strong>{user.role}</strong>
          </div>
          <div>
            <p className="meta">Department</p>
            <strong>{user.department || 'Not added'}</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSummary;
