import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../utils/apiServices';
import toastr from 'toastr';


const Create = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [publishingYear, setPublishingYear] = useState('');
    const currentYear = new Date().getFullYear();
    const { id } = useParams(); // id for edit mode
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const getIndividualMovie = async () => {
        if (id) {
            try {
                const response = await apiService.get(`/movie/getById?id=${id}`);
                if (response && response.data) {
                    const { title, publishingyear, poster } = response.data;
                    setTitle(title);
                    setPublishingYear(publishingyear);
                    setImage(poster); // base64 string or URL
                }
            } catch (error) {
                toastr.error(error.response.data.error);
            }
        }
    };

    useEffect(() => {
        getIndividualMovie();

    }, [id]);

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validation
        if (!title.trim()) {
            toastr.error("Title is required");
            return;
        }
    
        const year = parseInt(publishingYear, 10);
        if (!publishingYear || !/^\d{4}$/.test(publishingYear) || year < 1900 || year > currentYear) {
            toastr.error("Invalid publishing year. It must be a four-digit year between 1900 and the current year.");
            return;
        }
    
        try {
            const payload = {
                title,
                publishingyear: publishingYear,
                poster: image,
            };
    
            if (id) {
                payload.id = id;
              const response=  await apiService.put(`/movie/update`, payload);
                toastr.success(response.data.message);
            } else {
               const response= await apiService.post('/movie/create', payload);
                toastr.success(response.data.message);
            }
            navigate('/home');
        } catch (error) {
        
            // Display the specific error message from the API if available, otherwise a default message
            const errorMessage = error.response?.data?.error || "Error submitting movie. Please try again.";
            toastr.error(errorMessage); // Show error toast with the API error message
        }
    };
    

    const handlePublishingYearChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value) && (value === '' || Number(value) <= currentYear)) {
            setPublishingYear(value);
        }
    };

    return (
        <div className="create-edit-movie-page inner-page">
      
            <div className="custom-container">
                <div className="inner-page-main-heading">
                    <h2>{id ? "Edit Movie" : "Create a New Movie"}</h2>
                </div>

                <div className="create-edit-movie-wrapper">
                    <div
                        className="movie-image-uploader"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input type="file" onChange={handleFileChange}  id="file-upload" />
                        <label htmlFor="file-upload" className="drop-area">
                            {image ? (
                                <img src={image} alt="Uploaded" className="uploaded-image" />
                            ) : (
                                <div className="drop-image-text text-center">
                                    <img src="images/drop-image.svg" alt="" />
                                    <p className="font-small">Drop an image here</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="movie-details-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group publishing-year-input">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Publishing year"
                                    value={publishingYear}
                                    onChange={handlePublishingYearChange}
                                    maxLength="4"
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => navigate('/home')}><span>Cancel</span></button>
                                <button type="submit" className="btn btn-primary"><span>Submit</span></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
