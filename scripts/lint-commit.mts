import chalk from 'chalk';
import { readFileSync } from 'fs';
import path from 'path';

const msgPath = path.resolve('.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error(`${chalk.bgRed.white('ERROR ')} ${chalk.red('提交消息格式无效。')}\n\n${chalk.red('自动生成 ChangeLog 需要正确的提交消息格式。 例如：\n\n')}${chalk.green('feat(compiler): add "comments" option')}\n${chalk.green('fix(v-model): handle events on blur (close #28)')}\n\n${chalk.red('  See .github/commit-convention.md for more details.\n')}`);
  process.exit(1);
}
