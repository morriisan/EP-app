import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


type RouteHandler = (req: Request, ...args: unknown[]) => Promise<Response>;

export function requireAuth(handler: RouteHandler) {
    return async function (req: Request, ...args: unknown[]) {
      let session;
  
      try {
        session = await auth.api.getSession({
          headers: req.headers,
        });
      } catch (error) {
        console.error("Failed to get session in requireAuth:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      return handler(req, ...args);
    };
  }

export function requireAdmin(handler: RouteHandler) {
    return async function (req: Request, ...args: unknown[]) {
      let session;
  
      try {
        session = await auth.api.getSession({
          headers: req.headers,
        });
      } catch (error) {
        console.error("Failed to get session in requireAdmin:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
      }
  
      return handler(req, ...args);
    };
  }