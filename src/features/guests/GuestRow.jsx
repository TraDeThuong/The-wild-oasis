import Table from "../../ui/Table";

export default function GuestRow({ guest = {} }) {
  const { created_at, fullName, email, nationality } = guest;

  return (
    <Table.Row>
      <div>{fullName || "-"}</div>

      <div>{email || "-"}</div>

      <div>
        <span>{nationality || "-"}</span>
      </div>

      <div>
        {created_at
          ? new Date(created_at).toLocaleDateString("en-GB")
          : "-"}
      </div>
    </Table.Row>
  );
}