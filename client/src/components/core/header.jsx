
export default function Header() {
    async function share() {
        const shareData = {
            title: "Chase Atlantic",
            text: "E-Friendship Bracelet",
            url: "https://chaseatlantic.com",
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully")
            } catch (err) {
                console.log(`Error: ${err}`)
            }
         } else {
            // do something else like copying the data to the clipboard
            console.log(`Can't share in this browser`)
         }
    }

    function openMenu() {
        window.open('https://found.ee/ca-mamacita')
    }

    function openWebsite() {
        window.open('https://chaseatlantic.com')
    }

    return (<>
        <div className="flex justify-between w-full items-center p-4 relative z-10">
            {/* Share Icon */}
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:cursor-pointer" onClick={ share }>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>  
            </div>
            <div className="m-auto">
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="208.6" height="9.8" viewBox="0 0 596 28" fill="none" onClick={ openWebsite } className="hover:cursor-pointer">
                <path d="M35.0636 11.7075C34.5736 8.47159 31.579 6.72637 26.461 6.72637C19.9275 6.72637 16.3884 9.23513 16.3884 13.8163C16.3884 18.3975 19.9275 20.8699 26.461 20.8699C31.1435 20.8699 34.0836 19.4519 35.0092 16.616H52.5954C51.0165 23.815 42.1417 27.6327 26.461 27.6327C8.92924 27.6327 0 22.906 0 13.8163C0 4.72664 8.92924 0 26.461 0C42.9039 0 51.9421 4.21762 52.4865 11.7075H35.0636Z" fill="white"/>
                <path d="M53.9196 26.9418V0.690816H69.1646V9.78051H86.5331V0.690816H101.778V26.9418H86.5331V16.3251H69.1646V26.9418H53.9196Z" fill="white"/>
                <path d="M100.151 26.9418L117.192 0.690816H136.521L152.419 26.9418H135.922L134.615 24.3604H117.9L116.485 26.9418H100.151ZM121.494 17.8885H131.24L126.503 8.65339L121.494 17.8885Z" fill="white"/>
                <path d="M148.408 18.9429H166.865C167.137 20.3246 169.533 21.1608 173.725 21.1608C177.809 21.1608 179.878 20.5427 179.878 19.2701C179.878 18.143 178.081 17.4886 174.433 17.1977L163.054 16.2524C153.635 15.4888 148.843 12.8346 148.843 8.43524C148.843 2.43604 156.139 0 171.493 0C187.5 0 195.559 2.4724 196.212 8.32616H178.517C178.136 6.69001 175.577 5.8174 170.84 5.8174C167.246 5.8174 165.341 6.54458 165.341 7.56262C165.341 8.7261 167.246 9.05333 171.166 9.41692L185.05 10.7258C193.707 11.5621 198.009 14.0708 198.009 18.3975C198.009 24.9785 189.352 27.7417 171.275 27.7417C156.357 27.7417 148.517 24.5058 148.408 18.9429Z" fill="white"/>
                <path d="M199.779 26.9418V0.690816H241.431V7.12632H215.024V10.2532H236.422V16.725H215.024V20.1791H242.737V26.9418H199.779Z" fill="white"/>
                <path d="M259.041 26.9418L276.083 0.690816H295.411L311.31 26.9418H294.813L293.506 24.3604H276.791L275.375 26.9418H259.041ZM280.384 17.8885H290.13L285.393 8.65339L280.384 17.8885Z" fill="white"/>
                <path d="M317.48 26.9418V7.34447H303.27V0.690816H346.99V7.34447H332.725V26.9418H317.48Z" fill="white"/>
                <path d="M347.025 26.9418V0.690816H362.27V19.7428H386.281V26.9418H347.025Z" fill="white"/>
                <path d="M383.845 26.9418L400.887 0.690816H420.215L436.114 26.9418H419.616L418.31 24.3604H401.595L400.179 26.9418H383.845ZM405.188 17.8885H414.934L410.197 8.65339L405.188 17.8885Z" fill="white"/>
                <path d="M434.498 26.9418V0.690816H452.52L467.71 15.8161V0.690816H482.465V26.9418H465.369L448.872 11.5621V26.9418H434.498Z" fill="white"/>
                <path d="M496.735 26.9418V7.34447H482.524V0.690816H526.245V7.34447H511.98V26.9418H496.735Z" fill="white"/>
                <path d="M526.28 26.9418V0.690816H541.525V26.9418H526.28Z" fill="white"/>
                <path d="M578.468 11.7075C577.978 8.47159 574.984 6.72637 569.866 6.72637C563.332 6.72637 559.793 9.23513 559.793 13.8163C559.793 18.3975 563.332 20.8699 569.866 20.8699C574.548 20.8699 577.488 19.4519 578.414 16.616H596C594.421 23.815 585.546 27.6327 569.866 27.6327C552.334 27.6327 543.405 22.906 543.405 13.8163C543.405 4.72664 552.334 0 569.866 0C586.309 0 595.347 4.21762 595.891 11.7075H578.468Z" fill="white"/>
                </svg> */}
                <img src="/images/chaselogo_400x.avif" className="w-56" />
            </div>
            {/* Menu Icon */}
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:cursor-pointer" onClick={ openMenu }>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

            </div>
        </div>
    </>)
}