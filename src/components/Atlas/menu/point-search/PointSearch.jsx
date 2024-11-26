import { useEffect, useState } from "react";
import { search } from "../../../../service/fuse/search";
import { useSelector } from "react-redux";
import SearchItem from "./SearchItem";
import "../../../../styles/components/menu/point-search.css";

export default function PointSearch({ points }) {
    const [ searchList, setSearchList ] = useState([]);
    const searchString = useSelector((state) => state.atlas.searchString);

    useEffect(() => {
        setSearchList(points);
    }, []);

    useEffect(() => {
        if (searchString === '') {
            setSearchList(points);
            console.log(points);
            return;
        }


        setSearchList(search(points, searchString));
    }, [searchString]);

    return (
        <div className="point-search-container">
            <h2>Результаты поиска</h2>
            { searchList && searchList.length !== 0 &&
                searchList.map((point) => (
                    <SearchItem point={ point } key={ point.id }/>
                ))
            }

            { searchList.length === 0 &&
                <h2>По вашему запросу ничего не найдено :(</h2>
            }
        </div>
    );
}