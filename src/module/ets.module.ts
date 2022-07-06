import { Global, Module } from '@nestjs/common';

import { EtsTracer } from './ets.tracer';
import { EtsClientKafka } from './kafka/client';

@Global()
@Module({
  exports: [EtsClientKafka, EtsTracer],
  providers: [EtsClientKafka, EtsTracer],
})
export class EtsModule {}
