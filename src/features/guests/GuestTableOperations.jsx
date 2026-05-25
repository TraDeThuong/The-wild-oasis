import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

export default function GuestTableOperations() {
  return (
    <TableOperations>
        <SortBy
            options = {[
                {value:"startDate-desc", label:"Sort by date (recent first)"},
                {value: "startDate-asc", label: "Sort by date (earlier first)" }
            ]}/>
    </TableOperations>
  )
}
