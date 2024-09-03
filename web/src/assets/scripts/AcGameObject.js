const AC_GAME_OBJECTS = []; // 存储所有游戏对象

export class AcGameObject {
    constructor() { // 构造函数
        AC_GAME_OBJECTS.push(this); // 将当前游戏对象添加到游戏对象列表中
        this.timedelta = 0; // 记录上一帧与当前帧之间的时间差，为了方便计算帧率，确定物体移动速度
        this.has_called_start = false; // 记录是否已经调用了start方法
    }
    // 以下我们实现了游戏对象的生命周期方法，这些方法可以在游戏对象被创建、更新和销毁时执行。
    // 这些方法可以被继承类重写，以实现不同的行为。
    start() { // 只执行一次
    }

    update() { // 每一帧都会执行，除了第一帧之外（第一帧执行的是start方法）

    }

    on_destroy() { // 删除之前执行
    }

    destory() { // 删除对象
        this.on_destroy() // 实现destroy之前调用一次on_destroy方法

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i]
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i, 1) // 从数组中删除当前游戏对象
                break;
            }
        }
    }

}

let last_timestamp = 0; // 上一帧的时间戳
const step = (timestamp) => {
    // 遍历所有游戏对象列表，执行update函数
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) { // 未执行start函数就进行执行，只有第一次执行
            obj.start()
            obj.has_called_start = true
        } else { // 否则执行update函数
            obj.timedelta = timestamp - last_timestamp // 计算帧之间时间差
            obj.update()
        }
    }

    last_timestamp = timestamp // 更新上一帧的时间戳
    requestAnimationFrame(step)
}

requestAnimationFrame(step) // requestAnimationFrame 方法用于在浏览器中请求动画帧，它会在下一帧前调用指定的回调函数。