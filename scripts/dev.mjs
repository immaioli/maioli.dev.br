// Cross-platform dev script: kills assigned port (if occupied) then starts Next.js
import { execSync, spawn } from 'child_process';

const port = process.env.PORT || '3000';

try {
  execSync(`npx kill-port ${port}`, { stdio: 'ignore' });
} catch {
  // Port was not in use — that's fine, proceed
}

const child = spawn('npx', ['next', 'dev', '-p', port], {
  stdio: 'inherit',
  shell: true,
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
