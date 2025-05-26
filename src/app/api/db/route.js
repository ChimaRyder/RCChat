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

   const Ably = require('ably');
   const ably = new Ably.Rest({key: process.env.ABLY_SECRET_KEY});
   const user = await currentUser();

   const notif = await ably.channels.get(`chat:${body.second_user}`);
   await notif.publish("new-chat", {
      username: user.username,
   })

   return Response.json(result);
}