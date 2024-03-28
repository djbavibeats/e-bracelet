import { OrbitControls, useGLTF } from "@react-three/drei"
import { Perf } from 'r3f-perf'
import { Physics, RigidBody, MeshCollider } from "@react-three/rapier"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three'

const Charm = ({ position, rotation, charmColor }) => {
    return (<>
    <group position={[ ...position ]} rotation={[ ...rotation ]}>
    <RigidBody>
        <MeshCollider
            type="trimesh"
            friction={ 0.125 }
            restitution={ 1.0 }
        >
        <mesh
            rotation={[ 0, Math.PI / 2, 0 ]}
            position={[ 0, 0, 0 ]}
        >
            <torusGeometry args={[
                    // Radius
                    0.4, 
                    // Tube
                    0.1, 
                    // Radial Segments
                    24, 
                    // Tubular Segments
                    48, 
                    // Arc
                    Math.PI * 2
            ]} />
            <meshStandardMaterial color="blue" />
        </mesh>
        </MeshCollider>
        <MeshCollider type="hull">
        <mesh
            position={[ 0.0, -0.85, 0 ]}
            scale={ 0.3 }
        >
            <sphereGeometry />
            <meshStandardMaterial color={ charmColor } />
        </mesh>
        </MeshCollider>
    </RigidBody>
    </group>
    </>)
}

const Ring = ({ position, rotation }) => {
    return (<>
    <mesh position={[ ...position ]} rotation={[ ...rotation ]} scale={[ 0.5, 0.5, 1.25 ]}>
        <torusGeometry args={[ 0.4, 0.075, 24, 48, Math.PI * 2 ]} />
        <meshStandardMaterial />
    </mesh>
    </>)
}
export default function PhysicsExperiement() {
    const { nodes, materials } = useGLTF("./models/temp-bracelet.gltf");
    // const rod = useRef()
    const circlet = useRef()
    const circletGeometry = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, (time * 0.5), Math.sin(time) * 0.3))
        // circlet.current.setNextKinematicRotation(rotation)
        // circletGeometry.current.rotation.z += 0.1
        // circletGeometry.current.rotation.set([ 
        //     circletGeometry.current.rotation._x += 0.1, 
        //     circletGeometry.current.rotation._y += 0.1, 
        //     circletGeometry.current.rotation._z += 0.1 
        // ])

    })

 
    const renderRings = () => {
        let elements = []
        let radius = 1.0
        for (let i = 0; i < 22; i++) {
            elements.push(<Ring 
                position={[
                    Math.sin(i * 2) * radius,
                    0,
                    Math.cos(i * 2) * radius
                ]}
                rotation={[ 
                    i % 2 === 0 ? Math.PI / 2 : 0,
                    i % 2 === 0 ? 0 : Math.PI + i * 2,
                    0
                ]} 
            />)
        }

        return elements.map(el => {
            return <group scale={ 2.0 }>{ el }</group>
        })
    }

    return (<>
        <OrbitControls />
        <Perf />
        <Physics debug={ false } paused={ false }>
        {/* <group 
            dispose={null} 
            scale={ 1.42 } 
            rotation={[ 0, 0, 0 ]} 
            position={[ 0.25, 0, 0 ]}
            ref={ circletGeometry }
        >
                <mesh
                    castShadow
                    geometry={nodes.Bracelet.geometry}
                    material={nodes.Bracelet.material}
                >  
                    <meshStandardMaterial 
                        color={ 0xff0000 } 
                        metalness={ 1 }
                        roughness={ 0.2 }
                    />

                </mesh>
                <mesh
                    castShadow
                    geometry={nodes.T_Clasp.geometry}
                    material={nodes.T_Clasp.material}
                    position={[-0.144, 0.029, 0.032]}
                    rotation={[0.003, 0.005, 0.002]}
                    scale={[50.001, 50, 50]}
                >
                    <meshStandardMaterial 
                        color={ 0xff0000 } 
                        metalness={ 1.0 }
                        roughness={ 0.2 }
                    />
                </mesh>
        </group> */}
        <group>
        { renderRings() }
        </group>
        <RigidBody
            ref={ circlet }
            type="kinematicPosition"
        >
        <MeshCollider
            type="trimesh"
            friction={ 1.0 }
        >
        <mesh
            rotation={[ Math.PI / 2, 0, 0 ]}
            position={[ 0, 0, 0 ]}
        >
            <torusGeometry args={[
                2.0,
                0.1,
                24,
                48
            ]} />
            <meshStandardMaterial transparent={ true } opacity={ 0.25 } />
        </mesh>
        </MeshCollider>
        </RigidBody>

        </Physics>
    </>)
}

useGLTF.preload('./models/temp-bracelet.gltf')