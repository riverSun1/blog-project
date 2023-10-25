import BlogForm from "../component/BlogForm";

const CreatePage = ({ addToast }) => {
    return (
        <div><BlogForm addToast={addToast}/></div>
    );
};

export default CreatePage;