import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export const GET: APIRoute = async () => {

    let sec = 0;
    let interval;
    try {
        interval = setInterval(() => {
            sec++;
        }, 1000);
        //Fetching all Panels
        const records = await xata.db["panels-datatable"]
         .select([
            "id",
            "panelSlug",
            "panelTitle",
            "panelAPILink",
            "panelAPIKey",
            "panelWebsiteURL",
            "lastBackupDate"
        ]).getAll();

        //Finding atleast 10 panels that requires Backup
        let servicesCount = 0;
        let panelsSuccessAPI = [];
        let panelsFailedAPI = [];
        for (let i = 0; i < records.length; i++) {
            let APIURL= `${records[i].panelAPILink}?key=${records[i].panelAPIKey}&action=services`;
            // console.log("Working on-", APIURL);

            let panelServicesData_FRESH = [];
            //Fetching the Fresh Services
            try {
                try {
                    //Trying with GET REQUEST
                    panelServicesData_FRESH = await fetch(APIURL).then((Response) =>
                        Response.json(),
                    );
                } catch (error) {
                    panelServicesData_FRESH = []
                    console.log("Could not Fetch with GET Request");
                }
            
                try {
                    //Trying with POST REQUEST
                    panelServicesData_FRESH = await fetch(APIURL, {method : "POST"}).then((Response) =>
                        Response.json(),
                    );
                } catch (error) {
                    panelServicesData_FRESH = []
                    console.log("Could not Fetch with POST Request");
                }
            } catch (error) {
                console.log("Could not fetch with Both GET and POST");
            }

            if(panelServicesData_FRESH.length > 0){
                panelsSuccessAPI.push([records[i].panelTitle, panelServicesData_FRESH.length])
                servicesCount += panelServicesData_FRESH.length;
            }
            else
                panelsFailedAPI.push([records[i].panelTitle, panelServicesData_FRESH.length])
        }
        
        clearInterval(interval);
        return new Response(
            JSON.stringify({
                PanelsWithWorkingAPI : panelsSuccessAPI,
                PanelsWithNotWorkingAPI : panelsFailedAPI,
                totalServices : servicesCount,
                complitionTime: `Execution Time: ${sec} seconds`
            })
        )

    } catch (error) {
        return new Response(
            JSON.stringify({
               message: "An error occurred",
               error 
            }),
            { status: 300 }
        );
    }
}