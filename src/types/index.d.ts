export {};
import { SAGE } from '../Manager';

declare global {
  interface Window {
    SAGE: SAGE;
  }
}