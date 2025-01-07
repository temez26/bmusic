import { assertEquals } from "@std/assert";

Deno.test(function addTest() {
  function add(a: number, b: number): number {
    return a + b;
  }
  assertEquals(add(2, 3), 5);
});
