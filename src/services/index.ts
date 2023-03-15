import { AirQualityProps, DailyProps, WeatherProps } from "@/interfaces";
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

    switchAirQuality(airQuality: number) {
        switch (airQuality) {
            case 1:
                return "Ótima"
            case 2:
                return "Boa"
            case 3:
                return "Moderada"
            case 4:
                return "Ruim"
            case 5:
                return "Péssima"
            default:
                return "Sem informação"
        }
    }

    serializeWheather(weather: any) {
        return {
            weather_description: weather.weather[0].main,
            locale: weather.name,
            alt: weather.weather[0].description,
            temp: {
                current: Math.trunc(weather.main.temp),
                sens: Math.trunc(weather.main.feels_like),
                min: Math.trunc(weather.main.temp_min),
                max: Math.trunc(weather.main.temp_max),
                pressure: Math.trunc(weather.main.pressure),
                humidity: Math.trunc(weather.main.humidity),
            },
            wind: {
                speed: Math.trunc(weather.wind.speed),
                deg: Math.trunc(weather.wind.deg),
                gust: Math.trunc(weather.wind.gust)
            },
            clouds: Math.trunc(weather.clouds.all),
            sunrise: new Date(weather.sys.sunrise * 1000).toLocaleString("pt-br"),
            sunset: new Date(weather.sys.sunset * 1000).toLocaleString("pt-br"),
        }
    }

    serializeAirQuality(airQuality: any) {
        return {
            aqi: this.switchAirQuality(airQuality.list[0].main.aqi as number),
            list: {
                "pm2.5": airQuality.list[0].components.pm2_5,
                "pm10": airQuality.list[0].components.pm10,
                "so2": airQuality.list[0].components.so2,
                "no2": airQuality.list[0].components.no2,
                "o3": airQuality.list[0].components.o3,
                "co": airQuality.list[0].components.co,
            }
        }
    }

    serializeNameOfDay(dayNumber: number) {
        switch (dayNumber) {
            case 0:
                return "Domingo"
            case 1:
                return "Segunda"
            case 2:
                return "Terça"
            case 3:
                return "Quarta"
            case 4:
                return "Quinta"
            case 5:
                return "Sexta"
            case 6:
                return "Sábado"
            default:
                return "Domingo"
        }
    }

    serializeDaily(daily: any) {
        const list: any[] = daily.list;
        let dailyWeather: DailyProps[] = []
        if (list.length > 0) {
            dailyWeather = list.map((daily: any, index) => {
                const day = this.serializeNameOfDay(new Date(daily.dt * 1000).getDay())
                console.log("Dia - ", new Date(daily.dt * 1000).toLocaleString())
                return {
                    day,
                    description: daily.weather.description,
                    min: Math.trunc(daily.main.temp_min),
                    max: Math.trunc(daily.main.temp_max),
                    cnt: daily.cnt,
                }
            })
        }
        return dailyWeather
    }

    async getByCordinates(lon: string, lat: string): Promise<{ weather: WeatherProps, airQuality: AirQualityProps, daily: DailyProps[] }> {
        const baseParams = {
            lat,
            lon,
            appid: this.apiKey,
            units: "metric",
            lang: "pt_br",
        }

        const weather = await axios.get(`${this.baseUrl}/weather`, {
            params: baseParams,
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        const airQuality = await axios.get(`${this.baseUrl}/air_pollution`, {
            params: baseParams,
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        const daily = await axios.get(`${this.baseUrl}/forecast`, {
            params: {
                ...baseParams,
            },
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        return {
            weather: this.serializeWheather(weather),
            airQuality: this.serializeAirQuality(airQuality),
            daily: this.serializeDaily(daily)
        }
    }

    async getByName(name: string): Promise<{ weather: WeatherProps, airQuality: AirQualityProps, daily: DailyProps[] }> {
        const baseParams = {
            q: name,
            appid: this.apiKey,
            units: "metric",
            lang: "pt_br",
        }

        const weather = await axios.get(`${this.baseUrl}/weather`, {
            params: baseParams
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        const airQuality = await axios.get(`${this.baseUrl}/air_pollution`, {
            params: baseParams
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        const daily = await axios.get(`${this.baseUrl}/forecast`, {
            params: {
                ...baseParams,
                cnt: 5,
            },
        }).then(data => {
            return data.data
        }).catch(data => {
            console.log("data error", data)
            // throw new Error("Erro comunicar com o servidor")
        });

        return {
            weather: this.serializeWheather(weather),
            airQuality: this.serializeAirQuality(airQuality),
            daily: this.serializeDaily(daily)
        }
    }

}

export default new WeatherService()