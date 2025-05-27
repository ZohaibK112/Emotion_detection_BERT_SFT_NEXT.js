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
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });

  // Explicitly overwrite the cookie with Max-Age=0, matching how it was set originally
  res.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  });

  return res;
}





