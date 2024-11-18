import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiService from "../utils/apiServices";
import { useEffect, useState } from "react";
import toastr from 'toastr';


const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
     reset,
  } = useForm();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      reset({ email: savedEmail });
      setRememberMe(true); 
    }
  }, [reset]);

  const handleLogin = async (data) => {

    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await apiService.post("/auth/login", payload);
     
      if (response.status === 200 && response.data.message) {
        const token = response.data.token;
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("email", data.email);
        } else {
          sessionStorage.setItem("token", token); 
          localStorage.removeItem("email");
        }

        navigate("/home");
        
        toastr.success(response.data.message); 
        
      } 
    } catch (error) {
      toastr.error(error.response.data.error);
    }
  };

  return (
    <div className="authentication-page">
      <div className="auth-box">
        <h1 className="text-center">Sign in</h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="form-group">
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errors.email && (
              <div className="validation_error">
                <span role="alert">{errors.email.message}</span>
              </div>
            )}
          </div>
          <div className="form-group">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
                  message:
                    "Password must contain at least one letter, one number, and one special character",
                },
              })}
            />
            {errors.password && (
              <div className="validation_error">
                <span role="alert">{errors.password.message}</span>
              </div>
            )}
          </div>
          <div className="form-group form-remember">
            <div className="custom-checkbox">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <i className="fi fi-br-check"></i>
            </div>
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <div className="form-button">
            <input type="submit" value="Login" className="btn btn-primary" />
          </div>

          <div className="register-link">
            <span>If you don't have an account, </span>
            <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
