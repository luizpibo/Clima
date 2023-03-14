import { WeatherResponse } from '@/interfaces'
import type { NextApiRequest, NextApiResponse } from 'next'
import WeatherService from '../../services'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WeatherResponse | { message: string }>
) {
  if (req.method === "GET") {
    const lat = req.query["lat"] as string
    const lon = req.query["lon"] as string
    const citie_name = req.query["citie_name"] as string

    if (lat && lon) {
      const weather = await WeatherService.getWeatherByCordinates(lon, lat)
      const airQuality = await WeatherService.getAirQualityByCordinates(lon, lat)
      res.status(200).json({ weather, airQuality })
    } else if (citie_name) {
      console.log("anarunia", citie_name)
    } else {
      res.status(400).json({ message: "latitude or longitude not found" })
    }
  }
}
