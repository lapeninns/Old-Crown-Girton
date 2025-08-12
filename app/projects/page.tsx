import { redirect } from 'next/navigation';

export default function ProjectsPage() {
  // This route is disabled; send users home.
  redirect('/');
}
