import React from 'react';
import './styles.scss';

class ReactCard extends React.Component {

  render() {
    let {
      thumbnail,
      title,
      description,
      tags,
      price
    } = this.props;
    return (
      <div className="thumb-wrapper">
        <a className='card-link'>
            <div className="card tagged-content-card">
              <div className='card-overlay'>
                <div className='overlay' style={{ backgroundImage: `url(${thumbnail})` }} />
              </div>
              <div className='card-content'>
              <div className='thumbnail'>
                <img src={thumbnail} />
              </div>
              <div className='text'>
                <div className='title'>
                {title}
              </div>
              <div className='description'>
                {description}
              </div>
              <div className='tags tag-wrapper'>
              {
                tags.map((tag, i) => {
                  return (
                    <span key={tag} className='tag'>
                      {tag}
                    </span>
                  );
                })
              }
              </div>
              <div className="row mt-2">
              <div className="delete col-md-6 mr-4 pr-5">
                <i className="fa fa-inr product-edit" title="Price" aria-hidden="true">{price}</i>
              </div>
              <div className="edit col-md-3 pr-3 ml-4">
                <i className="fa fa-pencil product-edit" aria-hidden="true" title="Edit"  onClick = { () => this.props.editProduct(this.props,"edit")}></i>
              </div>
              </div>
              </div>
          </div>
          </div>
        </a>
      </div>

    );
  }
}

export default ReactCard;
