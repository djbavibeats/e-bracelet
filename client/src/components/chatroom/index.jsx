import React, { useState, useEffect, useRef } from 'react'
import { socket } from '../../socket'

export default function Chatroom() {
    const [ isConnected, setIsConnected ] = useState(socket.connected)
    const [ usernameSelected, setUsernameSelected ] = useState(false)
    const usernameRef = useRef(null)
    const [ users, setUsers ] = useState([])
    const [ pairedUser, setPairedUser ] = useState(null)

    const messageRef = useRef(null)
    const [ messageBody, setMessageBody ] = useState('')

    useEffect(() => {       
        socket.on('connect', () => {
            users.forEach((user) => {
                if (user.self) {
                    user.connected = true
                    setIsConnected(true)
                }
            })
        })

        socket.on('disconnect', () => {
            users.forEach((user) => {
                if (user.self) {
                    user.connected = false
                    setIsConnected(false)
                }
            })
        })

        const initReactiveProperties = (user) => {
            user.connected = true
            user.messages = []
            user.hasNewMessages = false
        }

        socket.on('users', (users) => {
            users.forEach((user) => {
                user.self = user.userId === socket.id
                initReactiveProperties(user)
            })

            const sortedUsers = users.sort((a, b) => {
                if (a.self) return -1
                if (b.self) return 1
                if (a.username < b.username) return -1
                return a.username > b.username ? 1 : 0
            })

            setUsers(sortedUsers)
        })

        socket.on('user connected', (user) => {
            initReactiveProperties(user)
            setUsers(
                [ 
                    ...users,
                    user
                ]
            )
            console.log('updated users: ', users)
        })

        socket.on('user disconnected', (id) => {
            const updatedUsers = users
            for (let i = 0; i < updatedUsers.length; i++) {
                const user = users[i]
                if (user.userId === id) {
                    user.connected = false
                    break
                }
            }
            setUsers(updatedUsers)
        })

        socket.on('private message', ({ message, from }) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                if (user.userId === from) {
                    user.messages.push({
                        message: message,
                        fromSelf: false
                    })
                    if (user !== pairedUser) {
                        user.hasNewMessages = true
                    }
                    break
                }
            }  
            setMessageBody(message)
        })

        socket.on('connect_error', (err) => {
            if (err.message === 'invalid username') {
                setUsernameSelected(false)
            }
        })

        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('users')
            socket.off('user connected')
            socket.off('user disconnected')
            socket.off('connect_error')

        }
    }, [ users ])

    function handleUsernameSelection() {
        setUsernameSelected(true)
        socket.auth = {
            username: usernameRef.current.value
        }
        socket.connect()
    }

    function handleSelfClick(user) {
        setPairedUser(null)
    }

    // Select User
    function handleUserClick(selecteduser) {
        setPairedUser(selecteduser)
        selecteduser.hasNewMessages = false
    }

    // On Message
    function sendMessage() {
        if (pairedUser) {
            socket.emit('private message', {
                message: messageRef.current.value,
                to: pairedUser.userId
            })
            pairedUser.messages.push({
                message: messageRef.current.value,
                fromSelf: true
            })
            setMessageBody(messageRef.current.value)
            messageRef.current.value = ""
            // setPairedUser(updatedPairedUser)
        }
    }

    return (<>
        {/* Step One: Username Selection */}
        <div className={ 
            usernameSelected ? ` hidden ` : ` flex
             flex-col justify-center m-auto gap-2 p-2 max-w-[300px]`
        }>
            <input type="text" placeholder="Please create a username" className="border-b-2 p-2 w-full" ref={ usernameRef } />  
            <button onClick={ handleUsernameSelection } className="border-2 p-2 w-full">
                Enter
            </button>
        </div>

        {/* Step Two: Chatroom Particpants */}
        <div className={
            !usernameSelected ? ` hidden ` : ` grid
            grid-cols-12
        ` }>
            <div className="flex flex-col col-span-4 border-r-2">
                { users.map(user => {
                    if (user.self) {
                        return <div
                            key={ user.userId }
                            onClick={ () => handleSelfClick(user) }
                            className={ `border-b-2 p-2` }
                        >
                        { user.username } { user.connected ? <p>Online</p> : <p>Offline</p> }
                        </div>
                    } else {
                        return <div 
                            key={ user.userId }
                            onClick={ () => handleUserClick(user) }
                            className={  
                                pairedUser && user.userId === pairedUser.userId ? 
                                ` border-b-2 p-2 bg-black text-white ` 
                                : ` border-b-2 p-2 bg-white text-black `
                            }
                        >
                            { user.username } { user.connected ? <p>Online</p> : <p>Offline</p> }
                        </div>
                    }
                })}
            </div>
            <div className={`
                col-span-8 p-2 flex flex-col gap-2
            `}>
                { pairedUser ?
                    <>
                        <div>
                            <p>Chatroom with { pairedUser.username }</p>
                        </div>
                        <div>
                            <ul className="message">
                                { 
                                    pairedUser.messages.map((message, index) => {
                                        if (message.fromSelf) {
                                            return <li key={ index }>(yourself) : { message.message }</li>
                                        } else {
                                            return <li key={ index }>{ pairedUser.username } : { message.message }</li>
                                        }
                                    })
                                }
                            </ul>
                        </div>
                        <div>
                            <input type="textarea" className="border-2 w-full p-2 mb-2" ref={ messageRef } />
                            <button className="border-2 p-2" onClick={ sendMessage }>Send</button>
                        </div>
                    </>
                    : <p>Pick someone to chat with!</p>
                }
                <div>
                    <p></p>
                </div>
                
            </div>
        </div>
    </>)
}