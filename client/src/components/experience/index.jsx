import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, useProgress, Environment } from '@react-three/drei'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardListCheck, faCamera } from "@fortawesome/pro-regular-svg-icons"

import FriendshipBracelet from './Experience'
import TaskList from './TaskList.jsx'
import PhysicsExperiement from './PhysicsExperiment.jsx'

function Loader() {
    const { progress } = useProgress()
    return <Html center>
        <p className="w-screen h-[100%] items-center justify-center flex font-eurostile text-center leading-[1.8rem] tracking-[.2rem] mb-4">
            Loading ... <br />({Math.trunc(progress)}%)
        </p>
    </Html>
}

function beginMission(mission) {
    console.log(mission)
}

export default function Bracelet({ user, handlePopulateUser, handleUpdateUser, authMethod, missions, passDown }) {
    const [ missionsModalVisible, setMissionsModalVisible ] = useState(false)
    const [ missionsCompleted, setMissionsCompleted ] = useState(0)
    const [ charmFocused, setCharmFocused ] = useState(false)
    const [ activeMission, setActiveMission ] = useState(null)
    const canvas = useRef()

    const childFunc = useRef(null)

    useEffect(() => {
        setMissionsCompleted(user.missions.filter((mission) => mission.completed === true).length)
    }, [ user ])

    useEffect(() => {
        console.log(activeMission)
    }, [ activeMission ])


    const toggleMissionsModal = () => {
        console.log('toggle')
        setMissionsModalVisible(!missionsModalVisible)
    }

    const cancelFocus = () => {
        setCharmFocused(false)
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
    </>)
}