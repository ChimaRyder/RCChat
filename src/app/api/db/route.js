import clientPromise from "@/lib/mongodb";
import {currentUser} from "@clerk/nextjs/server";
import {usePresence} from "ably/react";

export const GET = async () => {
   const user = await currentUser();
   const client = await clientPromise;
   const db = client.db("rcchat");

   const rooms = await db.collection("chat").find({user1: user.id}).toArray();
   console.log(rooms);

   return Response.json(rooms);
}

export const POST = async (req) => {
   console.log(req.first_user);
   console.log(req.second_user);

   return Response.json({received: true});
}