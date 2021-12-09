import React from 'react'

export function ModalHeader(props) {
    return (
        <div className={"font-extrabold mb-5 text-right p-10 text-xl bg-blue-900 text-white"}>
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
            <div className={"relative top-20 -right-14 md:top-1/4 md:-right-1/4 w-3/4 h-3/4 md:w-1/2 md:h-1/2 overflow-auto bg-white shadow-lg rounded-md border-4 border-white"}>
                {props.children}
            </div>
           
        </div>
    )
}
