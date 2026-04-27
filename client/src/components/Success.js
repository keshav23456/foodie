import React from 'react'

export default function Success(props) {
  return (
    <>
    <div className="alert alert-success" role="alert">
  {props.success}
</div>
    </>
  )
}
