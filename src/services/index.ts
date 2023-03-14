import { AirQualityProps, WeatherProps } from "@/interfaces";
import axios from "axios";

class WeatherService {
    private baseUrl: string
    private apiKey: string

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL as string
        this.apiKey = process.env.NEXT_PUBLIC_API_KEY as string
    }

    getCoords() {
        return new Promise((resolve, reject) =>
            navigator.permissions ?
                // Permission API is implemented
                navigator.permissions.query({
                    name: 'geolocation'
                }).then(permission =>
                    // is geolocation granted?
                    permission.state === "granted"
                        ? navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords))
                        : resolve(null)
                ) :
                // Permission API was not implemented
                reject(new Error("Permission API is not supported"))
        )
    }

    async getWeatherByCordinates(lon: string, lat: string): Promise<WeatherProps> {
        const response = await axios.get(`${this.baseUrl}/weather`, {
            params: {
                lat: lat,
                lon: lon,
                appid: this.apiKey,
                units: "metric",
                lang: "pt_br",
            },
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });
        return {
            weather_description: response.weather[0].main,
            locale: response.name,
            alt: response.weather[0].description,
            temp: {
                current: Math.trunc(response.main.temp),
                sens: Math.trunc(response.main.feels_like),
                min: Math.trunc(response.main.temp_min),
                max: Math.trunc(response.main.temp_max),
                pressure: Math.trunc(response.main.pressure),
                humidity: Math.trunc(response.main.humidity),
            },
            wind: {
                speed: Math.trunc(response.wind.speed),
                deg: Math.trunc(response.wind.deg),
                gust: Math.trunc(response.wind.gust)
            },
            clouds: Math.trunc(response.clouds.all),
            sunrise: new Date(response.sys.sunrise * 1000).toLocaleString("pt-br"),
            sunset: new Date(response.sys.sunset * 1000).toLocaleString("pt-br"),
        }
    }

    async getAirQualityByCordinates(lon: string, lat: string): Promise<AirQualityProps> {
        const response = await axios.get(`${this.baseUrl}/air_pollution`, {
            params: {
                lat: lat,
                lon: lon,
                appid: this.apiKey,
                units: "metric",
                lang: "pt_br",
            },
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        return {
            aqi: Math.trunc(response.list[0].main.aqi),
            "pm2.5": Math.trunc(response.list[0].components.pm2_5),
            "pm10": Math.trunc(response.list[0].components.pm10),
            "so2": Math.trunc(response.list[0].components.so2),
            "no2": Math.trunc(response.list[0].components.no2),
            "o3": Math.trunc(response.list[0].components.o3),
            "co": Math.trunc(response.list[0].components.co),
        }
    }
}

export default new WeatherService()