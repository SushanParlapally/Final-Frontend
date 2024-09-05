import React from 'react';
import './Announcements.css';

function Announcements() {
  const announcements = [
    { id: 1, text: 'Reminder: All travel requests need to be submitted by Friday.', icon: '🔔' },
    { id: 2, text: 'Update: New travel policy effective from next month.', icon: '📅' },
    { id: 3, text: 'Notification: Ensure your travel profiles are updated.', icon: '📝' }
  ];

  return (
    <div className="announcements-container">
      <h3>Announcements</h3>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement.id}>
            <div className="announcements-content">
              <span className="announcements-icon">{announcement.icon}</span>
              <p>{announcement.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Announcements;
