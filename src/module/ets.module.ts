import { Global, Module } from '@nestjs/common';

import { EtsClientKafka } from './clients/kafka';
import { EtsTracer } from './ets.tracer';

@Global()
@Module({
  exports: [EtsTracer],
  imports: [EtsClientKafka],
  providers: [EtsTracer],
})
export class EtsModule {}
