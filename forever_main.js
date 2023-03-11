const forever = require('forever-monitor');
const child = new (forever.Monitor)('main.js', {
  uid: 'rs-chat-utilities',
  silent: true,
  args: [],
  killTree: true
});

child.on('watch:restart', (info) => {
  console.error('Restarting script because ' + info.file + ' changed');
});

child.on('restart', () => {
  console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', (code) => {
  console.error('Forever detected script exited with code ' + code);
});

child.start();
