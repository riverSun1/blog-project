import PropTypes from 'prop-types';

// onClick 함수를 부모 컴포넌트에서 받아온다.

const Card = ({ title, onClick, children }) => {
    return (
        <div class="card mb-3 cursor-pointer" onClick={onClick}>
            <div class="card-body">
                <div className='d-flex justify-content-between'>
                    <div>{title}</div>
                    {children && <div>{children}</div>}
                </div>
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