const context = {
    "kind": "user",
    "key": "1",
    "name": "Ed",
    "email": "ed.lopez@terazo.com"
}

const serverflag = async (ldclient: any, key: string, context: any, defaultvalue: any) => {
    const flag = await ldclient.variation(key, context, defaultvalue)
    return flag
}

export default serverflag