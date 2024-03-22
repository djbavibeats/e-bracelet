import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import questions from './questions.js'

import ShaderObject from './ShaderObject.jsx'

export default function Create() {
    const [ page, setPage ] = useState(0)
    const [ update, setUpdate ] = useState(false)
    const [ color, setColor ] = useState(null)
    const [ userSelections, setUserSelections ] = useState(questions)
    const [ zeroCount, setZeroCount ] = useState(0)
    const [ oneCount, setOneCount ] = useState(0)
    const [ twoCount, setTwoCount ]= useState(0)
    // const zero = useRef()
    // const one = useRef()
    // const two = useRef()

    useEffect(() => {
        console.log('Rendering Create Mission')
        return () => { 
            console.log('Unmounting Create Mission')
        }
    }, [])
    
    useEffect(() => {
        setZeroCount(userSelections.filter(question => question.selection === 0).length)
        setOneCount(userSelections.filter(question => question.selection === 1).length)
        setTwoCount(userSelections.filter(question => question.selection === 2).length)
    }, [ update ])

    useEffect(() => {
        // gsap.to(zero.current, { opacity: zeroCount / 11 })
        // gsap.to(one.current, { opacity: oneCount / 11 })
        // gsap.to(two.current, { opacity: twoCount / 11 })
    }, [ zeroCount, oneCount, twoCount ])
    
    function handleRadioChange(questionIndex, answerIndex) {
        let copy = userSelections
        copy[questionIndex].selection = answerIndex
        setUserSelections(copy)
        setUpdate(!update)
    }

    function incrementPage() {
        setPage(page + 1)
    }

    function decrementPage() {
        setPage(page - 1)
    }

    function getResults() {

    }
    return (<>
        <div className="items-center flex-col flex px-2 w-full relative">
            <div className="w-full">
                {/* Question Title */}
                { questions.map((question, index) => {
                    { if (index === page) {
                        return <div key={ index } className="text-center my-2">
                            <p className="font-eurostile p-2 uppercase">{ question.title }</p>
                        </div>
                    }}
                }) }
                {/* Progress Indicator */}
                <div className="h h-80 w-80 m-auto relative"> 
                    {/* <div ref={ zero } className="count-region zero absolute p-2 border-2 rounded-[100%] top-[10%] left-1/4 w-1/2 h-1/2 flex items-center justify-center">
                        Zero: { zeroCount }
                    </div>
                    <div ref={ one } className="count-region one absolute p-2 border-2 rounded-[100%] bottom-[10%] left-[10%] w-1/2 h-1/2 flex items-center justify-center">
                        One: { oneCount }
                    </div>
                    <div ref={ two } className="count-region two absolute p-2 border-2 rounded-[100%] bottom-[10%] right-[10%] w-1/2 h-1/2 flex items-center justify-center">
                        Two: { twoCount }
                    </div> */}
                    <Canvas>
                        <ambientLight intensity={ 1.0 } color={ '#ffffff'}  />
                        <ShaderObject 
                            zeroCount={ zeroCount }
                            oneCount={ oneCount }
                            twoCount={ twoCount }
                        />
                    </Canvas>
                    { questions.map((question, index) => {
                        { if (index === page) {
                            return <p key={ index }>{ index += 1 } / 11</p>
                        }}
                    })}
                </div>
                {/* Question Body */}
                { questions.map((question, questionIndex) => {
                    { if (questionIndex === page) { 
                        return <div key={ questionIndex } className="w-full p-2 uppercase mb-2">
                            {/* Title */}
                            {/* <div>{ question.title }</div> */}
                            {/* Question */}
                            <div className="font-eurostile text-[9px] text-center my-4">{ question.question }</div>
                            {/* Answers */}
                            <div className="flex flex-col">
                                { question.answers.map((answer, answerIndex) => {
                                    return <div key={ answerIndex }>
                                        <input type="radio"
                                            className="mr-2 border-2 border-color-red-500 invisible"
                                            value={ answerIndex }
                                            name={ question.title }
                                            key={ answerIndex }
                                            id={ `question${questionIndex}-${answerIndex}` }
                                            checked={ userSelections[questionIndex].selection === answer.weight }
                                            onChange={ () => handleRadioChange(questionIndex, answerIndex) }
                                        />
                                        <label htmlFor={ `question${questionIndex}-${answerIndex}` } className="hover:cursor-pointer font-eurostile text-[9px] text-center p-2 border-2 border-white mb-2">{ answer.copy }</label>
                                    </div>
                                })}
                            </div>
                        </div>
                    }
                    }
                }) }
            </div>
            <div className="flex w-full justify-between items-stretch space-between mb-4">
                { page !== 0 ? <button className="font-eurostile text-[9px] text-center w-28 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ decrementPage }>PREVIOUS</button> : <div></div> }
                { page !== 10 ? <button className="font-eurostile text-[9px] text-center w-28 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ incrementPage }>NEXT</button> : null }
                { page === 10 ? <button className="font-eurostile text-[9px] text-center w-28 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer" onClick={ getResults }>GET RESULTS</button> : null }
            </div>
            {/* <div className="text-center w-40 border-2 border-white py-1 px-1 rounded-full bg-[rgba(0,0,0,0.075)] hover:cursor-pointer mb-2" onClick={ handleSubmit }>
                <p className="font-eurostile text-[9px] text-center">SUBMIT</p>
            </div> */}
        </div>
    </>)    
}