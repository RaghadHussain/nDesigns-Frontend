import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Search from './Search'
import logoIcon from '../assets/logo-icon.png'

function Navbar() {
  const { logout, user} = useAuth()
  return (
    <nav className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='navbar__brand'>
          <img src={logoIcon} alt='' className='navbar__brand-mark' />
          <span className='navbar__brand-name'>ndesign</span>
        </Link>
        <div className='navbar__links'>
          <Link to='/products' className='navbar__link'>Shop</Link>
          <Link to='/about' className='navbar__link'>About</Link>
        </div>
        <div className='navbar__actions'>
          <Search />
          {user
          ? (<>
          <Link to='/account/profile' className='navbar__link'>Profile</Link>
          {user?.role === 'admin'
          ? (<>
            <Link to='/admin/orders' className='navbar__link'>Orders</Link>
            <Link to='/admin/discounts' className='navbar__link'>Discounts</Link>
            <button onClick={logout} className='navbar__link navbar__link--button'>Sign Out</button>
          </>)
          : (<>
          <Link to='/cart' className='navbar__link'>Cart</Link>
          <button onClick={logout} className='navbar__link navbar__link--button'>Sign Out</button>
          </>)}
          </>)
          : (<>
            <Link to='/sign-up' className='navbar__link'>Sign Up</Link>
            <Link to='/sign-in' className='navbar__link navbar__link--cta'>Sign In</Link>
          </>)}
        </div>
      </div>
    </nav>
  )
}

export default Navbar