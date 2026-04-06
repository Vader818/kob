import { AcGameObject } from "./AcGameObject"; 
import { Snake } from "./Snake";
import { Wall } from "./Wall";


export class GameMap extends AcGameObject{
    constructor(ctx,parent,store){
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0; 

        this.rows = 13;
        this.cols = 14;
        this.walls = []; //存放地图中所有的墙
        this.inner_walls_count = 20; //地图中间的墙的数量

        this.snakes = [
            new Snake({id:0, color:"#4876EC", r:this.rows - 2, c:1}, this),
            new Snake({id:1, color:"#F94848", r:1, c:this.cols - 2}, this)
        ];

    }



    create_walls(){
        
        const g = this.store.state.pk.gamemap; //从store中获取服务器传来的地图数据

        // 将墙添加到walls数组中
        for(let r = 0;r < this.rows;r++){
            for(let c = 0;c < this.cols;c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

    }

    start(){
        this.create_walls();
        this.add_listening_events();
    }

    add_listening_events(){
        this.ctx.canvas.focus();

        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === 'w') d = 0;
            else if (e.key === 'd') d = 1;
            else if (e.key === 's') d = 2;
            else if (e.key === 'a') d = 3;

            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({
                    event: "move",
                    direction: d,
                }));
            }
           
        });


    }


    update_size(){
        this.L =parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready(){ //判断两条蛇是否都准备好下一回合
        for(const snake of this.snakes){
            if(snake.status !== "idle"){ //如果有蛇还没有准备好，就返回false
                return false;
            }
            if(snake.direction === -1){ //如果有蛇还没有选择方向，就返回false
                return false;
            }
        }
        return true;
    }


    next_step(){ //如果两条蛇都准备好了，就让它们进入下一回合
        for(const snake of this.snakes){
            snake.next_step();
        }
    }

    check_valid(cell){ //检查一个格子是否合法，合法的格子不能有蛇的身体和墙
        for(const wall of this.walls){
            if(wall.r === cell.r && wall.c === cell.c){
                return false;
            }
        }
        for(const snake of this.snakes){
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()){
                k--;
            }
            for(let i = 0;i < k;i++){
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c){
                    return false;
                }            
            }

        }
        return true;
    }

    update(){
        this.update_size();
        if (this.check_ready()){
            this.next_step();
        }
        this.render();
    }
    
    render(){
        // this.ctx.fillStyle = "green";
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const color_even = "#AAD751",color_odd = "#A2D149";
        for(let r = 0;r < this.rows;r++){
            for(let c = 0;c < this.cols;c++){
                if((r + c) % 2 == 0){
                    this.ctx.fillStyle = color_even;
                }else{
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}       