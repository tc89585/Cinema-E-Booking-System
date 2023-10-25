// import React, { useState } from 'react';
// import './ManageMovies.css';

// function ManageMovies() {
//   const [movieData, setMovieData] = useState({
//     title: '',
//     description: '',
//     cast: '',
//     director: '',
//     rating: '',
//     genre: '',
//     trailerUrl: '',
//     trailerImage: '',
//     startDate: '',
//     endDate: '',
//     comingSoon: false,
//   });
//   const [message, setMessage] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const newValue = type === 'checkbox' ? checked : value;
//     setMovieData({ ...movieData, [name]: newValue });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add your logic here to save movie data to your backend or state.
//     // For this example, we'll just display a success message.
//     setMessage('Movie added successfully');
//   };

//   return (
//     <div className="manage-movies-container">
//       <h2>Add a Movie</h2>
//       <form onSubmit={handleSubmit} className="movie-form">
//         <div className="form-group">
//           <label>Title:</label>
//           <input type="text" name="title" value={movieData.title} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Description:</label>
//           <textarea name="description" value={movieData.description} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Cast:</label>
//           <input type="text" name="cast" value={movieData.cast} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Director:</label>
//           <input type="text" name="director" value={movieData.director} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Rating:</label>
//           <input type="text" name="rating" value={movieData.rating} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Genre:</label>
//           <input type="text" name="genre" value={movieData.genre} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Trailer URL:</label>
//           <input type="text" name="trailerUrl" value={movieData.trailerUrl} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Trailer Image:</label>
//           <input type="text" name="trailerImage" value={movieData.trailerImage} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>Start Date:</label>
//           <input type="date" name="startDate" value={movieData.startDate} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>End Date:</label>
//           <input type="date" name="endDate" value={movieData.endDate} onChange={handleInputChange} required />
//         </div>
//         <div className="form-group">
//           <label>
//             <input
//               type="checkbox"
//               name="comingSoon"
//               checked={movieData.comingSoon}
//               onChange={handleInputChange}
//             />
//             Coming Soon
//           </label>
//         </div>
//         <button type="submit" className="submit-button">
//           Submit Movie
//         </button>
//       </form>
//       {message && <p className="success-message">{message}</p>}
//     </div>
//   );
// }

// export default ManageMovies;

import React, { useState } from 'react';
import './ManageMovies.css';

function ManageMovies() {
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    cast: '',
    director: '',
    rating: '',
    genre: '',
    trailerUrl: '',
    trailerImage: '',
    startDate: '',
    endDate: '',
    comingSoon: false,
  });
  const [message, setMessage] = useState('');
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setMovieData({ ...movieData, [name]: newValue });
  };

  const handleAddMovieClick = () => {
    setShowAddMovieForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic here to save movie data to your backend or state.
    // For this example, we'll just display a success message.
    setMessage('Movie added successfully');
  };

  return (
    <div className="manage-movies-container">
      <h2>Add a Movie</h2>
      <button onClick={handleAddMovieClick} className="add-movie-button">
        Add Movie
      </button>
      {showAddMovieForm && (
        <form onSubmit={handleSubmit} className="movie-form">
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={movieData.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={movieData.description} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Cast:</label>
            <input type="text" name="cast" value={movieData.cast} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Director:</label>
            <input type="text" name="director" value={movieData.director} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <input type="text" name="rating" value={movieData.rating} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <input type="text" name="genre" value={movieData.genre} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Trailer URL:</label>
            <input type="text" name="trailerUrl" value={movieData.trailerUrl} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Trailer Image:</label>
            <input type="text" name="trailerImage" value={movieData.trailerImage} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" name="startDate" value={movieData.startDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="endDate" value={movieData.endDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="comingSoon"
                checked={movieData.comingSoon}
                onChange={handleInputChange}
              />
              Coming Soon
            </label>
          </div>
          <button type="submit" className="submit-button">
            Submit Movie
          </button>
        </form>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ManageMovies;
