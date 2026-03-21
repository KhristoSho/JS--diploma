export class Pool {
  createPool(numPools) {
    const pools = document.querySelector(".pools");
    for (let i = 0; i < numPools; i++) {
      pools.insertAdjacentHTML(
        "beforeEnd",
        `<div class="pool" data-id="${i + 1}"></div>`);
    }
  }

  getNumPool(min, max, current = null) {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num == current);
    console.log("старое значение:", current, "новое значение", num);
    return num;
  }

  getPoolWithGoblin() {
    return document.querySelector(".pool_with_goblin");
  }

  getAllPool() {
    return document.querySelectorAll(".pool");
  }
}
