// src/components/SignInForm/SignInForm.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { signIn } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import logoIcon from '../assets/logo-icon.png';


const SignInForm = ({}) => {
  useDocumentTitle("Sign In")
  const {setUser} = useAuth()
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function handleChange(event){
    setFormData({ ...formData, [event.target.name]: event.target.value });


  }

  async function handleSubmit(event){
    event.preventDefault();

  }
  async function handleSubmit(event){
    event.preventDefault();
    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate(signedInUser.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.log(`Error: ${err}`)
      setError(err?.response?.data?.message);
    }
  };

  return (
    <main className='auth-page'>
      <div className='auth-card'>
        <img src={logoIcon} alt='ndesign' className='auth-card__brand' />
        <p className='auth-card__subtitle'>Welcome back. Access your saved wishlist and bespoke orders.</p>
        <p className='error'>{error}</p>
        <form autoComplete='off' onSubmit={handleSubmit} className='auth-form'>
          <div className='field'>
            <label htmlFor='email'>Username</label>
            <input
              type='text'
              autoComplete='off'
              id='username'
              value={formData.username}
              name='username'
              onChange={handleChange}
              required
            />
          </div>
          <div className='field'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              autoComplete='off'
              id='password'
              value={formData.password}
              name='password'
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-actions'>
            <button className='btn btn--block'>Sign In</button>
            <button onClick={() => navigate('/')} className='btn btn--ghost btn--block'>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignInForm;

