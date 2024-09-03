import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#b37627";
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