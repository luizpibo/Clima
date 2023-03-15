export interface WeatherProps {
    weather_description: string,
    locale: string,
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

export interface AirQualityProps {
    aqi: string,
    list: {
        "pm2.5": number,
        "pm10": number,
        "so2": number,
        "no2": number,
        "o3": number,
        "co": number,
    }
}

export interface DailyProps {
    day: string,
    description: string,
    min: number,
    max: number,
    cnt: number,
}

export interface WeatherResponse {
    weather: WeatherProps,
    airQuality: AirQualityProps,
    daily: DailyProps[]
}