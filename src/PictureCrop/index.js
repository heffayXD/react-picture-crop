import React, { useState } from 'react'
import Editor from './Editor'

const PictureCrop = props => {
  const [url, setUrl] = useState('')

  const handleImageSelect = e => {
    const file = e.target.files[0]
    const reader = new FileReader() // eslint-disable-line
    reader.readAsDataURL(file)
    reader.onload = () => {
      setUrl(reader.result)
    }
  }

  /**
   * We don't want to do anything when the form is submitted.
   * @param {event} e
   */
  const onSubmit = e => {
    e.preventDefault()
  }

  /**
   * Checks to see if dimensions were defined in props, and if not, sends default
   * @return {object}
   */
  const getDimensions = () => {
    if (props.dimensions && props.dimensions.width && props.dimensions.height) {
      return props.dimensions
    }

    return { width: 200, height: 200 }
  }

  /**
   * Checks to see if we are going to use the slider
   * @return {boolean}
   */
  const showSlider = () => {
    if (props.slider === false) return props.slider

    return !!url
  }

  /**
   * Runs the submit prop with the Base 64 encoded text
   * @param {string} preview64
   */
  const handleSubmit = preview64 => {
    if (props.submit && typeof props.submit === 'function') {
      props.submit(preview64)
    }
  }

  return (
    <div id='picture-crop'>
      <form className='picture-form' id='picture-form' onSubmit={onSubmit}>
        <input
          type='file'
          id='picture-input'
          name='picture-input'
          accept='image/*'
          onChange={handleImageSelect}
        />
        <label htmlFor='picture-input'>Choose Image</label>
        <Editor
          slider={showSlider()}
          url={url}
          dimensions={getDimensions()}
          submit={handleSubmit}
        />
      </form>
    </div>
  )
}

export default PictureCrop
