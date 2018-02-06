import React from 'react'
import { render } from 'react-dom'
import Hello from './Hello'
import chroma from 'chroma-js'
import styled,{css, injectGlobal} from 'styled-components'
import { map, keys, zipObj, anyPass, isEmpty, isNil } from 'ramda'

injectGlobal`
body {
  background-color: #3b404e;

  display: flex;
  justify-content: center;
  align-items: center;
}
`

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
  blue: '#339af0',
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



export const ColorWrap = styled.div``;
export const ColorGroup = styled.div``;

export const ColorTitle = styled.span`

  font-size: 1.2rem;
  text-transform: capitalize;
  font-weight: bold;

`;


export const ColorChip = styled.div`

`;

export const ColorChipBg = styled.div`
  min-height: 5rem;
  min-width:5rem;
background-color: ${props => props.color};
  border-radius: 2px;
cursor:pointer;
  position: relative;
`;

export const ColorChips = styled.div`
    display: grid;
    width: 100%;
  grid-template-columns: repeat(11, 1fr);
  grid-auto-rows: 120px;
  grid-gap: 0rem;

`



export const ColorHex = styled.div`
  padding: .2rem .3rem;
    
    text-align: start;
  width: 100%;

  font-size: 14px;

  color: gray;

  line-height: 1.3;
`;

export const ColorName = styled.div`
  padding: .4rem .3rem .2rem;

  text-transform: uppercase;

  text-align: left;

  font-size: 14px;

  font-weight: 500;
`;

const ColorChipsWrap = styled.div`

align-self: center;
  justify-self: center;
`


function ColorPalRow({ name, weight }) {
  const main = color(name, weight)
  const readable = readableColor(main)

  return (
    <CopyToClipboard text={main} onCopy={() => console.log('copied', main)}>
      <ColorChip>
        <ColorChipBg color={main} title={`Click to Copy ${main}`}>
        </ColorChipBg>
        <ColorName>{name} {weight}</ColorName>
        <ColorHex>{main}
        </ColorHex>
      </ColorChip>
    </CopyToClipboard>
  )
}



function ColorPal({ baseColor }) {
  return (
    
      <ColorChipsWrap>
      <ColorChips>
      {['l5', 'l4', 'l3', 'l2', 'l1', 'b', 'd1', 'd2', 'd3', 'd4', 'd5'].map(
        step => <ColorPalRow key={step} name={`${baseColor}`} weight={step} />
      )}
      </ColorChips>
      </ColorChipsWrap>
   
  )
}

const colorkeys = keys(basecolors)

const PalHolder = styled.div`
  background-color: #fff;
  padding: 2rem;

 
`

function Color(props) {
  return (
    
      <PalHolder {...props}>
        {colorkeys.map(baseColor => (
          <ColorGroup>
            <ColorTitle>{baseColor}</ColorTitle>
          <ColorPal key={baseColor} baseColor={baseColor} />
          </ColorGroup>
        ))}
      </PalHolder>
   
  )
}

const AppStyle = styled.div`

`

const Header = styled.h1`
 text-align:center;
 color:#fff;
`

const App = () => (
  <AppStyle>
< Header > Hello Colors!</Header >
   <Color />
  </AppStyle>
)

render(<App />, document.getElementById('root'))

 // < Header > Header</Header >
 //   <Color />