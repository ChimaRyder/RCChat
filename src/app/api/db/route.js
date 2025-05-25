import clientPromise from "@/lib/mongodb";
import {currentUser} from "@clerk/nextjs/server";

export const GET = async () => {
   const user = await currentUser();
   const client = await clientPromise;
   const db = client.db("rcchat");

   const rooms = await db.collection("chat").find({users: user.id}).toArray();

   return Response.json(rooms);
}

export const POST = async (req) => {
   const body = await req.json();

   const client = await clientPromise;
   const db = client.db("rcchat");

   const result = await db.collection("chat").insertOne({
       users: [body.first_user, body.second_user],
       createdAt: new Date()
   });

   return Response.json(result);
}