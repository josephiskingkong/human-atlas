import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import clear from '../../service/dom-purify/purify';
import "../../styles/components/markdown.css";
import { useEffect, useState } from 'react';

export default function Markdown({ children }) {
    const [ markdownText, setMarkdownText ] = useState('');
    
    useEffect(() => {
        setMarkdownText(clear(children));
    }, [children]);

    return (
        <div className='markdown'>
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >{ markdownText }</ReactMarkdown>
        </div>
    );
}