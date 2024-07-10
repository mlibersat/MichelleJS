function solution(n) {
  // Quadratic sequence: f(n) = 2n^2-2n+1
  // Question: Is there a JS math/array method that can do this more robustly? (i.e., given any sequence (or a specific type of sequence), can javascript identify its nth term formula?)
  return 2 * Math.pow(n, 2) - 2 * n + 1;
}
