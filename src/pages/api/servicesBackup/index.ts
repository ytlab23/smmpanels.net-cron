import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";
import { compareServices, getAPIPath } from "../../js/utils";

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export const PUT: APIRoute = async () => {

    try {
        let panelsForBackUp : any = [];
        let counter = 0
        
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
        let currentDate = new Date();
        for (let i = 0; i < records.length; i++) {
            if(records[i].lastBackupDate == null){
                panelsForBackUp.push(records[i])
                counter++;
                break;
            }
        }

        if(counter == 1){
            for (let i = 0; i < records.length; i++) {
                
                if(records[i].lastBackupDate != null || records[i].lastBackupDate != undefined){
                    
                    const timeDifference = Math.abs(currentDate.getTime() - records[i].lastBackupDate.getTime() ); // in milliseconds
                    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
                    if(dayDifference >= 7){
                        panelsForBackUp.push(records[i]);
                        counter++;
                    }
                    
                }
                
                if(records[i].lastBackupDate == null){
                    
                    panelsForBackUp.push(records[i])
                    counter++;
                }
    
                if(counter == 1) break;
            }
        }
        
        return new Response(
            JSON.stringify({
                panelsForBackUp
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

export const POST: APIRoute = async ({request}) => {
    const data = await request.formData();
    
    //Fetching Panel's New Services
    // for (let i = 0; i < panelsForBackUp.length; i++) {
    let APIURL= `${data.get("panelAPILink")?.toString()}?key=${data.get("panelAPIKey")?.toString()}&action=services`;
    console.log("Working on-", APIURL);
    
    let panelServicesData_FRESH;
    //Fetching the Fresh Services
    try {
        try {
            //Trying with GET REQUEST
            panelServicesData_FRESH = await fetch(APIURL).then((Response) =>
                Response.json(),
            );
        } catch (error) {
            console.log("Could not Fetch with GET Request");
        }

        try {
            //Trying with POST REQUEST
            panelServicesData_FRESH = await fetch(APIURL, {method : "POST"}).then((Response) =>
                Response.json(),
            );
        } catch (error) {
            console.log("Could not Fetch with POST Request");
        }
    } catch (error) {
        console.log("Could not fetch with Both GET and POST");
    }
    
    interface filteredServicesSchema {
        newlyAdded : any[]
        toBeDeleted : any[]
    }
    let filteredServices : filteredServicesSchema = { 
        newlyAdded: [], 
        toBeDeleted: [] 
    };
    var deleteServicesID : string[] = [];

    //Adding editional details in Fresh services for Database integration
    if(panelServicesData_FRESH.length > 0){
        console.log("Services count- ", panelServicesData_FRESH.length);
        
        //Adding More Columns
        for (let j = 0; j < panelServicesData_FRESH.length; j++) {
            panelServicesData_FRESH[j].panelName = data.get("panelTitle")?.toString();
            panelServicesData_FRESH[j].panelSlug = data.get("panelSlug")?.toString();
            panelServicesData_FRESH[j].panelRefUrl = data.get("panelWebsiteURL")?.toString();
            panelServicesData_FRESH[j].serviceUploadDate = new Date();
        }
    
        //Changing Column Names as per Database
        for (let j = 0; j < panelServicesData_FRESH.length; j++) {
            panelServicesData_FRESH[j].serviceNo = panelServicesData_FRESH[j].service.toString();
            panelServicesData_FRESH[j].serviceName = panelServicesData_FRESH[j].name.toString();
            panelServicesData_FRESH[j].serviceRate = panelServicesData_FRESH[j].rate.toString();
            panelServicesData_FRESH[j].serviceMin = panelServicesData_FRESH[j].min.toString();
            panelServicesData_FRESH[j].serviceMax = panelServicesData_FRESH[j].max.toString();
            panelServicesData_FRESH[j].serviceCategory = panelServicesData_FRESH[j].category.toString();
        
            delete panelServicesData_FRESH[j].type;
            delete panelServicesData_FRESH[j].dripfeed;
            delete panelServicesData_FRESH[j].refill;
            delete panelServicesData_FRESH[j].cancel;
            
            delete panelServicesData_FRESH[j].desc;
            delete panelServicesData_FRESH[j].average_time;
            delete panelServicesData_FRESH[j].description;
            delete panelServicesData_FRESH[j].service;
            delete panelServicesData_FRESH[j].name;
            delete panelServicesData_FRESH[j].rate;
            delete panelServicesData_FRESH[j].min;
            delete panelServicesData_FRESH[j].max;
            delete panelServicesData_FRESH[j].category;
        }
    
        let APIURL_services= getAPIPath() + "api/panelServices/"+ data.get("panelSlug")?.toString();
        let panelServicesData_OLD = await fetch(APIURL_services).then((Response) =>
            Response.json(),
        );
        
        //console.log("panelServicesData_OLD- ", panelServicesData_OLD);
        
        // Filtering New and Deleted Services
        filteredServices = compareServices(panelServicesData_OLD.combinedArray, panelServicesData_FRESH);
        
        // console.log("filteredServices.newlyAdded- ",filteredServices.newlyAdded.length);
        // console.log("filteredServices.toBeDeleted- ",filteredServices.toBeDeleted.length);
    
        
        //#region Deleting removed Services 
        for (let i = 0; i < filteredServices.toBeDeleted.length; i++) {
            deleteServicesID.push(filteredServices.toBeDeleted[i].id);
        }
    
        if(deleteServicesID.length > 0){
            const recordDelete = await xata.db["panel-services"].delete(deleteServicesID);
            const recordDelete1 = await xata.db["panel-services1"].delete(deleteServicesID);
            const recordDelete2 = await xata.db["panel-services2"].delete(deleteServicesID);
            const recordDelete3 = await xata.db["panel-services3"].delete(deleteServicesID);
            const recordDelete4 = await xata.db["panel-services4"].delete(deleteServicesID);
            const recordDelete5 = await xata.db["panel-services5"].delete(deleteServicesID);
            
            if (recordDelete || recordDelete1 || recordDelete2 || recordDelete3 || recordDelete4 || recordDelete5) {
                console.log("Data Deleted");
            }
        }
        //#endregion
    
        //#region Inserting new Services
        if(filteredServices.newlyAdded.length > 0){
            
            let DBLength = (await xata.db["panel-services"].getAll()).length;
            let DB1Length = (await xata.db["panel-services1"].getAll()).length;
            let DB2Length = (await xata.db["panel-services2"].getAll()).length;
            let DB3Length = (await xata.db["panel-services3"].getAll()).length;
            let DB4Length = (await xata.db["panel-services4"].getAll()).length;
            let DB5Length = (await xata.db["panel-services5"].getAll()).length;

            console.log("DBLength used before Upload- ", DBLength);
            console.log("DB1Length used before Upload- ", DB1Length);
            console.log("DB2Length used before Upload- ", DB2Length);
            console.log("DB3Length used before Upload- ", DB3Length);
            console.log("DB4Length used before Upload- ", DB4Length);
            console.log("DB5Length used before Upload- ", DB5Length);
            
            if((filteredServices.newlyAdded.length + DBLength) < 49000){
                const record = await xata.db["panel-services"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }
            else if((filteredServices.newlyAdded.length + DB1Length) < 49000){
                const record = await xata.db["panel-services1"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }
            else if((filteredServices.newlyAdded.length + DB2Length) < 49000){
                const record = await xata.db["panel-services2"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }
            else if((filteredServices.newlyAdded.length + DB3Length) < 49000){
                const record = await xata.db["panel-services3"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }
            else if((filteredServices.newlyAdded.length + DB4Length) < 49000){
                const record = await xata.db["panel-services4"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }
            else if((filteredServices.newlyAdded.length + DB5Length) < 49000){
                const record = await xata.db["panel-services5"].create(filteredServices.newlyAdded);
        
                if (record) {
                    console.log("Data Uploaded");
                }
            }

        }
        //#endregion
    }

    //#region Updating the Panels Database (LastBackupDate)
    console.log("Updating Backup Date for ", data.get("panelTitle")?.toString());
    const record = await xata.db["panels-datatable"].update(data.get("id")?.toString() || "", {
        lastBackupDate: new Date(),
    });
    console.log("Backup Date Updated-", record?.lastBackupDate);
    //#endregion

    let isAPIWorking = false;
    if(panelServicesData_FRESH.length > 0){
        isAPIWorking = true
    } 

    return new Response(
        JSON.stringify({
            panelSlug : data.get("panelSlug")?.toString(),
            newServices : filteredServices.newlyAdded.length,
            isAPIWorking : isAPIWorking,
            deletedServices : deleteServicesID.length,
        })
    )
}

export const GET: APIRoute = async () => {
    let stats = [];

    let sec = 0;
    let interval;
    try {
        interval = setInterval(() => {
            sec++;
        }, 1000);
        let panelsForBackUp = await fetch(getAPIPath() + "api/servicesBackup", {method: "PUT"}).then((Response) =>
            Response.json(),
        );
        let APIUrl = "";
        //  for (let i = 0; i < 1; i++) {
        for (let i = 0; i < panelsForBackUp.panelsForBackUp.length; i++) {
            
            let panelFormData = new FormData();
            panelFormData.append("id", panelsForBackUp.panelsForBackUp[i].id);
            panelFormData.append("panelAPILink", panelsForBackUp.panelsForBackUp[i].panelAPILink);
            panelFormData.append("panelAPIKey", panelsForBackUp.panelsForBackUp[i].panelAPIKey);
            panelFormData.append("panelTitle", panelsForBackUp.panelsForBackUp[i].panelTitle);
            panelFormData.append("panelSlug", panelsForBackUp.panelsForBackUp[i].panelSlug);
            panelFormData.append("panelWebsiteURL", panelsForBackUp.panelsForBackUp[i].panelWebsiteURL);
            
            APIUrl = `${panelsForBackUp.panelsForBackUp[i].panelAPILink}?key=${panelsForBackUp.panelsForBackUp[i].panelAPIKey}&action=services`

            let processPanelServiceBackup = await fetch(getAPIPath() + "api/servicesBackup", {
                    method:"POST",
                    body : panelFormData
                }
            ).then((Response) =>
                Response.json(),
            );

            stats.push({
                panelTitle :panelsForBackUp.panelsForBackUp[i].panelTitle, 
                APIURL: APIUrl,
                is_PanelsAPI_Working : processPanelServiceBackup.isAPIWorking,
                newServices :processPanelServiceBackup.newServices, 
                deletedServices :processPanelServiceBackup.deletedServices
            })
            if(stats.length == panelsForBackUp.panelsForBackUp.length)
                break;
        }

        clearInterval(interval);
        
        return new Response(
            JSON.stringify({
                stats,
                message : "Panels Fetched and Backup Completed",
                complitionTime: `Execution Time: ${sec} seconds`
            })
        )
    } catch (error) {
        clearInterval(interval);
        return new Response(
            JSON.stringify({
                message : "An Error occured",
                error
            })
        )
    }
}
