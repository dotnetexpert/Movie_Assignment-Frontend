import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiServices'; 
import { useForm } from 'react-hook-form';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleRegister = async (data) => {
      
        const payLoad = {
            email: data.email,
            password: data.password
        };
    
        try {
            const response = await apiService.post('/auth/register', payLoad);

            const message= response.data.message;
            if (response && response.data) {
              
                toastr.success(message); // Success message with email
                navigate('/'); 
                reset(); 
                
            }
            
            
        } catch (error) {
            
            const errorMessage = error.response.data.error || 'Error during registration. Please try again.'; 
            toastr.error(errorMessage); 
        }
    };

    return (
        <div className="authentication-page">
         
            <div className="auth-box">
                <h1 className="text-center">Sign up</h1>

                <form onSubmit={handleSubmit(handleRegister)}>
                    <div className="form-group">
                        <input
                            id='email'
                            type='email'
                            placeholder="Email"
                            className='form-control'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Entered value does not match email format',
                                },
                            })}
                        />
                        {errors.email && (
                            <div className='validation_error'>
                                <span role='alert'>
                                    {errors.email.message}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            id="password"
                            type="password"
                              placeholder="Password"
                            className="form-control"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters long',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Password cannot exceed 20 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
                                    message: 'Password must contain at least one letter, one number, and one special character',
                                }
                            })}
                        />
                        {errors.password && (
                            <div className='validation_error'>
                                <span role='alert'>
                                    {errors.password.message}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-button">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>

                    <div className="register-link">
                        <span>If you already have an account, </span>
                        <Link to="/">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
