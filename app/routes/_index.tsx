import type { MetaFunction } from "@remix-run/node";
import { useLoaderData,useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "OPCUA Client" },
    { name: "OPCUA Client", content: "Welcome" },
  ];
};



export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:5000/api')
  return json(await response.json())
}

export default function Index() {

  const loaderData = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const id = setInterval(revalidate, 1000);
    return () => clearInterval(id);
  }, [revalidate]);

  const newData=loaderData;
  
  //console.log(newData.map((kk)=>{console.log(newData[kk][0],"  :  ",newData[kk][1])}))
  
  return (<>
    <h1 className="text-blue-500 text-3xl">OPCUA Client</h1>
    <p><span className="text-red-500 font-bold mr-5">{newData[0][0]}</span><span className="text-blue-500 font-bold">{newData[0][1]}</span></p>
    <p><span className="text-red-500 font-bold mr-5">{newData[1][0]}</span><span className="text-blue-500 font-bold">{newData[1][1]}</span></p>  
    </>
  );
}


export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}