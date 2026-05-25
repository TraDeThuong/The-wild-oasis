import React from 'react'
import Row from '../ui/Row'
import Heading from '../ui/Heading'
import GuestTable from '../features/guests/GuestTable'
import GuestTableOperations from '../features/guests/GuestTableOperations'

export default function Guests() {
  return (
    <>
      <Row type = "horizontal">
        <Heading as="h1">
            All Guests
        </Heading>
        <GuestTableOperations/>
      </Row>
      <GuestTable/>
    </>
  )
}
