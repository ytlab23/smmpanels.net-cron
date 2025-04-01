import type { APIRoute } from 'astro';
import { XataClient } from '../../../xata';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

//#region Fetching Services For a Particular Panel
export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    if(id?.toString().includes("search_")){
        const records = await xata.db["panel-services"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
    
        const records1 = await xata.db["panel-services1"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records2 = await xata.db["panel-services2"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records3 = await xata.db["panel-services3"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records4 = await xata.db["panel-services4"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records5 = await xata.db["panel-services5"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
    
        let panelServices = records.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        let panelServices1 = records1.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        let panelServices2 = records2.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        let panelServices3 = records3.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        let panelServices4 = records4.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        let panelServices5 = records5.filter(obj => obj.serviceName?.includes(id?.replace("search_", "").toString()));
        
        const combinedArray = panelServices.concat(panelServices1.concat(panelServices2.concat(panelServices3.concat(panelServices4.concat(panelServices5)))));
    
        return new Response(
            JSON.stringify({
                searchTerm : id?.replace("search_", "").toString(),
                servicesFoundCount : combinedArray.length,
                combinedArray
            })
        )
    }
    else{
        const records = await xata.db["panel-services"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
    
        const records1 = await xata.db["panel-services1"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records2 = await xata.db["panel-services2"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records3 = await xata.db["panel-services3"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records4 = await xata.db["panel-services4"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
        
        const records5 = await xata.db["panel-services5"]
        .select([
            "xata_id",
            "panelName",
            "panelRefUrl",
            "panelSlug",
            "serviceCategory",
            "serviceMax",
            "serviceMin",
            "serviceName",
            "serviceNo",
            "serviceRate",
            "serviceUploadDate",
        ])
        .getAll();
    
        let panelServices = records.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
        let panelServices1 = records1.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
        let panelServices2 = records2.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
        let panelServices3 = records3.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
        let panelServices4 = records4.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
        let panelServices5 = records5.filter(obj => obj.panelSlug === id?.replace("search_", "").toString());
    
        const combinedArray = panelServices.concat(panelServices1.concat(panelServices2.concat(panelServices3.concat(panelServices4.concat(panelServices5)))));
    
        return new Response(
            JSON.stringify({
                panelSlug : id?.toString(),
                combinedArray
            })
        )
    }
}
//#endregion