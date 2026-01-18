import { redirect } from '@sveltejs/kit';

export function load({ locals }: { locals: App.Locals }) {
  if (locals.user?.id) {
    throw redirect(302, '/');
  }
}
