import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
// state 사용시 무한 반복 => useEffect 사용.
import Card from '../component/Card';
import { useHistory } from 'react-router';
import LoadingSpinner from '../component/LoadingSpinner';
import Pagination, { bool } from './Pagination';
import { useLocation } from 'react-router-dom'; // 현재 URL 정보 가져오기
import propTypes from 'prop-types';
// import { v4 as uuidv4 } from 'uuid'; // 유니크한 ID
import useToast from '../hooks/toast';

const BlogList = ({ isAdmin }) => {
    const history = useHistory();
    const location = useLocation();
    const params = new URLSearchParams(location.search); // '=3'
    const pageParam = params.get('page');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // 처음에 들어가면 페이지는 1.
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0); // 몇개의 페이지를 보여주느냐.
    const [searchText, setSearchText] = useState('');
    // const [toasts, setToasts] = useState([]);
    
    const { addToast } = useToast();
    // const [, setToastsRerender] = useState(false); // true, false가 바뀌면 rerendering됨.
    // const toasts = useRef([]);
    const limit = 5; // 한 페이지당 포스트 갯수

    // 한 페이지당 포스트갯수
    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfPosts / limit));
    }, [numberOfPosts]); // numberOfPosts가 바뀔 때마다 실행.

    // 뒤로가기 했을 때 이전 페이지로 가고싶을 경우
    // history.push를 하면 history에 기록이 남게된다.
    const onClickPageButton = (page) => {
        // history.push(`/admin?page=${page}`)
        history.push(`${location.pathname}?page=${page}`)
        setCurrentPage(page);
        getPosts(page);
    }

    // 페이지 번호를 누르면 onClick 함수를 통해 여기로 숫자를 전달받는다.
    const getPosts =(page = 1) => {
        // setCurrentPage(page);
        // 블로그 글 내림차순 정렬
        let params = { // getPosts 파라미터
            _page: page,
            _limit: limit,
            _sort: 'id',
            _order: 'desc',
            // publish: true
            title_like: searchText // 일부분만 일치하더라도 검색가능.
        }

        if (!isAdmin) {
            params = { ...params, publish: true };
        }

        // axios.get(`http://localhost:3001/posts?_page=${page}&_limit=5&_sort=id&_order=desc`, {
        axios.get(`http://localhost:3001/posts`, {
            params: params
        }).then((res) => {
            setNumberOfPosts(res.headers['x-total-count']);
            setPosts(res.data);
            setLoading(false);
        })
    }

    useEffect(() => { // 처음에 한 번만 실행.
        setCurrentPage(parseInt(pageParam) || 1); // null일 때 =1로 세팅
        getPosts(parseInt(pageParam) || 1); // string -> int
    }, []);

    // npm i uuid
    // true일 경우 들어가고 false일 경우 들어가지 않는다.
    // const deleteToast = (id) => {
    //     const filteredToasts = toasts.current.filter(toast => {
    //         return toast.id != id; // 다를 경우 남겨두고 같으면 삭제
    //     });
    //     toasts.current = filteredToasts;
    //     setToasts(filteredToasts);
    //     setToastsRerender(prev => !prev);
    // }

    // const addToast = (toast) => {
    //     const id = uuid4();
    //     const toastWithId = {
    //         ...toast,
    //         id: id
    //     }
    //     toasts.current = [
    //         ...toasts.current,
    //         toastWithId
    //     ];
    //     setToastsRerender(prev => !prev);
    //     // setToasts(prev => [...prev, toastWithId]); // 기존 toast와 새로운 toast를 합친다.
        
    //     setTimeout(() => {
    //         deleteToast(id);
    //     }, 5000);
    // };

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            setPosts(prevPosts => {
                return prevPosts.filter(post => {
                    return post.id !== id; // 지우려는 id만 빼고 다 출력.
                })
            })
            // 삭제가 되었을 때 toast를 추가.
            addToast({
                text: 'Successfully deleted',
                type: 'success'
            });
        });
    }

    // useEffect(() => {
    //     getPosts(); // 데이터를 받아온다.
    // }, []); // 빈 배열이기 떄문에 처음에 한번만 실행이 된다.

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (posts.length === 0) {
        return (<div>No blog posts.</div>)
    }

    const renderBlogList = () => {
        return posts.filter(post => {
            return isAdmin || post.publish
        }).map(post => {
            return ( // 자식 컴포넌트에 데이터를 보냄.
                <Card
                    key={post.id}
                    title={post.title}
                    onClick={() => history.push(`/blogs/${post.id}`)}>
                    {isAdmin ? (<div>
                        <button className='btn btn-danger btn-sm'
                            onClick={deleteBlog(e, post.id)}
                        >Delete</button>
                    </div>) : null}
                </Card>
            );
        })
    }

    // 누른 키가 enter인 경우 post를 통해서 데이터를 가져오고
    // enter가 아닐시 데이터를 받아오지 않는다.
    // e -> onKeyUpEvent를 받아온다.
    const onSearch = (e) => {
        if (e.key === 'Enter') {
            history.push(`${location.pathname}?page=1`)
            // search해서 enter키 입력시 항상 첫 번째 페이지를 가져오도록 하자.
            setCurrentPage(1);
            getPosts(1);
        }
    }

    // props로 넘긴다.
    return (
        <div>
            {/* <Toast
                toasts={toasts}
                deleteToast={deleteToast}
            /> */}
            <input
                type="text"
                placeholder='Search...'
                className='form-control'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={onSearch} // 타자를 칠 때마다 검색이 됨.
            />
            <hr />
            {posts.length === 0
                ? <div>No blog posts.</div>
                : <>
                    {renderBlogList()}
                    {numberOfPages > 1 && <Pagination
                        currentPage={currentPage}
                        numberOfPages={numberOfPages} // 1,2,3,4,5
                        // onClick={getPosts}
                        onClick={onClickPageButton}
                    />}
                </>
            }

        </div>
    )
};

BlogList.propTypes = {
    isAdmin: propTypes.bool
};

BlogList.defaultProps = {
    isAdmin: false
}

export default BlogList;