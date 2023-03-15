import Display from '@/components/Display'
import Form from '@/components/Form'
import { AirQualityProps, WeatherProps, WeatherResponse } from '@/interfaces'
import axios from 'axios'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [weatherState, setWeatherState] = useState<WeatherResponse>()
  const [geoLocation, setGeoLocation] = useState(false)

  const getWeather = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (location) => {
      setGeoLocation(true)
      const lat = location.coords.latitude
      const lon = location.coords.longitude
      await axios.get<WeatherResponse>("/api/weather", {
        params: {
          lat: String(lat),
          lon: String(lon),
        },
      }
      ).then(result => {
        result.data
        localStorage.setItem("weather", JSON.stringify({ ...result.data, time: new Date().getTime() }))
        setWeatherState(result.data)
      })
    });
  }, [setWeatherState, setGeoLocation])

  useEffect(() => {
    const getInitinalProps = async () => {
      return await navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        const geoLocationPermissionState = result.state
        if (geoLocationPermissionState != 'denied') {
          let weatherRaw = localStorage.getItem("weather")
          if (weatherRaw) {
            const weather = JSON.parse(weatherRaw)
            //If current time is before weather time plus 1 minute
            if ((weather.time + (1000 * 1) > new Date().getTime())) {
              setWeatherState(weather)
            } else {
              getWeather()
            }
          } else {
            getWeather()
          }
        }
      });
    }
    getInitinalProps()
  }, [])

  return (
    <>
      <Head>
        <title>Clima</title>
        <meta name="description" content="Site que mostra o clima de uma região" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col gap-5 w-11/12 md:w-4/5 lg:w-3/4 2xl:w-2/4 text-center'>
        <Form />
        {
          weatherState?.weather && weatherState.airQuality ?
            (
              <Display weather={weatherState.weather} airQuality={weatherState.airQuality} daily={weatherState.daily} />
            )
            :
            (
              <span className='text-2xl font-semibold'>
                {geoLocation ? ("Carregando informações...") : ("Compatilhe sua localização com o site para obter o clima da sua região ou digite o nome de uma cidade no campo acima!")}
              </span>
            )
        }
      </main>
    </>
  )
}
