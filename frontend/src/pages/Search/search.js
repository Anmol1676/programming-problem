import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './search.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

function Search() {
  const [searchString, setSearchString] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchString) {
      axios.get(`http://localhost:4000/searchString?searchString=${searchString}`)
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => console.log(error));
    }
  };

  const handleAuthorSearch = (event) => {
    event.preventDefault();
    if (authorSearch) {
      axios.get(`http://localhost:4000/searchauthor?searchString=${authorSearch}`)
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => console.log(error));
    }
  };

  const handleLikesSearch = () => {
    axios.get(`http://localhost:4000/searchlike`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    if (posts.length > 0) {
      Prism.highlightAll();
    }
  }, [posts]);

  return (
    <section>
      <div className="container-fluid">
        <h1 className="mt-5">Welcome</h1>
        <p>This is the search page</p>
        
        {/* Search by Content */}
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search posts..."
          />
          <button type="submit">Search by Content</button>
        </form>
        
        {/* Search by Author */}
        <form onSubmit={handleAuthorSearch}>
          <input
            type="text"
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            placeholder="Search by author..."
          />
          <button type="submit">Search by Author</button>
        </form>

        {/* Search by Likes */}
        <button onClick={handleLikesSearch}>Search by Likes</button>

        <div>
          {posts.map(post => (
            <pre><code className="language-javascript">{post.content}</code></pre>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Search;
