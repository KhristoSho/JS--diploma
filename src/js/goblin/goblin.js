import goblinPNG from "../../img/goblin.png";

export class Goblin {
  removeGoblin(element) {
    element.classList.remove("pool_with_goblin");
    element.querySelector("img").remove();
  }

  putGoblin(element) {
    element.classList.add("pool_with_goblin");
    const img = document.createElement("img");
    img.src = goblinPNG;
    img.alt = "goblin";
    img.classList.add("goblin");
    element.append(img);
  }
}
