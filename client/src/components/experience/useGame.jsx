import { create } from 'zustand'

export default create((set) => {
    return {
        phase: 'playing',
        start: () => {
            set(() => {
                return { phase: 'playing' }
            })
        },
        stop: () => {
            set(() => {
                return { phase: 'paused' }
            })
        }
    }
})