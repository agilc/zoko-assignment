import React from 'react';
import _ from 'lodash';

const Pagination = (props) => {
    const pagesCount = Math.ceil(props.productCount / props.pageSize);
    if(pagesCount <= 1) return null;
    const pages = _.range(1, pagesCount+1);
    return <nav>
        <ul className="pagination pagination-padding">
            <li className="page-item"><a className="page-link" onClick={props.onPagePrevious}>Previous</a></li>
            {
                pages.map(page => (
                    <li key={page} className={page === props.currentPage ? "page-item active" : "page-item"}>
                        <a className="page-link" onClick = { () => props.onPageChange(page)}>{page}</a>
                    </li>
                ))
            }
            <li className="page-item"><a className="page-link" onClick={props.onPageNext}>Next</a></li>
        </ul>
    </nav>
}

export default Pagination;