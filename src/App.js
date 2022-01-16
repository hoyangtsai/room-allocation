// import CustomInputNumber from "./components/CustomInputNumber";
import RoomAllocation from './components/RoomAllocation';

function App() {
  return (
    <div className="App">
      <h2>Room Booking</h2>
      {/* <CustomInputNumber name="custom-input" onChange={event => console.log(event)} step={2} disabled={false} /> */}
      <RoomAllocation guest={10} room={3} onChange={result => console.log(result)} />
    </div>
  )
}

export default App