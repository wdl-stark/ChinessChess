
const Chessman = require('Chessman');
cc.Class({
    extends: Chessman,

    properties: {
        ChessType:4,
    },
    start()
    {
        this._super();
        this.ChessType = ChessTypeEnum.Che;
    },
   
    CanMove(rowColumn)
    {
        if(!this._super(rowColumn))
        {
            return false;
        }
        if(this.RowColPos.x == rowColumn.x || this.RowColPos.y == rowColumn.y)
        {
            if(!this.CheckLineHasOtherChess(this.RowColPos, rowColumn))
            {
                return true;
            }
        }
        return false;
    },
    getAllMoves()
    {
        let mvs = [];
        //return mvs;
        for(let i = 0;i <= 9;i++)
        {
            if(i == this.RowColPos.x)
            {
                continue;
            }
            let pos = cc.v2(i,this.RowColPos.y);
            if(this.CanMove(pos))
            {
                let mv = {chess:this, toPos:pos};
                mvs.push(mv);
            }
        }
        for(let i=0;i<=8;i++)
        {
            if(i == this.RowColPos.y)
            {
                continue;
            }
            let pos = cc.v2(this.RowColPos.x,i);
            if(this.CanMove(pos))
            {
                let mv = {chess:this, toPos:pos};
                mvs.push(mv);
            }
        }
        return mvs;
    },
    
});
