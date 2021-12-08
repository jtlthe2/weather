import React from 'react'

export default function LoadingScreen() {
    return (
        <div className={"realtive flex flex-col mx-20"}>
            <div className={"animate-pulse h-1/2 grid grid-cols-2 md:grid-cols-4 justify-items-stretch border-8 rounded-md mx-8 my-5 border-gray-700 bg-gray-700"}>
                <section className={"col-span-full h-36 p-10 "}>
                </section>

                <section className={"col-span-full h-72 bg-white p-2"}>
                </section>
          </div>

          <div className={"animate-pulse h-1/2 grid grid-cols-2 md:grid-cols-4 justify-items-stretch border-8 rounded-md mx-8 my-5 border-gray-700 bg-gray-700"}>
                <section className={"col-span-full h-36 p-10 "}>
                </section>

                <section className={"col-span-full h-72 bg-white p-2"}>
                </section>
          </div>
        </div>
    )
}
