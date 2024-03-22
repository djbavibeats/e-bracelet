import { useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faEnvelope } from "@fortawesome/pro-regular-svg-icons"
export default function EmailAuth({ screen, handleScreenChange, user, handlePopulateUser }) {
    const email = useRef()
    const password = useRef()
    const [ errorMessage, setErrorMessage ] = useState(null)

    // Production
    const url = 'https://friends4ever-server.onrender.com'
    // Development
    // const url = 'http://localhost:5000'

    const handleEmailAuthentication = () => {
        if (email.current.value && password.current.value) {
            fetch(`${url}/database/users/get-email-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.current.value,
                    password: password.current.value
                })
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.status === 400) {
                    setErrorMessage('Looks like you created your account using Spotify.')
                } else if (data.status === 404) {
                    setErrorMessage('No user with that email / password combination found.')
                } else if (data.status === 403) {
                    setErrorMessage('Incorrect password!')
                } else if (data.status === 200) {
                    localStorage.setItem('dbv_id', data.user._id)
                    localStorage.setItem('auth_method', data.user.authMethod)
                    handlePopulateUser(data.user, data.user.authMethod)
                    handleScreenChange('bracelet')
                }
            })
        } else {
            setErrorMessage('Please enter a valid email!')
        }
    }
    return (<>
        <div className="flex flex-col items-center gap-4 flex-grow p-4">
            {/* Login Text */}
            <p className="font-eurostile text-md text-center leading-[1.8rem] tracking-[.2rem]">PLEASE ENTER YOUR EMAIL AND PASSWORD</p>
            <p className="text-center text-sm font-light">FIRST TIME HERE? <span className="underline hover:cursor-pointer" onClick={ () => handleScreenChange('email_signup') }>CREATE AN ACCOUNT.</span></p>
            {/* Buttons Text */}
            <label className="relative">
                <input type="text" ref={ email } className="flex bg-transparent placeholder-white outline-none  text-white items-center justify-center border-2 p-2 w-64" placeholder="EMAIL"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ faEnvelope } />
            </label>
            <label className="relative">
                <input type="password" ref={ password } className="flex bg-transparent placeholder-white outline-none  items-center justify-center border-2 p-2 w-64" placeholder="PASSWORD"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ faLock }  />
            </label>
            { errorMessage && 
                <p className="text-center text-sm font-light">
                    { errorMessage }
                </p>
            }
            <button className="flex items-center justify-center bg-white text-black border-2 border-white p-2 w-64" onClick={ handleEmailAuthentication }>
                ENTER
            </button>
            {/* Terms & Conditions Text */}
            <p className="text-center text-[9px] font-light">
                BY CONNECTING, YOU AGREE TO THE TERMS & CONDITIONS AND PRIVACY POLICY
                AND YOU AGREE TO RECEIVE EMAIL COMMUNICATION FORM CHASE ATLANTIC AND FEARLESS RECORDS.
                FOR MORE INFORMATION ON HOW WE USE YOUR DATA, PLEASE CLICK HERE.
            </p>
        </div>
    </>)
}