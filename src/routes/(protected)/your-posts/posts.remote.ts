import { getRequestEvent, query } from '$app/server';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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
