import React, { useState, useEffect } from "react";
import Select,{components} from "react-select";

interface City {
  id: number;
  name: string;
}
const cities: City[] = [
  {
    id: 1,
    name: "Paris"
  },
  {
    id: 2,
    name: "Marseille"
  },
  {
    id: 3,
    name: "Lyon"
  },
  {
    id: 4,
    name: "Toulouse"
  },
  {
    id: 5,
    name: "Nice"
  },
  {
    id: 6,
    name: "Nantes"
  },
  {
    id: 7,
    name: "Strasbourg"
  },
  {
    id: 8,
    name: "Montpellier"
  },
  {
    id: 9,
    name: "Bordeaux"
  },
  {
    id: 10,
    name: "Lille"
  },
  {
    id: 11,
    name: "Rennes"
  },
  {
    id: 12,
    name: "Reims"
  },
  {
    id: 13,
    name: "Le Havre"
  },
  {
    id: 14,
    name: "Saint-Étienne"
  },
  {
    id: 15,
    name: "Toulon"
  },
  {
    id: 16,
    name: "Angers"
  },
  {
    id: 17,
    name: "Grenoble"
  },
  {
    id: 18,
    name: "Dijon"
  },
  {
    id: 19,
    name: "Nîmes"
  },
  {
    id: 20,
    name: "Aix-en-Provence"
  }
];


interface Option {
  value: string;
  label: string;
}

interface Props {
  onSelect: (selectedOption: Option | null) => void;
  placeholderText: string;
}

const SearchableDropdown: React.FC<Props> = ({ onSelect, placeholderText }) => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [data, setData] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState<boolean>();

    useEffect(() => {
      if (keyword.length === 0) {
        setData([]);
        return;
      }
      if (keyword.toLowerCase() === "fail") {
        setError(true);
        setIsLoading(false);
        return;
      } else {
        setError(false);
      }
      setIsLoading(true);
      const fetchData = async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const filteredData = cities.filter((city) =>
            city.name.toLowerCase().includes(keyword.toLowerCase())
          );
        const options = filteredData.map(city => ({
          value: city.name,
          label: city.name
        }));
        setData(options);
        setIsLoading(false);
      };
      fetchData();
    }, [keyword]);
  
    const handleChange = (selectedOption: Option | null) => {
      if (!selectedOption) {
        setKeyword("");
      }
      setSelectedOption(selectedOption);
      onSelect && onSelect(selectedOption);
    };
  
    return (
      <>
        {error && (
        <span className="error-message">Keyword contains Fail, cannot proceed with search</span>
        )}
        <Select
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholderText}
        options={data}
        isLoading={isLoading}
        onInputChange={value => setKeyword(value)}
        menuIsOpen={keyword.length > 0}
        components={{ DropdownIndicator: null }}
        isClearable
        required
        className="input-box"
        />
      </>
    );
  };
  
export default SearchableDropdown;
