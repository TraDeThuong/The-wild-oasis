import { HiArrowRightOnRectangle } from "react-icons/hi2"
import ButtonIcon from "../../ui/ButtonIcon"
import {useLogout} from "../../features/authentication/useLogout"
import SpinnerMini from "../../ui/SpinnerMini"


export default function Logout() {

    const {logout, isLoading: isLoadingOut} = useLogout ()
  return (
    <ButtonIcon
        disabled = {isLoadingOut}
        onClick={logout}>

      {isLoadingOut ? <SpinnerMini/> :<HiArrowRightOnRectangle/>}
    </ButtonIcon>
  )
}
