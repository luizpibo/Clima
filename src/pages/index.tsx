import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import WeatherService from '../services'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [weatherState, setWeatherState] = useState({})
  const [lodding, setLodding] = useState(true)
  const [geoLocation, setGeoLocation] = useState(false)

  useEffect(() => {
    const allowed = async () => {
      return await navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        const geoLocationPermissionState = result.state
        if (geoLocationPermissionState != 'denied') {
          let weatherRaw = localStorage.getItem("weather")
          if (weatherRaw) {
            const weather = JSON.parse(weatherRaw)
            //If current time is before weather time plus 5 minutes
            if ((weather.time + (1000 * 300) > new Date().getTime())) {
              setWeatherState(weather)
            } else {
              navigator.geolocation.getCurrentPosition(async (location) => {
                setGeoLocation(true)
                const lat = location.coords.latitude
                const log = location.coords.longitude
                await WeatherService.getWeatherByCordinates(String(lat), String(log)).then(result => {
                  localStorage.setItem("weather", JSON.stringify({ ...result, time: new Date().getTime() }))
                  setWeatherState(result)
                })
              });
            }
          } else {
            navigator.geolocation.getCurrentPosition(async (location) => {
              setGeoLocation(true)
              const lat = location.coords.latitude
              const log = location.coords.longitude
              await WeatherService.getWeatherByCordinates(String(lat), String(log)).then(result => {
                localStorage.setItem("weather", JSON.stringify({ ...result, time: new Date().getTime() }))
                setWeatherState(result)
              })
            });
          }
        }
      });
    }
    allowed()
    setLodding(false)
  }, [])

  return (
    <>
      <Head>
        <title>Clima</title>
        <meta name="description" content="Site que mostra o clima de uma região" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        lodding ? (
          <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24" >Carregando...</svg>
        )
          :
          (
            geoLocation ? (
              <main className='my-auto grid grid-cols-4 grid-rows-2 w-full flex-1 h-4/5'>
                <section>
                  Week Weather
                </section>
                <section>
                  Sun time
                </section>
                <section>
                  Air quality
                </section>
                <section>
                  Temperature now
                </section>
              </main>
            ) : (
              <div> NAO TEM GEOLOCATION NA PARADA</div>
            )
          )
      }
    </>
  )
}
