// import React from 'react'

// // Suggested initial states
// const initialMessage = ''
// const initialEmail = ''
// const initialSteps = 0
// const initialIndex = 4 // the index the "B" is at

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

// export default class AppClass extends React.Component {
//   // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
//   // You can delete them and build your own logic from scratch.

//   getXY = () => {
//     // It it not necessary to have a state to track the coordinates.
//     // It's enough to know what index the "B" is at, to be able to calculate them.
//   }

//   getXYMessage = () => {
//     // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
//     // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
//     // returns the fully constructed string.
//   }

//   reset = () => {
//     // Use this helper to reset all states to their initial values.
//   }

//   getNextIndex = (direction) => {
//     // This helper takes a direction ("left", "up", etc) and calculates what the next index
//     // of the "B" would be. If the move is impossible because we are at the edge of the grid,
//     // this helper should return the current index unchanged.
//   }

//   move = (evt) => {
//     // This event handler can use the helper above to obtain a new index for the "B",
//     // and change any states accordingly.
//   }

//   onChange = (evt) => {
//     // You will need this to update the value of the input.
//   }

//   onSubmit = (evt) => {
//     // Use a POST request to send a payload to the server.
//   }

//   render() {
//     const { className } = this.props
//     return (
//       <div id="wrapper" className={className}>
//         <div className="info">
//           <h3 id="coordinates">Coordinates (2, 2)</h3>
//           <h3 id="steps">You moved 0 times</h3>
//         </div>
//         <div id="grid">
//           {
//             [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
//               <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
//                 {idx === 4 ? 'B' : null}
//               </div>
//             ))
//           }
//         </div>
//         <div className="info">
//           <h3 id="message"></h3>
//         </div>
//         <div id="keypad">
//           <button id="left">LEFT</button>
//           <button id="up">UP</button>
//           <button id="right">RIGHT</button>
//           <button id="down">DOWN</button>
//           <button id="reset">reset</button>
//         </div>
//         <form>
//           <input id="email" type="email" placeholder="type email"></input>
//           <input id="submit" type="submit"></input>
//         </form>
//       </div>
//     )
//   }
// }

import React from 'react'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    }
  }

  getXY = () => {
    const x = this.state.index % 3
    const y = Math.floor(this.state.index / 3)
    return { x, y }
  }

  getXYMessage = () => {
    const { x, y } = this.getXY()
    return `Coordinates (${x + 1}, ${y + 1})`
  }

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    })
  }

  getNextIndex = (direction) => {
    const { index } = this.state
    switch (direction) {
      case 'left':
        return index % 3 === 0 ? index : index - 1
      case 'up':
        return index < 3 ? index : index - 3
      case 'right':
        return index % 3 === 2 ? index : index + 1
      case 'down':
        return index >= 6 ? index : index + 3
      default:
        return index
    }
  }

  move = (evt) => {
    const direction = evt.target.id
    const nextIndex = this.getNextIndex(direction)
    if (nextIndex !== this.state.index) {
      this.setState({
        index: nextIndex,
        steps: this.state.steps + 1,
        message: '',
      })
    }
  }

  onChange = (evt) => {
    this.setState({ email: evt.target.value })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const { email, message } = this.state
    const payload = { email, message }
    fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send message')
        }
        this.setState({ message: 'Message sent successfully' })
      })
      .catch((error) => {
        console.error(error)
        this.setState({ message: 'Failed to send message' })
      })
  }

  render() {
    const { className } = this.props;
    const { message, email, index, steps } = this.state;
  
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={evt => this.move(evt, 'left')}>LEFT</button>
          <button id="up" onClick={evt => this.move(evt, 'up')}>UP</button>
          <button id="right" onClick={evt => this.move(evt, 'right')}>RIGHT</button>
          <button id="down" onClick={evt => this.move(evt, 'down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
export default App;