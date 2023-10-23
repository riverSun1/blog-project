import { useEffect, useState, useRef } from 'react'; // rendering
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { bool } from 'prop-types';
import propTypes from 'prop-types';

const BlogForm = ({ editing }) => {
    const history = useHistory();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [body, setbody] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalBody, setOriginalBody] = useState('');
    const [Publish, setPublish] = useState(false);
    const [originalPublish, setOriginalPublish] = useState(false);
    // json-server --watch bd.json --port 3001
    // package.json에 추가해서 npm run db라고 해도 db가 실행된다.
    const [titleError, setTitleError] = useState(false);
    const [bodyError, setBodyError] = useState(false);
    // const [toasts, setToasts] = useState([]);
    const [, setToastsRerender] = useState(false); // true, false가 바뀌면 rerendering됨.
    const toasts = useRef([]);
    // useState는 setToast를 통해서 state 업데이트를 했을 때 리렌더링이 일어난다.
    // useRef를 사용하면 리렌더링이 일어나지 않는다.
    // setToast를 통해서 toast를 업데이트 할 때는 데이터가 곧바로 업데이트 되지않고
    // 컴포넌트가 리렌더링 되기 전에 마지막에 한 번에 몰아서 해줬다.
    // 근데 useRef 같은 경우에는 우리가 업데이트를 하면 즉시 업데이트가 된다.

    useEffect(() => {
        if (editing) { // 
        axios.get(`http://localhost:3001/posts/${id}`).then(res => {
            setTitle(res.data.title);
            setbody(res.data.body);
            setOriginalTitle(res.data.title);
            setOriginalBody(res.data.body);
            setPublish(res.data.publish);
            setOriginalPublish(res.data.publish);
            })
        }
    }, [id, editing]);

    const isEdited = () => { // 제목과 내용이 수정되었다면
        return title !== originalTitle
        || body !== originalBody
        || Publish !== originalPublish;
    };

    const goBack = () => {
        if (editing) {
            history.push(`/blogs/${id}`);
        } else {
            history.push('/blogs'); // 새로 글을 쓰는 곳은 id가 없다.
        }
    };

    const validateForm = () => {
        let validated = true;

        if (title === '') {
            setTitleError(true);
            validated = false;
        }
        if (body === '') {
            setBodyError(true);
            validated = false;
        }
        return validated;
    }

    const deleteToast = (id) => {
        const filteredToasts = toasts.current.filter(toast => {
            return toast.id != id; // 다를 경우 남겨두고 같으면 삭제
        });

        toasts.current = filteredToasts; // useRef // toasts.current = toast 값에 접근.
        // setToasts(filteredToasts);
        setToastsRerender(prev => !prev);
    }

    const addToast = (toast) => {
        const id = uuid4();
        const toastWithId = {
            ...toast,
            id: id
        }
        // useRef // toasts.current = toast 값에 접근.
        // 기존 toast에 새로운 toast 추가
        toasts.current = [...toasts.current, toastWithId];
        setToastsRerender(prev => !prev);
        // 기존 toast와 새로운 toast를 합친다.
        // 리렌더링을 하긴 하는데 곧바로 하는게 아니라 마지막에 모아서 해준다. (비동기적)
        // 기존에 있던 toast를 지우고 최근 꺼는 업데이트가 바로 안돼서 삭제가 안됨.
        // toast를 업데이트를 했을 때 업데이트 된 그 데이터에 접근을 해야지 삭제를 할 수 있다.
        // 이 문제를 해결하기 위해서 Hooks를 사용한다.

        //setToasts(prev => [...prev, toastWithId]);
        
        setTimeout(() => {
            deleteToast(id);
        }, 5000);
    };

    const onSubmit = () => {
        setTitleError(false);
        setBodyError(false);
        if (validateForm()) { // 유효성검사 통과
            if (editing) { // 수정
                axios.patch(`http://localhost:3001/posts/${id}`, { // patch - 일부 데이터 업데이트할 때 사용.
                    title: title,
                    body: body,
                    publish: Publish
                }).then(res => {
                    history.push(`/blogs/${id}`)
                })
            } else { // 새로 작성
                axios.post('http://localhost:3001/posts', {
                    title: title,
                    body: body,
                    publish: Publish,
                    createdAt: Date.now()
                }).then(() => {
                    addToast({
                        type: 'success',
                        text: 'Successfully created!'
                    });
                    // history.push('/admin');
                })
            }
        }
    };

    const onChangePublish = (e) => {
        setPublish(e.target.checked);
    };

    return (
        <div>
            <Toast
                toast={toasts.current}
                deleteToast={deleteToast}
            />
            <h1>{editing ? 'Edit' : 'Create'} a blog post</h1>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    className={`form-control ${titleError ? 'border-danger': ''}`}
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
            </div>

            {titleError && <div className="text-danger">
                Title is required.
            </div>}

            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea
                    className={`form-control ${bodyError ? 'border-danger': ''}`}
                    value={body}
                    onChange={(event) => {
                        setbody(event.target.value);
                    }}
                    rows="10" />
            </div>

            {bodyError && <div className="text-danger">
                Body is required.
            </div>}
            
            <div className="form-check mb-3">
                <input // 공개글 여부
                    className="form-check-input"
                    type="checkbox"
                    checked={Publish}
                    onChange={onChangePublish}
                />

                <label className="form-check-label">
                    Publish
                </label>
            </div>

            <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={editing && !isEdited()}
            >
                {editing ? 'Edit' : 'Post'}</button>

            <button
                className="btn btn-danger ms-2"
                onClick={goBack}
            >Cancel
            </button>
        </div>
    );
};

BlogForm.propTypes = {
    editing: propTypes.bool
}

BlogForm.defaultProps = {
    editing: false
}

export default BlogForm;