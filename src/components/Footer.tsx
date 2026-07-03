import { APP_VERSION } from '../config';

export default function Footer() {
  return (
    <footer className="mt-10 flex items-center justify-between text-xs text-muted">
      <span>RateWise v{APP_VERSION}</span>
      
      
    </footer>
  );
}
