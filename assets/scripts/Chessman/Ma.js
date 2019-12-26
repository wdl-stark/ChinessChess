
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:3,
    },
    start()
    {
        this._super();
        this.ChessType = ChessTypeEnum.Ma;
    },
    
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        //正“日”
        if(Math.abs(this.RowColPos.x - rowColumn.x) == 2 && Math.abs(this.RowColPos.y - rowColumn.y) == 1)
        {
            for(let i=0;i<GameControl.RedChesses.length;i++)
            {
                let chessman = GameControl.RedChesses[i];
                //有子在马脚
                if(chessman.RowColPos.y == this.RowColPos.y 
                && Math.abs(chessman.RowColPos.x - this.RowColPos.x) == 1 
                && Math.abs(chessman.RowColPos.x - rowColumn.x) == 1)
                {
                    return false;
                }
            }
            for(let i=0;i<GameControl.BlackChesses.length;i++)
            {
                let chessman = GameControl.BlackChesses[i];
                //有子在马脚
                if(chessman.RowColPos.y == this.RowColPos.y 
                && Math.abs(chessman.RowColPos.x - this.RowColPos.x) == 1 
                && Math.abs(chessman.RowColPos.x - rowColumn.x) == 1)
                {
                    return false;
                }
            }
            return true;
        }
        //倒“日”
        else if(Math.abs(this.RowColPos.x - rowColumn.x) == 1 && Math.abs(this.RowColPos.y - rowColumn.y) == 2)
        {
            for(let i=0;i<GameControl.RedChesses.length;i++)
            {
                let chessman = GameControl.RedChesses[i];
                //有子在马脚
                if(chessman.RowColPos.x == this.RowColPos.x 
                && Math.abs(chessman.RowColPos.y - this.RowColPos.y) == 1
                && Math.abs(chessman.RowColPos.y - rowColumn.y) == 1)
                {
                    return false;
                }
            }
            for(let i=0;i<GameControl.BlackChesses.length;i++)
            {
                let chessman = GameControl.BlackChesses[i];
                //有子在马脚
                if(chessman.RowColPos.x == this.RowColPos.x 
                && Math.abs(chessman.RowColPos.y - this.RowColPos.y) == 1
                && Math.abs(chessman.RowColPos.y - rowColumn.y) == 1)
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    getAllMoves()
    {
        let mvs = [];
        //return mvs;
        let pos = cc.v2(this.RowColPos.x - 2, this.RowColPos.y - 1);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x - 1, this.RowColPos.y - 2);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x + 2, this.RowColPos.y - 1);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x + 1, this.RowColPos.y - 2);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x - 2, this.RowColPos.y + 1);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x - 1, this.RowColPos.y + 2);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x + 1, this.RowColPos.y + 2);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        pos = cc.v2(this.RowColPos.x + 2, this.RowColPos.y + 1);
        if(this.CanMove(pos))
        {
            let mv = {chess:this, toPos:pos};
            mvs.push(mv);
        }
        return mvs;
    }
});
