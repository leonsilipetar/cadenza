import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { notifikacija } from './Notifikacija';
import axios from 'axios';
import ApiConfig from './apiConfig';

// Add this line to ensure credentials are sent with requests
axios.defaults.withCredentials = true;

const PostEditor = ({ post, onClose, onSave }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [visibility, setVisibility] = useState(post?.visibility || 'public');
  const [showAllSchools, setShowAllSchools] = useState(post?.showAllSchools || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      notifikacija('Naslov i sadržaj su obavezni', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const data = { title, content, visibility, showAllSchools };
      let response;

      if (post?._id) {
        response = await axios.put(`${ApiConfig.baseUrl}/api/posts/${post._id}`, data);
      } else {
        response = await axios.post(`${ApiConfig.baseUrl}/api/posts`, data);
      }

      notifikacija('Objava uspješno spremljena', 'success');
      onSave(response.data);
    } catch (error) {
      console.error('Error saving post:', error);
      const errorMessage = error.response?.data?.message || 'Greška pri spremanju objave';
      notifikacija(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="popup">
      <div className="karticaZadatka">
        <form onSubmit={handleSubmit}>
          <div className="div">
            <input
              id="post-title"
              className="input-login-signup"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder='Naslov'
            />
          </div>

          <div className="div" style={{ marginBottom: '2rem' }}>
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              style={{ height: '350px', marginBottom: '50px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'font': [] }],
                  [{ 'align': [] }],
                  ['clean']
                ]
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="div" style={{ flex: 1 }}>
              <label htmlFor="post-visibility">Vidljivost objave:</label>
              <select
                id="post-visibility"
                className="input-login-signup"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Javno</option>
                <option value="mentor">Samo mentori</option>
                <option value="admin">Samo administratori</option>
              </select>
            </div>

            <div className="div-radio" style={{ flex: 1, alignItems: 'center', marginTop: '1.5rem' }}>
              <div
                className={`radio-item ${showAllSchools ? 'checked' : ''}`}
                onClick={() => setShowAllSchools(!showAllSchools)}
              >
                <input
                  type="checkbox"
                  checked={showAllSchools}
                  onChange={() => setShowAllSchools(!showAllSchools)}
                  style={{ display: 'none' }}
                />
                Prikaži svim školama
              </div>
            </div>
          </div>

          <div className="div-radio">
            <button
              type="button"
              className="gumb action-btn zatvoriBtn"
              onClick={onClose}
            >
              Odustani
            </button>
            <button
              type="submit"
              className="gumb action-btn spremiBtn"
              disabled={isSaving}
            >
              {isSaving ? 'Spremanje...' : 'Spremi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;