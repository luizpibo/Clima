// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import WeatherService from '../../services'

type Data = {
  weather_description: string,
  alt: string,
  temp: {
    current: number,
    sens: number,
    min: number,
    max: number,
    pressure: number,
    humidity: number,
  },
  wind: {
    speed: number,
    deg: number,
    gust: number
  },
  clouds: number,
  sunrise: string,
  sunset: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  if (req.method === "GET") {
    const lat = req.query["lat"] as string
    const lon = req.query["lon"] as string
    if (lat && lon) {
      const weather = await WeatherService.getWeatherByCordinates(lon, lat)
      res.status(200).json({ ...weather })
    } else {
      res.status(400).json({ message: "latitude or longitude not found" })
    }
  }
}
