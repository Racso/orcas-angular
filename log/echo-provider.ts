/**
 * Echo provider for Angular dependency injection.
 * Provides a singleton Echo instance with console writer.
 */
import { InjectionToken, Provider } from '@angular/core';
import { Echo, EchoConsole } from './echo';

/**
 * Injection token for Echo logger instance
 */
export const ECHO = new InjectionToken<Echo>('Echo Logger Instance');

/**
 * Factory function to create Echo instance
 */
export function echoFactory(): Echo {
  return EchoConsole.new();
}

/**
 * Provider for Echo logger
 * Use this in your module providers or inject it in services
 */
export const ECHO_PROVIDER: Provider = {
  provide: ECHO,
  useFactory: echoFactory
};
