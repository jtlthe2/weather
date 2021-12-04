import React from 'react'

export default function WeatherCondition(props) {
    return (
        <div>
            <p>{props.weatherCondition.main}–{props.weatherCondition.description}</p>
        </div>
    )
}
