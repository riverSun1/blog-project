import propTypes from "prop-types";
// 현재 페이지를 props로 받아오기 위함

const Pagination = ({ currentPage, numberOfPages, onClick, limit }) => {
    const currentSet = Math.ceil(currentPage/limit);
    const lastSet = Math.ceil(numberOfPages/limit); // 5개로 나뉜 세트의 갯수. 마지막 세트를 의미하기도함.
    const startPage = limit * (currentSet - 1) + 1; // 5개로 나뉜 세트의 첫번째 페이지 수.
    const numberOfPageForSet = currentSet === lastSet ? numberOfPages%limit : limit // 현재 세트가 마지막 세트라면 4개만 보여주고 아니면 그대로 5개.
    // 마지막이면 11,12,13,14 총 4개. 아니면 1,2,3,4,5 또는 6,7,8,9,10 5개씩.
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {currentSet !== 1 && <li className="page-item">
                    <div
                        className="page-link cursor-pointer" href="#"
                        onClick={() => onClick(startPage - limit)}
                    >
                        Previous
                    </div>
                </li>}
                {Array(numberOfPageForSet) // 1,2,3,4,5
                    .fill(startPage)
                    .map((value, index) => value + index)
                    .map((pageNumber) => {
                        return (
                        <li
                            key={pageNumber}
                            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                        >
                            <div
                                className="page-link cursor-pointer"
                                onClick={() => {
                                    onClick(pageNumber); // 클릭한 페이지 번호로 변경.
                                }}
                            >
                                {pageNumber}
                            </div>
                        </li>)
                    })}
                {currentSet !== lastSet && <li className="page-item">
                    <div
                        className="page-link cursor-pointer" href="#"
                        onClick={() => onClick(startPage + limit)}
                    >
                        Next
                    </div>
                </li>}
            </ul>
        </nav>
    )
}

Pagination.propTypes = {
    currentPage: propTypes.number,
    numberOfPages: propTypes.number.isRequired,
    onClick:propTypes.func.isRequired,
    limit: propTypes.number
}

Pagination.defaultProps = {
    currentPage: 1,
    limit: 5
}

export default Pagination;