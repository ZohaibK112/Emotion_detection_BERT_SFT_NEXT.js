    import { jwtVerify } from 'jose';
    import { NextRequest } from 'next/server';

    export async function getSession(req: NextRequest) {
    const tokenCookie = req.cookies.get('token');
    console.log("Retrieved token cookie:", tokenCookie); // Debugging token

    if (!tokenCookie) return null;
    
    const token = tokenCookie.value; // Get the string value from the cookie
    
    try {
        console.log("JWT Secret:", process.env.JWT_SECRET); // Log the JWT Secret for debugging

        // Verify the JWT
        const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
        );

        return verified.payload;
    } catch (error) {
        console.error('Session verification error:', error); // Log the error
        return null;
    }
    }

    export async function getCurrentUser(req: NextRequest) {
    const session = await getSession(req);

    if (!session) return null;

    return {
        id: session.userId, // FIXED: use userId instead of id
        email: session.email,
        role: session.role || 'user'
    };
    }
