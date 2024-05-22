import serverflag from "@/utils/ld-server/flaggetter";
import getServerClient from "@/utils/ld-server/serverClient";

export async function POST(req: Request, res: Response) {
    const ldClient = await getServerClient(process.env.LAUNCHDARKLY_SDK_KEY!);
    const data = await req.json();
    console.log(data);
    try {


        return Response.json({ message: "Thanks for your feedback" })
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}
