# react-picture-crop
React component for cropping pictures.

## Usage

```
import React from 'react'
import PictureCrop from '@heffayxd/react-picture-crop'

const App = () => {
  return (
    <div id='app'>
      <PictureCrop slider />
    </div>
  )
}

export default App
```

## Props
### slider

Add the prop "slider" to enable the magnification slider

### dimensions
```
<PictureCrop dimensions={{ width: 200, height: 200 }} />
```

Use the "dimensions" prop to pass the target resolution in pixels (default is 200x200)

### noStyles

Add the prop "noStyles" to disable all default CSS styles

### label
```
<PictureCrop label='Choose file' />
```

Adding this prop will add a label for the "Choose file" input. You can use this for custom styling your own "Choose file" input.
