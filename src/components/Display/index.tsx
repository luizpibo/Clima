import { WeatherResponse } from '@/interfaces'
import Image from 'next/image'
import React from 'react'
import Clock from '../Clock'


const Display: React.FC<WeatherResponse> = ({ weather, airQuality, daily }) => {
    return (
        <div className='flex flex-col lg:flex-row gap-4 w-full text-white'>
            <section className='relative text-center shadow-xl rounded-lg'>
                <Image src="/clouds.jpg" className='rounded-lg z-0 opacity-60' fill alt="weather background" />
                <div className='relative flex flex-col flex-1 h-full gap-8 bg-sky-800 bg-opacity-30 backdrop-blur-sm p-4 rounded-lg'>
                    <div className='flex flex-col gap-3 text-3xl pt-8'>
                        <span>{weather?.locale}, {weather?.weather_description}</span>
                        <span className='flex justify-center items-start text-6xl font-bold'>{weather?.temp.current} <span className='text-2xl font-normal'>&deg;C</span></span>
                        <span className='flex gap-4 w-full justify-center'>
                            <span>min: {weather?.temp.min} &deg;C</span>
                            |
                            <span>max: {weather?.temp.max} &deg;C</span>
                        </span>
                    </div>
                    <Clock />
                    <div className='flex gap-3 w-full'>
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-10 backdrop-blur-sm text-center shadow-lg'>
                            <div className='flex justify-center gap-3'>
                                <Image src="/icons/wind-icon.svg" width={45} height={45} alt="wind icon" />
                                <div>
                                    <span className='text-base font-light'>
                                        Vento
                                    </span><br />
                                    <span className='text-2xl font-semibold'>
                                        {weather?.wind.speed} <span className='text-xl'>km/h</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-10 backdrop-blur-sm text-center shadow-lg'>
                            <Image src="/icons/humidity-icon.svg" width={45} height={45} alt="wind icon" />
                            <div>
                                <span className='text-base font-light'>
                                    Umidade
                                </span> <br />
                                <span className='text-2xl font-semibold'>
                                    {weather?.temp.humidity} %
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-10 backdrop-blur-sm text-center shadow-lg'>
                            <Image src="/icons/clouds-icon.svg" width={45} height={45} alt="wind icon" />
                            <div>
                                <span className='text-base font-light'>
                                    Nuvens
                                </span> <br />
                                <span className='text-2xl font-semibold'>
                                    {weather?.clouds} %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='flex flex-col flex-1 gap-4'>
                <div className='flex justify-center gap-4'>
                    <section className='flex flex-col gap-4 w-full p-4 rounded-md bg-gradient-to-r from-sky-600 to-sky-500 shadow-xl'>
                        <span className='flex items-center justify-center gap-3'> <Image src="/icons/air-quality-icon.svg" width={30} height={30} alt="air quality icon" />Qualidaded do ar</span>
                        {airQuality ? (
                            <>
                                <div>{airQuality.aqi}</div>
                                <div className='flex gap-4 text-sm p-2 backdrop-blur-lg bg-sky-700 bg-opacity-50 rounded-lg'>{Object.keys(airQuality.list).map((key, i) => {
                                    return (<div className='font-medium'>{airQuality.list[key]} <span className='font-light'>{key}</span></div>)
                                })}</div>
                            </>
                        ) : (
                            <div>

                            </div>
                        )}

                    </section>
                    <section className='w-full p-4 rounded-md bg-gradient-to-l from-sky-600 to-sky-500 '>
                        {weather?.wind.speed}
                    </section>
                </div>
                <section className='flex justify-center items-center gap-8 p-4 rounded-md bg-gradient-to-t h-full from-sky-600 to-sky-500 '>
                    {daily.map((day) => {
                        return (
                            <div className='grid gap-4'>
                                <span>{day.day}</span>
                                <span>icon</span>
                                <span>{day.description}</span>
                                <div className='flex gap-3'><span>{day.min} &deg;</span> <span>{day.max} &deg;</span></div>
                            </div>
                        )
                    })}
                </section>
            </section>
        </div>
    )
}

export default Display