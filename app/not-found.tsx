import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x grid min-h-dvh place-content-center gap-4 py-24">
      <p className="font-mono text-sm text-muted">404 · No such file or directory</p>
      <h1 className="text-4xl font-semibold tracking-tight text-fg">This page doesn&apos;t exist</h1>
      <p className="text-muted">The link may be old or mistyped. / Le lien est peut-être ancien ou mal saisi.</p>
      <Link href="/" className="mt-4 inline-flex h-12 w-fit items-center rounded-xl bg-primary px-6 font-semibold text-on-primary hover:bg-primary-hover">
        Go to the home page
      </Link>
    </main>
  );
}
