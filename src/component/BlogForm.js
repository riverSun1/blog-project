import { useEffect, useState } from 'react'; // rendering
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import propTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import useToast from '../hooks/toast';
// import Toast from './Toast';

const BlogForm = ({ editing }) => {
    const navigaete = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalBody, setOriginalBody] = useState('');
    const [Publish, setPublish] = useState(false);
    const [originalPublish, setOriginalPublish] = useState(false);
    // json-server --watch bd.json --port 3001
    // package.json에 추가해서 npm run db라고 해도 db가 실행된다.
    const [titleError, setTitleError] = useState(false);
    const [bodyError, setBodyError] = useState(false);
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const [, setToastsRerender] = useState(false); // true, false가 바뀌면 rerendering됨.
    // const toasts = useRef([]);

    // useState는 setToast를 통해서 state 업데이트를 했을 때 리렌더링이 일어난다.
    // useRef를 사용하면 리렌더링이 일어나지 않는다.
    // setToast를 통해서 toast를 업데이트 할 때는 데이터가 곧바로 업데이트 되지않고
    // 컴포넌트가 리렌더링 되기 전에 마지막에 한 번에 몰아서 해줬다.
    // 근데 useRef 같은 경우에는 우리가 업데이트를 하면 즉시 업데이트가 된다.

    useEffect(() => {
        if (editing) {
            axios.get(`http://localhost:3001/posts/${id}`).then(res => {
                setTitle(res.data.title);
                setOriginalTitle(res.data.title);
                setBody(res.data.body);
                setOriginalBody(res.data.body);
                setPublish(res.data.publish);
                setOriginalPublish(res.data.publish);
                setLoading(false);
            }).catch(e => {
                setError('something went wrong in db');
                addToast({
                    type: 'danger',
                    text: 'something went wrong in db'
                })
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, [id, editing]);

    const isEdited = () => { // 제목과 내용이 수정되었다면
        return title !== originalTitle
            || body !== originalBody
            || Publish !== originalPublish;
    };

    const goBack = () => {
        if (editing) {
            navigaete(`/blogs/${id}`);
        } else {
            navigaete('/blogs'); // 새로 글을 쓰는 곳은 id가 없다.
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
                    console.log(res);
                    navigaete(`/blogs/${id}`)
                }).catch(e => {
                    addToast({
                        type: 'danger',
                        text: 'We could not update blog.'
                    })
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
                    navigaete('/admin');
                }).catch(e => {
                    addToast({
                        type: 'danger',
                        text: 'We could not create blog.'
                    })
                })
            }
        }
    };

    const onChangePublish = (e) => {
        setPublish(e.target.checked);
    };

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return (<div>{error}</div>)
    }

    return (
        <div>
            <h1>{editing ? 'Edit' : 'Create'} a blog post</h1>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    className={`form-control ${titleError ? 'border-danger' : ''}`}
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
                {titleError && <div className="text-danger">
                    Title is required.
                </div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea
                    className={`form-control ${bodyError ? 'border-danger' : ''}`}
                    value={body}
                    onChange={(event) => {
                        setBody(event.target.value);
                    }}
                    rows="10" />
                {bodyError && <div className="text-danger">
                    Body is required.
                </div>}
            </div>
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