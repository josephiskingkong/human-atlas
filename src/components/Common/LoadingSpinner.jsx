import { GridLoader } from "react-spinners";
import '../../styles/components/loading-spinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
        <GridLoader color="#3754ED" cssOverride={{}} size={25}/>
    </div>
);
}