export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.x = c + 0.5;
        this.y = r + 0.5;
    }

    update() {
        this.render();
    }

    render() {
        const L = this.gamemap.L; // 需要动态取单元长度，是变化的
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}