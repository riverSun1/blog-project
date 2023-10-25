import PropTypes from 'prop-types';

// onClick 함수를 부모 컴포넌트에서 받아온다.

// 리덕스 툴킷에서 state를 정의하는 방법.
// state를 컴포넌트에서 가져와서 사용하는 법
// create Slice를 통해서 state를 정의하고
// state를 컴포넌트에서 가져와 사용하는 방법
// useSelector를 이용해서 state에서 원하는 데이터만 뽑아올 수 있다.

const Card = ({ title, onClick, children }) => {
    
    return (
        <div
            className="card mb-3 cursor-pointer"
            onClick={onClick}
        >
            <div className="card-body py-2 d-flex align-items-center">
                <div className="flex-grow-1">{title}</div>
                {children && <div>{children}</div>}
            </div>
        </div>
    );
};

Card.prototype = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    onclick: PropTypes.func,
};

Card.defaultProps = {
    children: null,
    onClick: () => {},
};

export default Card;

// npm install prop-types