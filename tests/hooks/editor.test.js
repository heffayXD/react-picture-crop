/* eslint-env jest */
import { useScaleAspectRatio, usePositionCalc } from '../../src/hooks/editor'

test('Aspect Ratio sets to scale', () => {
  const getScaledAspectRatio = useScaleAspectRatio()

  const scale = { height: 300, width: 300 }
  const canvas = { height: 200, width: 200 }
  const image = { height: 1920, width: 1080 }

  const { height, width } = getScaledAspectRatio(scale, canvas, image)

  expect(height).toBe(300)
  expect(width).toBe(300)
})

test('Aspect Ratio binds to canvas', () => {
  const getScaledAspectRatio = useScaleAspectRatio()

  const scale = { height: 100, width: 100 }
  const canvas = { height: 200, width: 200 }
  const image = { height: 1920, width: 1080 }

  const { height, width } = getScaledAspectRatio(scale, canvas, image)

  expect(height).toBe(200)
  expect(width).toBe(200)
})

test('Calc Position stays if no change', () => {
  const calculatePosition = usePositionCalc()

  const newScale = { height: 300, width: 300 }
  const oldScale = { height: 300, width: 300 }
  const canvas = { height: 200, width: 200 }
  const position = { x: -100, y: -100 }

  const { x, y } = calculatePosition(newScale, oldScale, canvas, position)

  expect(x).toBe(-100)
  expect(y).toBe(-100)
})

test('Calc Position keeps within bounds', () => {
  const calculatePosition = usePositionCalc()

  const newScale = { height: 200, width: 200 }
  const oldScale = { height: 300, width: 300 }
  const canvas = { height: 200, width: 200 }
  const position = { x: 10, y: 10 }

  const { x, y } = calculatePosition(newScale, oldScale, canvas, position)

  expect(x).toBe(0)
  expect(y).toBe(0)
})
