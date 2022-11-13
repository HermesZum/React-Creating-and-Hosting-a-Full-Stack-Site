import React from 'react';
import { useState } from "react";
import axios from "axios";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
        const response = await axios.post(`/api/articles/${articleName}/comment`, {
            postedBy: name,
            text: commentText,
        });

        const updatedArticle = response.data;

        onArticleUpdated(updatedArticle);

        setName('');
        setCommentText('');
    }

    return (
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            <label htmlFor="name">
                Name:
                <input value={name}
                       onChange={e => setName(e.target.value)}
                       type="text"/>
            </label>
            <label htmlFor="comment">
                Comment:
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
