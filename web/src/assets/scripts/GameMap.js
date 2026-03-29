import { AcGameObject } from "./AcGameObject"; 
import { Wall } from "./Wall";


export class GameMap extends AcGameObject{
    constructor(ctx,parent){
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0; 

        this.rows = 13;
        this.cols = 13;
        this.walls = []; //存放地图中所有的墙
        this.inner_walls_count = 20; //地图中间的墙的数量

    }

    check_connectivity(g,sx,sy,tx,ty){ //检查地图是否联通，g是地图，sx,sy是起点坐标，tx,ty是终点坐标
        if(sx == tx && sy == ty){ //如果起点和终点是同一个点，说明已经联通了
            return true;
        }
        g[sx][sy] = true; //将起点标记为已经访问过了
        let dx = [-1,0,1,0],dy = [0,1,0,-1];  //四个方向的偏移量
        for(let i = 0;i < 4;i++){
            let x = sx + dx[i],y = sy + dy[i];
            if(!g[x][y] && this.check_connectivity(g,x,y,tx,ty)){ //如果这个点没有被访问过，并且从这个点出发可以到达终点，说明已经联通了
                return true;
            }
            
        }
        return false;

    }

    create_walls(){
        const g = [];
        for(let r = 0;r < this.rows;r++){
            g[r] = [];
            for(let c = 0;c < this.cols;c++){
                g[r][c] = false;
            }
        }
        // 在地图的四周创建墙
        for(let r = 0;r < this.rows;r++){
            g[r][0] = true;
            g[r][this.cols - 1] = true;
        }
        for(let c = 0;c < this.cols;c++){
            g[0][c] = true;
            g[this.rows - 1][c] = true;
        }
        
        // 在地图中间随机创建障碍物
        for(let i = 0;i < this.inner_walls_count/2;i++){
            for(let j = 0;j < 1000;j++){
                const r = parseInt(Math.random() * this.rows);
                const c = parseInt(Math.random() * this.cols);
                if(g[r][c] || g[c][r]){ //如果这个位置已经有墙了，或者它对称的位置已经有墙了，就重新随机一个位置
                    continue;
                }

                if(r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2 ){ //如果这个位置是玩家出生点，就重新随机一个位置
                    continue;
                }

                g[r][c] = true;
                g[c][r] = true;
                break;
            }


        }

        const copy_g = JSON.parse(JSON.stringify(g)); //深复制地图，防止修改原地图
        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)){ //如果地图不联通，就重新创建地图
            return false;
        }

        // 将墙添加到walls数组中
        for(let r = 0;r < this.rows;r++){
            for(let c = 0;c < this.cols;c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }

    start(){
        for(let i = 0;i < 1000;i++){
            if(this.create_walls()){
                break;
            }
        }
    }

    update_size(){
        this.L =parseInt(Math.min(this.parent.clientWidth/this.cols,this.parent.clientHeight/this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }


    update(){
        this.update_size();
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