import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super()

        this.id = info.id; // 蛇的id
        this.color = info.color;
        this.gamemap = gamemap; // 为了获得单元长度等信息

        this.cells = [new Cell(info.r, info.c)]; // 蛇的身体，以及cells[0]蛇头
        this.next_cell = null;  // 下一步的目标位置

        this.speed = 5; // 蛇每秒走的格子数
        this.direction = -1; // 蛇的方向，0-上，1-右，2-下，3-左，-1表示无指令
        this.status = "idle"; // idle表示静止，move表示移动，die表示死亡

        this.dr = [-1, 0, 1, 0]; // 行偏移量，对应上右下左
        this.dc = [0, 1, 0, -1]; // 列偏移量

        this.step = 0; // 回合数
        this.eps = 1e-2;  // 表示浮点数比较允许的误差

        // 蛇眼睛初始朝向
        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;

        this.eye_dx = [ // 蛇眼睛不同方向的x偏移量（蛇头中心为0,0），简化他们距离蛇头中心的偏转角为45°
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [ // 蛇眼睛不同方向的y偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
    }

    start() {

    }

    //辅助函数  方便后续修改为后端设置蛇方向
    set_direction(d) {
        this.direction = d;
    }

    // 检查当前回合蛇长度会不会增加
    check_tail_increasing() {
        if (this.step <= 10) return true;
        if (this.step % 3 === 1) return true;
        return false;
    }

    // 将蛇的状态变为走下一步
    next_step() {
        const d = this.direction;
        this.eye_direction = d; // 蛇眼睛朝向与蛇头方向相同
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1; // 清空方向
        this.status = "move"; // 蛇的状态变为移动
        this.step++;

        // 处理蛇移动
        const k = this.cells.length; // 求长度
        for (let i = k; i > 0; i--) { // 初始元素不变 每一个元素往后移动一位
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1])); // 注意一定要用JSON.parse(JSON.stringify())深拷贝，否则会导致引用关系错乱
        }

        // 判断移动是否合法，不合法则die
        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = "die";
        }
    }

    // 更新蛇的位置
    update_move() {
        // 更改蛇头位置
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {  // 走到目标点了
            this.cells[0] = this.next_cell;  // 添加一个新蛇头
            this.next_cell = null;
            this.status = "idle";  // 走完了，停下来

            // 蛇不变长则刨除蛇尾一个节点
            if (!this.check_tail_increasing()) {
                this.cells.pop();
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000; // 每两帧之间移动的距离。注意speed是每秒速度，而update是以帧为单位，所以要乘以timedelta（单位为毫秒）
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            // 处理蛇尾移动
            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if (this.status === "move") {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === "die") { // 蛇死亡了，直接蛇变白色
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) { // in遍历的是key，of遍历的是value
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2); // 参数：x, y, radius, startAngle, endAngle
            ctx.fill();
        }

        // 美化蛇，两个半圆间用正方形再画一次
        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) // 如果两个球重合，跳过。这里说的是蛇头/蛇尾移动时最后几帧可能近似重合
                continue;
            if (Math.abs(a.x - b.x) < this.eps) { // 如果两个球在同一列，画正方形
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L); // 参数分别是：x, y, width, height
            } else { // 如果两个球在同一行，画正方形
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        // 蛇眼睛绘制
        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++ ) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}