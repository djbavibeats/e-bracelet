import { useRef, useMemo, useState } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
// import { useControls } from 'leva'
import { useEffect } from 'react'

const ShaderObjectMaterial = shaderMaterial(
    {
        uTime: 0
    },
    // VertexShader
    /*glsl*/`
    uniform float u_time;

    varying vec2 vUv;
    
    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        modelPosition.y += sin(modelPosition.x * 4.0 + u_time * 2.0) * 0.2;
    
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        
        gl_Position = projectedPosition;

        vUv = uv;
    }
    `,
    // FragmentShader
    /*glsl*/`
    varying vec2 vUv;

    uniform float u_red;
    uniform float u_blue;
    uniform float u_green;
    
    void main() {
      gl_FragColor = vec4(vUv.x * u_red, vUv.y * u_blue, u_green, 1.0);
    }
    `
)
extend({ ShaderObjectMaterial })

export default function ShaderObject({ zeroCount, oneCount, twoCount }) {
    const mesh = useRef()
    // const { rotation } = useControls({
    //     rotation: {
    //         value: { x: - 0.75, y: - 0.35, z: - 0.75 },
    //         step: 0.01
    //     }
    // })

    
    
    const uniforms = useMemo(
        () => ({
            u_time: { value: 0.0, },
            u_red: { value: 0.0 },
            u_blue: { value: 0.0 },
            u_green: { value: 0.0 }

        }), []
    )

    useFrame((state, delta) => {
        const { clock } = state
        mesh.current.material.uniforms.u_time.value = clock.getElapsedTime()
        mesh.current.material.uniforms.u_red.value = zeroCount * 0.1
        mesh.current.material.uniforms.u_blue.value = oneCount * 0.1
        mesh.current.material.uniforms.u_green.value = twoCount * 0.1
    })  

    return <>
        <mesh ref={ mesh } position={[ -0.5, 0.95, 0 ]} rotation={[ - 0.75, - 0.35, - 0.75 ]} scale={ 5.0 }>
            <planeGeometry args={[ 1, 1, 32, 32 ]} />
            <shaderObjectMaterial 
                uniforms={ uniforms }
                wireframe={ true }
            />
        </mesh>
    </>

}