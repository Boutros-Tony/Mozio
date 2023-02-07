import React, { useState} from 'react';
import SearchableDropdown from '../searchable-dropdown/searchable-dropdown.component';
import { useNavigate} from 'react-router-dom';
import '../../App.scss';

interface City {
value: string;
label: string;
}

const Form: React.FC = () => {
const navigate = useNavigate();
const [selectedCity, setSelectedCity] = useState<City | null>(null);
const [selectedDestinationCity, setSelectedDestinationCity] = useState<City | null>(null);
const [intermediateCities, setIntermediateCities] = useState<City[]>([]);
const [selectedNumber, setSelectedNumber] = useState(1);
const [selectedDate, setSelectedDate] = useState(new Date());


const handleSelectCity = (selectedOption: City | null) => {
  if (selectedOption) {
    setSelectedCity(selectedOption);
  }
};

const handleSelectDestinationCity = (selectedOption: City | null) => {
  setSelectedDestinationCity(selectedOption as City);
};


const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const selected = new Date(event.target.value);
if (selected >= new Date()) {
setSelectedDate(selected);
}
};

const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const selected = parseInt(event.target.value);
if (selected > 0) {
setSelectedNumber(selected);
}
};

const handleAddIntermediateCity = (event: React.FormEvent<HTMLButtonElement>) => {
event.preventDefault();
setIntermediateCities([...intermediateCities, { value: '', label: '' }]);
};

const handleRemoveIntermediateCity = (index: number) => {
setIntermediateCities(intermediateCities.filter((_, i) => i !== index));
};

const handleIntermediateCityChange = (index: number, selectedOptionValue: string) => {
  setIntermediateCities(
    intermediateCities.map((city, i) => (i === index ? { value: selectedOptionValue, label: selectedOptionValue } : city))
  );
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
if (!selectedCity || !selectedDestinationCity || (intermediateCities.length > 0 && intermediateCities.some(city => city.value === ''))) {
return;
}
  
      const encodedDestinationCity = encodeURIComponent(selectedDestinationCity.value);
      const encodedIntermediateCities = intermediateCities
        .map(city => encodeURIComponent(city.value))
        .join(',');
      navigate(`/result/${selectedCity.value}/${encodedDestinationCity}/${encodedIntermediateCities ? encodedIntermediateCities : null}/${selectedNumber}/${selectedDate}`);
      
    };

  return (
    <>
      <div className='main-wrapper'>
        <div className='form-wrapper'>
          <h1>
            Trip Distance Calculator</h1>
       <form onSubmit={handleSubmit}>
         <label htmlFor="">From</label>
         
         <SearchableDropdown onSelect={handleSelectCity} placeholderText="Search City of Origin"/>

       <label htmlFor="">Intermediate city</label>
       {intermediateCities.map((city, index) => (
         <div key={index} style={{position:"relative",margin:"5px 0"}}>
 
 
           
 <SearchableDropdown
  onSelect={(selectedOption: City | null) => handleIntermediateCityChange(index, selectedOption!.value)}
  placeholderText={`Search Intermediate city ${index + 1}`}
/>

             <button className='remove-intermediate' onClick={() => handleRemoveIntermediateCity(index)}>
               -
             </button>
          
         </div>
       ))}
  
       <button onClick={handleAddIntermediateCity} className="add-intermediate">Add</button>
       <label htmlFor="">To</label>
       <SearchableDropdown onSelect={handleSelectDestinationCity} placeholderText="Search City of Destination"/>
       <label htmlFor="">Number of Passengers</label>
       <input
       type="number"
       value={selectedNumber}
       min={1}
       onChange={handleNumberChange}
       onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = Math.max(1, parseInt(event.target.value, 10)).toString();
      }}
     />
     <label htmlFor="">Date of the trip</label>
       <input
       type="date"
       value={selectedDate.toISOString().substr(0, 10)}
       min={new Date().toISOString().substr(0, 10)}
       onChange={handleDateChange}
     />
<button className='calculate' type='submit' disabled={!selectedCity || !selectedDestinationCity || (intermediateCities.length > 0 && intermediateCities.some(city => !city.value))}>
  Calculate
</button>

       </form>
       </div>
       
       
       
      
     </div>
    
        </>
     
    );
 
  
}

export default Form;