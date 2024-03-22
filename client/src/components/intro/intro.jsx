import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/pro-regular-svg-icons"
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { useState, useEffect } from 'react'

const getTokenFromUrl = () => {
        if (window.location.href.includes('?')) {
            return window.location.href
                .split('?')[1]
                .split('&')
                .reduce((initial, item) => {
                    let parts = item.split('=')
                    initial[parts[0]] = decodeURIComponent(parts[1])
                    return initial
            }, {})
        }
    // }
}

export default function Intro({ screen, handleScreenChange, user, handlePopulateUser }) {
    const [ spotifyToken, setSpotifyToken ] = useState("")
    const [ loggedIn, setLoggedIn ] = useState(false)

    // SERVER URL
    const url = import.meta.env.VITE_SERVER_URL

    useEffect(() => {
        const spotifyToken = getTokenFromUrl()
        var access_token = ''
        var token_type = ''

        // If a user has this, it means they have an ID associated with their browser
        // Next step is to see what their authentication method is
        if (localStorage.getItem('ca_dbv_id')) {
            console.log('user already is logged in in this browser')

            // This will check if the user is logged in via email
            if (localStorage.getItem('ca_auth_method') === 'email') {
                console.log('email account')
                fetch(`${url}database/users/get-by-id?user_id=${localStorage.getItem('ca_dbv_id')}`)
                    .then(resp => resp.json())
                    .then(data => {
                        handlePopulateUser(data.user, data.user.authMethod)
                        handleScreenChange('bracelet')
                    })

            // This will check if the user is logged in via Spotify, if they are then it will fetch their Spotify account, and then their DB account
            } else if (localStorage.getItem('ca_auth_method') === 'spotify' && localStorage.getItem('ca_spotify_refresh')) {
                const refresh_token = localStorage.getItem('ca_spotify_refresh')
                fetch(`${url}spotify/refresh?refresh_token=${refresh_token}`)
                    .then(resp => resp.json())
                    .then(data => {
                        access_token = data.data.access_token
                        token_type = data.data.token_type
                        fetch(`${url}spotify/get-user?access_token=${access_token}&token_type=${token_type}`)
                            .then(resp => resp.json())
                            .then(data => {  
                                console.log(data)
                                fetch(`${url}database/users/get-spotify-user?spotifyId=${data.data.id}`)
                                    .then(resp => resp.json())
                                    .then(data => {
                                        console.log(data)
                                        localStorage.setItem('ca_dbv_id', data.user._id)
                                        localStorage.setItem('ca_auth_method', data.user.authMethod)
                                        handlePopulateUser(data.user, data.user.authMethod)
                                        handleScreenChange('bracelet')
                                    })
                            })
                    })
            }
        // If a user is not logged in
        } else {
            if (spotifyToken && !loggedIn) {
                setSpotifyToken(spotifyToken)
                // use spotify api
                setLoggedIn(true)
                fetch(`${url}spotify/callback?code=${spotifyToken.code}&state=${spotifyToken.state}`)
                    .then(resp => resp.json())
                    .then(data => {
                        if (data.status === 200) {
                            const refreshToken = data.data.refresh_token
                            localStorage.setItem('ca_spotify_refresh', data.data.refresh_token)
                            access_token = data.data.access_token
                            token_type = data.data.token_type
                            fetch(`${url}spotify/get-user?access_token=${access_token}&token_type=${token_type}`)
                                .then(resp => resp.json())
                                .then(data => {
                                    if (data.status === 200) {
                                        const email = data.data.email
                                        const displayName = data.data.display_name
                                        const spotifyId = data.data.id
                                        const spotifySubscription = data.data.product
    
                                        // Check if user has an account already
                                        fetch(`${url}database/users/get-spotify-user?spotifyId=${data.data.id}`)
                                            .then(resp => resp.json())
                                            .then(data => {
                                                if (!data.user) {
                                                    fetch(`${url}database/users/create-spotify-user`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            email: email,
                                                            displayName: displayName,
                                                            spotifyRefreshToken: refreshToken,
                                                            spotifyId: spotifyId,
                                                            spotifySubscription: spotifySubscription,
                                                            authMethod: 'spotify'
                                                        })
                                                    })
                                                        .then(resp => resp.json())
                                                        .then(data => {
                                                            localStorage.setItem('ca_dbv_id', data.user._id)
                                                            localStorage.setItem('ca_auth_method', data.user.authMethod)
                                                            handlePopulateUser(data.user, data.user.authMethod)
                                                            handleScreenChange('bracelet')
                                                            // handlePopulateUser(data.data, 'spotify')
                                                        })
                                                } else {
                                                    localStorage.setItem('ca_dbv_id', data.user._id)
                                                    localStorage.setItem('ca_auth_method', data.user.authMethod)
                                                    handlePopulateUser(data.user, data.user.authMethod)
                                                    handleScreenChange('bracelet')
                                                }
                                            })
                                    } else {
                                        console.log('nope')
                                        alert(`Spotify authentication failed: ${ data.message }`)
                                    }
                                })
                        } else {
                            alert(`Spotify authentication failed: ${ data.data.error_description }`)
                        }
                    })
            }
        }

        if (localStorage.getItem('ca_spotify_refresh')) {
            
        } else {
            
        }

    }, [])

    const handleSpotifyClick = () => {
        window.open(`${url}spotify/login`, '_self')
    }

    const handleEmailClick = () => {
        handleScreenChange('email_auth')
    }

    return (<>
        <div className="flex flex-col items-center p-4 px-4 gap-4 flex-grow">
            {/* Login Text */}
            <p className="font-eurostile text-md text-center leading-[1.8rem] tracking-[.2rem]">LOGIN TO VIEW YOUR FRIENDSHIP BRACELET</p>
            {/* Buttons Text */}
            <button className="flex items-center justify-center border-2 border-white p-2 w-64" onClick={ handleSpotifyClick }>
                LOGIN WITH SPOTIFY <FontAwesomeIcon className="ml-2" icon={ faSpotify } />
            </button>
            {/* <button className="flex items-center justify-center border-2 border-white p-2 w-64" onClick={ handleEmailClick }>
                LOGIN WITH EMAIL <FontAwesomeIcon className="ml-2" icon={ faEnvelope }  />
            </button> */}
            {/* Terms & Conditions Text */}
            <p className="text-center text-[9px] font-light">
                BY CONNECTING, YOU AGREE TO THE TERMS & CONDITIONS AND PRIVACY POLICY
                AND YOU AGREE TO RECEIVE EMAIL COMMUNICATION FORM CHASE ATLANTIC AND FEARLESS RECORDS.
                FOR MORE INFORMATION ON HOW WE USE YOUR DATA, PLEASE CLICK HERE.
            </p>
        </div>
    </>)
}