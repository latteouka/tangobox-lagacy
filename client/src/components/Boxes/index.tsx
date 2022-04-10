import React from 'react'
import AllBoxes from './AllBoxes'

interface BoxesProps {
  user: any
}

const Boxes: React.FC<BoxesProps> = ({ user }) => {
  return <AllBoxes user={user} />
}

export default Boxes
