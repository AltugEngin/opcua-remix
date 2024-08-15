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
  


  return (<>
    <h1 className="text-blue-500 text-3xl">OPCUA Client</h1>
    <p><span className="text-red-500 font-bold mr-5">{loaderData[0].item}</span><span className="text-blue-500 font-bold">{loaderData[0].value}</span></p>
    <p><span className="text-red-500 font-bold mr-5">{loaderData[1].item}</span><span className="text-blue-500 font-bold">{loaderData[1].value}</span></p>
    <p><span className="text-red-500 font-bold mr-5">{loaderData[2].item}</span><span className="text-blue-500 font-bold">{loaderData[2].value}</span></p>  
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