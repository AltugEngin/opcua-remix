# A Sample OPCUA Client App

- Technologies used ==> Remix.run | Chart.js | Node.js (node-opcua) | Express.js

- This template can be used to develop Remix.run frontend applications which need to consume periodically changing OPCUA variables. Project consists of two seperate servers.

        1) BACKEND app/opcua_server/app.js ==> 
        This server should always run with the command
        ```
        node app.js
        ```
        You will need to change `endpoint url` and `items.js` according to your needs

        2) FRONTEND
        Remix.run server
        ```
        ```  
After running backend server successfully you should see variables changing which are described in `items.js` 

![dashboard](https://github.com/user-attachments/assets/cd52a3e6-a1ef-4caf-9412-a4349733199d)
![chart](https://github.com/user-attachments/assets/e2c09bfb-b767-4d1e-84fb-3d672a16fbbc)
