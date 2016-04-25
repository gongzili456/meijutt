var program = require('commander');
var request = require('request');

// program
//   .version('0.0.1')
//   .command('search <name>', 'search a movie', {isDefault: true})
//   .action(function (name) {
//     console.log('name: ', name);
//     request({
//       url: 'http://www.meijutt.com/search.asp',
//       method: 'POST',
//       headers: {
//         // 'Content-Length':
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       form: {
//         searchword: encodeURIComponent('name')
//       }
//     }, function (err, resp, body) {
//       if (err) throw err;
//       console.log('body: ', body);
//     });
//   })
//   .parse(process.argv);

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    console.log('env: ', env, 'options: ', options);
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });
