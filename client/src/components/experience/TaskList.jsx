import { faLock } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

import Create from './missions/create/Create'
import Watch from './missions/watch/Watch'
import Find from './missions/find/Find'

// SERVER URL
const url = import.meta.env.VITE_SERVER_URL

const SuccessModal = ({ successModalMission, toggleSuccessModal }) => {
    function renderSuccessMessage (missionName) {
        switch (missionName) {
            case ('follow'):
                return (<div className="flex items-center flex-col">
                    <img className="w-[150px] h-[150px] mb-4" src={ './images/bracelet-icon.png' } />
                    <p>Follow Charm Name</p>
                </div>)
            default:
                break
        }
    }
    return (<>
        <div className="absolute z-[9999] top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.85)]">
            <div className="relative top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white modal-container border bg-black h-[50%] max-h-[400px] w-[90%] max-w-[400px]">
                <div className="flex flex-col items-center text-center gap-4">
                    <p>
                        Charm Unlocked
                    </p>
                    { renderSuccessMessage(successModalMission.name) }
                    <div className="text-center w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ (successModalMission) => toggleSuccessModal() }>
                        <p className="font-eurostile text-[9px] text-center">GO BACK</p>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

const FindModal = ({ user, toggleFindModal }) => {
    const openARExperience = () => {
        var url_safe_username = encodeURIComponent(user._id)
        var url = "https://justinbavier.staging.8thwall.app/chase-atlantic-e-bracelet-ar?uid=" + url_safe_username
        console.log(url)
        console.log('sending user to AR', user)
        window.open(url, "_blank")
    }

    return (<>
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
                    <div className="text-center w-24 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ openARExperience }>
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
const Mission = ({ mission, user, handleUpdateUser, followMission, findMission, toggleMission }) => {
    const [ missionDetails, setMissionDetails ] = useState(null)

    function executemission(name) {
        switch (name) {
            case ('follow'):
                followMission(user, mission)
                break
            case ('find'):
                findMission(user, mission)
                break
            default:
                toggleMission(mission)
                break
        }
    }

    useEffect(() => {
        if (user.missions.find(umission => umission.missionId === mission._id)) {
            setMissionDetails(user.missions.find(umission => umission.missionId === mission._id))
        }
    }, [ user ])

    return (<>
        <div className={`grid py-2 grid-cols-4 relative mb-4`}>
            { !mission.available &&
                <div className="absolute flex flex-col items-center justify-center m-auto z-50 h-full w-full">
                    <FontAwesomeIcon className="text-2xl mb-3" icon={ faLock }  />
                    <p className="font-eurostile text-xs">MISSION LOCKED</p>
                </div>
            }
            <div className={ mission.available ?
                `col-span-1`
                : `blur-sm col-span-1`
            }>
                <div className="flex pr-2 h-full w-full items-center justify-center">
                    <img src={'./images/bracelet-icon.png' } />
                </div>
            </div>
            <div className={ mission.available ?
                `relative col-span-3`
                : `relative col-span-3 blur-[8px]`
            }>
                { missionDetails &&
                    missionDetails.completed && 
                    mission.available && 
                    <div className="absolute h-full w-full flex items-center pl-5">
                        <p className="font-eurostile text-xs text-[rgba(0,255,0,1)]">MISSION COMPLETE</p>
                    </div>
                } 
                <div className={ missionDetails && missionDetails.completed && mission.available ? `blur-[8px]` : `` }
                >
                <p className="font-eurostile uppercase">{ mission.name }</p>
                <p className="font-eurostile text-[9px] uppercase pt-2 mb-4">{ mission.description }</p>
                <div onClick={ () => executemission(mission.name) } className="w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer">
                    <p className="font-eurostile text-[9px] text-center">START MISSION</p>
                </div>
                </div>
            </div>

        </div>  
    </>)
}

export default function TaskList({ user, missions, toggleMissionsModal, handleUpdateUser }) {
    const [ activeScreen, setActiveScreen ] = useState('missions')
    const [ videoPlaying, setVideoPlaying ] = useState(false)
    const [ mapActive, setMapActive ] = useState(false)
    
    // Success modal state
    const [ successModalVisible, setSuccessModalVisible ] = useState(false)
    const [ successModalMission, setSuccessModalMission ] = useState(null)

    // Find modal state
    const [ findModalVisible, setFindModalVisible ] = useState(false)


    const toggleSuccessModal = (mission) => {
        console.log('toggle', mission)
        setSuccessModalMission(mission)
        setSuccessModalVisible(!successModalVisible)
    }

    const toggleFindModal = () => {
        setFindModalVisible(!findModalVisible)
    }

    function followMission(user, mission) {
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
                            console.log('Chase Atlantic Followed!')
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
                                        console.log('Mamacita saved!')
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
                                                            toggleSuccessModal(mission)
                                                        })
                                                })
                                    } else {
                                        console.log('Error saving Mamacita')
                                    }
                                    console.log(data)
                                })
                        } else {
                            console.log('Error following Chase Atlantic')
                        }
                    })
            } else {
                console.log("user did not authenticate with spotify")
            }
    }

    function findMission(user, mission) {
        toggleFindModal()
    }

    function toggleMission(mission) {
        setActiveScreen(mission.name)
    }


    return (<>
        {
            findModalVisible && <FindModal user={ user } toggleFindModal={ toggleFindModal } />
        }
        {
            successModalMission && <SuccessModal toggleSuccessModal={ toggleSuccessModal } successModalMission={ successModalMission } />
        }
        <div className="flex fixed top-0 left-0 right-0 h-full w-screen p-1 bg-[rgba(0,0,0,1)] md:bg-[rgba(0,0,0,0.25)] z-20 overflow-x-hidden overflow-y-auto">
            <div className="relative top-0 left-0 right-0 bottom-0 flex items-start md:items-center text-white modal-container w-[100%] max-w-full">
                <div className="flex flex-col relative bg-black task-list-modal min-h-full min-w-full md:min-h-[700px] py-4 px-2 border-2 border-color-white md:w-[100%] md:max-w-[500px] md:min-w-[330px]">
                    <div className="absolute top-3 right-3 text-xs border-2 border-white rounded-full px-[6px] py-1 font-bold bg-[rgba(0,0,0,0.25)] hover:cursor-pointer" onClick={ toggleMissionsModal }>
                        <div className="font-eurostile">X</div>
                    </div>
                    <p className="font-eurostile text-center text-2xl leading-[1.8rem] tracking-[.2rem] mb-0">MISSIONS</p>
                    {
                        activeScreen === "missions" &&
                        <>
                            <div className="h-[2px] w-[90%] m-auto bg-black mb-4"></div>            
                            <div className="px-2 w-full">
                                { missions.map((mission, index) => {
                                    return <Mission 
                                    key={ index } 
                                    user={ user } 
                                    mission={ mission } 
                                    handleUpdateUser={ handleUpdateUser } 
                                    followMission={ followMission } 
                                    findMission={ findMission }
                                    toggleMission={ toggleMission }
                                />
                                })}
                            </div>    
                            <div className="h-[2px] w-[90%] m-auto bg-black mb-4"></div> 
                        </>
                    }
                    {
                        activeScreen === "create" &&
                        <>
                            <div className="w-full mt-4 flex flex-col items-center justify-between flex-grow">
                            <p className="font-eurostile text-xs mb-4">PLAYLIST QUIZ</p>
                            <Create />
                            <div className="text-center w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ () => setActiveScreen('missions') }>
                                <p className="font-eurostile text-[9px] text-center">GO BACK</p>
                            </div>
                            </div>
                        </>
                    }
                    {
                        activeScreen === "watch" &&
                        <>
                            <div className="w-full mt-4 flex flex-col items-center justify-between flex-grow">
                            <p className="font-eurostile text-xs mb-4">MAMACITA OFFICIAL LYRIC VIDEO</p>
                                <Watch />
                                <div className="text-center w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ () => setActiveScreen('missions') }>
                                    <p className="font-eurostile text-[9px] text-center">GO BACK</p>
                                </div>
                            </div>
                        </>
                    }
                    { activeScreen === "find" &&
                        <>
                            <div className="w-full mt-4 flex flex-col items-center justify-between flex-grow">
                            <p className="font-eurostile text-xs mb-4">DIGITAL DROP POINTS</p>
                            <Find />
                            <div className="text-center w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ () => setActiveScreen('missions') }>
                                <p className="font-eurostile text-[9px] text-center">GO BACK</p>
                            </div>
                            </div>
                        </>

                    }
                </div>
            </div>
        </div>
    </>)
}   