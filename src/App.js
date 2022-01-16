// import { useCallback } from 'react';
import CustomInputNumber from "./components/CustomInputNumber";
import RoomAllocation from './components/RoomAllocation';

function App() {
  return (
    <div className="App">
      <h2>Room Booking</h2>
      <CustomInputNumber name="custom-input"
        style={{marginBottom: '40px'}}
        min={4} step={2}
        onChange={event => console.log('onChange =>', event)}
        onBlur={event => console.log('onBlur =>', event)} />
      <RoomAllocation guest={10} room={3} onChange={result => console.log(result)} />
    </div>
  )
}

export default App