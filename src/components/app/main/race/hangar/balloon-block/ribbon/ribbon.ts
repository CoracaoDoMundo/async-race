class Ribbon {
  private ribbon: SVGSVGElement;

  constructor() {
    this.ribbon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }

  public draw(container: HTMLDivElement): void {
    this.ribbon.setAttribute("viewBox", "75.21 0 361.57 512");
    this.ribbon.setAttribute("xml:space", "preserve");
    this.ribbon.setAttribute("fill", "#000000");
    this.ribbon.classList.add("ribbon");
    this.ribbon.innerHTML =
      '<g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><rect x="185.845" y="251.39" style="fill:#f702b6;" width="250.94" height="111.52"/><rect x="75.215" style="fill:#1d0159;" width="43.542" height="512"/><rect x="75.215" style="fill:#f702b6;" width="361.57" height="111.52"/><g><polygon style="fill:#02f7e7;" points="436.785,111.521 185.845,362.916 185.845,251.394 436.785,0 "/><polygon style="fill:#02f7e7;" points="240.773,447.76 352.094,447.76 436.785,362.916 436.785,251.394 "/></g></g>';
    container.append(this.ribbon);
  }
}

export default Ribbon;
