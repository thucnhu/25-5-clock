import React from 'react'
import "./SetTime.css"

export default function SetTime({ label, duration, increment, decrement }) {
    return (
        <div>
            <p className="label">{label}</p>
            <div className="time-adjustment">
                <i class="fas fa-arrow-down" onClick={() => decrement(label)} />
                <p>{duration}</p>
                <i class="fas fa-arrow-up" onClick={() => increment(label)} />
            </div>
        </div>
    )
}