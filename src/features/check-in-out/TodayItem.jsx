import styled from "styled-components";
import Tag from "../../ui/Tag"
import {Flag} from "../../ui/Flag"
import Button from "../../ui/Button"
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "./CheckoutButton"
import { useCheckout } from "./useCheckout";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

export default function TodayItem({activity}) {
  const {id, status, Guests, numNights} = activity;
  const navigate = useNavigate ()
  const {checkout, isCheckingOut} = useCheckout()

  if (!Guests) return null;
  

  return (
    <StyledTodayItem>
      {status === "unconfirmed" && <Tag type = "green"> Arriving </Tag>}
      {status === "checked-in" && <Tag type = "blue"> Departing </Tag>}
      <Flag src={Guests.countryFlag} alt={`Flag of ${Guests.country}`} />
      <Guest> {Guests.fullName}</Guest>
      <div>{numNights} nights</div>
      {status === "unconfirmed" && (
        <Button 
          size = "small" 
          variation = "primary"
          onClick={()=> navigate(`/checkin/${id}`)} >  
          Check in 
        </Button>
      )}

      {status === "checked-in" && (
        <CheckoutButton bookingId={id}/>
      )
    }
    </StyledTodayItem>
  )
}
