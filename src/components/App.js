import React from 'react'
import PictureCrop from '../PictureCrop'

const App = () => {
  const dimensions = { width: 700, height: 300 }
  return (
    <div id='app'>
      <h1>Hello World!</h1>
      <PictureCrop slider dimensions={dimensions} />
    </div>
  )
}

export default App
