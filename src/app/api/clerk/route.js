import { getAuth, clerkClient } from "@clerk/nextjs/server";

export const GET = async (req) => {
    const {searchParams} = new URL(req.url);
    const targetUser = searchParams.get("user");

    const {userId : authID} = await getAuth(req);


    if (!authID) {
        return Response.json({message: "Unauthorized"});
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(targetUser);
        return Response.json(user);
    } catch (e) {
        return Response.json({message: "User not found"});
    }
}
