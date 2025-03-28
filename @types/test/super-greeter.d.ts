/*~ This example shows how to have multiple overloads for your function */
export interface GreeterFunction {
  (name: string): void;
  (time: number): void;
}
/*~ This example shows how to export a function specified by an interface */
export const greeter: GreeterFunction;
