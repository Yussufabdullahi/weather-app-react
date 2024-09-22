import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDate = () => {
    const months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December",
    ];
    const currentDate = new Date();
    const date = `${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = (event) => {
    if (event.key === "Enter") {
      setInput("");
      setWeather({ ...weather, loading: true });
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: input,
          units: "metric",
          appid: "1f3ae7d4f90a148da3d13d95fc821c2b",
        }
      })
      .then(res => {
        console.log(res);
        setWeather({ loading: false, data: res.data, error: false });
      })
      .catch(err => {
        setWeather({ loading: false, data: {}, error: true });
      });
    }
  };

  return (
    <div className='weather-app'>
      <div className="city-search">
        <input
          type="text"
          className="city"
          placeholder="Enter City Name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={search}
        />
      </div>
      {
        weather.loading && (
          <Oval color='green' height={70} width={70} />
        )
      }
      {
        weather.error && (
          <div className='error-message'>
            <span>City Not Found</span>
          </div>
        )
      }
      {
        weather && weather.data && weather.data.main && (
          <div>
            <div className='city-name'>
              <h2>{weather.data.name},
                <span>
                  {weather.data.sys.country}
                </span>
              </h2>
            </div>
            <div className='date'>
              <span>{toDate()}</span>
            </div>
            <div className='weather-info'>
              <h3>{weather.data.main.temp} °C</h3>
              <p>{weather.data.weather[0].description}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} 
                alt={weather.data.weather[0].description} 
              />
              <p>Wind Speed: {weather.data.wind.speed} m/s</p>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
