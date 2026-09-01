import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useAuth } from '../../context/AuthContext'
import { updateUserDetails } from '../../services/authService'
import { createAddress, getUserAddress, updateAddress } from '../../services/addressService'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function ProfilePage() {
  useDocumentTitle("My Profile")
  const { user, setUser } = useAuth()

  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isEditingUser, setIsEditingUser] = useState(false)
  const [userFormData, setUserFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
  })
  const [userError, setUserError] = useState('')

  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    city: '',
    block: '',
    road: '',
    building: '',
    apartment: '',
    note: '',
  })
  const [addressError, setAddressError] = useState('')

  useEffect(() => {
    async function fetchAddress() {
      try {
        const userAddress = await getUserAddress()
        setAddress(userAddress)
      } catch (err) {
        if (err.message !== 'No Address Found') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAddress()
  }, [])

  function handleUserChange(event) {
    setUserFormData({ ...userFormData, [event.target.name]: event.target.value })
  }

  function startEditUser() {
    setUserFormData({
      username: user.username || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
    })
    setUserError('')
    setIsEditingUser(true)
  }

  async function handleUserSubmit(event) {
    event.preventDefault()

    try {
      const updatedUser = await updateUserDetails(user._id, userFormData)
      setUser(updatedUser)
      setIsEditingUser(false)
    } catch (err) {
      setUserError(err.message)
    }
  }

  function handleAddressChange(event) {
    setAddressFormData({ ...addressFormData, [event.target.name]: event.target.value })
  }

  function startEditAddress() {
    setAddressFormData({
      city: address?.city ?? '',
      block: address?.block ?? '',
      road: address?.road ?? '',
      building: address?.building ?? '',
      apartment: address?.apartment ?? '',
      note: address?.note ?? '',
    })
    setAddressError('')
    setIsEditingAddress(true)
  }

  async function handleAddressSubmit(event) {
    event.preventDefault()

    const payload = {
      city: addressFormData.city,
      block: Number(addressFormData.block),
      road: Number(addressFormData.road),
      building: Number(addressFormData.building),
      apartment: addressFormData.apartment === '' ? undefined : Number(addressFormData.apartment),
      note: addressFormData.note,
    }

    try {
      const savedAddress = address
        ? await updateAddress(address._id, payload)
        : await createAddress(payload)
      setAddress(savedAddress)
      setIsEditingAddress(false)
    } catch (err) {
      setAddressError(err.message)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main className='account-page account-page--profile container'>
      <h1>My Profile</h1>

      <p className='account-back'><Link to='/account/orders'>View Order History</Link></p>

      <section className='account-section'>
        <h2>Account Details</h2>
        <p className='error'>{userError}</p>

        {isEditingUser ? (
          <form onSubmit={handleUserSubmit}>
            <div className='field'>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                name='username'
                value={userFormData.username}
                onChange={handleUserChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={userFormData.email}
                onChange={handleUserChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='phoneNumber'>Phone Number</label>
              <input
                type='Number'
                id='phoneNumber'
                name='phoneNumber'
                value={userFormData.phoneNumber}
                onChange={handleUserChange}
                required
              />
            </div>
            <div className='form-actions'>
              <button type='submit' className='btn'>Save</button>
              <button type='button' onClick={() => setIsEditingUser(false)} className='btn btn--outline'>Cancel</button>
            </div>
          </form>
        ) : (
          <div className='account-detail-list'>
            <p>Username: <span>{user.username}</span></p>
            <p>Email: <span>{user.email}</span></p>
            <p>Phone Number: <span>{user.phoneNumber}</span></p>
            <p>Loyalty Points: <span>{user.loyaltyPoints}</span></p>
            <button onClick={startEditUser} className='btn btn--outline btn--sm'>Edit</button>
          </div>
        )}
      </section>

      <section className='account-section'>
        <h2>Address</h2>
        <p className='error'>{addressError}</p>

        {isEditingAddress ? (
          <form autoComplete='off' onSubmit={handleAddressSubmit}>
            <div className='field'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                name='city'
                value={addressFormData.city}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='block'>Block</label>
              <input
                type='number'
                id='block'
                name='block'
                value={addressFormData.block}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='road'>Road</label>
              <input
                type='number'
                id='road'
                name='road'
                value={addressFormData.road}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='building'>Building</label>
              <input
                type='number'
                id='building'
                name='building'
                value={addressFormData.building}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='apartment'>Apartment</label>
              <input
                type='number'
                id='apartment'
                name='apartment'
                value={addressFormData.apartment}
                onChange={handleAddressChange}
              />
            </div>
            <div className='field'>
              <label htmlFor='note'>Note</label>
              <input
                type='text'
                id='note'
                name='note'
                value={addressFormData.note}
                onChange={handleAddressChange}
              />
            </div>
            <div className='form-actions'>
              <button type='submit' className='btn'>Save</button>
              <button type='button' onClick={() => setIsEditingAddress(false)} className='btn btn--outline'>Cancel</button>
            </div>
          </form>
        ) : address ? (
          <div className='account-detail-list'>
            <p>City: <span>{address.city}</span></p>
            <p>Block: <span>{address.block}</span></p>
            <p>Road: <span>{address.road}</span></p>
            <p>Building: <span>{address.building}</span></p>
            {address.apartment !== undefined && address.apartment !== null && (
              <p>Apartment: <span>{address.apartment}</span></p>
            )}
            {address.note && <p>Note: <span>{address.note}</span></p>}
            <button onClick={startEditAddress} className='btn btn--sm'>Edit</button>
          </div>
        ) : (
          <div className='account-detail-list'>
            <p>No address yet</p>
            <button onClick={startEditAddress} className='btn btn--sm'>Add Address</button>
          </div>
        )}
      </section>
    </main>
  )
}

export default ProfilePage
