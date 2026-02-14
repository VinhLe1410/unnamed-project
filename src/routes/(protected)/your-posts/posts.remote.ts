import { form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const getYourPosts = query(async () => {
  const event = getRequestEvent();
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });
  if (session?.user.id) {
    return db.query.post.findMany({
      where: eq(post.authorId, session.user.id),
    });
  } else {
    return [];
  }
});

export const createPost = form(
  z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
  }),
  async ({ title, body }) => {
    const event = getRequestEvent();
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    if (!session?.user.id) {
      error(401, 'Unauthorized');
    }
    const slug = title.toLowerCase().replace(/ /g, '_');
    await db.insert(post).values({
      title,
      slug,
      body,
      authorId: session.user.id,
    });
    redirect(302, `/your-posts`);
  },
);
