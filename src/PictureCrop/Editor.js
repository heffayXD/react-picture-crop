import React, { useState, useEffect, useRef } from 'react'
import { useScaleAspectRatio, usePositionCalc } from '../hooks/editor'

const Editor = props => {
  // References
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  // State
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [scale, setScale] = useState({ width: null, height: null })
  const [canvas, setCanvas] = useState({ width: 200, height: 200 })
  const [image, setImage] = useState({ width: 200, height: 200 })
  const [initialPos, setInitialPos] = useState({ x: null, y: null })
  const [finalPos, setFinalPos] = useState({ x: 0, y: 0 })

  // State references
  const initialRef = useRef(initialPos)
  const finalRef = useRef(finalPos)
  const scaleRef = useRef(scale)

  // Helper hooks
  const getScaledAspectRatio = useScaleAspectRatio()
  const calculatePosition = usePositionCalc()

  useEffect(() => {
    if (props.dimensions && props.dimensions.width && props.dimensions.height) {
      setCanvas(props.dimensions)
      setImage(props.dimensions)
    }
  }, [])

  /**
   * Updates the image
   */
  const updateImage = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.fillStyle = '#07000d'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const drawX = finalPos.x - canvas.width < -image.width ? 0 : Math.round(finalPos.x)
    const drawY = finalPos.y - canvas.height < -image.height ? 0 : Math.round(finalPos.y)

    ctx.drawImage(imageRef.current, drawX, drawY, scale.width, scale.height)
  }

  /**
   * Handles slider changes
   * @param {event} e
   */
  const handleSlider = e => {
    calculateScale(e.target.value)
  }

  /**
   * Sets the scale appropriately
   * @param {float} value
   */
  const calculateScale = value => {
    const newScale = value * 0.01

    // Get scaled width and height
    const ratio = getScaledAspectRatio({ width: image.width * newScale, height: image.height * newScale }, canvas, image)

    // Calculate the new position after zoom
    const { x, y } = calculatePosition(ratio, scaleRef.current, canvas, finalRef.current)

    setZoom(value)
    setScale(ratio)
    setFinalPos({ x, y })
  }

  /**
   * On Touch End event
   * @param {object} e
   */
  const onTouchEnd = e => {
    e.stopPropagation()
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)

    setDragging(false)
    setInitialPos({ x: null, y: null })
  }

  /**
   * On Touch Event
   * @param {object} e
   */
  const onTouchStart = e => {
    const touches = e.changedTouches
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)

    setDragging(true)
    setInitialPos({ x: -(finalPos.x - touches[0].clientX), y: -(finalPos.y - touches[0].clientY) })
  }

  /**
   * On Mouse Down event
   * @param {object} e
   */
  const onMouseDown = e => {
    e.stopPropagation()
    e.preventDefault()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    setInitialPos({ x: -(finalPos.x - e.clientX), y: -(finalPos.y - e.clientY) })
    setDragging(true)
  }

  /**
   * On Touch Move event
   * @param {object} e
   */
  const onTouchMove = e => {
    e.stopPropagation()
    e.preventDefault()

    const touches = e.changedTouches

    const tempX = -(initialRef.current.x - touches[0].clientX)
    const tempY = -(initialRef.current.y - touches[0].clientY)

    const x = tempX - canvas.width > -scale.width && tempX < 0 ? Math.round(tempX) : finalRef.current.x
    const y = tempY - canvas.height > -scale.height && tempY < 0 ? Math.round(tempY) : finalRef.current.y

    setFinalPos({ x, y })
  }

  /**
   * On Mouse Move event
   * @param {object} e
   */
  const onMouseMove = e => {
    e.stopPropagation()
    e.preventDefault()

    const tempX = -(initialRef.current.x - e.clientX)
    const tempY = -(initialRef.current.y - e.clientY)

    const x = tempX - canvas.width > -scale.width && tempX < 0 ? Math.round(tempX) : finalRef.current.x
    const y = tempY - canvas.height > -scale.height && tempY < 0 ? Math.round(tempY) : finalRef.current.y

    setFinalPos({ x, y })
  }

  /**
   * On Mouse Up event
   * @param {object} e
   */
  const onMouseUp = e => {
    e.stopPropagation()
    e.preventDefault()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    setDragging(false)
    setInitialPos({ x: null, y: null })
  }

  /**
   * Handles the image being loaded
   */
  const onImageLoad = () => {
    const dimensions = props.dimensions ? props.dimensions : { width: 200, height: 200 }
    const scaledDimensions = { width: imageRef.current.clientWidth * (zoom * 0.01), height: imageRef.current.clientHeight * (zoom * 0.01) }
    const imageDimensions = { width: imageRef.current.clientWidth, height: imageRef.current.clientHeight }
    const ratio = getScaledAspectRatio(scaledDimensions, dimensions, imageDimensions)

    setZoom(1)
    setFinalPos({ x: 0, y: 0 })
    setImage(imageDimensions)
    setScale({ width: ratio.width, height: ratio.height })
    setCanvas(dimensions)
  }

  /**
   * Sets up the initial state
   */
  useEffect(() => {
    canvasRef.current.addEventListener('touchstart', onTouchStart, { passive: false })
    imageRef.current.onload = onImageLoad
  }, [])

  /**
   * Retrieves the minimum scale amount that will keep the picture within bounds
   */
  const getMin = () => {
    let tempMin = 1
    let loop = true
    while (tempMin < 100 && loop) {
      if (canvas.width <= image.width * (tempMin * 0.01) && canvas.height <= image.height * (tempMin * 0.01)) {
        loop = false
      } else {
        tempMin++
      }
    }

    return tempMin
  }

  /**
   * Fixes image when a new one is loaded
   */
  useEffect(() => {
    calculateScale(getMin())
  }, [image])

  /**
   * Update refs and image whenever state changes
   */
  useEffect(() => {
    initialRef.current = initialPos
    finalRef.current = finalPos
    scaleRef.current = scale

    updateImage()
  }, [dragging, zoom, scale, canvas, image, initialPos, finalPos])

  /**
   * Returns the slider
   * @return {string}
   */
  const getSlider = () => {
    if (props.slider) {
      return (
        <input
          className='crop-slider'
          id='crop-slider'
          name='slider'
          onChange={handleSlider}
          type='range'
          min={getMin()}
          max='100'
          value={zoom}
        />
      )
    }

    return ''
  }

  /**
   * Handles submitting the Base 64 encoded link
   * @param {event} e
   */
  const handleSubmit = e => {
    if (props.onSubmit) {
      props.onSubmit(canvasRef.current.toDataURL('image/jpeg'))
    }
  }

  return (
    <div id='picture-editor'>
      <canvas
        ref={canvasRef}
        width={canvas.width.toString()}
        height={canvas.height.toString()}
        onMouseDown={onMouseDown}
      />
      {getSlider()}
      {props.url ? <button type='submit' className='submit-button' onClick={handleSubmit}>Submit</button> : ''}
      <img
        ref={imageRef}
        src={props.url}
        style={{ visibility: 'hidden', position: 'fixed' }}
      />
    </div>
  )
}

export default Editor
