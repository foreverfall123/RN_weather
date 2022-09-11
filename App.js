import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
const { height, width:SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = "2e962ef8aded19cbdaf545d17e67a2d1";

const icons = {
  Clouds: "cloudy",
  'overcast clouds': "cloudy",
  'broken clouds': "cloudy",
  'scattered clouds': "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
  'light rain': "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].country);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.list);
  }
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
          {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator 
            color="white"
            style={{ marginTop: 10 }} 
            size="large"/>
          </View> 
          ) : ( 
            days.map((day, index) => 
              <View key={index} style={styles.day}>
                <View style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    width: "100%",
                    justifyContent:"space-between",
                  }}>
                  <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].description]} size={68} color="white"/>
                </View>
                <Text style={styles.description}>{day.weather[0].description}</Text>
                <Text style={styles.tinyText}>{day.dt_txt}</Text>
              </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
})