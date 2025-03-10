import { XataClient } from '../../../xata.ts';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export async function GET() {
   try {
      const records = await xata.db["panel-services"]
         .select([
            "panelName",
            "panelSlug",
            "panelRefUrl",
            "serviceNo",
            "serviceName",
            "serviceRate",
            "serviceMin",
            "serviceMax",
            "serviceUploadDate",
            "serviceCategory",
         ])
         .getAll();

      return new Response(
         JSON.stringify(records),
      )
   } catch (error: any) {
      console.log(error);
   }
}