import React, { useState } from 'react'
import Editor from './Editor'
import '../scss/index.scss'

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
    if (props.slider && !!url) return props.slider

    return false
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
    <div id='react-picture-crop'>
      <form className='picture-form' id='picture-form' onSubmit={onSubmit}>
        <input
          type='file'
          id='react-picture-crop-input'
          name='react-picture-crop-input'
          accept='image/*'
          onChange={handleImageSelect}
        />
        {props.label ? (<label htmlFor='react-picture-crop-input'>{props.label}</label>) : ''}
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
