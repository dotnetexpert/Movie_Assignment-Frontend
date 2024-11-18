import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiServices';
// import img from '../../public/images/Spinner.gif';
import toastr from 'toastr';
const Movie = () => {
    const navigate = useNavigate();
    const [movieList, setMovieList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(6);
    const [loading, setLoading] = useState(true); 
    const [showModal,setShowModal]=useState(false);
    const [movieID,setMovieID]=useState('');
    const totalPages = Math.ceil(movieList.length / moviesPerPage);

    const getAllMovies = async () => {
        setLoading(true); 
        try {
            const response = await apiService.get('/movie/getAll');
            if (response && response.data) {
                setMovieList(response.data); 
            }
        } catch (error) {
            const errorMessage = error.response.data.error; 
            toastr.error(errorMessage); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        getAllMovies();
    }, []);

    const handleCreateMovie = () => {
        navigate('/create');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        sessionStorage.removeItem("token");
        navigate('/'); 
        toastr.success(`Logout successfully`)
    };

    const handleEditMovie = (id) => {
        navigate(`/edit/${id}`);
    };

    const indexOfLastMovie = currentPage * moviesPerPage; 
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; 
    const currentMovies = movieList.slice(indexOfFirstMovie, indexOfLastMovie); 

    const paginate = (pageNumber) => setCurrentPage(pageNumber); 

    const handleDelete=async()=>{
        const id=movieID;

        try {
            if (id) {
    
              const response=  await apiService.delete(`/movie/delete?id=${id}`);
                toastr.success(response.data.message);
                handleCancel();
                getAllMovies();
            }
        } catch (error) {
        
            // Display the specific error message from the API if available, otherwise a default message
            const errorMessage = error.response?.data?.error || "Error deleteing movie. Please try again.";
            toastr.error(errorMessage); // Show error toast with the API error message
        }
    };

    const handleCancel=()=>{
        setShowModal(false);
        setMovieID(''); 
    };

    return (
        <>
            {loading ? (
                <div className="loading"><img src="images/Spinner.gif" alt=""/></div>
            ) : movieList.length > 0 ? (
                <div className="my-movies-page inner-page">
                    <div className="custom-container">
                        <div className="inner-page-main-heading flex-heading">
                            <h2>My Movies 
                                <span onClick={handleCreateMovie}>
                                    <img src="images/add-icon.png" alt='' />
                                </span>
                            </h2>
                            <span onClick={handleLogout} className="logout-action">
                                Logout <img src="images/logout-icon.png" alt="" />
                            </span>
                        </div>

                        <div className="movies-list-wrapper">
                            {currentMovies.map((movie) => (
                                <div 
                                    key={movie.id} 
                                    className="movie-box" 
                                  
                                >
                                    <figure>
                                    <button  className="delete-icon" onClick={()=>{setShowModal(true);setMovieID(movie.id);}}>
                                   <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="18" height="18"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"></path><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"></path><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"></path></svg>
                                    </button>
                                        <img   onClick={() => handleEditMovie(movie.id)} src={movie.poster || "images/default-movie.png"} alt={movie.title} />
                                    </figure>
                                    <div className="movie-box-desc">
                                        <p className="font-large movie-name">{movie.title}</p>
                                        <p className="font-small movie-year">{movie.publishingyear}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="custom-pagination">
                            <span 
                                className={`prev-page ${currentPage === 1 ? 'disabled' : ''}`} 
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            >
                                Previous
                            </span>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <span 
                                    key={index + 1} 
                                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`} 
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </span>
                            ))}
                            <span 
                                className={`next-page ${currentPage === totalPages ? 'disabled' : ''}`} 
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                            >
                                Next
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="movies-page movie-empty-page">
                    <div className="movie-empty-box text-center">
                        <h2>Your movie list is empty</h2>
                        <button type="button" className="btn btn-primary" onClick={handleCreateMovie}>
                            <span>Add a new movie</span>
                        </button>
                    </div>
                </div>
            )}

{showModal && <div className="custom-modal delete-modal hidden">

<div className="modal-main-content">

<div className='delete-icon'>
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>
</div>

<p>Are you sure you want to delete this movie?</p>
<div class="form-buttons"><button type="button" onClick={handleCancel}class="btn btn-secondary"><span>Cancel</span></button><button type="submit" onClick={handleDelete} class="btn btn-danger"><span>Delete</span></button></div>
</div>
</div>}
        </>
    );
};

export default Movie;
