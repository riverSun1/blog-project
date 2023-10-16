import { useEffect, useState } from 'react'; // rendering
import axios from 'axios';
import { useHistory } from 'react-router';

const BlogForm = ({ editing }) => {
    const history = useHistory();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [body, setbody] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalBody, setOriginalBody] = useState('');
    // json-server --watch bd.json --port 3001
    // package.json에 추가해서 npm run db라고 해도 db가 실행된다.

    useEffect(() => {
        if (editing) { // 
        axios.get(`http://localhost:3001/posts/${id}`).then(res => {
            setTitle(res.data.title);
            setbody(res.data.body);
            setOriginalTitle(res.data.title);
            setOriginalBody(res.data.body);
            })
        }
    }, [id, editing]);

    const isEdited = () => { // 제목과 내용이 수정되었다면
        return title !== originalTitle || body !== originalBody;
    };

    const goBack = () => {
        if (editing) {
            history.push(`/blogs/${id}`);
        } else {
            history.push('/blogs'); // 새로 글을 쓰는 곳은 id가 없다.
        }
        
    };

    const onSubmit = () => {
        if (editing) {
            axios.patch(`http://localhost:3001/posts/${id}`, { // patch - 일부 데이터 업데이트할 때 사용.
                title: title,
                body: body
            }).then(res => {
                history.push(`/blogs/${id}`)
            })
        } else {
            axios.post('http://localhost:3001/posts', {
                title: title,
                body: body,
                createdAt: Date.now()
            }).then(() => {
                history.push('/blogs');
            })
        }
    };

    return (
        <div>
            <h1>{editing ? 'Edit' : 'Create'} a blog post</h1>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    className="form-control"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }} />
            </div>

            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea
                    className="form-control"
                    value={body}
                    onChange={(event) => {
                        setbody(event.target.value);
                    }}
                    rows="10" />
            </div>
            
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"/>
                <label className='form-check-label'>
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
    editing: bool
}

BlogForm.defaultProps = {
    editing: false
}

export default BlogForm;