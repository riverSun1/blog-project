import propTypes from "prop-types";

// 블로그 글을 삭제했을 때 toast 메시지를 보여줌.
const Toast = ({ toasts, deleteToast }) => {
  return (
    <div className="position-fixed bottom-0 end-0 p-2">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            // toast 메시지를 누르면 삭제됨.
            onClick={() => {deleteToast(toast.id)}}
            // type이 있으면 넣어주고 없으면 success.
            className={`cursor-pointer alert alert-${toast.type || 'success'} m-0 py-2 mt-2`}
          >
            {toast.text}
          </div>
        );
      })}
    </div>
  );
}

// props를 받을 때.
// array가 있고 array안에 object가 들어갈건데
// 그 각각의 object안에 text가 들어가도록 한다.
// 여러개 알림창에 대한 정보를 받아오는데
// arrray그안에 여러개 object를 받아오는 것이고
// 그 각각의 object 안에 text가 들어있다.
Toast.propTypes = {
  toasts: propTypes.arrayOf(propTypes.shape({
    text: propTypes.string,
    type: propTypes.string
  })).isRequired,
  deleteToast: propTypes.func.isRequired,
}

Toast.defaultProps = {
  toasts: []
}

export default Toast;