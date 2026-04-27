import styled from "styled-components";
import Spinner from "../../ui/Spinner"
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";
import Stas from "../../features/dashboard/Stats"
import {useCabins} from "../../features/cabins/useCabins"
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;


export default function DashboardLayout() {

  const {isLoading: isBookingsLoading , bookings} = useRecentBookings()
  const {isLoading: isStaysLoading, confirmedStays, numDays} = useRecentStays()
  const {cabins, isLoading: isCabinsLoading} = useCabins()

  if ((isBookingsLoading) || (isStaysLoading) || (isCabinsLoading)) return <Spinner/>

  return (
    <StyledDashboardLayout>
      <Stas  
        bookings = {bookings} 
        confirmedStays = {confirmedStays} 
        numDays = {numDays} 
        cabinCount = {cabins.length}/>

      <TodayActivity/>

      <DurationChart confirmedStays = {confirmedStays}/>

      <SalesChart bookings={bookings} numdDays={numDays}/>

    </StyledDashboardLayout>
  )
}
