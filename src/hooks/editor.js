/**
 * Determines the scaled aspect ratio
 * @return {function}
 */
export const useScaleAspectRatio = () => {
  /**
   * Fits the dimensions to the scale of the canvas
   * @param {object} scale
   * @param {object} canvas
   * @param {object} image
   * @return {object}
   */
  const handleBounds = (scale, canvas, image) => {
    if (scale.width < scale.height) {
      return {
        width: canvas.width,
        height: image * (canvas.width / image.width)
      }
    }

    if (scale.width !== scale.height) {
      return {
        width: image.width * (canvas.height / image.height),
        height: canvas.height
      }
    }

    // Lock to canvas bounds
    return { width: canvas.height, height: canvas.width }
  }

  return (scale, canvas, image) => {
    // Checks if the new scale is out of canvas bounds
    const result = (scale.width < canvas.width || scale.height < canvas.height)
      ? handleBounds(scale, canvas, image)
      : { width: scale.width, height: scale.height }

    // Rounds it out because pixels aren't floats
    return { width: Math.round(result.width), height: Math.round(result.height) }
  }
}

/**
 * Figures out where to align the canvas based on scaled ratio
 * @return {function}
 */
export const usePositionCalc = () => {
  return (newScale, oldScale, canvas, position) => {
    const deltaWidth = (newScale.width - oldScale.width)
    const deltaHeight = (newScale.height - oldScale.height)
    const posX = (position.x) - (canvas.width / 2)
    const posY = (position.y) - (canvas.height / 2)
    const coefX = Math.round(posX / newScale.width * 100) / 100
    const coefY = Math.round(posY / newScale.height * 100) / 100
    let x = position.x + (deltaWidth * coefX)
    let y = position.y + (deltaHeight * coefY)

    // Set to bounds if we are going to be too small
    if (x - canvas.width < -newScale.width) {
      x = -(newScale.height - canvas.width) > 0 ? 0 : -(newScale.width - canvas.width)
    }

    if (y - canvas.height < -newScale.height) {
      y = -(newScale.height - canvas.height) > 0 ? 0 : -(newScale.height - canvas.height)
    }

    // Set to bounds if out of bounds
    x = x > 0 ? 0 : Math.round(x)
    y = y > 0 ? 0 : Math.round(y)

    return { x, y }
  }
}
