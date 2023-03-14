import { WeatherResponse } from '@/interfaces'
import Image from 'next/image'
import React from 'react'
import Clock from '../Clock'


const Display: React.FC<WeatherResponse> = ({ weather, airQuality }) => {
    return (
        <section className='flex flex-col lg:flex-row gap-4 w-full text-white'>
            <section className='flex relative flex-col flex-1 h-full gap-8 p-4 rounded-lg shadow-lg backdrop-blur-lg bg-sky-800 bg-opacity-50 text-center'>
                <Image src="/clouds.jpg" className='rounded-lg z-0 opacity-25 backdrop-brightness-50' fill alt="weather background" />
                <div className='relative flex flex-col flex-1 h-full gap-8 '>
                    <div className='flex flex-col gap-3 text-3xl pt-8'>
                        <span>{weather?.locale}, {weather?.weather_description}</span>
                        <span className='text-6xl font-bold'>{weather?.temp.current} &deg;C</span>
                        <span className='flex gap-4 w-full justify-center'>
                            <span>min: {weather?.temp.min} &deg;C</span>
                            |
                            <span>max: {weather?.temp.max} &deg;C</span>
                        </span>
                    </div>
                    <Clock />
                    <div className='flex gap-3 w-full'>
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-40 backdrop-blur-lg text-center shadow-lg'>
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
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-40 backdrop-blur-lg text-center shadow-lg'>
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
                        <div className='flex items-center justify-center p-3 gap-3 rounded-md flex-1 bg-sky-500 bg-opacity-40 backdrop-blur-lg text-center shadow-lg'>
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
            <div className='flex flex-col flex-1 gap-4'>
                <div className='flex justify-center gap-4'>
                    <section className='w-full p-4 rounded-md bg-sky-800'>
                        <span className='flex items-center justify-center gap-3'> <Image src="/icons/air-quality-icon.svg" width={30} height={30} alt="air quality icon" />Qualidaded do ar</span>
                    </section>
                    <section className='w-full p-4 rounded-md bg-sky-800'>
                        {weather?.wind.speed}
                    </section>
                </div>
                <section className='row-start-3 row-end-5 row-span-2 col-span-2 p-4 rounded-md bg-sky-800'>

                </section>
            </div>
        </section>
    )
}

export default Display