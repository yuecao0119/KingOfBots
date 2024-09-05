import { AcGameObject } from "./AcGameObject"; // 引入 AcGameObject 基类
import { Snake } from "./Snake.js";
import { Wall } from "./Wall.js";

// 定义一个游戏地图类，继承自 AcGameObject
export class GameMap extends AcGameObject {
    // ctx: 游戏画布的上下文对象
    // parent: 画布的父元素，用来构造画布长宽
    constructor(ctx, parent) {
        super(); // 调用基类的构造函数

        this.ctx = ctx; // 保存游戏画布的上下文对象
        this.parent = parent; // 保存画布的父元素
        
        // 因为游戏地图的大小是相对于浏览器窗口的大小的，所以我们需要的是每个物体的相对长度。然后只需要根据一个单位的绝对长度，就可以在浏览器窗口改变时，获得实时的渲染绝对长度
        this.L = 0; // 一个单位的绝对距离
        this.cols = 14;
        this.rows = 13;

        this.walls = []; // 存储所有的墙对象
        this.inner_walls_count = 20; // 内部墙体的数量

        this.snakes = [
            new Snake({id: 0, r: this.rows - 2, c: 1, color: "#4876eb"}, this),
            new Snake({id: 1, r: 1, c: this.cols - 2, color: "#fc4749"}, this),
        ]; // 存储所有的蛇对象
    }

    // 检查非障碍物地图是否连通
    check_connectivity(g, sx, sy, tx, ty) {
        // 参数含义：g: 布尔数组标识哪个地方是墙体
        // sx, sy: 起点坐标
        // tx, ty: 终点坐标
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true; // 走过的地方标记为true

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1]; // 四个方向
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) {
                return true;
            }
        }

        return false;
    }

    create_walls() {
        const g = []; // 布尔数组标识哪个地方是墙体
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        // 给四周加上墙
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (r === 0 || r === this.rows - 1 || c === 0 || c === this.cols - 1) {
                    g[r][c] = true;
                }
            }
        }

        // 先随机绘制墙体，然后沿对角线对称一下，保证公平
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ){
            for (let j = 0; j < 1000; j++ ) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue; // 之前存在则重新随机
                // 我们希望对战双方出生点在左下角和右上角，所以不希望墙体生成在这里
                if (r == this.rows - 2 && c == 1 || c == this.cols - 2 && r == 1)
                    continue;

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        // 判断非障碍物地图是否连通，不连通则返回false
        const copy_g = JSON.parse(JSON.stringify(g)); // 实现深度复制，防止污染原数组
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;


        // 绘制墙体
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this)); // 实例化一个墙对象
                }
            }
        }

        return true;
    }

    // 添加监听事件
    add_listening_events() {
        this.ctx.canvas.focus(); // 让canvas获得焦点，从而可以接收键盘事件

        // 监听键盘事件
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            console.log(e.key)

            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        });
    }

    start() {
        // 直接循环1000次防止生成地图不连通
        for(let i = 0; i < 1000; i++)
            if (this.create_walls())
                break;

        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols; // 设置画布的宽度
        this.ctx.canvas.height = this.L * this.rows;
    }

    // 判断两条蛇是否准备好下一回合
    check_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false; // 有蛇正在移动则返回false
            if (snake.direction === -1) return false; // 有蛇没有准备好下一步移动方向则返回false
        }
        return true;
    }

    // 让两个蛇进入下一个回合
    next_step() {
        for (const snake of this.snakes) {
            snake.next_step()
        }
    }

    update() {
        this.update_size(); // 更新画布大小
        if (this.check_ready()) {
            this.next_step();
        }
        this.render(); // 调用渲染函数

    }

    // 渲染函数，用于在画布上渲染游戏地图
    render() {
        const color_even = "#aad751", color_odd = "#a2d048";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L); // 参数分别是：x, y, width, height
            }
        }
    }

    on_destroy() {
    }
}