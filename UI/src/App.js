import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Filter from './components/Filter';
import Dialog from './components/Dialog';
import ReactCard from './components/ReactCard/index';
import Pagination from './components/Pagination';
import axios from 'axios';
import _ from 'lodash';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let apiEnpoint = "http://localhost:3000/api/product";

class App extends Component {

  state = { 
    showDialog: false,
    color: '#FFF',
    displayColorPicker: false,
    products:[],
    pageSize: 6,
    currentPage: 1,
    selectedProduct:{},
    dialogViewType: "add",
    avaialbleColors: ["#FF0000", "#FFFFFF", "#0000FF", "#FFC0CB", "#008080", "#800080", "#A52A2A", "#000000", "#FFA500", "#FFFF00", "#008000", "#808080"],
    tags:[]
 }

 componentDidMount() {
   this.handleProductList();
 }

 handleProductList = async (filter) => {
    let avaialbleColors = [];
    if(filter)
      apiEnpoint = "http://localhost:3000/api/product?params="+encodeURIComponent(JSON.stringify(filter));
    const { data: products } = await axios.get(apiEnpoint);
    // if(!filter){
    //   products.forEach( product => {
    //     avaialbleColors = _.union(avaialbleColors,product.color);
    //   });
    //   this.setState({avaialbleColors});
    // }
    console.log(products);
    
    this.setState({products});
 }

  handleDialogShow = () => {
    this.setState({ selectedProduct: {}, tags:[] });
    this.setState({ showDialog: true });
  }

  handleDialogHide = () =>{
    this.setState({ showDialog: false} );
  }

  handleColorChange = (color) => {
    this.setState({ color: color.hex });
    console.log(this.state.color);
  };

  handleColorClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
    this.handleColorClose();
  };

  handleColorClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handlePageChange = page => {
    this.setState({currentPage: page});
  }

  handlePageNext = () => {
    const pagesCount = Math.ceil(this.state.products.length / this.state.pageSize);
    console.log(pagesCount, this.state.currentPage);
    if(pagesCount > this.state.currentPage)
      this.setState({currentPage: this.state.currentPage + 1});
  }

  handlePagePrevious = () => {
    if( this.state.currentPage > 1 )
      this.setState({currentPage: this.state.currentPage-1 });
  }

  handleProductEdit = (product,viewType) =>{
    let newTags = [];
    product.tags.forEach( tag => {
        newTags.push({id: tag, text:tag});
    });

    this.setState({ selectedProduct: product, color:product.color, dialogViewType:viewType, tags:newTags });
    this.setState({ showDialog: true });
  }

  handleDelete = (i) => {
    const { tags } = this.state;
    this.setState({
     tags: tags.filter((tag, index) => index !== i),
    });
}

handleAddition = (tag) => {
    this.setState(state => ({ tags: [...state.tags, tag] }));
}


  render() {
    const startIndex = ( this.state.currentPage - 1) * this.state.pageSize ;
    const products = _(this.state.products).slice(startIndex).take(this.state.pageSize).value();

    return (
      <div>
        <ToastContainer/> 
        <NavBar onShowDialog = { this.handleDialogShow }/>

        <div className="row">
          <div className="col-lg-3 filter-wrapper list-filter-wrapper">
            <Filter 
              onFilterProduct = { this.handleProductList }
              avaialbleColors = { this.state.avaialbleColors }
            />
          </div>
          <div className="mt-2 col-lg-8 list-card-wrapper">
            <div className={ this.state.products.length === 0? "no-data-div":"no-display" }>
              <span>No data Available..!</span>
            </div>
            {
                  products.map((i, j) => {
                    return (
                      <ReactCard key={j}
                      thumbnail={i.imageUrl}
                      title =  {i.name}
                      description = {i.description}
                      name = { i.name }
                      tags = { i.tags? i.tags:[] }
                      price = { i.price? i.price : 0 }
                      color = { i.color }
                      _id = { i._id }
                      editProduct = { this.handleProductEdit }
                      />
                    );
                  })
            }
            <Pagination 
              productCount= { this.state.products.length} 
              pageSize={this.state.pageSize } 
              onPageChange={this.handlePageChange}
              onPagePrevious={this.handlePagePrevious}
              onPageNext={this.handlePageNext}
              currentPage = { this.state.currentPage}
            />
          </div>
        </div>
        <Dialog 
        selectedProduct = { this.state.selectedProduct }
        show = { this.state.showDialog }
        color = { this.state.color }
        viewType = { this.state.dialogViewType }
        displayColorPicker = { this.state.displayColorPicker}
        onHideDialog = { this.handleDialogHide }
        onColorSelect = { this.handleColorChange }
        onColorClose = { this.handleColorClose }
        onColorClik = { this.handleColorClick }
        onProductListLoad = { this.handleProductList }
        onTagAdd = { this.handleAddition }
        onTagDelete = { this.handleDelete}
        dialogTags = { this.state.tags}
        />
      </div>
    );
  }
}

export default App;
