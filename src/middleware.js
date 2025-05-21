import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isChatRoute = createRouteMatcher(['/chat(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (isChatRoute(req)) await auth.protect({unauthenticatedUrl: `${req.nextUrl.protocol || 'https:'}//${req.headers.get('host')}/`})
})

export const config = {
    matcher : ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}