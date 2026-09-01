import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../services/authService";
import useDocumentTitle from "../hooks/useDocumentTitle";
import logoIcon from "../assets/logo-icon.png";

function Signup() {
  useDocumentTitle("Sign Up")
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    email: "",
    phoneNumber: ""
  });
  const [ submitting, setSubmitting ] = useState(false)

  const { username, password, passwordConf, email, phoneNumber } = formData;

  function handleChange(event){
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });

  }


  async function handleSubmit(event){
    event.preventDefault();
    try {
      setSubmitting(true)
      await signUp(formData);
      navigate('/sign-in')
    } catch (err) {
      setError(err.response.data.message);
      setSubmitting(false)
    }
  }

  function isFormInvalid(){
    return !(username && password && password === passwordConf);
  };

  return (
    <main className='auth-page'>
      <div className='auth-card'>
        <img src={logoIcon} alt='ndesign' className='auth-card__brand' />
        <p className='auth-card__subtitle'>Join the inner circle. Register your personal account today.</p>
        <p className="error">{error}</p>
        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='field'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-actions'>
            <button disabled={isFormInvalid() || submitting} className='btn btn--block'>{submitting ? 'Signing up...' : 'Sign Up'}</button>
            <button onClick={() => navigate("/")} className='btn btn--ghost btn--block'>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}
export default Signup;
