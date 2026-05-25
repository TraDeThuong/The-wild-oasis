import Empty from "../../ui/Empty";
import Menus from "../../ui/Menus";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import GuestRow from "./GuestRow";
import { useGuests } from "./useGuests";

export default function GuestTable() {
  const { guests, isLoading, count } = useGuests();

  if (isLoading) return <Spinner />;
  console.log (guests.length)
  if (!guests?.length) return <Empty resourceName="guests" />;

  return (
    <Menus>
      <Table columns="1fr 2fr 2fr 1fr">
        <Table.Header>
          <div>Guest Name</div>
          <div>Email</div>
          <div>Nationality</div>
          <div>Created at</div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={(guest) => (
            <GuestRow key={guest.id} guest={guest} />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}