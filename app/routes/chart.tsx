import { useEffect, useState } from 'react';
import { useNavigate,useRevalidator } from '@remix-run/react';
import { json, MetaFunction } from '@remix-run/node';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { Line,Bar } from 'react-chartjs-2';
import { memo } from 'react';
import loadable, { type LoadableComponent } from '@loadable/component';
import { type ApexOptions } from 'apexcharts';
import Charte from "app/components/apexchart"



import { ClientOnly } from 'remix-utils/client-only';
import { useLoaderData } from '@remix-run/react/dist/components';
import { LoaderFunction } from '@remix-run/node';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:5000/api')
  return json(await response.json())
}

export default function OPC_Chart() {
  const Charte: LoadableComponent<ApexOptions> = loadable(() => import('react-apexcharts'), {
    ssr: false,
    resolveComponent: (components: any) => components.default['default'] as any,
    });
  
  const { revalidate } = useRevalidator();

  useEffect(() => {
    
    const id = setInterval(revalidate, 100);
    return () => clearInterval(id);
  }, [revalidate]);
  const navigate=useNavigate()
  const loaderData = useLoaderData<typeof loader>();
  
  const labels = [
    loaderData[0].item,
    loaderData[1].item,
    loaderData[2].item,
    /*
    loaderData[3].item,
    
    loaderData[4].item,
    
    loaderData[5].item,
    loaderData[6].item,
    loaderData[7].item,
    */
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vibration Chart',
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          loaderData[0].value,
          loaderData[1].value,
          loaderData[2].value,
          /*
          loaderData[3].value,
          
          loaderData[4].value,
          
          loaderData[5].value,
          loaderData[6].value,
          loaderData[7].value,
          */
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        barPercentage: 0.9,
        hoverBackgroundColor: 'blue',
        categoryPercentage: 0.9,
      },
     
    ],
  };

  const apexOptions = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };



  return (<>
   
    <button className="underline" onClick={()=>navigate("/OPCUA")}>Back</button>
    <ClientOnly fallback={<Fallback />}>
      {() => <Bar options={options} data={data} />}
</ClientOnly>

    
    </>
  );
}

function Fallback() {
  return <div>Yükleniyor...</div>;
}


/*

{() => <Bar options={options} data={data} />}
{()=> <Apexchart options={{apexOptions}}/>}

*/


/*
<ClientOnly fallback={<Fallback />}>{()=>
      <Apexchart2 options={apexOptions.options}
              series={apexOptions.series}
              type="bar"
              width="500"/>
}</ClientOnly>
*/

/*

<Charte options={apexOptions.options}
              series={apexOptions.series}
              type="bar"
              width="500"/>

*/