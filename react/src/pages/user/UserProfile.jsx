import React from 'react';
import './UserProfile.css'; 

export default function UserProfile() {

  const user = {
    name: 'Sarah Anderson',
    title: 'Senior UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bio: 'Passionate about creating human-centered designs and solving complex problems through intuitive interfaces.',
    stats: {
      projects: 142,
      followers: '2.4k',
      following: 586
    },
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing'],
    contact: {
      email: 'sarah.anderson@example.com',
      location: 'San Francisco, CA',
      website: 'www.sarahanderson.design'
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.name} />
          <div className="online-status"></div>
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-title">{user.title}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-number">{user.stats.projects}</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{user.stats.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{user.stats.following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">About</h2>
          <p className="profile-bio">{user.bio}</p>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-container">
            {user.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Contact</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{user.contact.email}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Location:</span>
              <span className="contact-value">{user.contact.location}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Website:</span>
              <a href="#" className="contact-value link">{user.contact.website}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn primary">Follow</button>
        <button className="btn secondary">Message</button>
      </div>
    </div>
  );
}