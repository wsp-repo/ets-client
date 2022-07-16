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
  });

  tracer.addEvent('tracerEvent1');

  setTimeout(() => {
    tracer.addEvent('tracerEvent2');
  }, 3000);
})();
