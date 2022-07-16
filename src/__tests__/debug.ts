import { EtsTracer } from '../index';

setInterval(() => {}, 60000);

(async () => {
  const tracer = await EtsTracer.getTracer({
    client: {
      envPrefix: 'ETS_',
    },
    tracer: {
      name: 'Debug tracer',
    },
  }).catch((error) => {
    console.warn('Tracer error: ', error);

    process.exit();
  });

  if (!tracer) return;

  tracer.addEvent('tracerEvent1');

  setTimeout(() => {
    tracer.addEvent('tracerEvent2');
  }, 3000);
})();
