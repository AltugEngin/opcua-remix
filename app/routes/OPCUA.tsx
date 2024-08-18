import type { MetaFunction } from "@remix-run/node";
import { useLoaderData,useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { Layout } from "../components/layout"
import { useNavigate } from "@remix-run/react";

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
  const navigate=useNavigate()
  const loaderData = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const id = setInterval(revalidate, 100);
    return () => clearInterval(id);
  }, [revalidate]);
  
  
  const rows = [];
  const items=[];
  const values=[];
  for (let i = 0; i < loaderData.length; i++) {
    rows.push(<p key={i}><span className="text-blue-900 font-bold drop-shadow-md mr-5">{loaderData[i].item}</span><span className="text-yellow-500 font-bold">{loaderData[i].value}</span></p>);
    items.push(loaderData[i].item)
    values.push(loaderData[i].value)
}
//const result = Object.keys(items).map((key) => [items[key]]);




  return (
  <Layout>
    
    <h1 className="text-orange-500 text-3xl">OPCUA Client</h1>
     {rows}
     <button className="mx-10 my-10 bg-slate-600 px-5 py-5 rounded-md text-white" onClick={()=>navigate("/chart")}>Graph</button>
     </Layout>
    
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