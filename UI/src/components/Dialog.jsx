import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { WithContext as ReactTags } from 'react-tag-input';

const apiEnpoint = "http://localhost:3000/api/product";

const KeyCodes = {
    comma: 188,
    enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Dialog extends Component {
    state = {
        loading:false,
        tags: []
    }

    getTagObject = tagArray => {
        let filterTags = [];
        if(tagArray.length > 0){
            tagArray.forEach(tag => {
                filterTags.push({id:tag, text:tag});
              });
        }
        return filterTags;
    }
    saveProduct = async () => {
        this.setState({ loading: true });
        const data = new FormData();
        if(this.uploadInput.files[0])
            data.append('file', this.uploadInput.files[0]);
        if(this.name.value)
            data.append('name', this.name.value);
        if(this.description.value)
            data.append('description', this.description.value);
        if(this.props.dialogTags.length > 0) 
            data.append('tags', JSON.stringify(this.props.dialogTags.map(tag => tag.text)));
        if(this.price.value)
            data.append('price', this.price.value);
        if(this.props.color)
            data.append('color', JSON.stringify(this.props.color));

        let result = [];
        if(this.props.selectedProduct._id){
            data.append("_id",this.props.selectedProduct._id);
            result = await axios.put(apiEnpoint,data);
            this.setState({ loading: false });
            if(result.data.code === 251){
                toast.error(result.data.message);
                return;
            }
            if(result.status === 200){
                toast.success("Product updated succesfully.");
                this.props.onProductListLoad();
                this.props.onHideDialog();
                return;
            }
        }
        else{
            result = await axios.post(apiEnpoint,data);
            this.setState({ loading: false });
            if(result.data.code === 251){
                toast.error(result.data.message);
                return;
            }
            if(result.status === 200){
                toast.success("Product added succesfully.");
                this.props.onHideDialog();
                this.props.onProductListLoad();
                return;
            }
            else{
                toast.error("Product not found");
            }
        }
        console.log(result);
        if(result.status === 404){
           toast.error("Product not found.");
        }
        else{
            toast.error("An unexpected errror occured");
        }
        this.setState({ loading: false });
      }


    render() {         
        const { tags } = this.state;
        return ( 
            <div>
              <Modal show={this.props.show} animation={false}>
                <Modal.Header>
                    <Modal.Title>{(this.props.viewType === "edit")?"Edit Product" : "Add Product"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="name_input" className="required">Name</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="name_input" defaultValue={this.props.selectedProduct.name} ref={(ref) => { this.name = ref; }} type="text" className="form-control input-sm"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description_input">Description</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="description_input" ref={(ref) => { this.description = ref; }} defaultValue={this.props.selectedProduct.description} type="text" className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags_input">Tags</label>
                        <div className="tag_ac_wrapper">
                            <ReactTags 
                                autofocus={false}
                                tags={this.props.dialogTags}
                                handleDelete={this.props.onTagDelete}
                                handleAddition={this.props.onTagAdd}
                                delimiters={delimiters} 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price_input">Price</label>
                        <div className="input-group input-group-sm mb-1">
                            <input id="price_input" ref={(ref) => { this.price = ref; }} type="number" defaultValue={this.props.selectedProduct.price} className="form-control"/>
                        </div>
                    </div>
                    <div className="form-group pt-3">
                        <label className="color-picker-lbl">Image</label>
                        <div className="col-lg-8 color-picker">
                           <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                        </div>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={ this.saveProduct }>Save</Button>
                    <Button onClick={ this.props.onHideDialog }>Close</Button>
                </Modal.Footer>
                </Modal>
                <div id="app" className={this.state.loading? "loader" :""}></div>
            </div>
         );
    }
}
 
export default Dialog;