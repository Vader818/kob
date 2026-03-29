import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject{
    constructor(r,c,game_map){
        super();
        this.game_map = game_map;
        this.r = r;
        this.c = c;
        this.color = "#B37226";
    }
    
    update(){
        this.render();
    }

    render(){
        const L = this.game_map.L;
        const ctx = this.game_map.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);

    }









}
