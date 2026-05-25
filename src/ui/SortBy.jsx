import { useSearchParams } from "react-router-dom";
import Select from "./Select";

export default function SortBy({options}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const sortBy = searchParams.get("sortBy") || options.at(0)?.value || "";
        // console.log (sortBy)

    function handleChange (e) {
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.set("sortBy", e.target.value)
        if (nextSearchParams.get("page")) nextSearchParams.set("page", 1)
        setSearchParams(nextSearchParams)
    }
  return (
    <Select 
        options={options} 
        type = "white" 
        onChange = {handleChange}
        value={sortBy}/>
  )
}
