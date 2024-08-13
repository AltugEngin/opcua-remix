import type { MetaFunction } from "@remix-run/node";
import { useLoaderData,useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

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
    <p><span className="font-bold text-red-500">{loaderData.item} :</span> {loaderData.value}</p>
    </>
  );
}
