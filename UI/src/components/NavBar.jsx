import React, { Component } from 'react';

class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <span className="navbar-brand">Product Search</span>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto"></ul>
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.props.onShowDialog}>Add Product</button>
                </div>
            </nav>
         );
    }
}
 
export default NavBar;