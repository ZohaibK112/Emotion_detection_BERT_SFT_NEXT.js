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
// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });

  // Clear the HTTP-only access_token cookie
  res.cookies.set('access_token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}
