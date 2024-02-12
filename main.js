const app = Vue.createApp({
    data(){
        return{
            matrixSizeTxt: '5',
            bomb :
                [[0,0,1],
                [0,0,0],
                [0,0,0]],
            visibility :
                [[0,0,0],
                [0,0,0],
                [0,0,0]],
        message: "",
        }
    },
    methods:{
        startGame(){
            this.message = "";

            const sz = Number(this.matrixSizeTxt);
            this.bomb = Array(sz).fill(0).map(()=>Array(sz).fill(0));
            const n_bomb = Math.floor(sz);

            // ちょうどn_bomb個の爆弾をしかける
            for (let i=0; i<n_bomb; i++){
                let loop = true;
                while (loop){
                    const x = Math.floor(Math.random()*sz);
                    const y = Math.floor(Math.random()*sz);
                    if (this.bomb[y][x] == 0){
                        this.bomb[y][x] = 1;
                        loop = false;
                    }
                }
            }

            this.visibility = Array(sz).fill(0).map(()=>Array(sz).fill(0));
            // this.visibility[Math.floor(sz/2)][Math.floor(sz/2)] = 1;

            // debugger;


        },
        clicked (event) {
            const ij = event.target.id.split('_');
            const i = Number(ij[0]);
            const j = Number(ij[1]);
            this.visibility[i][j] = 1;

            if (this.bomb[i][j]==1){
                this.message = "Game Over";
            }

            this.checkClear();

        },
        rightClicked (event) {
            const ij = event.target.id.split('_');
            const i = Number(ij[0]);
            const j = Number(ij[1]);
            this.visibility[i][j] = 2 - this.visibility[i][j];
            console.log(ij);
            console.log(this.visibility[i][j]);

            this.checkClear();
        },
        AI(){
            const sz = this.bomb.length;
            while (true){
                let changed = false;

                for (let i=0; i<sz; i++){
                    for (let j=0; j<sz; j++){
                        if (this.visibility[i][j] == 1 && this.counts[i][j]==0){

                            // console.log([i,j, this.visibility[i][j], this.counts[i][j]]);

                            for (let k=-1; k<2; k++){
                                for (let l=-1; l<2; l++){
                                    const y = i + k;
                                    const x = j + l;
                                    if (x >= 0 && x < sz && y>=0 && y<sz && this.visibility[y][x]==0){
                                        this.visibility[y][x] = 1;
                                        changed = true;
                                    }
                                }
                            }
                        }

                        if (this.visibility[i][j] == 1 && this.counts[i][j] > 0){

                            // console.log([i,j, this.visibility[i][j], this.counts[i][j]]);

                            let sum = 0;
                            for (let k=-1; k<2; k++){
                                for (let l=-1; l<2; l++){
                                    const y = i + k;
                                    const x = j + l;
                                    if (x >= 0 && x < sz && y>=0 && y<sz && this.visibility[y][x]==2){
                                        sum += 1;
                                    }
                                }
                            }

                            if (sum == this.counts[i][j]){
                                // full open
                                console.log([i,j,sum]);
                                for (let k=-1; k<2; k++){
                                    for (let l=-1; l<2; l++){
                                        const y = i + k;
                                        const x = j + l;
                                        if (x >= 0 && x < sz && y>=0 && y<sz && this.visibility[y][x]==0){
                                            this.visibility[y][x]=1;
                                            if (this.bomb[y][x]==1){
                                                this.message = "Game Over";
                                                return;
                                            }
                                            changed = true;
                                        }
                                    }
                                }
    


                            }


                        }

                        
                    }
                }

                if (!changed){
                    break;
                }
            }

        },

        checkClear(){

            let cleared = true;
            for (let i=0; i<this.bomb.length; i++){
                for (let j=0; j<this.bomb.length; j++){

                    if (this.visibility[i][j] == 0){
                        cleared = false;
                    }
                    if (this.bomb[i][j] == 1 & this.visibility[i][j] == 2){
                        continue;
                    }
                    if (this.bomb[i][j] == 0 & this.visibility[i][j] == 1){
                        continue;
                    }
                    cleared = false;

                }
            }

            if (cleared){
                this.message = "Clear!";
            }

        },

        char(i,j){
            if (this.visibility[i][j]==0){
                return "";
            }else if (this.visibility[i][j]==1){
                return this.counts[i][j];
            }else {
                return "★";
            }
        }

    },

    computed : {
        counts(){
            const n = this.bomb.length;
            const a = new Array(n).fill("");
            for (let i=0; i<n; i++){
                a[i] = new Array(n).fill("");
            }

            for (let i=0; i<n; i++){
                for (let j=0; j<n; j++){
                    if (this.bomb[i][j]==1){
                        a[i][j] = "B";
                        continue;
                    }


                    let sum = 0;
                    for (let k=-1; k<2; k++){
                        for (let l=-1; l<2; l++){
                            const y = i + k;
                            const x = j + l;
                            // console.log([x,y]);
                            if (x >= 0 & x < n & y>=0 & y<n){
                                sum += this.bomb[y][x];
                            }
                        }
                    }
                    a[i][j] = sum;
                }
            }
            return a;
        }
    }



})

app.mount("#app");
