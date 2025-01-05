import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from '../navigacija';
import NavTop from '../nav-top';
import ApiConfig from '../../components/apiConfig.js';
import { Icon } from '@iconify/react';
import PostEditor from '../../components/PostEditor';
import { notifikacija } from '../../components/Notifikacija';
import "../../styles/Posts.css";
axios.defaults.withCredentials = true;

const Naslovna = () => {
  const [user, setUser] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [posts, setPosts] = useState([]);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [deletePostId, setDeletePostId] = useState(null);
  console.log(searchResults)

  const otvoreno = 'naslovna';

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    // Check if query length is less than 2 characters
    if (query.length < 2) {
      setSearchResults([]); // Clear search results or keep previous results (based on desired behavior)
      return; // Exit the function to avoid making an API call
    }

    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/users`, { query });
      setSearchResults(res.data.results);
    } catch (error) {
      console.error('Error searching users and mentors:', error);
      setSearchResults([]); // Set search results to an empty array in case of error
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'posts' || activeTab === 'my-posts') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const endpoint = activeTab === 'my-posts' ? '/api/my-posts' : '/api/posts';
      const res = await axios.get(`${ApiConfig.baseUrl}${endpoint}`);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const handlePostSave = async (post) => {
    await fetchPosts();
    setShowPostEditor(false);
    setSelectedPost(null);
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`${ApiConfig.baseUrl}/api/posts/${postId}`);
      notifikacija('Objava uspješno obrisana', 'success');
      fetchPosts();
      setDeletePostId(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      notifikacija('Greška pri brisanju objave', 'error');
    }
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={'Naslovna'} />
      <div className="main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Pretraživanje
          </button>
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Sve objave
          </button>
          {user?.isMentor && (
            <button
              className={`tab ${activeTab === 'my-posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-posts')}
            >
              Moje objave
            </button>
          )}
        </div>

        {/* Move the add post button here, outside of tabs */}
        {user?.isMentor && (
          <button
            className="floating-action-btn"
            onClick={() => {
              setSelectedPost(null);
              setShowPostEditor(true);
            }}
          >
            <Icon icon="solar:add-circle-broken" />
          </button>
        )}

        {activeTab === 'search' ? (
          <div className="karticaZadatka">
            <input
              className="input-login-signup "
              type="text"
              placeholder="Pretraži korisnike..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchResults && searchResults.length > 0 && (
              searchResults.map((result) => (
                <div key={result._id} className="search-result-item">
                  <div>
                    <div><p>{result.ime} {result.prezime}</p> <p className='txt-min2'>{result.email}</p></div>
                    <p className='txt-min'>{result.school.name}</p>
                  </div>
                  <div>
                    <p>{result.uloga}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="karticaZadatka">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    {user?._id === post.author._id && (
                      <div className="post-actions">
                        <button
                          className="action-btn abEdit"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowPostEditor(true);
                          }}
                        >
                          <Icon icon="solar:pen-broken" />
                        </button>
                        <button
                          className="action-btn abDelete"
                          onClick={() => setDeletePostId(post._id)}
                        >
                          <Icon icon="solar:trash-bin-trash-broken" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className={`post-content ${expandedPosts.has(post._id) ? 'expanded' : ''}`}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <button
                    className="show-more-btn"
                    onClick={() => togglePostExpansion(post._id)}
                  >
                    {expandedPosts.has(post._id) ? 'Prikaži manje' : 'Prikaži više'}
                  </button>
                  <div className="post-footer">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('hr-HR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span>{post.author.ime} {post.author.prezime}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-posts">Nema objava za prikaz.</p>
            )}
          </div>
        )}
      </div>
      {showPostEditor && (
          <PostEditor
            post={selectedPost}
            onClose={() => {
              setShowPostEditor(false);
              setSelectedPost(null);
            }}
            onSave={handlePostSave}
          />
        )}
      {deletePostId && (
        <div className="popup">
          <div className="karticaZadatka">
            <h3>Potvrda brisanja</h3>
            <p>Jeste li sigurni da želite obrisati ovu objavu?</p>
            <div className="div-radio">
              <button
                className="gumb action-btn zatvoriBtn"
                onClick={() => setDeletePostId(null)}
              >
                Odustani
              </button>
              <button
                className="gumb action-btn abDelete"
                onClick={() => handlePostDelete(deletePostId)}
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Naslovna;
