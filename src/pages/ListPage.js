import axios from 'axios';
import { useState, useEffect } from 'react';
// state 사용시 무한 반복 => useEffect 사용.
import Card from '../component/Card';
import { Link } from 'react-router-dom ';
import { useHistory } from 'react-router';
import LoadingSpinner from '../component/LoadingSpinner';

const ListPage = () => {
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = () => {
        axios.get('http://localhost:3001/posts').then((res) => {
        setPosts(res.data);
        setLoading(false);
        })
    }

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => {
                return prevPosts.filter(post => {
                    return post.id !== id; // 지우려는 id만 빼고 다 출력.
                })
            })
        });
    }

    useEffect(() => {
        getPosts();
    }, []); // 빈 배열이기 떄문에 처음에 한번만 실행이 된다.

    const renderBlogList = () => {
        if (loading) {
            return (
                <LoadingSpinner />
            );
        }

        if (posts.length === 0) {
            return (<div>No blog posts.</div>)
        }

        // 배열에 데이터가 있을 경우
        return posts.map(post => {
            return ( // 자식 컴포넌트에 데이터를 보냄.
                <Card key={post.id} title={post.title}
                    onClick={() => history.push(`/blogs/${post.id}`)}>
                    <div>
                        <button className='btn btn-danger btn-sm'
                            onClick={deleteBlog(e, post.id)}
                        >Delete</button>
                    </div>
                </Card>
            );
        })    
    };

    return (
        <div>
            <div className='d-flex justify-content-between'>
            <h1>Blogs</h1>
            <div>
                <Link to="/blogs/create" className="btn btn-success">
                    Create New
                </Link>
            </div>
            </div>
            {renderBlogList()}
        </div>
    );
};

export default ListPage;