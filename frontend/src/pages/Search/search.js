import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [searchString, setSearchString] = useState('');
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

  return (
    <section>
      <div className="container-fluid">
        <h1 className="mt-5">Welcome</h1>
        <p>This is the search page</p>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search posts..."
          />
          <button type="submit">Search</button>
        </form>
        <div>
          {posts.map(post => (
            <div key={post.id}>{post.content}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Search;
