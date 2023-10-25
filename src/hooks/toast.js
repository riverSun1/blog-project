// toast.js -> toast랑 관련된 hooks.

// useState, useRef는 함수 컴포넌트 안에서만 쓸 수 있다.
// 이렇게 밖으로 빼서 사용할 수 없다.
// 이때 custom hook를 만들어 사용할 수 있다.
// useEffect, useState, useRef... 등등은 react 자체에서 제공하는 hooks이고
// 내가 자체적으로 hook을 만들어 쓸 수 있다.
// hook는 앞에 use를 붙여서 이름을 짓는다.

// BlogList와 BlogForm에서 가져다 쓰는 것일뿐 값을 공유하지는 않는다.

import { v4 as uuidv4 } from 'uuid'; // 유니크한 ID
import { addToast as add, removeToast } from '../store/toastSlice';
import { useDispatch } from 'react-redux';

const useToast = () => {
    const dispatch = useDispatch();

    const deleteToast = (id) => {
        dispatch(removeToast(id));
    }

    const addToast = (toast) => {
        const id = uuidv4();
        const toastWithId = {
            ...toast,
            id: id
        }

        dispatch(add(toastWithId));
        // // useRef // toasts.current = toast 값에 접근.
        // // 기존 toast에 새로운 toast 추가
        // toasts.current = [...toasts.current, toastWithId];
        // setToastsRerender(prev => !prev);
        // // 기존 toast와 새로운 toast를 합친다.
        // // 리렌더링을 하긴 하는데 곧바로 하는게 아니라 마지막에 모아서 해준다. (비동기적)
        // // 기존에 있던 toast를 지우고 최근 꺼는 업데이트가 바로 안돼서 삭제가 안됨.
        // // toast를 업데이트를 했을 때 업데이트 된 그 데이터에 접근을 해야지 삭제를 할 수 있다.
        // // 이 문제를 해결하기 위해서 Hooks를 사용한다.

        // //setToasts(prev => [...prev, toastWithId]);
        
        setTimeout(() => {
            deleteToast(id);
        }, 5000);
    };

    // return [
    //     addToast,
    //     deleteToast
    // ];
    // 객체로 바꿔주면 순서 상관없이 사용할 수 있다.
    return {
        addToast: addToast,
        deleteToast: deleteToast
    };
};

export default useToast;