import React, { useState, useEffect } from 'react'
import "./App.css"
import { SetTime, Timer } from "./"


export default function App() {
    const defaultSessionDuration = 25 * 60
    const defaultBreakDuration = 5 * 60

    const [breakDuration, setBreakDuration] = useState(defaultBreakDuration)
    const [sessionDuration, setSessionDuration] = useState(defaultSessionDuration)
    const [timeRemaining, setTimeRemaining] = useState(defaultSessionDuration)
    const [pause, setPause] = useState(true)
    const [onBreak, setOnBreak] = useState(false)
    const sound = new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav")

    const [hovered1, setHovered1] = useState(false)
    const [hovered2, setHovered2] = useState(false)

    function timeFormat(time) {
        let minutes = Math.floor(time / 60)
        let seconds = time % 60

        return (minutes < 10 ? "0" + minutes : minutes) + ":" +
                (seconds < 10 ? "0" + seconds : seconds)
    }

    function increment(label) {
        if (pause) {
            if (label === "Break Length")
                setBreakDuration(prevDuration => prevDuration + 60)
            
            if (label === "Session Length") {
                setSessionDuration(prevDuration => prevDuration + 60)
                if (timeRemaining !== sessionDuration)
                    setTimeRemaining(sessionDuration - 60)
                else setTimeRemaining(prevTime => prevTime + 60)
            }
        }
    }

    function decrement(label) {
        if (pause) {
            if (label === "Break Length" && breakDuration > 60)
                setBreakDuration(prevDuration => prevDuration - 60)
            
            if (label === "Session Length" && sessionDuration > 60) {
                setSessionDuration(prevDuration => prevDuration - 60)
                if (timeRemaining !== sessionDuration)
                    setTimeRemaining(sessionDuration - 60)
                else setTimeRemaining(prevTime => prevTime - 60)
            }
        }
    }

    function controlTimer() {
        let date = new Date().getTime()
        let nextDate = new Date().getTime() + 1000

        if (pause) {
            let interval = setInterval(() => {
                date = new Date().getTime()

                if (date > nextDate) {
                    setTimeRemaining(prevTime => {
                        if (prevTime <= 0 && !onBreak) {
                            sound.play()
                            setOnBreak(true)
                            return breakDuration
                        } else if (prevTime <= 0 && onBreak) {
                            sound.play()
                            setOnBreak(false)
                            return sessionDuration
                        }

                        return prevTime - 1
                    })
                    nextDate += 1000
                }
            }, 30)
            localStorage.clear()
            localStorage.setItem("interval-id", interval)
        } else {
            clearInterval(localStorage.getItem("interval-id"))
        }

        setPause(!pause)
    }

    function resetTimer() {
        setPause(true)
        setTimeRemaining(defaultSessionDuration)
        setBreakDuration(defaultBreakDuration)
        setSessionDuration(defaultSessionDuration)
    }

    return (
        <div className="app">
            <h1>Pomodoro Timer</h1>
            <div className="break-session">
                <SetTime 
                    label="Break Length" 
                    duration={timeFormat(breakDuration)} 
                    increment={increment}
                    decrement={decrement}
                />
                <SetTime 
                    label="Session Length" 
                    duration={timeFormat(sessionDuration)}
                    increment={increment}
                    decrement={decrement}
                />
            </div>

            <div className="timer-box">
                <p>Session</p>
                <p className="time">{timeFormat(timeRemaining)}</p>
            </div>

            <div className="icons" onClick={controlTimer}>
                { // display icons based on the pause state
                    pause ? 
                    <i
                        class={(hovered1 ? "fas" : "far") + " fa-lg fa-play-circle"} 
                        onMouseEnter={() => setHovered1(true)}
                        onMouseLeave={() => setHovered1(false)}
                    /> :
                    <i 
                        class={(hovered2 ? "fas" : "far") + " fa-lg fa-pause-circle"} 
                        onMouseEnter={() => setHovered2(true)}
                        onMouseLeave={() => setHovered2(false)}
                    />
                }
                <i class="fa-lg fas fa-undo-alt" onClick={resetTimer} />
            </div>
        </div>
    )
}