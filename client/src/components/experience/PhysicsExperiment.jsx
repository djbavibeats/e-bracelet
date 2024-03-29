import { OrbitControls, useGLTF, Html, Hud, Billboard, Text } from "@react-three/drei"
import { Perf } from 'r3f-perf'
import { useRef, useState, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import { useEffect } from "react"

const Ring = ({ position, rotation }) => {
    return (<>
    <mesh position={[ ...position ]} rotation={[ ...rotation ]} scale={[ 0.3, 0.3, 1.125 ]}>
        <torusGeometry args={[ 0.4, 0.06, 24, 48, Math.PI * 2 ]} />
        <meshStandardMaterial />
    </mesh>
    </>)
}

CameraControls.install({ THREE })

function Controls({ zoom, focusPoint, pos = new THREE.Vector3(), look = new THREE.Vector3() }) {
    const camera = useThree((state) => state.camera)
    const gl = useThree((state) => state.gl)
    const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])
    return useFrame((state, delta) => {
        zoom ? 
            pos.set(focusPoint.x + 0.0, focusPoint.y - 0.75, focusPoint.z - 1.0) 
            : pos.set(0, 1.0, - 5)
        zoom ? 
            look.set(focusPoint.x + 0.0, focusPoint.y - 0.75, focusPoint.z + 1.0) 
            : look.set(0, 0, - 2)
        state.camera.position.lerp(pos, 0.75)
        state.camera.updateProjectionMatrix()  
        controls.setLookAt(state.camera.position.x, state.camera.position.y, state.camera.position.z, look.x, look.y, look.z, true)
        return controls.update(delta)

    })
}



const Charm = ({ position, rotation, zoomToView, zoom, focusPoint, focusObject, mission, setActiveMission, hover, setHover, available }) => {
    console.log(mission)
    const charm = useRef()
    const [ charmHover, setCharmHover ] = useState(false)
    const [ random, setRandom ] = useState(Math.random() * 0.5)
    let speed = 3
    let distance = 0.035
    // let random = Math.random() * 0.5
    // let color = "#42b4f8"
    let color       = available ? 
        // "#d0cece" 
        "#AACECE"
        : '#aa9999'
    let metalness   = 1.0
    let roughness   = 0.2
    let opacity     = available ? 0.85 : 0.35

    let pos = new THREE.Vector3()
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (focusObject === charm.current) {
            if (zoom) {
                if (charm.current.position.y < 1) {
                    charm.current.position.y = 0
                    charm.current.position.x = 0
                    charm.current.position.z = - 4  
                }
            } else {
                charm.current.position.y = Math.sin(time * (speed + random)) * distance + (position[1] * 0.25)
            }
        } else {
            charm.current.position.y = Math.sin(time * (speed + random)) * distance + (position[1] * 0.25)
        }
    })

    useEffect(() => {
        document.body.style.cursor = charmHover ? 'pointer' : 'auto' 
    }, [ charmHover ])

    useEffect(() => {
        if (zoom) {
            if (focusObject === charm.current) {
                charm.current.children[0].material.opacity = 0.95
                charm.current.children[1].material.opacity = 0.95
                charm.current.children[2].material.opacity = 0.95
            }
        } else {
            charm.current.children[0].material.opacity = opacity
            charm.current.children[1].material.opacity = opacity
            charm.current.children[2].material.opacity = opacity
        }
    }, [ zoom, focusObject ])

    return (<>
    <group 
        onClick={(e) => { 
            zoomToView(e.object.parent, e.object.parent.position) 
            setActiveMission(mission)
        }}
        onPointerEnter={(e) => setCharmHover(true)} // see note 1
        onPointerLeave={(e) => setCharmHover(false)} // see note 1
        ref={ charm }
        position={[ position[0], position[1], position[2] ]}
    >
        <mesh position-y={ 0.175 } rotation={[ ...rotation ]} scale={ 0.04 }>
            <sphereGeometry />
            <meshStandardMaterial transparent={ true } opacity={ opacity } color={ color } metalness={ metalness } roughness={ roughness } />
        </mesh>
        <mesh position-y={ 0.25 } rotatation={[ ...rotation ]} scale={ 0.02 }>
            <sphereGeometry />
            <meshStandardMaterial transparent={ true } opacity={ opacity } color={ color } metalness={ metalness } roughness={ roughness }  />
        </mesh>
        <mesh position-y={ 0 } rotation={[ ...rotation ]} scale={ 0.125 }>
            <sphereGeometry />
            <meshStandardMaterial transparent={ true } opacity={ opacity } color={ color } metalness={ metalness } roughness={ roughness } />
        </mesh>
    </group>
    </>)
}

