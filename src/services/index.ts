import { AirQualityProps, DailyProps, WeatherProps, WeatherResponse } from "@/interfaces";
import axios from "axios";

class WeatherService {
    private baseUrl: string
    private apiKey: string

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL as string
        this.apiKey = process.env.NEXT_PUBLIC_API_KEY as string
    }

    private switchAirQuality(airQuality: number) {
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

    private serializeWheather(weather: any) {
        return {
            weather_description: weather.weather[0].main,
            weather_icon: weather.weather[0].icon,
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

    private serializeAirQuality(airQuality: any) {
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

    private serializeNameOfDay(dayNumber: number) {
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

    private serializeDaily(dailyRaw: any) {
        interface DailyDescription {
            day: string,
            descriptions: string[]
        }

        const rawWeathers: any[] | undefined = dailyRaw?.list;
        let allWeathers: DailyProps[] = []
        //se tem a lista
        if (rawWeathers) {
            allWeathers = rawWeathers.map((daily: any) => {
                //coletando string com nome do dia
                const day = this.serializeNameOfDay(new Date(daily.dt * 1000).getDay())
                return {
                    weather_icon: daily.weather[0].icon,
                    day,
                    description: daily.weather[0].description,
                    min: Math.trunc(daily.main.temp_min),
                    max: Math.trunc(daily.main.temp_max),
                }
            })

            //lista dos dias com o nome do dia, temp min e max
            let weatherWithDescription: DailyProps[] = []
            //variaveis auxiliares
            let min: number = 0, max: number = 0
            //array de descrições
            let descriptionsOfDay: DailyDescription[] = []

            allWeathers.forEach((daily) => {
                let lastIndexOfDescriptionsArray = descriptionsOfDay.length - 1
                let lastIndexOfweatherWithDescriptionArray = weatherWithDescription.length - 1
                //se for o primeiro elemento da lista, adicione
                if (weatherWithDescription.length == 0) {
                    weatherWithDescription.push(daily)
                    descriptionsOfDay.push({
                        day: daily.day,
                        descriptions: [daily.description]
                    })
                } else {
                    //se o nome do dia for diferente
                    if (weatherWithDescription[lastIndexOfDescriptionsArray].day != daily.day) {
                        //adicione e zere as variaveis de temperatura min e max
                        weatherWithDescription.push(daily)
                        min = 0
                        max = 0
                        descriptionsOfDay.push({
                            day: daily.day,
                            descriptions: [daily.description]
                        })
                    } else {
                        //se o nome for igual
                        //adicione a nova descrição
                        descriptionsOfDay[lastIndexOfDescriptionsArray].descriptions.push(daily.description)
                        //checa se a temp min atual e menor que de hambiente e o max tbm..
                        if (min > daily.min) {
                            min = daily.min
                            weatherWithDescription[lastIndexOfweatherWithDescriptionArray].min = min
                        }
                        if (max < daily.max) {
                            max = daily.max
                            weatherWithDescription[lastIndexOfweatherWithDescriptionArray].max = max
                        }
                    }
                }
            });

            //Interando sobre o array que contem as descrilções para cada dia
            const descriptionOfDays = descriptionsOfDay.map((day) => {
                //criar um array que vai conter os objetos com a descrição e o somatorio de ocorrencias
                let amountOfDescriptionsDays: { description: string, amount: number }[] = []

                //para cada descrição 
                //para cada description do objeto
                day.descriptions.forEach((description) => {
                    //se o array estiver vazio, adicione o primeiro elemento
                    if (amountOfDescriptionsDays.length == 0) {
                        amountOfDescriptionsDays.push({
                            description,
                            amount: 1
                        })
                    } else {
                        //Iniciando a variavel que deve conter o index, caso contrario o valor é igual a -1
                        let equalIndex: number = -1
                        //se houver alguma descrição igual, salve o index da posição
                        amountOfDescriptionsDays.find((current, index) => {
                            if (current.description.match(description)) {
                                equalIndex = index
                                return current
                            }
                        })
                        //se houver a mesma descrição adicione 1 no na quantidade
                        if (equalIndex != -1) {
                            amountOfDescriptionsDays[equalIndex].amount += 1
                        } else {
                            //se não houver, adicione o novo objeto
                            amountOfDescriptionsDays.push({ description, amount: 1 })
                        }
                    }
                })

                //Verifiar qual descrição possui a maior quantidade para esse dia
                let biger: { amount: number, index: number } = { amount: -1, index: -1 }
                amountOfDescriptionsDays.forEach((amount, index) => {
                    if (amount.amount > biger.amount) {
                        biger.amount = amount.amount
                        biger.index = index
                    }
                })
                return { day: day.day, description: amountOfDescriptionsDays[biger.index].description }
            })

            let finalWeather = weatherWithDescription.map((weather) => {
                descriptionOfDays.forEach((day) => {
                    if (day.day.match(weather.day)) {
                        weather.description = day.description
                    }
                })
                return weather
            })

            return finalWeather
        }
        return undefined
    }

    public async getByCordinates(lon: string, lat: string): Promise<WeatherResponse> {
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

    public async getByName(name: string): Promise<WeatherResponse> {
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