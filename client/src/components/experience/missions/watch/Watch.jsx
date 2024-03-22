import YouTube from "react-youtube"
import { useEffect } from "react"

export default function Watch() {
    useEffect(() => {
        console.log('Rendering Watch Mission')
        return () => { console.log('Unmounting Watch Mission') }
    }, [])

    return (<>
        <div className="flex items-center flex-col px-2 w-full">
        <YouTube 
            videoId="Ppu8TB3Mc-Q"
            opts={{
                width: "325",
                height: "325"
            }}
            onPlay={() => {
                console.log('video playing')
            }}
            onPause={() => {
                console.log('video paused')
            }}    
            onEnd={() => {
                alert('you finished the video!')
            }}
        />
        </div>
    </>)
}