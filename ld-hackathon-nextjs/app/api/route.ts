import serverflag from "@/utils/ld-server/flaggetter";
import getServerClient from "@/utils/ld-server/serverClient";
const { v4: uuidv4 } = require('uuid');
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

export async function POST(req: Request, res: Response) {
    const ldClient = await getServerClient(process.env.LAUNCHDARKLY_SDK_KEY!);
    const context = {
        kind: "user",
        key: "31416",
        name: "Terazoan",
        email: "devdir@terazo.com",
    }
    //const useDDAgent = await serverflag(ldClient, "useDDAgent", context, { agentId: "", agentAliasId: "" });
    //console.log(useDDAgent)

    const client = new BedrockAgentRuntimeClient();
    const sessionId = uuidv4();
    const data = await req.json();
    const prompt = `Hello, ${data.query}`

    const input = { // InvokeAgentRequest
        agentId: "Y5L1LWHIB5", // required
        agentAliasId: "0HVLRPUCTN", // required
        sessionId: sessionId, // required
        endSession: false,
        enableTrace: true,
        inputText: prompt,
    };
    const command = new InvokeAgentCommand(input);

    try {
        let completion = "";

        const response = await client.send(command);
        console.log(response)

        if (response.completion === undefined) {
            throw new Error("Completion is undefined");
        }

        for await (let chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
            console.log(chunk);
            const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes ?? new Uint8Array());
            if (decodedResponse) {
                completion += decodedResponse;
            }
        }

        return Response.json({ message: completion })
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}
