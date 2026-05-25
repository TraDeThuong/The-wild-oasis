import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiTrash,
  HiXCircle,
} from "react-icons/hi2";

import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";

import { differenceInDays } from "date-fns";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({ booking = {} }) {
  const {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    Guests,
    Cabins,
  } = booking;

  const navigate = useNavigate();

  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deleteBooking } = useDeleteBooking();

  // ----------------------------
  // SAFE DATA (FIXED PART)
  // ----------------------------

  const guestName = Guests?.fullName ?? "No guest";
  const email = Guests?.email ?? "";

  const cabinName = Cabins?.name ?? "No cabin";

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const safeNumNights =
    numNights ??
    (start && end ? differenceInDays(end, start) : 0);

  const safeTotalPrice = totalPrice ?? 0;

  const formattedStatus = status
    ? status.replace("-", " ")
    : "unknown";

  const formattedStartDate = start
    ? format(start, "MMM dd yyyy")
    : "No date";

  const formattedEndDate = end
    ? format(end, "MMM dd yyyy")
    : "No date";

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <Table.Row>
      {/* CABIN */}
      <Cabin>{cabinName}</Cabin>

      {/* GUEST */}
      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      {/* DATE */}
      <Stacked>
        <span>
          {startDate
            ? isToday(start)
              ? "Today"
              : formatDistanceFromNow(startDate)
            : "No date"}{" "}
          &rarr; {safeNumNights || "-"} night stay
        </span>

        <span>
          {formattedStartDate} — {formattedEndDate}
        </span>
      </Stacked>

      {/* STATUS */}
      <Tag type={statusToTagName[status] ?? "silver"}>
        {formattedStatus}
      </Tag>

      {/* PRICE */}
      <Amount>{formatCurrency(safeTotalPrice)}</Amount>

      {/* ACTIONS */}
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />

          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiXCircle />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See Details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-in" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => checkout(bookingId)}
                disabled={isCheckingOut}
              >
                Check out
              </Menus.Button>
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>
                Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="bookings"
              disabled={isDeleting}
              onConfirm={() => deleteBooking(bookingId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;