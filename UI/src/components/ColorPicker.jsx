import React from 'react'
import reactCSS from 'reactcss'
import { TwitterPicker } from 'react-color'

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false
  };


  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${ this.props.color }`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <React.Fragment>
        <div style={ styles.swatch } onClick={ this.props.onColorClick }>
          <div style={ styles.color } />
        </div>
        { this.props.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.props.onColorClose }/>
          <TwitterPicker colors={ this.props.avaialbleColors } onChange={ this.props.onColorSelect } />
        </div> : null }

      </React.Fragment>
    )
  }
}

export default SketchExample