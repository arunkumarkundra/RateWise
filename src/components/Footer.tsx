import { APP_VERSION, GITHUB_URL } from '../config';

export default function Footer() {
  return (
    <footer className="mt-10 flex items-center justify-between text-xs text-muted">
      <span>RateWise v{APP_VERSION}</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-accent-strong hover:underline"
      >
        GitHub
      </a>
    </footer>
  );
}
