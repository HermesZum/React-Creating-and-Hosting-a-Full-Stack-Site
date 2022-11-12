import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import App from "../App";
import ArticlePage from "../pages/ArticlePage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/ArticlePage">
                <ArticlePage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;