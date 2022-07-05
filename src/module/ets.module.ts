import { Global, Module } from '@nestjs/common';

import { EtsClientKafka } from './clients/kafka';
import { EtsTracer } from './ets.tracer';

@Global()
@Module({
  exports: [EtsClientKafka, EtsTracer],
  providers: [EtsClientKafka, EtsTracer],
})
export class EtsModule {}