export default function PhysicsExperiement({ missions, charmFocused, setCharmFocused, setActiveMission }) {
    const { nodes, materials } = useGLTF("./models/temp-bracelet.gltf")
    const [ zoom, setZoom ] = useState(false)
    const [ hover, setHover ] = useState(false)
    const [ focusPoint, setFocusPoint ] = useState({})
    const [ focusObject, setFocusObject ] = useState(null)

    const circletGeometry = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (!zoom) {
            if (hover) {
                circletGeometry.current.rotation.y += 0.0025
            } else {   
                circletGeometry.current.rotation.y += 0.0075
            }
        } else {
            circletGeometry.current.rotation.y = 0.0
        }
    })

    useEffect(() => {
    }, [ focus ])

    useEffect(() => {
        console.log('switching charm focus')
        if (!charmFocused) {
            setZoom(false)
        }
    }, [ charmFocused ])

    const zoomToView = (focusObject, focusPoint) => {
        if (zoom) {
            setZoom(false)
            setCharmFocused(false)
            setFocusPoint({})
            setFocusObject(focusObject)

        } else {
            setZoom(true)
            setCharmFocused(true)
            setFocusPoint(focusPoint)
            setFocusObject(focusObject)
        }
    }

    const renderCharms = () => {
        let charms = []
        let radius = 1.325
        let random
        Promise.all(missions.map((mission, i) => {
            random = Math.random() / 40
            if (mission.available) {
                charms.push(<Charm 
                    key={ i }
                    zoom={ zoom }
                    hover={ hover }
                    setHover={ setHover }
                    mission={ mission }
                    setActiveMission={ setActiveMission }
                    focusPoint={ focusPoint }
                    focusObject={ focusObject }
                    position={[
                        Math.sin(i * 10) * radius - 0.25,
                        - 1.75 + random,
                        Math.cos(i * 10) * radius
                    ]}
                    rotation={[ 0, 0, 0 ]}
                    zoomToView={ zoomToView }
                    available={ true }
                />)
            } else {
                charms.push(<Charm 
                    key={ i }
                    zoom={ zoom }
                    hover={ hover }
                    setHover={ setHover }
                    mission={ mission }
                    setActiveMission={ setActiveMission }
                    focusPoint={ focusPoint }
                    focusObject={ focusObject }
                    position={[
                        Math.sin(i * 10) * radius - 0.25,
                        - 1.75 + random,
                        Math.cos(i * 10) * radius
                    ]}
                    rotation={[ 0, 0, 0 ]}
                    zoomToView={ zoomToView }
                    available={ false }
                />)
            }
        }))
        // for (let i = 0; i < 5; i++) {
        //     random = Math.random() / 40
        //     charms.push(<Charm 
        //         key={ i }
        //         zoom={ zoom }
        //         focusPoint={ focusPoint }
        //         focusObject={ focusObject }
        //         position={[ 
        //             Math.sin(i * 10) * radius - 0.25, 
        //             - 1.75 + random, 
        //             Math.cos(i * 10) * radius 
        //         ]}
        //         rotation={[ 0, 0, 0 ]}
        //         zoomToView={ zoomToView }
        //     />)
        // }

        return (<group scale={ 1.00 } >{
            charms.map(el => {
                return el
            })
        }</group>)
    }
    
    // const renderRings = () => {
    //     let elements = []
    //     let radius = 1.125
    //     for (let i = 0; i < 44; i++) {
    //         elements.push(<Ring 
    //             key={ i }
    //             position={[
    //                 Math.sin(i / 7) * radius,
    //                 0,
    //                 Math.cos(i / 7) * radius
    //             ]}
    //             rotation={[ 
    //                 // Math.PI / 2, 
    //                 i % 2 === 0 ? Math.PI / 2 : 0,
    //                 // 0, 
    //                 i % 2 === 0 ? 0 : Math.PI + (i / 7),
    //                 0
    //             ]} 
    //         />)
    //     }

    //     return (<group scale={ 1.75 } >{
    //         elements.map(el => {
    //             return el
    //         })
    //     }</group>)
    // }

    return (<>
        <OrbitControls makeDefault />
        <Perf />
        <group 
            dispose={null} 
            scale={ 1.0 } 
            rotation={[ 0, 0, 0.0 ]} 
            position={[ 0.0, - 0.75, 0 ]}
            ref={ circletGeometry }
        >   
                <mesh scale={[ 3, 0.75, 3 ]} position={[ 0, 0, 0 ]}
                    visible={ false }
                    onPointerEnter={() => {
                        console.log('pointer enter')
                        setHover(true)
                    }}
                    onPointerLeave={() => {
                        console.log('pointer leave')
                        setHover(false)
                    }}
                >
                    <boxGeometry />
                    <meshBasicMaterial />
                </mesh>
                <mesh
                    castShadow
                    geometry={nodes.Bracelet.geometry}
                >  
                    <meshStandardMaterial 
                        color={ 0xd0cece } 
                        metalness={ 1 }
                        roughness={ 0.2 }
                    />

                </mesh>
                <mesh
                    castShadow
                    geometry={nodes.T_Clasp.geometry}
                    position={[-0.144, 0.029, 0.032]}
                    rotation={[0.003, 0.005, 0.002]}
                    scale={[50.001, 50, 50]}
                >
                    <meshStandardMaterial 
                        color={ 0xd0cece } 
                        metalness={ 1.0 }
                        roughness={ 0.2 }
                    />
                </mesh>
                { renderCharms() }
        </group>
        <Controls zoom={ zoom } focusPoint={ focusPoint } />     
    </>)
}

useGLTF.preload('./models/temp-bracelet.gltf')