import { Global, Module } from '@nestjs/common';

import { EtsClientKafka } from './client.kafka';
import { EtsClientTracer } from './client.tracer';

@Global()
@Module({
  exports: [EtsClientTracer],
  providers: [EtsClientKafka, EtsClientTracer],
})
export class EtsClientModule {}
