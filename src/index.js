import React from 'react'
import { render } from 'react-dom'
import Hello from './Hello'
import chroma from 'chroma-js'
import styled from 'styled-components'
import { map, keys, zipObj, anyPass, isEmpty, isNil } from 'ramda'

import { CopyToClipboard } from 'react-copy-to-clipboard'

const isNilOrEmpty = anyPass([isNil, isEmpty])

export const basecolors = {
  red: '#f5222d',
  vermilion: '#fa541c',
  orange: '#fa8c16',
  amber: '#faad14',
  yellow: '#fadb14',
  lime: '#a0d911',
  green: '#52c41a',
  teal: '#13c2c2',
  blue: '#1890ff',
  indigo: '#2f54eb',
  violet: '#5141DE',
  purple: '#722ed1',
  magenta: '#eb2f96',
  slate: '#6f9cb3',
  dusk: '#7781a6',
  blueGray: '#aeb9cb',
  lightGray: '#bfbfbf',
  gray: '#808080',
  darkGray: '#404040'
}

export function getColorShades(color, steps = 11) {
  let colorList = {}
  const light = chroma
    .mix(color, 'white', 0.6)
    .brighten(0.5)
    .hex()

  const dark = chroma
    .mix(color, 'black', 0.6)
    .darken(0.5)
    .hex()
  /*  var light = chroma(scaleSourceHex)
    .brighten(2.5)
    .hex()
  var dark = chroma(scaleSourceHex)
    .darken(2.9)
    .hex() */
  // Prepare color scale.
  const colors = [light, color, dark]
  colorList = chroma
    .scale(colors)
    .mode('lch')
    .colors(steps)
  // Output source color.

  return colorList
}

const colors = map(
  color => ({
    ...zipObj(
      ['l5', 'l4', 'l3', 'l2', 'l1', 'b', 'd1', 'd2', 'd3', 'd4', 'd5'],
      getColorShades(color)
    )
  }),
  {
    ...basecolors
  }
)

console.log('Colors', colors)
const color = (key, weight) => colors[key][weight]

// Give an option to use a different Dark/Light color
function readableColor(color, darktext = '', lighttext = '') {
  color = chroma(color)
  if (isNilOrEmpty(lighttext)) {
    lighttext = '#ffffff'
  }
  if (isNilOrEmpty(darktext)) {
    darktext = '#111111'
  }

  if (!color) {
    return lighttext
  }
  if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return 'rgba(0,0,0,0.4)'
  }

  const [red, green, blue] = color.rgb()
  const yiq = (red * 299 + green * 587 + blue * 114) / 1000
  return yiq >= 128 ? darktext : lighttext
}

const Row = styled.div`
  background-color: ${props => props.color};
  display: flex;
  font-size: 0.8em;
  justify-content: center;
  align-items: center;
  padding: 0.05em;
  width: 100%;
  cursor: pointer;
  outline: none;
  border: none;
  text-transform: uppercase;
  min-height: 2rem;
`
const RowContent = styled.div`
  color: ${props => props.color};
  display: 'inline-block';
  margin-bottom: 0.1rem;
`

function ColorPalRow({ name, weight }) {
  const main = color(name, weight)
  const readable = readableColor(main)

  return (
    <CopyToClipboard text={main} onCopy={() => console.log('copied', main)}>
      <Row color={main} title={`Click to Copy ${main}`}>
        <RowContent color={readable}>
          {weight}-{main}
        </RowContent>
      </Row>
    </CopyToClipboard>
  )
}

const Pal = styled.div`
  display: 'inline-block';
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  width: 20%;
  padding: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.7rem;
`

function ColorPal({ baseColor }) {
  return (
    <Pal>
      {baseColor}
      {['l5', 'l4', 'l3', 'l2', 'l1', 'b', 'd1', 'd2', 'd3', 'd4', 'd5'].map(
        step => <ColorPalRow key={step} name={`${baseColor}`} weight={step} />
      )}
    </Pal>
  )
}

const colorkeys = keys(basecolors)

const PalHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

function Color(props) {
  return (
    <div {...props}>
      <PalHolder>
        {colorkeys.map(baseColor => (
          <ColorPal key={baseColor} baseColor={baseColor} />
        ))}
      </PalHolder>
    </div>
  )
}

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  width: '50 %',
  margin: '0 auto'
}

const App = () => (
  <div style={styles}>
    <Hello name="Colors" />
    <Color />
  </div>
)

render(<App />, document.getElementById('root'))
