import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, useProgress, Environment } from '@react-three/drei'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardListCheck, faCamera } from "@fortawesome/pro-regular-svg-icons"

import FriendshipBracelet from './Experience'
import TaskList from './TaskList.jsx'
import PhysicsExperiement from './PhysicsExperiment.jsx'

// SERVER URL
const url = import.meta.env.VITE_SERVER_URL
const ar_url = import.meta.env.VITE_AR_URL

function followMission(user, mission, handleUpdateUser) {
    console.log('follow', user, mission)
    if (user.authMethod === "spotify") {
            // Follow Chase Atlantic
            fetch(`${url}spotify/follow-chase-atlantic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    spotifyId: user.spotifyId,
                    spotifyRefreshToken: user.spotifyRefreshToken 
                })
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.status === 200) {
                        // Save Mamacita on Spotify
                        fetch(`${url}spotify/save-mamacita`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                spotifyId: user.spotifyId,
                                spotifyRefreshToken: user.spotifyRefreshToken
                            })
                        })
                            .then(resp => resp.json())
                            .then(data => {
                                if (data.status === 200) {
                                    fetch(`${url}database/missions/update-mission-finishers`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                missionId: mission._id,
                                                userId: user._id,
                                            })
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log(data.message)
                                                fetch(`${url}database/users/get-by-id?user_id=${localStorage.getItem('ca_dbv_id')}`)
                                                    .then(resp => resp.json())
                                                    .then(data => {
                                                        handleUpdateUser(data.user)
                                                        // toggleSuccessModal(mission)
                                                        return {
                                                            status: 200,
                                                            message: "success",
                                                            user: data.user,
                                                            mission: mission
                                                        }
                                                    })
                                            })
                                } else {
                                    console.log('Error saving Mamacita')
                                }
                                console.log(data.status)
                            })
                    } else {
                        console.log('Error following Chase Atlantic')
                    }
                })
        } else {
            console.log("user did not authenticate with spotify")
        }
}

const FindModal = ({ user, missions, toggleFindModal, handleUpdateUser }) => {
    const [ arActive, setArActive ] = useState(false)
    const [ arPopup, setArPopup ] = useState(false)
    const [ arConnected, setArConnected ] = useState(false)

    const completeMission = () => {
        const userId = user._id
        const mission = missions.find(mission => mission.name === 'find')
        const missionId = mission._id

        fetch(`${url}database/missions/update-mission-finishers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                missionId: missionId,
                userId: userId,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message)
                fetch(`${url}database/users/get-by-id?user_id=${localStorage.getItem('ca_dbv_id')}`)
                    .then(resp => resp.json())
                    .then(data => {
                        handleUpdateUser(data.user)
                        setArConnected(false)
                        toggleFindModal()
                        return {
                            status: 200,
                            message: "success",
                            user: data.user,
                            mission: mission
                        }
                    })
            })
    }
    const openARExperience = () => {
        var url_safe_username = encodeURIComponent(user._id)
        // var url = "https://djbavibeats-default-justinbavier.dev.8thwall.app/chase-atlantic-e-bracelet-ar?uid=" + url_safe_username
        var url = ar_url + "?uid=" + url_safe_username
        let popup = window.open(url)
        setArPopup(popup)
    }

    useEffect(() => {
        console.log("AR Popup Change", arPopup)
        if (arPopup) {
            setTimeout(() => {
                arPopup.postMessage("connecting-from-bracelet", "*")  
            }, 5000)
        }

    }, [ arPopup ])

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.origin !== window.location.href.replace(/\/+$/, '')) {
                if (event.data === "ar-connected") {
                    console.log('ar connected')
                    setArConnected(true)
                } else if (event.data === "ar-mission-quit") {
                    alert("Mission quit!")
                    setArConnected(false)
                    toggleFindModal()
                } else if (event.data === "ar-mission-success") {
                    alert("Mission success!")
                    completeMission()
                    console.log('message received?')
                }
            }
        })
    }, [ arPopup ])

    return (<>
        {
            arConnected &&
                <div className="absolute z-[99999] top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black">
                    <p>AR experience is open in a new tab!</p>
                </div>
        }
        <div className="absolute z-[9999] top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.85)]">
            <div className="relative top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-white modal-container border bg-black h-[250px] max-h-[400px] min-w-[300px] max-w-[350px] gap-4">
                <p className="font-eurostile uppercase">
                    Heads Up!
                </p>
                <p className="text-center text-[12px] mb-2 px-2">
                    This mission involves an AR experience, 
                    <br/>
                    you will be redirected in a different window.
                </p>
                <div className="flex flex-row gap-x-2">
                    <div className="text-center w-24 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" 
                        onClick={ openARExperience }
                    >
                        <p className="font-eurostile text-[9px] text-center">CONTINUE</p>
                    </div>
                    <div className="text-center w-24 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ toggleFindModal }>
                        <p className="font-eurostile text-[9px] text-center">GO BACK</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

function findMission(user, mission, handleUpdateUser) {
    console.log('find')

}

function Loader() {
    const { progress } = useProgress()
    return <Html center>
        <p className="w-screen h-[100%] items-center justify-center flex font-eurostile text-center leading-[1.8rem] tracking-[.2rem] mb-4">
            Loading ... <br />({Math.trunc(progress)}%)
        </p>
    </Html>
}

export default function Bracelet({ user, handlePopulateUser, handleUpdateUser, authMethod, missions, passDown }) {
    const [ missionsModalVisible, setMissionsModalVisible ] = useState(false)
    const [ missionsCompleted, setMissionsCompleted ] = useState(0)
    const [ charmFocused, setCharmFocused ] = useState(false)
    const [ activeMission, setActiveMission ] = useState(null)
    const canvas = useRef()

    const childFunc = useRef(null)

    // useEffect(() => {
    //     console.log(window.location.href.replace(/\/+$/, ''))
    //     window.addEventListener("message", (event) => {
    //         if (event.origin !== window.location.href.replace(/\/+$/, '')) {
    //             console.log(event.data)
    //             alert(event.data)
    //         }
    //     })
    // }, [])
    
    // Find modal state
    const [ findModalVisible, setFindModalVisible ] = useState(false)

    useEffect(() => {
        setMissionsCompleted(user.missions.filter((mission) => mission.completed === true).length)
    }, [ user ])

    useEffect(() => {
        console.log(activeMission)
    }, [ activeMission ])

    const toggleFindModal = () => {
        setFindModalVisible(!findModalVisible)
    }

    const toggleMissionsModal = () => {
        console.log('toggle')
        setMissionsModalVisible(!missionsModalVisible)
    }

    const beginMission = (mission) => {
        switch (mission.activeMission.name) {
            case('follow'):
                followMission(user, mission.activeMission, handleUpdateUser)
                break
            case('find'):
                toggleFindModal()
                break
            default:
                console.log('that mission is not ready')
                break
        }
    }

    const cancelFocus = () => {
        setCharmFocused(false)
    }

    const renderCompleted = (user, mission, cancelFocus) => {
        let el
        user.missions.filter((item) => {
            if (item.missionId === mission._id) {
                if (item.completed === true) {
                    console.log(item)
                    el =  <div className="bg-black absolute flex flex-col items-center justify-center top-0 left-0 m-auto z-[90] h-full w-full">
                        {/* <FontAwesomeIcon className="text-2xl mb-3" icon={ faLock }  /> */}
                        <p className="font-eurostile uppercase mb-2">{ item.missionName }</p>
                        <p className="font-eurostile text-xs mb-4">MISSION COMPLETE</p>
                        <div onClick={ () => cancelFocus() } className="z-50 w-1/2 border-2 border-white py-1 px-1 rounded bg-[rgba(0,0,0,0.075)] hover:cursor-pointer">
                            <p className="font-eurostile text-[9px] text-center">CLOSE</p>
                        </div>
                    </div>
                }
            }
        })
        return <div>{ el }</div>
    }

    return (<>
    <div className="h-1/6 pt-8 px-8 flex items-center justify-center relative z-10">
        { user && 
            <p className="font-eurostile uppercase text-center leading-[1.8rem] tracking-[.2rem] mb-4">Welcome back,<br/>{ user.displayName }</p>
        }
    </div>
        {/* Spacer */}
        {/* <div className="h-3/6"></div> */}
        <div className="aspect-square w-full relative">
            <Canvas
                shadows
                ref={ canvas }
                // frameloop="demand"
                id="canvas-wrapper-id"
                gl={{ preserveDrawingBuffer: true }}
                camera={ { 
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [ 0, 2, - 6 ],
                    aspect: 1 / 1
                } }
            >
                <Suspense fallback={<Loader />}>
                    {/* <FriendshipBracelet 
                        user={ user } 
                        childFunc={ childFunc } 
                        missionsCompleted={ missionsCompleted } 
                        missionsModalVisible={ missionsModalVisible }
                    /> */}
                    <PhysicsExperiement 
                        user={ user }
                        missions={ missions }
                        charmFocused={ charmFocused }
                        setCharmFocused={ setCharmFocused }
                        setActiveMission={ setActiveMission }
                    />
                </Suspense>
                <Environment 
                    preset="city"
                >
                </Environment>
            </Canvas>
            <div 
                className="absolute -bottom-20 md:-bottom-20 right-0 text-2xl pr-4 pb-0 hover:cursor-pointer flex items-end"
                onClick={() => childFunc.current()}
            >
                <FontAwesomeIcon icon={ faCamera } />
            </div>
            { charmFocused &&
                <div className="border-2 rounded bg-[rgba(0,0,0,.5)] absolute m-auto right-0 -bottom-4 md:bottom-0 left-0 h-32 md:h-36 w-[95%] md:w-[400px] px-2 pt-2 pb-2">
                     { !activeMission.available &&
                        <div className="absolute flex flex-col items-center justify-center top-0 left-0 m-auto z-50 h-full w-full">
                            {/* <FontAwesomeIcon className="text-2xl mb-3" icon={ faLock }  /> */}
                            <p className="font-eurostile text-xs">MISSION LOCKED</p>
                        </div>
                    }
                    { renderCompleted(user, activeMission, cancelFocus) }
                    <div className={ `flex flex-col justify-between h-full w-full gap-y-2 `}>
                        <div className={ `${ activeMission.available ? '' : 'blur-sm' } `} >
                            <p className="font-eurostile uppercase mb-0">{ activeMission.name }</p>
                            <p className="font-eurostile text-[9px] uppercase">{ activeMission.description }</p>
                        </div>
                        <div className="flex gap-x-2 items-center justify-center">
                            { activeMission.available &&
                                <div onClick={ () => beginMission({ activeMission }) } className="w-1/2 border-2 border-white py-1 px-1 rounded bg-[rgba(0,0,0,0.075)] hover:cursor-pointer">
                                    <p className="font-eurostile text-[9px] text-center">START MISSION</p>
                                </div>
                            }
                            <div onClick={ () => cancelFocus() } className="z-50 w-1/2 border-2 border-white py-1 px-1 rounded bg-[rgba(0,0,0,0.075)] hover:cursor-pointer">
                                <p className="font-eurostile text-[9px] text-center">CANCEL</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
        <div className="h-2/6 flex flex-col items-center justify-center relative z-10 p-8">
            <p className="font-eurostile text-2xl text-center leading-[1.8rem] tracking-[.2rem]">{ missionsCompleted } / 4</p>
            <p className="font-eurostile text-xs text-center leading-[1.8rem] tracking-[.2rem] mb-4">MISSIONS COMPLETED</p>
            {/* <button className="flex items-center font-eurostile text-sm justify-center border-2 border-white p-2 w-64 hover:cursor-pointer" onClick={ toggleMissionsModal }>
                VIEW MISSIONS <FontAwesomeIcon className="ml-2" icon={ faClipboardListCheck } />
            </button> */}
        </div>
        <div>

        </div>
        { missionsModalVisible && 
            <TaskList user={ user } missions={ missions } toggleMissionsModal={ toggleMissionsModal } handleUpdateUser={ handleUpdateUser } />
        }
        {
            findModalVisible &&
            <FindModal user={ user } missions={ missions } toggleFindModal={ toggleFindModal } handleUpdateUser={ handleUpdateUser } />
        }
    </>)
}