import { AcGameObject } from "./AcGameObject"; // 引入 AcGameObject 基类

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
    }

    start() {
    }

    update() {
        this.render(); // 调用渲染函数

    }

    // 渲染函数，用于在画布上渲染游戏地图
    render() {

    }

    on_destroy() {
    }
}