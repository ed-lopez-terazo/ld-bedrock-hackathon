import asyncio
import json
import uuid
import boto3
import botocore.config
import ldclient
from ldclient import Context
from ldclient.config import Config

ldclient.set_config(Config("<sdk-46431>"))
ld_client = ldclient.get()
client = boto3.client('bedrock-agent-runtime', config=botocore.config.Config(read_timeout=1000))

def lambda_handler(event, context):
    print(event)
    prompt = event.get("inputText")
    session_id = event.get("sessionId")
    
    try:
        ldContext = Context.builder("po-agent-2").kind("user").name("Poli").build()
        
        usePOAgent = ld_client.variation(key="usePOAgent", context=ldContext, default={})
        print(usePOAgent)
        agent_id = usePOAgent["agentId"]
        agent_alias_id = usePOAgent["agentAliasId"]
        print(f"agent_id = {agent_id}, agent_alias_id = {agent_alias_id}")

        print(f"Question: {prompt}")
        response = asyncio.run(_invoke_agent(prompt, session_id, agent_id, agent_alias_id))
        print(f"Agent: {response}")
    
        return {
            'statusCode': 200,
            'body': json.dumps({"response": response})
        }
    except RuntimeError as err:
        error_code = err.response["Error"]["Code"]
        error_message = err.response["Error"]["Message"]
        logger.error(
            "Couldn't invoke agent. Here's why: %s: %s",
            error_code,
            error_message,
        )
        return {
            'statusCode': error_code,
            'body': json.dumps(error_message)
        }

async def _invoke_agent(prompt, session_id, agent_id, agent_alias_id):
        response = client.invoke_agent(
            agentId = agent_id,
            agentAliasId = agent_alias_id,
            sessionId = session_id,
            inputText = prompt,
        )

        completion = ""

        for event in response.get("completion"):
            chunk = event["chunk"]
            completion += chunk["bytes"].decode()

        return completion