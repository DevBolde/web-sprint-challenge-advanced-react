import React, {useState} from 'react'
import axios from 'axios'

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [steps, setSteps] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(4);// the index the "B" is at

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = currentIndex % 3;
    const y = Math.floor(currentIndex / 3);
    return { x, y };
  }

  const { x, y } = getXY();

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    ;
    return `Coordinates (${x + 1}, ${y + 1})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage('');
    setEmail('');
    setSteps(0);
    setCurrentIndex(4);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
const { x, y } = getXY();

switch (direction) {
  case 'left':
    return x === 0 ? currentIndex : currentIndex - 1;
  case 'right':
    return x === 2 ? currentIndex : currentIndex + 1;
  case 'up':
    return y === 0 ? currentIndex : currentIndex - 3;
  case 'down':
    return y === 2 ? currentIndex : currentIndex + 3;
  default:
    return currentIndex;
}
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
      const nextIndex = getNextIndex(evt.target.id);
      if (nextIndex !== currentIndex) {
        setCurrentIndex(nextIndex);
        setSteps(steps + 1);
        setMessage('');
      } else {
        setMessage('Cannot move in that direction');
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

    function onSubmit(evt) {
      // Use a POST request to send a payload to the server.
      evt.preventDefault();
      const payload = {
        x: parseInt(x),
        y: parseInt(y),
        steps: parseInt(steps),
        email: email,
      };      
      axios.post('http://localhost:9000/api/result', payload)
        .then(response => {
           setMessage(response.data.message)})
        .catch(error => {
          setMessage(error.response.data.message)});
    }
    

 return (
  <div id="wrapper" className={props.className}>
  <div className="info">
    <h3 id="coordinates">{getXYMessage()}</h3>
    <h3 id="steps">You moved {steps} times</h3>
  </div>
  <div id="grid">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
      <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
        {idx === currentIndex ? 'B' : null}
      </div>
    ))}
  </div>
  <div className="info">
    <h3 id="message">{message}</h3>
  </div>
  <div id="keypad">
    <button id="left" onClick={move}>
      LEFT
    </button>
    <button id="up" onClick={move}>
      UP
    </button>
    <button id="right" onClick={move}>
      RIGHT
    </button>
    <button id="down" onClick={move}>
      DOWN
    </button>
    <button id="reset" onClick={reset}>
      reset
    </button>
  </div>
  <form onSubmit={onSubmit}>
    <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
    <input id="submit" type="submit" value="Submit" />
    </form>
  </div>
)}

