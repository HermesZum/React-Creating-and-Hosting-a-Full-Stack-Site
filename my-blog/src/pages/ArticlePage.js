import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import articles from "./article-content";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvote: 0, comments: [], canUpvote: false });
    const { canUpvote } = articleInfo;
    const { articleId } = useParams();
    const navigate = useNavigate();

    const { user, isLoading } = useUser();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { auth_token: token } : {};
            const response = await axios.get(`/api/articles/${ articleId }`, { headers });
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        if (!isLoading) {
            loadArticleInfo();
        }

    }, [isLoading, user]);

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { auth_token: token } : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers } );
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
            <h1>{ article.title }</h1>
            <div className="upvote-section">
                { user
                    ? <button onClick={addUpvote}>{ canUpvote ? 'Upvote' : 'Already Upvote' }</button>
                    : <button onClick={ () => { navigate('/login'); } }>Log in to upvote</button>
                }
                <span> </span>
                <p>This article has { articleInfo.upvote } upvote(s)</p>
            </div>

            { article.content.map((paragraph, i) => (
                <p key={ i }>{ paragraph }</p>
            )) }
            { user
                ?  <AddCommentForm
                        articleName={articleId}
                        onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}
                    />
                : <button onClick={ () => { navigate('/login'); } }>Log in to comment</button>
            }
            <CommentsList comments={ articleInfo.comments} />
        </>
    );
}

export default ArticlePage;