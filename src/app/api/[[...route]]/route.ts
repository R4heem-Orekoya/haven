import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
   return c.json({
      message: 'Hello Next.js!',
   })
}).get("/yo", (c) => {
   return c.json({
      message: "Whats good",
   })
})

app.post("/create-listing", (c) => {
   const formData = c.req.formData
   
   return c.json(formData)
})

export const GET = handle(app)
export const POST = handle(app)