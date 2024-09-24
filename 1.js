/* SOAL NO.1
Buatlah function untuk mencetak pattern segitiga siku-siku terbalik dengan ketentuan sebagai berikut:
Input user berupa panjang alas dan tinggi segitiga (alas dan tingginya sama) dengan ketentuan :
0 < Alas/Tinggi < 10
Segitiga dibentuk dengan deret angka prima yang terus berlanjut meskipun barisnya berganti.
Input:
drawSikuSiku(7):

Output:

2
3 5
7 11 13
17 19 23 29
31 37 41 43 47
53 59 61 67 71 73
79 83 89 97 101 103 107

 */
console.log("------------SOAL NOMOR 1------------")

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function drawSikuSiku(n) {
  if (n <= 0 || n >= 10) {
    console.log("Input harus antara 0 dan 10");
    return;
  }

  let primes = [];
  let num = 2;

  while (primes.length < (n * (n + 1)) / 2) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }

  let index = 0;
  for (let i = 1; i <= n; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
      row += primes[index] + " ";
      index++;
    }
    console.log(row.trim());
  }
}

drawSikuSiku(7);
