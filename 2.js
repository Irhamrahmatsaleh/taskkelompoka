/*
  SOAL NO.2
  Buatlah sebuah function sederhana untuk menghitung potongan harga, biaya yang harus dibayar, dan total kembalian pada sistem voucher DumbWays Klontong , ketentuan :

  Voucher :
  DumbWaysJos, potongan 21,1%, minimal uang belanja 50000, Maksimal diskon 20000
  DumbWaysMantap, potongan 30%, minimal uang belanja 80000, maksimal diskon 40000
  Clue : maka jika function dijalankan:
  hitungVoucher(DumbWaysJos, 100000)
    output :     -	Uang yang harus dibayar : 80000
  Diskon : 20000
  Kembalian  : 20000

 */
console.log(" ")
console.log("------------SOAL NOMOR 2------------")


function hitungVoucher(voucher, totalBelanja) {
  let potongan = 0;
  let minimalBelanja = 0;
  let maksimalDiskon = 0;

  if (voucher === "DumbWaysJos") {
    potongan = 21.1 / 100;
    minimalBelanja = 50000;
    maksimalDiskon = 20000;
  } else if (voucher === "DumbWaysMantap") {
    potongan = 30 / 100;
    minimalBelanja = 80000;
    maksimalDiskon = 40000;
  } else {
    console.log("Voucher tidak valid");
    return;
  }

  if (totalBelanja < minimalBelanja) {
    console.log("Total belanja tidak memenuhi syarat minimal.");
    return;
  }

  let diskon = totalBelanja * potongan;
  if (diskon > maksimalDiskon) {
    diskon = maksimalDiskon;
  }

  let totalBayar = totalBelanja - diskon;
  let kembalian = totalBelanja - totalBayar;

  console.log(`Uang yang harus dibayar : ${totalBayar}`);
  console.log(`Diskon : ${diskon}`);
  console.log(`Kembalian : ${kembalian}`);
}

hitungVoucher("DumbWaysJos", 100000);
