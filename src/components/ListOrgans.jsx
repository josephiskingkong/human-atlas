import { useEffect, useState } from "react";
import { getOrgansByCategoryId } from "../api/get-organ";
import Organ from "./Organ";
import '../styles/llistOrgans/listOrgans.css';
import Navbar from "./Navbar";

export default function ListOrgans() {
    const [ listOrgans, setListOrgans ] = useState([]);

    useEffect(() => {
        async function setOrgans() {
            const organs =  await getOrgansByCategoryId(1);
            
            console.log("ORGANS", organs);
            
            setListOrgans(organs);
        }

        setOrgans();
    }, []);

    return (
        <>
            <Navbar></Navbar>

            <div className="listOrgans">
                { listOrgans != 0 &&
                    listOrgans.map((organ) => {
                        return (<Organ id={organ.id} name={organ.name} key={organ.id}></Organ>);
                    })
                }
            </div>
        </>
    );
}