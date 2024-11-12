import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/llistOrgans/organ.css';

export default function Organ({ id, name }) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(id);
        console.log(name);
    }, [])

    const handleClick = () => {
        navigate(`/human-atlas/${id}`);
    };

    return (
        <div onClick={ handleClick } className="organ" style={{ cursor: 'pointer' }}>
            <p className="id">{id}</p>
            <p className="name">{name}</p>
        </div>
    );
}