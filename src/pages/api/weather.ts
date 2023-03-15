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
    const city_name = req.query["citie_name"] as string

    if (lat && lon) {
      const result = await WeatherService.getByCordinates(lon, lat)
      res.status(200).json({ ...result })
    }

    if (city_name) {
      const result = await WeatherService.getByName(city_name)
      res.status(200).json({ ...result })
    }
    
    res.status(400).json({ message: "Erro na requisição!" })
  }
}
