/** 
* Array of routes accessible by logged out users.
 * These routes do not require authentication 
 * @type {string[]}
**/

export const publicRoutes = [
   "/",
   "/properties",
   "/properties/*",
   "/estate-agents",
   "/estate-agents/*",
   "/property-developers",
   "/property-developers/*"
]

/**  
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /users
 * @type {string[]}
**/
export const authRoutes = [
   "/sign-in",
   "/register"
]

/**  
 * The prefix for API authentication routes.
 * Routes that start with tis prefix are used for api authentication purposes. 
 * @type {string}
**/
export const apiAuthPrefix = "/api/auth"


/**
 * The default redirect path after logging in.
 * @type {string}
**/
export const DEFAULT_LOGIN_REDIRECT = "/"