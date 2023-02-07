import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
const cities = [
    {
      id: 1,
      name: "Paris",
      lat:48.856614,
      long: 2.352222
    },
    {
      id: 2,
      name: "Marseille",
      lat:43.296482,
      long: 5.369780
    },
    {
      id: 3,
      name: "Lyon",
      lat:45.764043,
      long: 4.835659
    },
    {
      id: 4,
      name: "Toulouse",
      lat:43.604652,
      long: 1.444209
    },
    {
      id: 5,
      name: "Nice",
      lat: 43.710173,
      long: 7.261953
    },
    {
      id: 6,
      name: "Nantes",
      lat:47.218371,
      long: -1.553621
    },
    {
      id: 7,
      name: "Strasbourg",
      lat:48.573405,
      long:  7.752111
    },
    {
      id: 8,
      name: "Montpellier",
      lat:43.610769,
      long:3.876716
    },
    {
      id: 9,
      name: "Bordeaux",
      lat: 44.837789,
      long: -0.579180
    },
    {
      id: 10,
      name: "Lille",
      lat:50.629250,
      long: 3.057256
    },
    {
      id: 11,
      name: "Rennes",
      lat:48.117266,
      long: -1.677793
    },
    {
      id: 12,
      name: "Reims",
      lat:49.258329,
      long: 4.031696
    },
    {
      id: 13,
      name: "Le Havre",
      lat:49.494370,
      long:  0.107929
    },
    {
      id: 14,
      name: "Saint-Étienne",
      lat:45.439695,
      long:  4.387178
    },
    {
      id: 15,
      name: "Toulon",
      lat:43.124228,
      long: 5.928000
    },
    {
      id: 16,
      name: "Angers",
      lat:47.478419,
      long:  -0.563166
    },
    {
      id: 17,
      name: "Grenoble",
      lat:45.188529,
      long:  5.724524
    },
    {
      id: 18,
      name: "Dijon",
      lat:47.322047,
      long:  5.041480
    },
    {
      id: 19,
      name: "Nîmes",
      lat:43.836699,
      long: 4.360054
    },
    {
      id: 20,
      name: "Aix-en-Provence",
      lat: 43.529742,
      long: 5.447427
    }
  ];
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateTotalDistance(coordinates: Array<{ lat: number; long: number }>): number {
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(
      coordinates[i].lat,
      coordinates[i].long,
      coordinates[i + 1].lat,
      coordinates[i + 1].long
    );
  }
  return totalDistance;
}

function calculateDistances(
  coordinates: Array<{ lat: number; long: number; value: string }>
): Array<{ from: string; to: string; distance: number }> {
  const distances = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    distances.push({
      from: coordinates[i].value,
      to: coordinates[i + 1].value,
      distance: haversineDistance(
        coordinates[i].lat,
        coordinates[i].long,
        coordinates[i + 1].lat,
        coordinates[i + 1].long
      ),
    });
  }
  return distances;
}



interface City {
    name: string;
    lat: number;
    long: number;
  }
  
  interface Distance {
    from: string;
    to: string;
    distance: number;
  }
  
  const Result: React.FC = () => {
    const { origin, destination, intermediate, number, date } = useParams();
    const [distances, setDistances] = useState<Array<Distance>>([]);
    const [totalDistance, setTotalDistance] = useState<number | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      setIsLoading(true);
      const fetchData = async () => {
        const keywords = intermediate
  ? [origin, ...intermediate.split(','), destination].filter(Boolean)
  : [origin, destination].filter(Boolean);
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (keywords && keywords.some(keyword => keyword && keyword.toLowerCase().includes("dijon"))) {
            setError("Keyword contains Dijon, cannot proceed with search");
            setIsLoading(false);
            return;
          }
          const filteredData = cities.filter(city =>
            keywords.some(keyword => keyword && city.name.toLowerCase().includes(keyword.toLowerCase()))
          );
          
        const sortedData = filteredData.sort((a, b) => keywords.indexOf(a.name) - keywords.indexOf(b.name));
        const options = sortedData.map(city => ({
          value: city.name,
          lat: city.lat,
          long: city.long
        }));
  
        const allDistances = calculateDistances(options);
        const total = calculateTotalDistance(options);
        setDistances(allDistances);
        setTotalDistance(total);
        setIsLoading(false);
      };
  
      fetchData();
    }, [origin, destination, intermediate]);

  return (
    <>
      <Outlet />
      <div className='main-wrapper'>
           
           
            <div className='form-wrapper'>

            <h1 style={{marginBottom:"50px"}}>Trip Distance Calculator</h1>
            {isLoading ? <h2 className='calculating'>Calculating Distance...</h2> : error ? <div className='error-message'>{error}</div> : <>
            <div className='info-box no-border'>City of Origin: {origin}</div>
            <div  className='info-box'>Intermediate cities: {intermediate}</div>
            <div  className='info-box no-border'>City of Destination: {destination}</div>
            <div  className='info-box'>Number of passengers: {number}</div>
            <div className='info-box'>Date of the trip: {date}</div>
            {distances.map((item) => (
                <div key={item.distance} className='info-box'>
                    from {item.from} to {item.to} their is  <span> {" " + item.distance.toFixed(2)} Km</span>
                </div>
            ))}
            <div className='total-distance'>Total Ditance: {totalDistance && totalDistance.toFixed(2)} km</div>
            <Link className='recalculate' to="/">Recalculate</Link>
</>}



            
            
            </div>
       
         
       </div>
      
    </>
  
  );
};

export  default Result
