// // app/api/logout/route.ts
// import { NextResponse } from 'next/server';

// export async function POST() {
//   const response = NextResponse.json(
//     { success: true },
//     { status: 200 }
//   );
  
//   // Clear the auth cookie
//   response.cookies.set('access_token', '', {
//     httpOnly: true,
//     expires: new Date(0),
//     path: '/'
//   });

//   return response;
// }


// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // 1) Prepare a 200 JSON response
  const res = NextResponse.json({ success: true }, { status: 200 });

  // 2) Delete the HTTP-only cookie named "access_token"
  res.cookies.delete("access_token");

  return res;
}




