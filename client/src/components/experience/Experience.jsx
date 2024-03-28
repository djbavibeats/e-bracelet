import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Backdrop, Stage } from '@react-three/drei'
import * as THREE from 'three'
import { RigidBody, Physics } from '@react-three/rapier'
import { useControls } from 'leva'

export default function FriendshipBracelet(props) {
    const [ materialColor, setMaterialColor ] = useState('blue')
  const { nodes, materials } = useGLTF("./models/temp-bracelet.gltf");
    const bracelet = useRef()
    const charm = useRef()
    const braceletPhysics = useRef()
    const { gl } = useThree()

    useFrame((state) => {

        const time = state.clock.getElapsedTime()
        if (time > 2) {
            const eulerRotation = new THREE.Euler(0, (time - 2) * 0.5, 0)
            const quaternionRotation = new THREE.Quaternion()
            quaternionRotation.setFromEuler(eulerRotation)
            bracelet.current.setNextKinematicRotation(quaternionRotation)
        }
    })
    useFrame(() => {
        // bracelet.current.rotation.z += 0.01
        // braceletRotation.y += 0.01
    })

    useEffect(() => {
        setMaterialColor('#d0cece')
    }, [])

    useEffect(() => {
        props.childFunc.current = alertUser
    }, [ props.childFunc.current ])

    function alertUser() {
        shareCanvas()
    }

    /**
     * Share Functions
     */
    function mergeImageURIs(images) {
        return new Promise( (resolve, reject) => {
            var canvas = document.createElement('canvas')
            canvas.width = 750
            canvas.height = 1050
            Promise.all(images.map((imageObj, index) => add2Canvas(canvas, imageObj)))
                .then(() => { 
                    resolve(canvas.toDataURL('image/png'), reject) 
                })
        })
    }

    function add2Canvas(canvas, imageObj) {
        return new Promise( (resolve, reject ) => {
            if (!imageObj || typeof imageObj != 'object') return reject()
            var x = imageObj.x && canvas.width ? (imageObj.x >= 0 ? imageObj.x : canvas.width + imageObj.x) : 0
            var y = imageObj.y && canvas.height ? (imageObj.y >=0 ? imageObj.y : canvas.height + imageObj.y) : 0
            var image = new Image()
            image.onload = function() {
                canvas.getContext('2d').drawImage(this, x, y, imageObj.width, imageObj.height)

                // Draw Name
                canvas.getContext('2d').font = "24px Eurostile"
                canvas.getContext('2d').fillText(`${props.user.displayName.toUpperCase()}`, 190, 75)

                // Draw Number of Misisons
                canvas.getContext('2d').font = "24px Eurostile"
                canvas.getContext('2d').fillText(`${props.missionsCompleted} / 5 MISSIONS COMPLETED`, 85, 595)
                resolve()
            }
            image.src = imageObj.src
        })
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(","),
            mimeType = arr[0].match(/:(.*?);/)[1],
            decodedData = atob(arr[1]),
            lengthOfDecodedData = decodedData.length,
            u8array = new Uint8Array(lengthOfDecodedData)
        while (lengthOfDecodedData--) {
            u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData)
        }
        return new File([u8array], filename, { type: mimeType })
    }

    function shareCanvas() {
        // Three JS Canvas Image
        var braceletimg = new Image()
        braceletimg.style.border = "2px solid blue"
        braceletimg.src = gl.domElement.toDataURL()

        // Pokemon Card Template Image
        var cardimg = new Image()
        cardimg.src = './images/pokemon-template.png'

        var images = [
            { src: braceletimg.src, x: 125, y: 75, width: 500, height: 500 },
            { src: cardimg.src, x: 0, y: 0, width: 750, height: 1050 }
        ]

        mergeImageURIs(images)
            .then(resp => {
                var test = new Image
                test.src = resp

                // Method 1: Download the image from browser
                /*
                var link = document.createElement('a')
                link.href = test.src
                link.download = `${props.user.displayName}-e-bracelet.png`
                link.click()
                */

                // Method 2: Share image using Navigator Share API
                 
                const file = [ dataURLtoFile(test.src, `${props.user.displayName}-E-BRACELET.png`) ]
                share("E-Friendship Bracelet", file)
                
                
                // Method 3: Open the image in a new tab
                /*
                var w = window.open("");
                w.document.write(test.outerHTML);
                */
                
            })
    }

    const share = async (title, file) => {
        const data = {
            files: file
        }
        try {
            if (!(navigator.canShare(data))) {
                throw new Error("Cannot share data.", data)
            }
            await navigator.share(data)
        } catch (err) {
            console.log(err.name, err.message)
        }
    }
    // End Share Functions

    const { braceletPosition, braceletScale, braceletRotation } = useControls('Bracelet', {
        braceletPosition:
        {
            value: { x: 0, y: 0, z: 0.5 },
            step: 0.01
        },
        braceletScale:
        {
            value: 0.15,
            step: 0.01
        },
        braceletRotation:
        {
            value: { x: 1.9, y: 0, z: 0 },
            step: 0.1
        }
    })

    const { charmPosition, charmScale, charmRotation } = useControls('Charm', {
        charmPosition: {
            value: { x: -1.39, y: 0.17, z: 0 },
            step: 0.01
        },
        charmScale: {
            value: 0.05,
            step: 0.01
        },
        charmRotation:
        {
            value: { x: 0, y: 0.0, z: 0 },
            step: 0.1
        }
    })
    return (<>
        <OrbitControls />
        <directionalLight 
            castShadow
            intensity={ 15 }
        />
        {/* <pointLight 
            position={[ 0.0, -0.5, -1.0 ]}
            intensity={ 5.0 }
            castShadow
        /> */}
        <ambientLight intensity={ 0.4 } />
        <Physics  debug>
            {/* <group castShadow ref={ bracelet } {...props} dispose={null} scale={ 1.125 } rotation={[ -.125, 0, 0.125 ]} position={[ 0, 0, 0.5 ]}>
                <mesh
                    castShadow
                    geometry={nodes.Bracelet.geometry}
                    material={nodes.Bracelet.material}
                >  
                    <meshStandardMaterial 
                        color={ materialColor } 
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
                        color={ materialColor } 
                        metalness={ 1.0 }
                        roughness={ 0.2 }
                    />
                </mesh>
            </group> */}
            <RigidBody 
                ref={ bracelet }
                colliders="trimesh" 
                friction={ 0 }
                type="kinematicPosition" 
            >
            <mesh 
                castShadow
                scale={ braceletScale } 
                // rotation={[ Math.PI / 2 - .125, 0, 0.125 ]} 
                rotation={[ braceletRotation.x, braceletRotation.y, braceletRotation.z ]}
                position={[ braceletPosition.x, braceletPosition.y, braceletPosition.z ]}
            >
                <torusGeometry args={[ 
                    // Radius
                    10, 
                    // Tube
                    0.75, 
                    // Radial Segments
                    16, 
                    // Tubular Segments
                    16, 
                    // Arc
                    Math.PI * 2 
                ]} 
                />
                <meshStandardMaterial 
                    color={ materialColor } 
                    metalness={ 1.0 } 
                    roughness={ 0.2 } 
                />
            </mesh>
            </RigidBody>
            <RigidBody 
                colliders="trimesh" 
                ref={ charm }
            >     
            <mesh 
                castShadow
                scale={ charmScale } 
                // rotation={[ Math.PI / 2 - .125, 0, 0.125 ]} 
                rotation={[ charmRotation.x, charmRotation.y, charmRotation.z ]}
                position={[ charmPosition.x, charmPosition.y, charmPosition.z ]}
            >
                <torusGeometry args={[ 
                    // Radius
                    10, 
                    // Tube
                    0.5, 
                    // Radial Segments
                    16, 
                    // Tubular Segments
                    16, 
                    // Arc
                    Math.PI * 2 
                ]} 
                />
                <meshStandardMaterial 
                    color={ materialColor } 
                    metalness={ 1.0 } 
                    roughness={ 0.2 } 
                />
            </mesh>
            </RigidBody>

        <RigidBody type="fixed">
        <mesh receiveShadow rotation-x={ - Math.PI / 2 } scale={ 10 } position={[ 0, -1, 0 ]}>
            <planeGeometry />
            <meshStandardMaterial color="#000000" />
        </mesh>
        </RigidBody>
        </Physics>
    </>)
}

useGLTF.preload('./models/temp-bracelet.gltf')