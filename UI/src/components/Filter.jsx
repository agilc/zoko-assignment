import React, { Component } from 'react';
import ColorPicker from './ColorPicker';
import { Button } from 'react-bootstrap';

class Filter extends Component {
    state = { 
        color : '',
        displayColorPicker: false
     }

     handleColorClose = () => {
        this.setState({ displayColorPicker: false })
      };
    
      handleColorChange = (color) => {
        this.setState({ color: color.hex }, () => {
            this.handleColorClose();
        })
        
      };
    
      handleColorClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      }

      clearFilter = async () => {
        await this.setState({ color: '' });
        this.name.value = '';
        this.description.value = '';
        this.tag.value = '';
        this.minPrice.value = '';
        this.maxPrice.value = '';
        this.filterProduct();
      }

      filterProduct = () => {
        const data = {};
        if(this.name.value) data['name']= this.name.value;
        if(this.description.value) data['description'] = this.description.value;
        if(this.tag.value) data['tags'] = this.tag.value;
        if(this.minPrice.value) data['minPrice'] = this.minPrice.value;
        if(this.maxPrice.value) data['maxPrice'] = this.maxPrice.value;
        if(this.state.color) data['color'] = this.state.color;
        this.props.onFilterProduct(data);
      }

    render() { 
        return ( 
            <div className=" pl-2 pr-2 mt-3 filter-border">
                <h3>Filter</h3>
                <form>
                    <div className="form-group">
                        <label htmlFor="name_input">Name</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="name_input" type="text" ref={(ref) => { this.name = ref; }} className="form-control input-sm"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description_input">Description</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="description_input" type="text" ref={(ref) => { this.description = ref; }} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tag_input">Tags</label>
                        <span className="font-size-small"> (Enter comma separated values) </span>
                        <div className="input-group input-group-sm mb-1">
                            <input id="tag_input" type="text" ref={(ref) => { this.tag = ref; }} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price_input">Price</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="price_input" type="number" placeholder="Min" className="form-control" ref={(ref) => { this.minPrice = ref; }}/>
                            <input id="price_input" type="number" placeholder="Max" className="form-control" ref={(ref) => { this.maxPrice = ref; }}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price_input" className="color-picker-lbl">Color</label>
                        <div className="input-group input-group-sm mb-1 color-picker col-lg-5">
                        <ColorPicker
                                color = { this.state.color }
                                avaialbleColors = { this.props.avaialbleColors }
                                displayColorPicker = { this.state.displayColorPicker }
                                onColorSelect = { this.handleColorChange }
                                onColorClose = { this.handleColorClose }
                                onColorClick = { this.handleColorClick }
                            />
                        </div>
                    </div>
                    <div className="filter-btn-wrapper">
                        <Button bsSize="small" onClick={this.clearFilter} className="mr-3">Clear</Button>
                        <Button bsSize="small" bsStyle="primary" onClick={ this.filterProduct }>Apply Filter</Button>
                    </div>
                </form>
            </div>
         );
    }
}
 
export default Filter;