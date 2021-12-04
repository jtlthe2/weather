import React from 'react'

export function ModalHeader(props) {
    return (
        <div className={"font-extrabold mb-5 text-right p-10 text-xl bg-black text-white"}>
            {props.children}
        </div>
    )
}

export function ModalBody(props) {
    return (
        <div className="text-center h-1/2">
            {props.children}
        </div>
    )
}

export function ModalFooter(props) {
    return (
        <div className={""}>
            {props.children}
        </div>
    )
}

export default function Modal(props) {
    let containerClassName = "fixed top-0 right-0 z-50 w-screen h-screen bg-black bg-opacity-75";
    if(!props.show) {
        containerClassName += " invisible"
    }
    else {
        containerClassName += " visible "
    }
    return (
        <div show={props.show.toString()} className={containerClassName}>
            <div className={"relative top-1/4 -right-1/4 w-1/2 h-1/2 overflow-auto bg-white shadow-lg rounded-md border-4 border-white"}>
                {props.children}
            </div>
           
        </div>
    )
}
