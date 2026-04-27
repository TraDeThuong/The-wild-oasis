// import { useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

export default function AddCabin () {
  return (
      <div>
        <Modal>
          <Modal.Open opens ="cabin-form">
            <Button>Add new Cabin</Button>
          </Modal.Open>
          <Modal.Window name = "cabin-form">
            <CreateCabinForm/>
          </Modal.Window>

          {/* <Modal.Open opens ="table"> 
            <Button>Show Table</Button>
          </Modal.Open>
          <Modal.Window name = "table">
            <CabinTable/>
          </Modal.Window> */}

        </Modal>
      </div>
  )
}

// THIS FUNCTION IS USED FOR MODAL-V1
// function AddCabin() {
//     const [isOpenModel, setIsOpenModal] = useState (false);

    
//   return (
//     <div>
//       <Button
//           onClick = {()=> setIsOpenModal((show) => !show)}> 
//           Add new cabin 
//         </Button>
//         {isOpenModel && 
//             <Modal onClose = {()=> setIsOpenModal(false)}>
//                 <CreateCabinForm onCloseModal = {()=> setIsOpenModal(false)}/>
//             </Modal>}
//     </div>
//   )
// }

