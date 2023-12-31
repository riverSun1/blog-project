import { useParams } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";
import LoadingSpinner from "../component/LoadingSpinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useToast from "../hooks/toast";

const ShowPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null); // 데이터를 받아와서 state에 보관.
    const [loading, setLoading] = useState(true); // 데이터 받아오기 전까진 로딩 상태 표시.
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [timer, setTimer] = useState(0);
    const { addToast } = useToast();
    const [error, setError] = useState('');

    const getPosts = (id) => {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
            setPost(res.data)
            setLoading(false);
        }).catch(e => {
            setError('something went wrong in db');
            addToast({
                type: 'danger',
                text: 'something went wrong in db'
            })
            setLoading(false);
        })
    };

    // getPosts는 한 번만 받을 것이기 때문에 useEffect를 사용한다.
    useEffect(() => {
        getPosts(id)
    }, [id]) // [] 의존성 배열. useEffect가 이 배열에 의존하기 때문
    // 배열을 넣지 않으면 ShowPage 컴포넌트가 렌더링 될때마다 useEffect()가 실행된다.


    // 다른 페이지로 이동시 메모리 정리
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);



    const printDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    }

    if (loading) { // 로딩 중일 경우 
        return <LoadingSpinner />
    }

    if (error) {
        return (<div>{error}</div>)
    }

    // 로딩 중이 아닐 경우
    return (
        <div>
            <div className="d-flex">
                <h1 className="flex-grow-1">{post.title}</h1>
                {isLoggedIn && <div>
                    <Link 
                        className="btn btn-primary"
                        to={`/blogs/${id}/edit`}>
                        Edit
                    </Link>
                </div>}
            </div>
            <small className = "text-muted">
                Created At: {printDate(post.createdAt)}
            </small>
            <hr />
            <p>{post.body}</p>
        </div>
    );
};

export default ShowPage;