import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE_URL =
    process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function handler(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
) {
    if (!API_BASE_URL) {
        return Response.json(
            { message: "API_URL is not configured" },
            { status: 500 },
        );
    }

    const { path } = await context.params;
    const incomingUrl = new URL(request.url);

    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    const endpoint = path
        .map((part) => encodeURIComponent(part))
        .join("/");

    const targetUrl = `${baseUrl}/${endpoint}${incomingUrl.search}`;

    const headers = new Headers();

    for (const key of ["authorization", "content-type", "accept", "cookie"]) {
        const value = request.headers.get(key);
        if (value) headers.set(key, value);
    }

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body: ["GET", "HEAD"].includes(request.method)
                ? undefined
                : await request.arrayBuffer(),
            cache: "no-store",
            redirect: "manual",
        });

        const responseHeaders = new Headers();
        const contentType = response.headers.get("content-type");

        if (contentType) {
            responseHeaders.set("content-type", contentType);
        }

        const cacheControl = response.headers.get("cache-control");
        if (cacheControl) {
            responseHeaders.set("cache-control", cacheControl);
        }

        return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("Temporary backend proxy error:", error);

        return Response.json(
            { message: "Backend API is unreachable" },
            { status: 502 },
        );
    }
}

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as OPTIONS,
};