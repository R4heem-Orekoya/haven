import { db } from '@/lib/db'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs';

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

app.get("/property/count", async (c) => {
   try {
      const count = await db.property.count()

      return c.json({ count })
   } catch (error) {
      //@ts-expect-error unknown error
      return c.json({ message: error.message })
   }
})

export const GET = handle(app)
export const POST = handle(app)