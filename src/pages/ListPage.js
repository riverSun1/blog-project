import BlogList from '../components/BlogList';

const ListPage = () => {
    // 배열에 데이터가 있을 경우
    return posts.map(post => {
        <div>
            <div className='d-flex justify-content-between'>
                <h1>Blogs</h1>
            </div>
            <BlogList />
        </div>
    });
};

export default ListPage;