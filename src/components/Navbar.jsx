import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Search from './Search'

function Navbar() {
  const { logout, user} = useAuth()
  return (
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/products'>Shop</Link>
      <Search />
      {user
      ?
      (<>
      <Link to='/cart'>Cart</Link>
      <button onClick={logout}>Sign Out</button>
      </>) :
      (<>
        <Link to='/sign-up'>Sign Up</Link>
        <Link to='/sign-in'>Sign In</Link>
      </>)}
    </nav>
  )
}

export default Navbar