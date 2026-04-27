import React from 'react'

export default function Error(props) {
    return (
        <>
            <div className="alert alert-danger" role="alert">
                {props.error}
            </div>
        </>
    )
}
