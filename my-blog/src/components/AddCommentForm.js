import React, { useState } from 'react';
import axios from "axios";
import useUser from "../hooks/useUser";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {

    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');
    const { user } = useUser();

    /**
     * We're using the `axios` library to make a POST-request to the `/api/articles/:articleName/comment` endpoint, passing
     * in the name of the user and the comment text
     */
    const addComment = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { auth_token: token } : {};
        const response = await axios.post(`/api/articles/${articleName}/comment`, {
            postedBy: name,
            text: commentText,
        },{
            headers,
        });
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText('');
    }

    /**
     * It takes a user object and returns the first part of the user's email address
     * @returns The substring of the email address up to the @ symbol.
     */
    let trimEmail = () => {
        const i = user.email.indexOf('@');
        return user.email.substring(0, i);
    }

    return (
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            {user && <p>You are posting as <strong>{trimEmail()}</strong></p>}
            <label htmlFor="comment">
                {/*Comment:*/}
                <textarea value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          name="comment"
                          id="comment"
                          cols="50"
                          rows="4" />
            </label>
            <button onClick={addComment}>Add Comment</button>
        </div>
    );
};

export default AddCommentForm;
