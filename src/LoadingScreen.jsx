import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const duration = 2200
        const start = performance.now()

        let frameId
        let exitTimer
        let removeTimer

        const animate = (now) => {
            const elapsed = Math.min((now - start) / duration, 1)

            // Smooth ease-out progress from 0 to 100
            const eased = 1 - Math.pow(1 - elapsed, 3)
            const nextProgress = Math.min(
                100,
                Math.floor(eased * 100)
            )

            setProgress(nextProgress)

            if (elapsed < 1) {
                frameId = requestAnimationFrame(animate)
            } else {
                setProgress(100)

                // Brief pause at 100% before the curtain moves
                exitTimer = setTimeout(() => {
                    setLeaving(true)

                    // Remove the loader after the swipe animation
                    removeTimer = setTimeout(() => {
                        setVisible(false)
                    }, 1250)
                }, 250)
            }
        }

        frameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(frameId)
            clearTimeout(exitTimer)
            clearTimeout(removeTimer)
        }
    }, [])

    if (!visible) return null

    return (
        <div
            className={`loading-screen${leaving ? ' loading-screen--leaving' : ''}`}
            role="status"
            aria-label={`Loading portfolio: ${progress}%`}
        >
            <div className="loader-brand">TY.</div>

            <div className="loader-center">
                <div className="loader-orbit">
                    <span className="loader-dot" />
                </div>

                <p className="loader-label">WELCOME TO MY WORLD</p>

                <h1 className="loader-title" aria-label="tyG">
                    <span className="letter" aria-hidden="true">t</span>
                    <span className="letter" aria-hidden="true">y</span>
                    <span className="letter" aria-hidden="true">G</span>
                    <span className="title-dot" aria-hidden="true">.</span>
                </h1>

                <p className="loader-subtitle">
                    Building my next decade.
                </p>
            </div>

            <div className="loader-bottom">
                <span>{String(progress).padStart(3, '0')}%</span>
            </div>

            <div className="loader-track">
                <div
                    className="loader-progress"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}