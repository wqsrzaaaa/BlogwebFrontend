import { NextResponse } from "next/server"

export function middleware(req){

  const token = req.cookies.get("token")?.value

  if(!token && req.nextUrl.pathname === '/write'){
    return NextResponse.redirect(new URL('/signin' , req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher : ['/write']
}