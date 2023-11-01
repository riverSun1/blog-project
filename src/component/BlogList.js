import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
// state 사용시 무한 반복 => useEffect 사용.
import Card from '../component/Card';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../component/LoadingSpinner';
import Pagination from './Pagination';
import { useLocation } from 'react-router-dom'; // 현재 URL 정보 가져오기
import propTypes from 'prop-types';
import useToast from '../hooks/toast';

const BlogList = ({ isAdmin }) => {
    const navigaete = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search); // '=3'
    const pageParam = params.get('page');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // 처음에 들어가면 페이지는 1.
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0); // 몇개의 페이지를 보여주느냐.
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const limit = 5; // 한 페이지당 포스트 갯수

    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfPosts / limit));
    }, [numberOfPosts]); // numberOfPosts가 바뀔 때마다 실행.

    // 뒤로가기 했을 때 이전 페이지로 가고싶을 경우
    // history.push를 하면 history에 기록이 남게된다.
    const onClickPageButton = (page) => {
        // history.push(`/admin?page=${page}`)
        navigaete(`${location.pathname}?page=${page}`)
        setCurrentPage(page);
        getPosts(page);
    }

    // 페이지 번호를 누르면 onClick 함수를 통해 여기로 숫자를 전달받는다.
    const getPosts = useCallback((page = 1) => {
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
        }).catch(e => {
            setLoading(false);
            setError('Something went wrong in database');
            addToast({
                text: 'Something went wrong',
                type: 'danger'
            })
        })
    }, [isAdmin, searchText])

    useEffect(() => { // 처음에 한 번만 실행.
        setCurrentPage(parseInt(pageParam) || 1); // null일 때 =1로 세팅
        getPosts(parseInt(pageParam) || 1) // string -> int
    }, []);

    const deleteBlog = (e, id) => {
        e.stopPropagation();

        axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
            getPosts(1); // 블로그 글 지웠을 때 1페이지로 간다. (5개 제목 표시)
            addToast({
                text: 'Successfully deleted',
                type: 'success'
            });
        }).catch(e => {
            addToast({
                text: 'The blog could not be deleted.',
                type: 'danger'
            })
        });
    };

    // useEffect(() => {
    //     getPosts(); // 데이터를 받아온다.
    // }, []); // 빈 배열이기 떄문에 처음에 한번만 실행이 된다.

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }
    
    // 자식 컴포넌트에 데이터를 보냄.
    const renderBlogList = () => {
        return posts.map(post => {
            return ( 
                <Card
                    key={post.id}
                    title={post.title}
                    onClick={() => navigaete(`/blogs/${post.id}`)}>
                    {isAdmin ? (<div>
                        <button className='btn btn-danger btn-sm'
                            onClick={(e) => deleteBlog(e, post.id)}
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
            navigaete(`${location.pathname}?page=1`)
            // search해서 enter키 입력시 항상 첫 번째 페이지를 가져오도록 하자.
            setCurrentPage(1);
            getPosts(1);
        }
    }

    if (error) {
        return <div>{error}</div>
    }

    // props로 넘긴다.
    return (
        <div>
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
                        onClick={onClickPageButton}
                    />}
                </>}
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