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

    async getWeatherByCordinates(lon: string, lat: string) {
        const response = await axios.get(this.baseUrl, {
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
        console.log("API RESPONSE", response)
        return {
            weather_description: response.weather[0].main,
            alt: response.weather[0].description,
            temp: {
                current: response.main.temp,
                sens: response.main.feels_like,
                min: response.main.temp_min,
                max: response.main.temp_max,
                pressure: response.main.pressure,
                humidity: response.main.humidity,
            },
            wind: {
                speed: response.wind.speed,
                deg: response.wind.deg,
                gust: response.wind.gust
            },
            clouds: response.clouds.all,
            sunrise: new Date(response.sys.sunrise * 1000).toLocaleString("pt-br"),
            sunset: new Date(response.sys.sunset * 1000).toLocaleString("pt-br"),
        }
    }
}

export default new WeatherService()