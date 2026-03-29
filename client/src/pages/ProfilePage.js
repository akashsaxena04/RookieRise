import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ProfilePage.css';

function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
          const result = await usersAPI.getUserById(userId);
          if (result.success) {
            setProfileUser(result.user);
            setFormData(result.user);
          } else {
              toast.error(result.error || 'Failed to load profile');
          }
      } catch (err) {
          toast.error('An error occurred loading the profile.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
      const { value } = e.target;
      // Simple comma separated split for skills/education
      setFormData(prev => ({
          ...prev,
          [field]: value.split(',').map(item => item.trim())
      }));
  };

  const handleFileChange = (e) => {
      if (e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedData = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => {
        if (key === 'skills' || key === 'education') {
            updatedData.append(key, JSON.stringify(formData[key] || []));
        } else if (formData[key] !== null && formData[key] !== undefined) {
             updatedData.append(key, formData[key]);
        }
    });

    // Append file if exists
    if (file) {
        updatedData.append('file', file);
    }

    try {
        const result = await usersAPI.updateUser(updatedData);
        if (result.success) {
          setProfileUser(result.user);
          setFormData(result.user);
          setIsEditing(false);
          setFile(null);
          toast.success('Profile updated successfully!');
        } else {
            toast.error(result.error || 'Failed to update profile');
        }
    } catch(err) {
        toast.error('An error occurred submitting the profile.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-page loading">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="profile-page error">Profile not found</div>;
  }

  const isOwnProfile = currentUser && userId === currentUser._id;
  const isRookie = profileUser.type === 'rookie';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-photo">
            <img src={profileUser.profilePicture || 'https://via.placeholder.com/150'} alt={profileUser.name} />
            {isEditing && (
                 <div className="file-upload-wrapper mt-2">
                     <label className="text-sm text-gray-600 block mb-1">Upload New Picture/Logo:</label>
                     <input type="file" accept="image/*" onChange={handleFileChange} />
                 </div>
            )}
          </div>
          <div className="profile-header-info">
            {isEditing ? (
                <input 
                   type="text" 
                   name="name" 
                   value={formData.name || ''} 
                   onChange={handleChange} 
                   className="edit-input title-input"
                   placeholder="Your Name"
                />
            ) : (
                <h1>{profileUser.name}</h1>
            )}

            {!isRookie && (
                isEditing ? (
                    <input type="text" name="company" value={formData.company || ''} onChange={handleChange} className="edit-input" placeholder="Company Name"/>
                ) : (
                    profileUser.company && <p className="company">{profileUser.company}</p>
                )
            )}
            
            <p className="role">{isRookie ? 'Rookie' : 'Recruiter'}</p>
            
            {isEditing ? (
                 <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="edit-input" placeholder="Location (City, Country)"/>
            ) : (
                 profileUser.location && <p className="location">📍 {profileUser.location}</p>
            )}

            {isOwnProfile && (
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? "btn-save mt-3" : "btn-edit mt-3"}
                disabled={saving}
              >
                {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
              </button>
            )}
            {isEditing && (
                 <button onClick={() => setIsEditing(false)} className="btn-cancel mt-3 ml-2" disabled={saving}>Cancel</button>
            )}
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-section">
             <h2>{isRookie ? 'About Me' : 'About Company'}</h2>
             {isEditing ? (
               <textarea
                 name={isRookie ? "bio" : "companyDescription"}
                 value={isRookie ? (formData.bio || '') : (formData.companyDescription || '')}
                 onChange={handleChange}
                 rows="4"
                 className="edit-input"
                 placeholder="Write a short description..."
               />
             ) : (
               <p>{(isRookie ? profileUser.bio : profileUser.companyDescription) || 'No description provided.'}</p>
             )}
          </section>

          {isRookie && (
            <>
              <section className="profile-section">
                <h2>Experience</h2>
                {isEditing ? (
                   <input
                     type="text"
                     name="experience"
                     value={formData.experience || ''}
                     onChange={handleChange}
                     className="edit-input"
                     placeholder="e.g. 2 years, Fresh Graduate"
                   />
                ) : (
                  <p>{profileUser.experience || 'Not specified'}</p>
                )}
              </section>

              <section className="profile-section">
                <h2>Skills</h2>
                {isEditing ? (
                     <div>
                        <input
                            type="text"
                            value={(formData.skills || []).join(', ')}
                            onChange={(e) => handleArrayChange(e, 'skills')}
                            className="edit-input"
                            placeholder="Comma separated skills (e.g. React, Node.js)"
                        />
                     </div>
                ) : (
                     <div className="skills-list">
                        {profileUser.skills && profileUser.skills.length > 0 ? (
                            profileUser.skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))
                        ) : <p>No skills added yet</p>}
                     </div>
                )}
              </section>

              <section className="profile-section">
                  <h2>Education</h2>
                  {isEditing ? (
                     <input
                         type="text"
                         value={(formData.education || []).join(', ')}
                         onChange={(e) => handleArrayChange(e, 'education')}
                         className="edit-input"
                         placeholder="Comma separated (e.g. BSc Computer Science)"
                     />
                  ) : (
                      <div className="education-list">
                          {profileUser.education && profileUser.education.length > 0 ? (
                              <ul>
                                  {profileUser.education.map((edu, idx) => <li key={idx}>{edu}</li>)}
                              </ul>
                          ) : <p>No education added yet</p>}
                      </div>
                  )}
              </section>

              <section className="profile-section">
                  <h2>Links</h2>
                  {isEditing ? (
                      <div className="links-edit">
                          <input type="url" name="githubLink" value={formData.githubLink || ''} onChange={handleChange} className="edit-input mb-2" placeholder="GitHub URL"/>
                          <input type="url" name="linkedinLink" value={formData.linkedinLink || ''} onChange={handleChange} className="edit-input mb-2" placeholder="LinkedIn URL"/>
                          <input type="url" name="portfolio" value={formData.portfolio || ''} onChange={handleChange} className="edit-input mb-2" placeholder="Portfolio Website"/>
                      </div>
                  ) : (
                      <div className="links-view">
                          {profileUser.githubLink && <a href={profileUser.githubLink} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline mb-1">GitHub</a>}
                          {profileUser.linkedinLink && <a href={profileUser.linkedinLink} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline mb-1">LinkedIn</a>}
                          {profileUser.portfolio && <a href={profileUser.portfolio} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline mb-1">Portfolio</a>}
                          {!profileUser.githubLink && !profileUser.linkedinLink && !profileUser.portfolio && <p>No links provided.</p>}
                      </div>
                  )}
              </section>

              <section className="profile-section">
                  <h2>Elevator Pitch (Video)</h2>
                  {isEditing ? (
                      <input type="url" name="videoPitch" value={formData.videoPitch || ''} onChange={handleChange} className="edit-input mb-2" placeholder="YouTube, Vimeo, or Loom URL"/>
                  ) : (
                      profileUser.videoPitch ? (
                          <div className="video-container rounded-xl overflow-hidden mt-4">
                              <iframe width="100%" height="315" src={profileUser.videoPitch.includes('watch?v=') ? profileUser.videoPitch.replace('watch?v=', 'embed/') : profileUser.videoPitch} title="Elevator Pitch" frameBorder="0" allowFullScreen></iframe>
                          </div>
                      ) : <p>No video pitch added.</p>
                  )}
              </section>
              
              <section className="profile-section">
                 <h2>Resume</h2>
                 {isEditing ? (
                      <div className="file-upload-wrapper">
                         <label className="text-sm text-gray-600 block mb-1">Upload Resume (PDF):</label>
                         <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                         <p className="text-xs text-gray-500 mt-1">Note: This will override any picture upload you selected above since we use a single file upload route currently.</p>
                      </div>
                 ) : (
                      profileUser.resume ? (
                           <a href={profileUser.resume} target="_blank" rel="noreferrer" className="btn-save inline-block" style={{textDecoration: 'none'}}>View Resume</a>
                      ) : <p>No resume uploaded.</p>
                 )}
              </section>
            </>
          )}

          {!isRookie && (
              <>
                <section className="profile-section">
                    <h2>Industry</h2>
                    {isEditing ? (
                        <input type="text" name="industry" value={formData.industry || ''} onChange={handleChange} className="edit-input" placeholder="e.g. Technology, Finance"/>
                    ) : <p>{profileUser.industry || 'Not specified'}</p>}
                </section>
                <section className="profile-section">
                    <h2>Company Size</h2>
                    {isEditing ? (
                        <input type="text" name="companySize" value={formData.companySize || ''} onChange={handleChange} className="edit-input" placeholder="e.g. 1-10, 50-200"/>
                    ) : <p>{profileUser.companySize || 'Not specified'}</p>}
                </section>
                <section className="profile-section">
                    <h2>Company Culture</h2>
                    {isEditing ? (
                        <textarea name="companyCulture" value={formData.companyCulture || ''} onChange={handleChange} rows="3" className="edit-input" placeholder="What's it like working here?"/>
                    ) : <p>{profileUser.companyCulture || 'Not specified'}</p>}
                </section>
                <section className="profile-section">
                    <h2>Perks & Benefits</h2>
                    {isEditing ? (
                        <input
                             type="text"
                             value={(formData.perks || []).join(', ')}
                             onChange={(e) => handleArrayChange(e, 'perks')}
                             className="edit-input"
                             placeholder="Comma separated (e.g. Healthcare, Remote Work)"
                        />
                    ) : (
                        <div className="skills-list flex flex-wrap gap-2 mt-2">
                            {profileUser.perks && profileUser.perks.length > 0 ? (
                                profileUser.perks.map((perk, idx) => <span key={idx} className="skill-tag">{perk}</span>)
                            ) : <p>Not specified</p>}
                        </div>
                    )}
                </section>
                <section className="profile-section">
                    <h2>Website</h2>
                    {isEditing ? (
                        <input type="url" name="website" value={formData.website || ''} onChange={handleChange} className="edit-input" placeholder="https://..."/>
                    ) : (
                        profileUser.website ? <a href={profileUser.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{profileUser.website}</a> : <p>Not specified</p>
                    )}
                </section>
              </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="sidebar-card">
            <h3>Contact</h3>
            <p className="contact-email mb-2">{profileUser.email}</p>
            {isRookie && profileUser.phone && <p className="contact-phone mb-2">📞 {profileUser.phone}</p>}
            
            {isEditing && isRookie && (
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="edit-input mt-2" placeholder="Phone Number" />
            )}

            {!isOwnProfile && currentUser && (
              <button className="btn-message mt-4">
                💬 Send Message
              </button>
            )}
          </div>

          <div className="sidebar-card mt-4">
             <h3>Member Since</h3>
             <p>{new Date(profileUser.createdAt).toLocaleDateString()}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProfilePage;
