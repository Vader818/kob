import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject{
    constructor(info, gamemap){
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        this.cells = [new Cell(info.r, info.c)]; //存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null; //下一步的目标位置

        this.speed = 3; //蛇每秒钟走3格
        this.direction = -1; //-1表示没有指令，0表示向上，1表示向下，2表示向左，3表示向右
        this.status = "idle"; //idle表示静止，move表示正在移动，die表示死亡
    
        this.dr = [-1,0,1,0];
        this.dc = [0,1,0,-1];

        this.step = 0; //表示当前回合数
        this.eps = 1e-2; //允许的误差范围

        this.eye_direction = 0; //蛇眼睛的方向
        if(this.id === 1){
            this.eye_direction = 2;
        }

        this.eye_dx = [
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ]
        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1],
        ] 

    }

    start(){

    }

    set_direction(d){
        this.direction = d;
    }

    check_tail_increasing(){ //判断当前回合蛇尾是否增加 
        if(this.step <= 10){
            return true;
        }
        if(this.step % 3 === 1){
            return true;
        }
        return false;
    }


    next_step(){
        const d = this.direction;
        this.eye_direction = d;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1; //清空指令
        this.status = "move";
        this.step++;

        const k = this.cells.length;
        for(let i = k;i > 0;i--){
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }


    }


    update_move(){
        // this.cells[0].x += this.speed * this.timedelta / 1000;
        
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy); //蛇头与目标位置的距离
        if(distance < this.eps){ //如果本次移动距离大于蛇头与目标位置的距离，说明可以到达目标位置了
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle";

            if(!this.check_tail_increasing()){
                this.cells.pop();
            }


        } else{
            const move_distance = this.speed * this.timedelta / 1000; //本次移动的距离
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;
            
            if(!this.check_tail_increasing()){
                const k = this.cells.length;
                const tail = this.cells[k - 1];
                const tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                const tail_distance = Math.sqrt(tail_dx * tail_dx + tail_dy * tail_dy);

                if (tail_distance > this.eps) {
                    tail.x += move_distance * tail_dx / tail_distance;
                    tail.y += move_distance * tail_dy / tail_distance;
                }
            }
        
        
        }




    }

    update(){
        if(this.status === "move"){
            this.update_move();
        }
        this.render();
    }

    render() {
    const L = this.gamemap.L;
    const ctx = this.gamemap.ctx;
    // 根据状态设置颜色
    ctx.fillStyle = (this.status === "die") ? "white" : this.color;

    // 绘制圆形部分
    for (const cell of this.cells) {
        ctx.beginPath();
        ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制矩形连接部分
    for (let i = 1; i < this.cells.length; i++) {
        const a = this.cells[i - 1], b = this.cells[i];
        if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
            continue;
        }
        if (Math.abs(a.x - b.x) < this.eps) {
            ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
        } else if (Math.abs(a.y - b.y) < this.eps) {
            ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
        }
    }

    ctx.fillStyle = "black";
    for(let i =0;i < 2;i++){
        const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
        const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
        ctx.beginPath();
        ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
        ctx.fill();
    }

}





}