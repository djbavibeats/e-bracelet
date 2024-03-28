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

export default function Bracelet({ user, handlePopulateUser, handleUpdateUser, authMethod, missions, passDown }) {
    const [ username, setUsername ] = useState('')
    const [ missionsModalVisible, setMissionsModalVisible ] = useState(false)
    const [ missionsCompleted, setMissionsCompleted ] = useState(0)
    const canvas = useRef()
    const [ test, setTest ] = useState(false)

    const childFunc = useRef(null)

    useEffect(() => {
        setMissionsCompleted(user.missions.filter((mission) => mission.completed === true).length)
    }, [ user ])


    const toggleMissionsModal = () => {
        console.log('toggle')
        setMissionsModalVisible(!missionsModalVisible)
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
                    />
                </Suspense>
                <Environment 
                    preset="city"
                >
                </Environment>
            </Canvas>
            <div 
                className="absolute bottom-0 right-0 text-2xl pr-4 pb-0 hover:cursor-pointer flex items-end"
                onClick={() => childFunc.current()}
            >
                <FontAwesomeIcon icon={ faCamera } />
            </div>
        </div>
        <div className="h-2/6 flex flex-col items-center justify-center relative z-10 p-8">
            <p className="font-eurostile text-2xl text-center leading-[1.8rem] tracking-[.2rem]">{ missionsCompleted }</p>
            <p className="font-eurostile text-xs text-center leading-[1.8rem] tracking-[.2rem] mb-4">CHARMS COLLECTED</p>
            <button className="flex items-center font-eurostile text-sm justify-center border-2 border-white p-2 w-64 hover:cursor-pointer" onClick={ toggleMissionsModal }>
                VIEW MISSIONS <FontAwesomeIcon className="ml-2" icon={ faClipboardListCheck } />
            </button>
        </div>
        { missionsModalVisible && 
            <TaskList user={ user } missions={ missions } toggleMissionsModal={ toggleMissionsModal } handleUpdateUser={ handleUpdateUser } />
        }
    </>)
}