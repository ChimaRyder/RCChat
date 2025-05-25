import {currentUser} from "@clerk/nextjs/server";
import {SignJWT} from "jose";
import clientPromise from "@/lib/mongodb";

const createToken = (clientID, apiKey, claim, capability) => {
    const [appID, signingKey] = apiKey.split(':', 2);
    const enc = new TextEncoder();
    const token = new SignJWT({
        'x-ably-capability': JSON.stringify(capability),
        'x-ably-clientId': clientID,
        'ably.channel.*': JSON.stringify(claim),

    })
        .setProtectedHeader({kid: appID, alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(enc.encode(signingKey));
    return token;
}

const generateCapability = async (claim) => {
    const client = await clientPromise;
    const db = client.db("rcchat");

    const rooms = await db.collection("chat").find({users: claim.id}).toArray();
    const roomIds = rooms.map(room => room._id);

    return {'*' : ['*']}
}

export const GET = async () => {
    const user = await currentUser();
    const userClaim = user.publicMetadata;
    const userCapability = generateCapability(userClaim);

    const token = await createToken(user.id, process.env.ABLY_SECRET_KEY, userClaim, userCapability);

    return Response.json(token);
}