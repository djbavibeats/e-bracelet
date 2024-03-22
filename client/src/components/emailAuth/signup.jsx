import { useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUser, faEnvelope, faCircleX, faCircleCheck } from "@fortawesome/pro-regular-svg-icons"

export default function EmailSignup({ screen, handleScreenChange, user, handlePopulateUser }) {
    const email = useRef()
    const name = useRef()
    const password = useRef()
    const confirmPassword = useRef()

    const [ errorMessage, setErrorMessage ] = useState(null)
    const [ passwordMatch, setPasswordMatch ] = useState(false)

    // Production
    const url = 'https://friends4ever-server.onrender.com'
    // Development
    // const url = 'http://localhost:5000'

    const handleEmailSignup = () => {
        console.log("Email: " + email.current.value)
        console.log("Name: " + name.current.value)
        console.log("Password: " + password.current.value)
        console.log("Confirm Password: " + confirmPassword.current.value)
        if (email.current.value && name.current.value && password.current.value && confirmPassword.current.value) {
            if (password.current.value === confirmPassword.current.value) {
                // handleScreenChange('bracelet')
                fetch(`${url}/database/users/create-email-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        displayName: name.current.value,
                        email: email.current.value,
                        password: password.current.value,
                        authMethod: 'email'
                    })
                })
                    .then(resp => resp.json())
                    .then(data => {
                        if (data.status === 400) {
                            setErrorMessage('Account with that email already exists!')
                        } else {
                            localStorage.setItem('dbv_id', data.user._id)
                            localStorage.setItem('auth_method', data.user.authMethod)
                            handlePopulateUser(data.user, data.user.authMethod)
                            handleScreenChange('bracelet')
                        }

                    })
            } else {
                setErrorMessage('Passwords must match!')
            }
        } else {
            setErrorMessage('Please fill out all fields!')
        }
    }

    const checkPassword = () => {
        if (password.current.value === confirmPassword.current.value) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }
    return (<>
        <div className="flex flex-col items-center gap-4 flex-grow p-4">
            {/* Login Text */}
            <p className="font-eurostile text-md text-center leading-[1.8rem] tracking-[.2rem]">NEW ACCOUNT</p>
            <p className="text-center text-sm font-light">PLEASE ENTER THE FOLLOWING INFORMATION,<br/> ALL FIELDS ARE REQUIRED.</p>
            <p className="text-center text-sm font-light">ALREADY HAVE AN ACCOUNT? <span className="underline hover:cursor-pointer" onClick={ () => handleScreenChange('email_auth') }>LOGIN.</span></p>
            {/* Buttons Text */}
            <label className="relative">
                <input type="text" ref={ email } className="flex bg-transparent placeholder-white outline-none  text-white items-center justify-center border-2 p-2 w-64" placeholder="EMAIL"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ faEnvelope } />
            </label>
            <label className="relative">
                <input type="text" ref={ name } className="flex bg-transparent placeholder-white outline-none  text-white items-center justify-center border-2 p-2 w-64" placeholder="YOUR NAME"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ faUser } />
            </label>
            <label className="relative">
                <input type="password" ref={ password } className="flex bg-transparent placeholder-white outline-none  items-center justify-center border-2 p-2 w-64" placeholder="PASSWORD"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ faLock }  />
            </label>
            <label className="relative">
                <input type="password" ref={ confirmPassword } onChange={ checkPassword } className="flex bg-transparent placeholder-white outline-none  items-center justify-center border-2 p-2 w-64" placeholder="CONFIRM PASSWORD"></input>
                <FontAwesomeIcon className="ml-2 absolute top-[.8rem] right-3" icon={ passwordMatch === true ? faCircleCheck : faCircleX }  />
            </label>
            { errorMessage && 
                <p className="text-center text-sm font-light">
                    { errorMessage }
                </p>
            }
            <button className="flex items-center justify-center bg-white text-black border-2 border-white p-2 w-64" onClick={ handleEmailSignup }>
                SIGN UP
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