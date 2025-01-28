import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BiLogOut } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../../../../context/AuthContext'
import { logoutUser } from '../../../../context/actions/authActions'
import { api } from '../../../../services/api'

const DropdownPegawai = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [userData, setUserData] = useState({
        username: '',
        role: '',
        photo: null
    })
    const navigate = useNavigate()
    const { dispatch } = useAuth()

    const trigger = useRef(null)
    const dropdown = useRef(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/employee/profile')
                setUserData({
                    username: response.data.name,
                    role: response.data.position,
                    photo: response.data.photo
                })
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        fetchUserData()
    }, [])

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return
            setDropdownOpen(false)
        }
        document.addEventListener('click', clickHandler)
        return () => document.removeEventListener('click', clickHandler)
    })

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return
            setDropdownOpen(false)
        }
        document.addEventListener('keydown', keyHandler)
        return () => document.removeEventListener('keydown', keyHandler)
    })

    const handleLogout = async () => {
        try {
            await logoutUser(dispatch)
            navigate('/')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    return (
        <div className='relative'>
            <Link
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center gap-4'
                to='#'
            >
                <span className='hidden text-right lg:block'>
                    <span className='block text-sm font-medium text-black dark:text-white'>
                        {userData.username || 'Loading...'}
                    </span>
                    <span className='block text-xs'>{userData.role || 'Employee'}</span>
                </span>

                <span className='h-12 w-12'>
                    {userData.photo ? (
                        <img className='rounded-full' src={userData.photo} alt='User' />
                    ) : (
                        <FaUserCircle className='h-full w-full text-gray-300' />
                    )}
                </span>

                <MdKeyboardArrowDown className="text-xl" />
            </Link>

            {/* <!-- Dropdown Start --> */}
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <ul className='flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark'>
                    <li>
                        <Link
                            to='/pegawai/pengaturan/ubah-password'
                            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'
                        >
                            <FiSettings className="text-xl" />
                            Settings
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base'
                        >
                            <BiLogOut className="text-xl" />
                            Log Out
                        </button>
                    </li>
                </ul>
            </div>
            {/* <!-- Dropdown End --> */}
        </div>
    )
}

export default DropdownPegawai;
