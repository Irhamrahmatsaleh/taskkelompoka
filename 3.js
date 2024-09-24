/*
  SOAL NOMOR 3

Diketahui sebuah data array sebagai berikut:
[2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11]
Buatlah sebuah function yang bertugas untuk menyusun array berikut menggunakan recursive bubble sort. Fungsi tersebut akan mengembalikan 3 output, yaitu array yang sudah tersusun dan bilangan yang ganjil dan genap.
Contoh:
Input: sortArray([2, 24, 32, 22, 31])

Output:
Array: 2, 22, 24, 31, 32
Ganjil: 31
Genap: 2, 22, 24, 32
 */

console.log(" ");
console.log("------------SOAL NOMOR 3------------")

function recursiveBubbleSort(arr, n) {
  if (n === 1) return arr;
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
  }
  return recursiveBubbleSort(arr, n - 1);
}

function sortArray(arr) {
  let sortedArray = recursiveBubbleSort(arr.slice(), arr.length);

  let ganjil = sortedArray.filter(num => num % 2 !== 0);
  let genap = sortedArray.filter(num => num % 2 === 0);

  console.log(`Array: ${sortedArray.join(', ')}`);
  console.log(`Ganjil: ${ganjil.join(', ')}`);
  console.log(`Genap: ${genap.join(', ')}`);
}

sortArray([2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11]);
