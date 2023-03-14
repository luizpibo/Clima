import moment from 'moment'
import React, { useEffect, useState } from 'react'

const Clock = () => {
    const [time, setTime] = useState<string>()

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setTime(date.toLocaleTimeString())
        }, 1000)
    }, [])

    return (
        <div className='text-3xl my-8'>{time ? time : "carregando..."}</div>
    )
}
export default Clock
